import { publicProcedure, router } from '@/lib/server/trpc';
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

export type computeHoldingInput = z.infer<typeof computeHoldingSchema>;

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
  getAssets: publicProcedure
    .input(
      z.object({
        user_id: z.string()
      })
    )
    .output(
      z.array(
        z.object({
          id: z.string(),
          code: z.string()
        })
      )
    )
    .query(async ({ ctx, input: { user_id } }) => {
      const holdings = await ctx.db.holding.findMany({
        where: {
          user_id,
          status: 'ACTIVE',
          shares: {
            gt: 0
          }
        },
        select: {
          id: true,
          asset: {
            select: {
              code: true
            }
          }
        }
      });

      return holdings.map(holding => ({
        id: holding.id,
        code: holding.asset.code
      }));
    })
});
