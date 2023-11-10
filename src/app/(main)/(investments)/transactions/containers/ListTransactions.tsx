import { ColumnDef } from '@tanstack/react-table';
import { formatInTimeZone } from 'date-fns-tz';

import { DataTable } from '@/app/(main)/(investments)/transactions/components/DataTable';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionEntity } from '@/lib/server/routers/transactions';
import { formatNumber } from '@/lib/utils/functions';

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
    accessorFn: data => formatNumber(data.shares)
  },
  {
    header: 'Cost per Share',
    accessorFn: data => formatNumber(data.cost_per_share, data.currency.code)
  },
  {
    header: 'Total Cost',
    accessorFn: data => formatNumber(data.total_cost, data.currency.code)
  }
];

export const ListTransactions: React.FC = () => {
  const { transactions, isLoading } = useTransactions();

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!transactions?.length) {
    return <>Empty</>;
  }

  return (
    <div className="px-2 py-10">
      <DataTable columns={columns} data={transactions} />
    </div>
  );
};
