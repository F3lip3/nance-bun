import { nanoid } from 'nanoid';
import { z } from 'zod';

import { AssetSchema } from './asset';

const TransactionStatusSchema = z.enum([
  'error',
  'validating',
  'importing',
  'done'
]);

export const AddTransactionFormSchema = z.object({
  asset: AssetSchema.required(),
  cost_per_share: z
    .string({ required_error: 'Inform the cost per share' })
    .transform(value => Number(value)),
  currency_id: z.string({ required_error: 'Set the transaction currency' }),
  date: z.date({
    required_error: 'Pick a date'
  }),
  shares: z
    .string({ required_error: 'Input the amount of shares' })
    .transform(value => Number(value)),
  type: z.enum(['BUY', 'SELL'])
});

export const TransactionSchema = z.object({
  tmpid: z
    .string()
    .optional()
    .transform(() => nanoid()),
  date: z.date(),
  type: z.enum(['BUY', 'SELL']),
  asset_code: z.string(),
  asset: AssetSchema.optional(),
  shares: z.number(),
  cost_per_share: z.number(),
  currency: z.string(),
  error: z.string().optional(),
  status: TransactionStatusSchema.default('validating')
});

export const ImportTransactionSchema = z
  .tuple([
    z.coerce.date(),
    z.enum(['BUY', 'SELL']),
    z.string(),
    z.coerce.number(),
    z.coerce.number(),
    z.string()
  ])
  .transform(tuple =>
    TransactionSchema.parse({
      date: tuple[0],
      type: tuple[1],
      asset_code: tuple[2],
      shares: tuple[3],
      cost_per_share: tuple[4],
      currency: tuple[5]
    })
  );

export const ImportTransactionsSchema = z.array(ImportTransactionSchema);

export type AddTransactionForm = z.infer<typeof AddTransactionFormSchema>;
export type Transaction = z.infer<typeof ImportTransactionSchema>;
export type TransactionStatus = z.infer<typeof TransactionStatusSchema>;
