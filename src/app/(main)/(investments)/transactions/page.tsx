import { AddTransaction } from '@/app/(main)/(investments)/transactions/containers/AddTransaction';
import { Heading } from '@/components/Heading';
import { TransactionsProvider } from '@/contexts/TransactionsContext';

export default function Transactions() {
  return (
    <main>
      <TransactionsProvider>
        <Heading size="lg" className="font-thin">
          Transactions
        </Heading>
        <AddTransaction />
      </TransactionsProvider>
    </main>
  );
}
