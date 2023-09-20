import { AddTransaction } from '@/app/(main)/(investments)/transactions/containers/AddTransaction';
import { Heading } from '@/components/Heading';

export default function Transactions() {
  return (
    <main>
      <Heading size="lg" className="font-thin">
        Transactions
      </Heading>
      <AddTransaction />
    </main>
  );
}
