import { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/app/(main)/(investments)/transactions/components/DataTable';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionEntity } from '@/lib/server/routers/transactions';
import { formatInTimeZone } from 'date-fns-tz';

const columns: ColumnDef<TransactionEntity>[] = [
  {
    header: 'Date',
    accessorFn: data => formatInTimeZone(data.date, 'UTC', 'PP')
  },
  {
    header: 'Action Type',
    accessorKey: 'type'
  },
  {
    header: 'Asset',
    accessorFn: data => data.asset.code.replace('.SA', '')
  },
  {
    header: 'Shares',
    accessorFn: data => data.shares.toFixed(2)
  },
  {
    header: 'Cost per Share',
    accessorFn: data => data.cost_per_share.toFixed(2)
  },
  {
    header: 'Total Cost',
    accessorFn: data => data.total_cost.toFixed(2)
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
