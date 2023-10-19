import {
  TransactionsContext,
  TransactionsContextData
} from '@/contexts/TransactionsContext';
import { useContext } from 'react';

export const useTransactions = (): TransactionsContextData => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      'useTransactions must be used within a TransactionsProvider'
    );
  }

  return context;
};
