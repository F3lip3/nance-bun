import { Plus } from '@phosphor-icons/react';

import { Button } from '@/components/ui/button';

import { AddTransaction } from '@/containers/transactions/add';
import { ImportTransactions } from '@/containers/transactions/import';

export const FloatingActionButton: React.FC = () => {
  return (
    <div className="rever group fixed bottom-4 right-4 flex flex-row-reverse items-center justify-end overflow-hidden">
      <Button
        variant="default"
        className="m-0 h-12 w-12 min-w-[3rem] rounded-full p-0 transition-transform hover:rotate-45"
      >
        <Plus size="24" />
      </Button>
      <div className="flex w-0 flex-row justify-start gap-2 overflow-hidden transition-all duration-500 ease-in-out group-hover:w-24">
        <AddTransaction />
        <ImportTransactions />
      </div>
    </div>
  );
};
