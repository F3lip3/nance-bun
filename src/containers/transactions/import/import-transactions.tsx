import { ImportTransactionsProvider } from '@/contexts/import-transactions.context';

import { ImportTransactionsDialog } from './import-transactions-dialog';

export const ImportTransactions: React.FC = () => {
  return (
    <ImportTransactionsProvider>
      <ImportTransactionsDialog />
    </ImportTransactionsProvider>
  );
};
