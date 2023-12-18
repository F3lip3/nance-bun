import { ImportTransactionsProvider } from '@/contexts/ImportTransactionsContext';

import { ImportTransactionsDialog } from './ImportTransactionsDialog';

export const ImportTransactions: React.FC = () => {
  return (
    <ImportTransactionsProvider>
      <ImportTransactionsDialog />
    </ImportTransactionsProvider>
  );
};
