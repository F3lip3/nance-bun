import { prisma } from '@/lib/server/prisma';
import { protectedProcedure, router } from '@/lib/server/trpc';
import z from 'zod';

const addTransactionSchema = z.object({
  asset: z.object({
    code: z.string(),
    exchange: z.string(),
    shortname: z.string(),
    sector: z.string().optional(),
    industry: z.string().optional(),
    type: z.string().optional(),
    longname: z.string(),
    source: z.string()
  }),
  category_id: z.string(),
  cost_per_share: z.number(),
  currency_id: z.string(),
  date: z.date(),
  portfolio_id: z.string(),
  shares: z.number(),
  type: z.enum(['BUY', 'SELL'])
});

const transactionOutputSchema = addTransactionSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  currency: z.object({
    code: z.string(),
    name: z.string()
  }),
  category: z.object({
    id: z.string(),
    name: z.string()
  })
});

export type TransactionEntity = z.infer<typeof transactionOutputSchema>;

export const transactionsRouter = router({
  addTransaction: protectedProcedure
    .input(addTransactionSchema)
    .output(transactionOutputSchema)
    .mutation(async ({ ctx: { userId }, input }) => {
      const { id: asset_id } = await prisma.asset.upsert({
        create: input.asset,
        update: input.asset,
        where: {
          code: input.asset.code
        }
      });

      const newTransaction = await prisma.transaction.create({
        data: {
          user_id: userId,
          date: input.date,
          portfolio_id: input.portfolio_id,
          category_id: input.category_id,
          currency_id: input.currency_id,
          shares: input.shares,
          cost_per_share: input.cost_per_share,
          type: input.type,
          asset_id
        },
        include: {
          asset: true,
          currency: true
        }
      });

      return transactionOutputSchema.parse({
        ...newTransaction,
        cost_per_share: newTransaction.cost_per_share.toNumber(),
        shares: newTransaction.shares.toNumber()
      });
    })
});
