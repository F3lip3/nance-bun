'use client';

import { DataTableSetCategory } from '@/app/(main)/(investments)/holdings/components/DataTable/DataTableSetCategory';
import { DataTableToolbarFilters } from '@/app/(main)/(investments)/holdings/components/DataTable/DataTableToolbarFilters';
import { Table } from '@tanstack/react-table';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  // const isFiltered = table.getState().columnFilters.length > 0;
  const isSomeRowsSelected =
    table?.getIsAllRowsSelected() || table?.getIsSomeRowsSelected() || false;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <DataTableToolbarFilters table={table} />
      </div>
      <div className="flex flex-1 items-center justify-end animate-in animate-out">
        {isSomeRowsSelected && <DataTableSetCategory table={table} />}
        {/* <DataTableViewOptions table={table} /> */}
      </div>
    </div>
  );
}
