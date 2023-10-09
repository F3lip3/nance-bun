'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

import { AssetSelector } from '@/app/(main)/(investments)/transactions/components/AssetSelector';
import { CategorySelector } from '@/app/(main)/(investments)/transactions/components/CategorySelector';
import { TransactionTypeSelector } from '@/app/(main)/(investments)/transactions/components/TransactionTypeSelector';
import { CurrencySelector } from '@/components/CurrencySelector';
import { DatePicker } from '@/components/DatePicker';
import { NumberInput } from '@/components/NumberInput';
import { toast } from '@/components/ui/use-toast';
import { usePortfolio } from '@/hooks/usePortfolio';
import { TransactionEntity } from '@/lib/server/routers/transactions';
import { trpc } from '@/lib/trpc/client';
import { Plus } from '@phosphor-icons/react';

type AddTransactionProps = {
  success: (transaction: TransactionEntity) => void;
};

export const AddTransactionFormSchema = z.object({
  asset: z.object(
    {
      code: z.string(),
      exchange: z.string(),
      shortname: z.string(),
      sector: z.string().optional(),
      industry: z.string().optional(),
      type: z.string().optional(),
      longname: z.string(),
      source: z.string()
    },
    { required_error: 'Set an asset' }
  ),
  category_id: z.string({
    required_error: 'Select a category.'
  }),
  cost_per_share: z.number({ required_error: 'Inform the cost per share' }),
  currency_id: z.string({ required_error: 'Set the transaction currency' }),
  date: z.date({
    required_error: 'Pick a date'
  }),
  shares: z.number({ required_error: 'Input the amount of shares' }),
  type: z.enum(['BUY', 'SELL'])
});

export type AddTransactionForm = z.infer<typeof AddTransactionFormSchema>;

export const AddTransaction: React.FC<AddTransactionProps> = ({ success }) => {
  const form = useForm<AddTransactionForm>({
    resolver: zodResolver(AddTransactionFormSchema),
    defaultValues: {
      type: 'BUY'
    }
  });

  const { portfolio: portfolio_id } = usePortfolio();

  const { mutateAsync: addTransaction, isLoading } =
    trpc.transactions.addTransaction.useMutation();

  const onSubmit = async (data: AddTransactionForm) => {
    const newTransaction = await addTransaction({
      ...data,
      portfolio_id
    });

    toast({
      title: 'Transaction added successfully.',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(newTransaction, null, 2)}
          </code>
        </pre>
      )
    });

    form.reset();
    success(newTransaction);
    console.info('new transaction', newTransaction);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="default"
          className="absolute bottom-4 right-4 m-0 h-12 w-12 rounded-full p-0"
        >
          <Plus size="24" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New transaction</SheetTitle>
          <SheetDescription>
            Add a new transaction to manage your assets...
          </SheetDescription>
        </SheetHeader>
        <main className="py-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CategorySelector
                form={form}
                name="category_id"
                label="Category"
                placeholder="Select category"
              />
              <section className="flex flex-row flex-nowrap gap-4">
                <TransactionTypeSelector
                  form={form}
                  name="type"
                  label="Transaction type"
                  placeholder="Select the transaction type"
                  className="flex flex-1 flex-col"
                />
                <DatePicker
                  form={form}
                  name="date"
                  label="Transaction date"
                  placeholder="Pick a date"
                  className="flex flex-1 flex-col"
                />
              </section>
              <AssetSelector
                form={form}
                name="asset"
                label="Asset"
                placeholder="Search assets"
              />
              <NumberInput
                form={form}
                name="shares"
                label="Shares"
                placeholder="Type the shares amount"
              />
              <NumberInput
                form={form}
                name="cost_per_share"
                label="Cost per share"
                placeholder="Type the cost per share"
              />
              <CurrencySelector
                form={form}
                name="currency_id"
                label="Currency"
                placeholder="Search currencies..."
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </main>
      </SheetContent>
    </Sheet>
  );
};
