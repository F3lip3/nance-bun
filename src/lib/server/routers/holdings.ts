import { protectedProcedure, publicProcedure, router } from '@/lib/server/trpc';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

type computedHolding = {
  average_cost: number;
  currency_id: string;
  shares: number;
  total_cost: number;
  total_shares: number;
};

export const computeHoldingSchema = z.object({
  asset_id: z.string(),
  portfolio_id: z.string(),
  user_id: z.string()
});

const assetSchema = z.object({
  code: z.string(),
  shortname: z.string(),
  current_price: z
    .unknown()
    .optional()
    .transform(value => {
      if (!value) return 0;
      return typeof value === 'number'
        ? value
        : (value as Prisma.Decimal).toNumber();
    })
});

const holdingGainSchema = z.object({
  percentage: z.number(),
  value: z.number(),
  type: z.enum(['positive', 'negative'])
});

const categorySchema = z
  .object({
    id: z.string(),
    name: z.string()
  })
  .nullable();

const currencySchema = z.object({
  code: z.string()
});

const holdingSchema = z
  .object({
    id: z.string(),
    asset: assetSchema,
    currency: currencySchema,
    category: categorySchema,
    shares: z
      .unknown()
      .transform(value =>
        typeof value === 'number' ? value : (value as Prisma.Decimal).toNumber()
      ),
    average_cost: z
      .unknown()
      .transform(value =>
        typeof value === 'number' ? value : (value as Prisma.Decimal).toNumber()
      )
  })
  .transform(values => ({
    ...values,
    get total_price(): number {
      return values.asset.current_price * values.shares;
    },
    get total_gain() {
      const percentage =
        values.asset.current_price / (values.average_cost / 100) - 100;

      const total_price = values.asset.current_price * values.shares;
      const total_cost = values.average_cost * values.shares;
      const value = total_price - total_cost;

      return holdingGainSchema.parse({
        percentage,
        value,
        type: value > 0 ? 'positive' : 'negative'
      });
    },
    get weight(): number {
      return 0;
    }
  }));

const holdingsSchema = z.array(holdingSchema).transform(holdings => {
  const total = holdings.reduce((acc, curr) => acc + curr.total_price, 0.0);
  return holdings.map(holding => ({
    ...holding,
    weight: holding.total_price / total
  }));
});

const setCategorySchema = z.object({
  category_id: z.string().nullable(),
  holdings: z.array(z.string())
});

export type AssetEntity = z.infer<typeof assetSchema>;
export type CategoryEntity = z.infer<typeof categorySchema>;
export type ComputeHoldingInput = z.infer<typeof computeHoldingSchema>;
export type CurrencyEntity = z.infer<typeof currencySchema>;
export type HoldingGainEntity = z.infer<typeof holdingGainSchema>;
export type HoldingEntity = z.infer<typeof holdingSchema>;
export type HoldingsEntity = z.infer<typeof holdingsSchema>;
export type SetCategoryEntity = z.infer<typeof setCategorySchema>;

export const holdingsRouter = router({
  computeHoldings: publicProcedure
    .input(computeHoldingSchema)
    .mutation(async ({ ctx, input: { asset_id, portfolio_id, user_id } }) => {
      const transactions = await ctx.db.transaction.findMany({
        select: {
          shares: true,
          cost_per_share: true,
          type: true,
          currency_id: true
        },
        where: {
          user_id,
          portfolio_id,
          asset_id
        },
        orderBy: [{ date: 'asc' }, { type: 'asc' }]
      });

      if (!transactions.length) return;

      const { currency_id } = transactions[0];

      const baseHolding = {
        currency_id,
        average_cost: 0,
        shares: 0,
        total_cost: 0,
        total_shares: 0
      } as computedHolding;

      const holding = transactions.reduce<computedHolding>(
        (comp, transaction) => {
          if (!comp.currency_id) comp.currency_id = transaction.currency_id;

          if (
            transaction.type === 'SELL' &&
            transaction.shares.toNumber() === comp.shares
          ) {
            return {
              ...baseHolding,
              currency_id: transaction.currency_id
            };
          }

          if (transaction.type === 'SELL')
            return {
              ...comp,
              shares: comp.shares - transaction.shares.toNumber()
            };

          const transaction_shares = transaction.shares.toNumber();
          const transaction_cost =
            transaction.cost_per_share.toNumber() * transaction_shares;

          const shares = comp.shares + transaction_shares;
          const total_shares = comp.total_shares + transaction_shares;
          const total_cost = comp.total_cost + transaction_cost;
          const average_cost = total_cost / total_shares;

          return {
            ...comp,
            shares,
            total_shares,
            total_cost,
            average_cost
          };
        },
        { ...baseHolding }
      );

      await ctx.db.holding.upsert({
        create: {
          user_id,
          portfolio_id,
          asset_id,
          currency_id,
          status: holding.shares ? 'ACTIVE' : 'REMOVED',
          transactions: transactions.length,
          shares: holding.shares,
          average_cost: holding.average_cost,
          removed_at: holding.shares ? null : new Date()
        },
        update: {
          transactions: transactions.length,
          shares: holding.shares,
          average_cost: holding.average_cost
        },
        where: {
          portfolio_id_asset_id: {
            asset_id,
            portfolio_id
          }
        }
      });
    }),
  getHoldings: protectedProcedure
    .input(z.object({ portfolio_id: z.string(), category_id: z.string() }))
    .output(holdingsSchema)
    .query(async ({ ctx, input: { category_id, portfolio_id } }) => {
      const holdings = await ctx.db.holding.findMany({
        where: {
          portfolio_id,
          status: 'ACTIVE',
          shares: {
            gt: 0
          },
          ...(category_id && category_id !== 'all' ? { category_id } : {})
        },
        select: {
          id: true,
          asset: {
            select: {
              code: true,
              shortname: true,
              current_price: true
            }
          },
          currency: {
            select: {
              code: true
            }
          },
          category: {
            select: {
              id: true,
              name: true
            }
          },
          shares: true,
          average_cost: true
        }
      });

      return holdings;
    }),
  setCategory: protectedProcedure
    .input(setCategorySchema)
    .mutation(async ({ ctx, input: { category_id, holdings } }) => {
      await ctx.db.holding.updateMany({
        where: {
          id: {
            in: holdings
          },
          user_id: ctx.userId
        },
        data: {
          category_id
        }
      });
    })
});
