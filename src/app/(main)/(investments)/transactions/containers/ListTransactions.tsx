import { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/app/(main)/(investments)/transactions/components/DataTable';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionEntity } from '@/lib/server/routers/transactions';

const columns: ColumnDef<TransactionEntity>[] = [
  {
    accessorKey: 'date',
    header: 'Date'
  },
  {
    accessorKey: 'type',
    header: 'Action Type'
  },
  {
    accessorKey: 'asset.code',
    header: 'Asset Code'
  },
  {
    accessorKey: 'shares',
    header: 'Shares'
  },
  {
    accessorKey: 'cost_per_share',
    header: 'Cost per Share'
  }
];

export const ListTransactions: React.FC = () => {
  const { transactions, isLoading } = useTransactions();

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!transactions || !Object.keys(transactions).length) {
    return <>Empty</>;
  }

  return Object.keys(transactions).map(key => (
    <div key={key} className="py-10">
      <DataTable columns={columns} data={transactions[key]} />
    </div>
  ));
};
