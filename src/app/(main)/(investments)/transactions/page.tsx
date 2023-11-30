'use client';

import { FloatingActionButton } from '@/app/(main)/(investments)/transactions/components/FloatingActionButton';
import { ListTransactions } from '@/app/(main)/(investments)/transactions/containers/ListTransactions';
import { TransactionsProvider } from '@/contexts/TransactionsContext';

export default function Transactions() {
  return (
    <TransactionsProvider>
      <main>
        <ListTransactions />
        <FloatingActionButton />
      </main>
    </TransactionsProvider>
  );
}
