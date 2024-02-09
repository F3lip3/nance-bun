import { ColumnDef } from '@tanstack/react-table';
import { formatInTimeZone } from 'date-fns-tz';

import { useTransactions } from '@/hooks/use-transactions';
import { TransactionEntity } from '@/lib/server/routers/transactions';
import { formatNumber } from '@/lib/utils/functions';

import { Spinner } from '@phosphor-icons/react';
import { DataTable } from '../../components/transactions/data-table';

const columns: ColumnDef<TransactionEntity>[] = [
  {
    header: 'Date',
    meta: { align: 'center' },
    accessorFn: data => formatInTimeZone(data.date, 'UTC', 'PP')
  },
  {
    header: 'Action Type',
    accessorKey: 'type',
    meta: { align: 'center' }
  },
  {
    header: 'Asset',
    meta: { align: 'center' },
    accessorFn: data => data.asset.code.replace('.SA', '')
  },
  {
    header: 'Shares',
    meta: { align: 'center' },
    accessorFn: data => formatNumber(data.shares, { decimalDigits: 14 })
  },
  {
    header: 'Cost per Share',
    meta: { align: 'center' },
    accessorFn: data =>
      formatNumber(data.cost_per_share, { currency: data.currency.code })
  },
  {
    header: 'Total Cost',
    meta: { align: 'center' },
    accessorFn: data =>
      formatNumber(data.total_cost, { currency: data.currency.code }),
    sortingFn: (rowA, rowB) => {
      const totalA = rowA.original.total_cost;
      const totalB = rowB.original.total_cost;
      return totalA > totalB ? 1 : totalA < totalB ? -1 : 0;
    }
  }
];

export const ListTransactions: React.FC = () => {
  const { transactions, isLoading } = useTransactions();

  if (isLoading) {
    return <Spinner className="animate-spin" />;
  }

  if (!transactions?.length) {
    return <div>No transactions found.</div>;
  }

  return (
    <div className="pb-10">
      <DataTable columns={columns} data={transactions} />
    </div>
  );
};
