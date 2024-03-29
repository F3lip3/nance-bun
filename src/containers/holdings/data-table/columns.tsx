import { ArrowDown, ArrowUp } from '@phosphor-icons/react';
import { rankItem } from '@tanstack/match-sorter-utils';
import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import {
  AssetEntity,
  HoldingEntity,
  HoldingGainEntity
} from '@/lib/server/routers/holdings';
import { cn, formatNumber } from '@/lib/utils/functions';

type HoldingGain = HoldingGainEntity & {
  currency: string;
};

export const HoldingsDataTableColumns: ColumnDef<HoldingEntity>[] = [
  {
    id: 'select',
    accessorKey: 'id',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row, getValue }) => (
      <Checkbox
        checked={row.getIsSelected()}
        value={getValue<string>()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false
  },
  {
    accessorKey: 'asset',
    header: 'Asset',
    enableSorting: true,
    enableColumnFilter: true,
    cell: info => {
      const asset = info.getValue<AssetEntity>();
      return (
        <>
          <div>{asset.code.replace('.SA', '')}</div>
          <small>{asset.shortname}</small>
        </>
      );
    },
    filterFn: (row, columnId, value, addMeta) => {
      const { code, shortname } = row.getValue<AssetEntity>(columnId);

      const codeRank = rankItem(code, value);
      const shortnameRank = rankItem(shortname, value);

      addMeta(codeRank);
      addMeta(shortnameRank);

      return codeRank.passed || shortnameRank.passed;
    },
    sortingFn: (rowA, rowB, columnId) => {
      const codeA = rowA.getValue<AssetEntity>(columnId).code;
      const codeB = rowB.getValue<AssetEntity>(columnId).code;

      return codeA > codeB ? 1 : codeA < codeB ? -1 : 0;
    }
  },
  {
    accessorKey: 'category',
    header: 'Category',
    enableSorting: true,
    enableColumnFilter: true,
    meta: { align: 'center' },
    accessorFn: data => data.category?.name ?? 'None'
  },
  {
    accessorKey: 'shares',
    meta: { align: 'center' },
    accessorFn: data => formatNumber(data.shares, { decimalDigits: 14 }),
    header: 'Shares',
    enableSorting: true
  },
  {
    header: 'Average Cost',
    accessorKey: 'average_cost',
    meta: { align: 'center' },
    accessorFn: data =>
      formatNumber(data.average_cost, { currency: data.currency.code })
  },
  {
    header: 'Current Price',
    meta: { align: 'center' },
    accessorFn: data =>
      formatNumber(data.asset.current_price, { currency: data.currency.code })
  },
  {
    header: 'Total',
    accessorFn: data =>
      formatNumber(data.total_price, { currency: data.currency.code }),
    sortingFn: (rowA, rowB) => {
      const totalA = rowA.original.total_price;
      const totalB = rowB.original.total_price;
      return totalA > totalB ? 1 : totalA < totalB ? -1 : 0;
    }
  },
  {
    header: 'Gain',
    meta: { align: 'center' },
    accessorFn: data => ({
      ...data.total_gain,
      currency: data.currency?.code ?? ''
    }),
    cell: info => {
      const gain = info.getValue<HoldingGain>();
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
            <small>
              {formatNumber(gain.value, { currency: gain.currency })}
            </small>
          </div>
        </div>
      );
    },
    footer: ({ table }) => {
      const { rows } = table.getFilteredRowModel();
      const groupedData = rows.reduce<HoldingGain>((acc, row) => {
        const data = row.getValue('Gain') as HoldingGain;
        return {
          currency: data.currency,
          value: (acc.value || 0) + data.value
        } as HoldingGain;
      }, {} as HoldingGain);

      groupedData.type = groupedData.value > 0 ? 'positive' : 'negative';

      return (
        <div
          className={cn(
            'py-2 text-green-600',
            groupedData.type === 'negative' && 'text-red-600'
          )}
        >
          <div>
            {formatNumber(groupedData.value, {
              currency: groupedData.currency
            })}
          </div>
          <small>TOTAL GAIN</small>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const gainA = rowA.original.total_gain.percentage;
      const gainB = rowB.original.total_gain.percentage;

      return gainA > gainB ? 1 : gainA < gainB ? -1 : 0;
    }
  },
  {
    header: 'Weight',
    meta: { align: 'center' },
    accessorKey: 'weight',
    accessorFn: data => `${formatNumber(data.weight * 100)}%`,
    sortingFn: (rowA, rowB) => {
      const weightA = rowA.original.weight;
      const weightB = rowB.original.weight;

      return weightA > weightB ? 1 : weightA < weightB ? -1 : 0;
    },
    footer: ({ table }) => (
      <div className="py-2">
        <div>
          {formatNumber(
            table
              .getFilteredRowModel()
              .rows.reduce(
                (total, row) =>
                  total +
                  Number(row.getValue('weight')?.toString().replace('%', '')),
                0
              ),
            { decimalDigits: 0 }
          )}
          %
        </div>
        <small>TOTAL WEIGHT</small>
      </div>
    )
  }
];
