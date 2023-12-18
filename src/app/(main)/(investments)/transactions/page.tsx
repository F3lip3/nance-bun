'use client';

import { FloatingActionButton } from '@/components/transactions/floating-action-button';
import { ListTransactions } from '@/containers/transactions/list';
import { TransactionsProvider } from '@/contexts/transactions.context';

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
