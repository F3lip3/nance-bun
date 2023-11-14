import { ArrowDown, ArrowUp } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/DataTable';
import { useHoldings } from '@/hooks/useHoldings';
import {
  AssetEntity,
  HoldingEntity,
  HoldingGainEntity
} from '@/lib/server/routers/holdings';
import { cn, formatNumber } from '@/lib/utils/functions';

type TotalGain = HoldingGainEntity & {
  currency: string;
};

const columns: ColumnDef<HoldingEntity>[] = [
  {
    header: 'Asset',
    accessorFn: data => data.asset,
    cell: info => {
      const asset = info.getValue<AssetEntity>();
      return (
        <>
          <div>{asset.code.replace('.SA', '')}</div>
          <small>{asset.shortname}</small>
        </>
      );
    }
  },
  {
    header: 'Shares',
    accessorFn: data => formatNumber(data.shares)
  },
  {
    header: 'Average Cost',
    accessorFn: data => formatNumber(data.average_cost, data.currency.code)
  },
  {
    header: 'Current Price',
    accessorFn: data =>
      formatNumber(data.asset.current_price, data.currency.code)
  },
  {
    header: 'Total',
    accessorFn: data => formatNumber(data.total_price, data.currency.code)
  },
  {
    header: 'Total Gain',
    accessorFn: data => ({ ...data.total_gain, currency: data.currency.code }),
    meta: { align: 'center' },
    cell: info => {
      const gain = info.getValue<TotalGain>();
      return (
        <div
          className={cn(
            'flex flex-row items-center justify-center gap-1 text-green-600',
            gain.type === 'negative' && 'text-red-600'
          )}
        >
          <div className="text-2xl">
            {gain.type === 'positive' ? <ArrowUp /> : <ArrowDown />}
          </div>
          <div className="flex flex-col">
            <div>{formatNumber(gain.percentage)}%</div>
            <small>{formatNumber(gain.value, gain.currency)}</small>
          </div>
        </div>
      );
    }
  }
];

export const ListHoldings: React.FC = () => {
  const { isLoading, holdings } = useHoldings();

  console.info('holdings', holdings);

  if (isLoading) return <>Loading...</>;
  if (!holdings) return <>Empty</>;

  return (
    <div className="px-2 py-10">
      <DataTable columns={columns} data={holdings} />
    </div>
  );
};
