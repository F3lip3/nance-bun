import z from 'zod';

import { QStashQueueProvider } from '@/lib/server/container/providers/queue/implementations/qstash-queue.provider';
import { AssetSchema } from '@/lib/server/routers/assets';
import { ComputeHoldingInput } from '@/lib/server/routers/holdings';
import { protectedProcedure, publicProcedure, router } from '@/lib/server/trpc';
import { r2 } from '@/lib/server/upload';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { randomUUID } from 'crypto';

const addTransactionSchema = z.object({
  asset: AssetSchema,
  cost_per_share: z.number(),
  currency_id: z.string(),
  date: z.date(),
  portfolio_id: z.string(),
  shares: z.number(),
  type: z.enum(['BUY', 'SELL'])
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

const uploadSchema = z.object({
  name: z.string().min(1),
  contentType: z.string().regex(/\w+\/[-+.\w]+/),
  portfolioId: z.string()
});

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
  uploadImportFile: publicProcedure
    .input(uploadSchema)
    .mutation(
      async ({
        ctx: { db, userId: user_id },
        input: { name, contentType, portfolioId: portfolio_id }
      }) => {
        const fileKey = randomUUID().concat('-').concat(name);

        const signedUrl = await getSignedUrl(
          r2,
          new PutObjectCommand({
            Bucket: 'nance-import',
            Key: fileKey,
            ContentType: contentType
          }),
          { expiresIn: 600 }
        );

        await db.file.create({
          data: {
            name,
            contentType,
            user_id,
            key: fileKey,
            portfolio_id
          }
        });

        return signedUrl;
      }
    )
});
