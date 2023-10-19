'use client';

import { AddTransaction } from '@/app/(main)/(investments)/transactions/containers/AddTransaction';
import { ListTransactions } from '@/app/(main)/(investments)/transactions/containers/ListTransactions';
import { Heading } from '@/components/Heading';
import { TransactionsProvider } from '@/contexts/TransactionsContext';

export default function Transactions() {
  return (
    <TransactionsProvider>
      <main>
        <Heading size="lg" className="font-light">
          Transactions
        </Heading>
        <ListTransactions />
        <AddTransaction />
      </main>
    </TransactionsProvider>
  );
}
