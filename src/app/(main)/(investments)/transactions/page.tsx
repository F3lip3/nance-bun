'use client';

import { AddTransaction } from '@/app/(main)/(investments)/transactions/containers/AddTransaction';
import { ListTransactions } from '@/app/(main)/(investments)/transactions/containers/ListTransactions';
import { TransactionsProvider } from '@/contexts/TransactionsContext';

export default function Transactions() {
  return (
    <TransactionsProvider>
      <main>
        <ListTransactions />
        <AddTransaction />
      </main>
    </TransactionsProvider>
  );
}
