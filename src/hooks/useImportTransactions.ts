import { useContext } from 'react';

import {
  ImportTransactionsContext,
  ImportTransactionsContextData
} from '@/contexts/ImportTransactionsContext';

export const useImportTransactions = (): ImportTransactionsContextData => {
  const context = useContext(ImportTransactionsContext);
  if (!context) {
    throw new Error(
      'useImportTransactions must be used within a ImportTransactionsProvider'
    );
  }

  return context;
};
