'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

import { Plus } from '@phosphor-icons/react';
import { CategorySelector } from '../components/CategorySelector';

export const AddTransactionFormSchema = z.object({
  category: z.string({
    required_error: 'Please select a category.'
  })
});

export type AddTransactionForm = z.infer<typeof AddTransactionFormSchema>;

export const AddTransaction = () => {
  const form = useForm<AddTransactionForm>({
    resolver: zodResolver(AddTransactionFormSchema)
  });

  function onSubmit(data: z.infer<typeof AddTransactionFormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      )
    });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="default"
          className="absolute bottom-4 right-4 m-0 h-12 w-12 rounded-full p-0"
        >
          <Plus size="24" className="text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add new transaction</SheetTitle>
          <SheetDescription>
            Input data in the field bellow in order to add a new transaction...
          </SheetDescription>
        </SheetHeader>
        <main className="py-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CategorySelector form={form} />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </main>
      </SheetContent>
    </Sheet>
  );
};
