import z from 'zod';

import { QStashQueueProvider } from '@/lib/server/container/providers/queue/implementations/qstash-queue.provider';
import { AssetSchema } from '@/lib/server/routers/assets';
import { ComputeHoldingInput } from '@/lib/server/routers/holdings';
import { ImportTransactionsInput } from '@/lib/server/routers/transactions-import';
import { protectedProcedure, router } from '@/lib/server/trpc';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';

const addTransactionSchema = z.object({
  asset: AssetSchema,
  cost_per_share: z.number(),
  currency_id: z.string(),
  date: z.date(),
  portfolio_id: z.string(),
  shares: z.number(),
  type: z.enum(['BUY', 'SELL'])
});

const importTransactionsSchema = z.object({
  portfolio_id: z.string(),
  transactions: z.array(
    z.object({
      date: z.date(),
      type: z.enum(['BUY', 'SELL']),
      asset: z.string(),
      shares: z.number(),
      cost_per_share: z.number(),
      currency: z.string(),
      category: z.string()
    })
  )
});

const transactionSchema = z.object({
  id: z.string(),
  date: z.date(),
  currency: z.object({
    code: z.string()
  }),
  asset: z.object({
    code: z.string(),
    shortname: z.string()
  }),
  shares: z
    .unknown()
    .transform(value =>
      typeof value === 'number' ? value : (value as Prisma.Decimal).toNumber()
    ),
  cost_per_share: z
    .unknown()
    .transform(value =>
      typeof value === 'number' ? value : (value as Prisma.Decimal).toNumber()
    ),
  total_cost: z.number(),
  type: z.enum(['BUY', 'SELL'])
});

const transactionsSchema = z.array(transactionSchema);

export type AddTransactionEntity = z.infer<typeof addTransactionSchema>;
export type TransactionEntity = z.infer<typeof transactionSchema>;

export const transactionsRouter = router({
  addTransaction: protectedProcedure
    .input(addTransactionSchema)
    .output(transactionSchema)
    .mutation(async ({ ctx: { db, userId }, input }) => {
      const existingPortfolio = await db.portfolio.findUnique({
        where: { id: input.portfolio_id }
      });

      if (!existingPortfolio) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Portfolio not found'
        });
      }

      const { id: asset_id } = await db.asset.upsert({
        create: input.asset,
        update: input.asset,
        where: {
          code: input.asset.code
        }
      });

      const newTransaction = await db.transaction.create({
        data: {
          user_id: userId,
          date: input.date,
          portfolio_id: input.portfolio_id,
          currency_id: input.currency_id,
          shares: input.shares,
          cost_per_share: input.cost_per_share,
          type: input.type,
          asset_id
        },
        select: {
          id: true,
          date: true,
          shares: true,
          cost_per_share: true,
          type: true,
          asset: {
            select: {
              code: true,
              shortname: true
            }
          },
          currency: {
            select: {
              code: true
            }
          }
        }
      });

      const queue = new QStashQueueProvider();
      const response = await queue.publish('holdings/compute', {
        asset_id,
        portfolio_id: input.portfolio_id,
        user_id: userId
      } as ComputeHoldingInput);

      console.info(
        `Transaction created successfully.
         Compute holding job message sent.
         Id: ${response.messageId}`
      );

      return transactionSchema.parse({
        ...newTransaction,
        total_cost:
          newTransaction.shares.toNumber() *
          newTransaction.cost_per_share.toNumber()
      });
    }),
  getTransactions: protectedProcedure
    .output(transactionsSchema)
    .query(async ({ ctx: { db, userId } }) => {
      const dbTransactions = await db.transaction.findMany({
        where: { user_id: userId },
        select: {
          id: true,
          date: true,
          shares: true,
          cost_per_share: true,
          type: true,
          asset: {
            select: {
              code: true,
              shortname: true
            }
          },
          currency: {
            select: {
              code: true
            }
          }
        }
      });

      const transactions = transactionsSchema.parse(
        dbTransactions.map(transaction => ({
          ...transaction,
          total_cost:
            transaction.shares.toNumber() *
            transaction.cost_per_share.toNumber()
        }))
      );

      return transactions;
    }),
  importTransactions: protectedProcedure
    .input(importTransactionsSchema)
    .mutation(async ({ ctx: { db, userId }, input }) => {
      if (!input.transactions.length) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Import must have at least one transaction'
        });
      }

      const existingPortfolio = await db.portfolio.findUnique({
        where: { id: input.portfolio_id }
      });

      if (!existingPortfolio) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Portfolio not found'
        });
      }

      const existingImport = await db.transactionImport.findFirst({
        where: {
          status: 'pending',
          user_id: userId
        }
      });

      if (existingImport !== null) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You already has a pending import'
        });
      }

      const { id: import_id } = await db.transactionImport.create({
        data: {
          user_id: userId,
          portfolio_id: input.portfolio_id,
          assets: {
            createMany: {
              skipDuplicates: true,
              data: input.transactions
            }
          }
        },
        select: { id: true }
      });

      const queue = new QStashQueueProvider();
      const response = await queue.publish('transactions/import', {
        import_id
      } as ImportTransactionsInput);

      console.info(
        `Import transactions proccess created successfully.
         Import transactions message sent.
         Id: ${response.messageId}`
      );
    })
});
