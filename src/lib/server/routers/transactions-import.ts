import { QStashQueueProvider } from '@/lib/server/container/providers/queue/implementations/qstash-queue.provider';
import { publicProcedure, router } from '@/lib/server/trpc';
import { z } from 'zod';

export const importTransactionsSchema = z.object({
  import_id: z.string()
});

export const importTransactionsFetchAssetsSchema = z.object({
  import_id: z.string()
});

export type ImportTransactionsInput = z.infer<typeof importTransactionsSchema>;
export type ImportTransactionsFetchAssetsInput = z.infer<
  typeof importTransactionsFetchAssetsSchema
>;

export const importTransactionsRouter = router({
  start: publicProcedure
    .input(importTransactionsSchema)
    .mutation(async ({ ctx, input: { import_id } }) => {
      const importProcess = await ctx.db.transactionImport.findUnique({
        where: { id: import_id, status: 'pending' }
      });

      if (!importProcess) return;

      await ctx.db.transactionImport.update({
        data: { status: 'in_progress' },
        where: { id: import_id }
      });

      const queue = new QStashQueueProvider();

      await queue.publish('transactions/import/assets', {
        import_id
      } as ImportTransactionsFetchAssetsInput);
    }),
  fetchAssets: publicProcedure
    .input(importTransactionsFetchAssetsSchema)
    .mutation(async ({ ctx, input: { import_id } }) => {
      const assetsToFetch = await ctx.db.transactionImportAsset.findMany({
        where: {
          transaction_import_id: import_id,
          status: 'pending'
        },
        take: 10
      });

      if (!assetsToFetch.length) {
        // finish import
        return;
      }

      // fetch assets
      // fetch currencies
      // add transactions
      // compute holdings for each asset
      // update status

      // if assetsToFetch.length equals batch size:
      // - call fetchAssets again
      // else:
      // - finish import
    })
});
