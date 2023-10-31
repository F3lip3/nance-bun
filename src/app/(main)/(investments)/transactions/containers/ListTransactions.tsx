import { ColumnDef } from '@tanstack/react-table';
import { formatInTimeZone } from 'date-fns-tz';

import { DataTable } from '@/app/(main)/(investments)/transactions/components/DataTable';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
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

  const numOfCategories = Object.keys(transactions ?? {}).length;

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!transactions || !numOfCategories) {
    return <>Empty</>;
  }

  if (numOfCategories === 1) {
    return Object.keys(transactions).map(key => (
      <div key={key} className="px-2 py-10">
        <DataTable columns={columns} data={transactions[key]} />
      </div>
    ));
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="mx-2 my-10 w-full border border-b-0"
      defaultValue={Object.keys(transactions)[0]}
    >
      {Object.keys(transactions).map(key => (
        <AccordionItem value={key} key={key}>
          <AccordionTrigger className="px-4">{key}</AccordionTrigger>
          <AccordionContent className="px-4">
            <DataTable columns={columns} data={transactions[key]} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
