import { createContext, useEffect, useMemo, useState } from 'react';

import {
  AddTransactionEntity,
  TransactionEntity
} from '@/lib/server/routers/transactions';
import { trpc } from '@/lib/trpc/client';

interface TransactionsProviderProps {
  children: React.ReactNode;
}

type Transactions = {
  [category: string]: TransactionEntity[];
};

export interface TransactionsContextData {
  addTransaction: (data: AddTransactionEntity) => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  transactions: Transactions;
}

export const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);

export const TransactionsProvider: React.FC<TransactionsProviderProps> = ({
  children
}) => {
  const [transactionsList, setTransactionsList] = useState<TransactionEntity[]>(
    []
  );

  const { data: serverTransactions, isLoading } =
    trpc.transactions.getTransactions.useQuery();

  const { mutateAsync: addNewTransaction, isLoading: isSaving } =
    trpc.transactions.addTransaction.useMutation();

  const addTransaction = async (data: AddTransactionEntity) => {
    const newTransaction = await addNewTransaction(data);

    setTransactionsList(currentTransactions => [
      ...currentTransactions,
      newTransaction
    ]);
  };

  const transactions = useMemo<Transactions>(() => {
    return transactionsList
      .sort((t1, t2) => t1.createdAt.getTime() - t2.createdAt.getTime())
      .reduce<Transactions>((groups, item) => {
        const key = item.category.name;
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
        return groups;
      }, {});
  }, [transactionsList]);

  useEffect(() => {
    if (serverTransactions) {
      setTransactionsList(serverTransactions);
    }
  }, [serverTransactions]);

  return (
    <TransactionsContext.Provider
      value={{ addTransaction, isLoading, isSaving, transactions }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
