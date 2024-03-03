'use client';

import { forwardRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from '@phosphor-icons/react';
import { ReloadIcon } from '@radix-ui/react-icons';

import { Button, ButtonProps, buttonVariants } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

import { CurrencySelector } from '@/components/common/currency-selector';
import { DatePicker } from '@/components/ui/date-picker';
import { NumberInput } from '@/components/ui/number-input';
import { toast } from '@/components/ui/use-toast';
import { usePortfolio } from '@/hooks/use-portfolio';
import { useTransactions } from '@/hooks/use-transactions';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils/functions';

import {
  AddTransactionForm,
  AddTransactionFormSchema
} from '@/schemas/transaction';

import { AssetSelector } from '../../components/transactions/asset-selector';
import { TransactionTypeSelector } from '../../components/transactions/transaction-type-selector';

const AddButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent className="mb-2">
        <p>Add</p>
      </TooltipContent>
    </Tooltip>
  )
);

AddButton.displayName = 'AddButton';

export const AddTransaction: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [openAssetSelector, setOpenAssetSelector] = useState(false);

  const form = useForm<AddTransactionForm>({
    resolver: zodResolver(AddTransactionFormSchema),
    defaultValues: {
      type: 'BUY',
      date: new Date()
    }
  });

  const { addTransaction, isSaving } = useTransactions();
  const { portfolio: portfolio_id } = usePortfolio();

  const onSubmit = async (data: AddTransactionForm) => {
    await addTransaction({
      ...data,
      portfolio_id
    });

    form.reset({
      asset: undefined,
      cost_per_share: 0,
      currency_id: data.currency_id,
      date: data.date,
      shares: 0,
      type: data.type
    });

    setOpenAssetSelector(true);
    form.setFocus('asset', { shouldSelect: true });

    toast({ title: 'Transaction added successfully.' });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <AddButton variant="ghost" size="icon" className="rounded-full">
          <PlusCircle size="24" />
        </AddButton>
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
                focus={openAssetSelector}
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
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <ReloadIcon className="animate-spin" /> wait...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </form>
          </Form>
        </main>
      </SheetContent>
    </Sheet>
  );
};
