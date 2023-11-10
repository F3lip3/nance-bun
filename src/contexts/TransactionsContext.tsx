import { createContext, useEffect, useState } from 'react';

import {
  AddTransactionEntity,
  TransactionEntity
} from '@/lib/server/routers/transactions';
import { trpc } from '@/lib/trpc/client';

interface TransactionsProviderProps {
  children: React.ReactNode;
}

export interface TransactionsContextData {
  addTransaction: (data: AddTransactionEntity) => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  transactions?: TransactionEntity[];
}

export const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);

export const TransactionsProvider: React.FC<TransactionsProviderProps> = ({
  children
}) => {
  const [transactions, setTransactions] = useState<TransactionEntity[]>([]);
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

  useEffect(() => {
    if (serverTransactions) {
      setTransactionsList(serverTransactions);
    }
  }, [serverTransactions]);

  useEffect(() => {
    if (!transactionsList?.length) {
      setTransactions([]);
    } else {
      setTransactions(
        transactionsList.sort((t1, t2) => {
          if (t1.date.getTime() === t2.date.getTime()) {
            return t1.asset.code.localeCompare(t2.asset.code);
          }

          return t1.date.getTime() - t2.date.getTime();
        })
      );
    }
  }, [transactionsList]);

  return (
    <TransactionsContext.Provider
      value={{ addTransaction, isLoading, isSaving, transactions }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
