import { Spinner } from '@phosphor-icons/react';
import { Table } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import { useHoldings } from '@/hooks/use-holdings';

import { DataTableToolbarFiltersCategory } from './DataTableToolbarFiltersCategory';

interface DataTableToolbarFiltersProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbarFilters<TData>({
  table
}: DataTableToolbarFiltersProps<TData>) {
  const { isLoadingHoldings } = useHoldings();

  return (
    <>
      <Input
        placeholder="Filter holdings by asset..."
        value={(table.getColumn('asset')?.getFilterValue() as string) ?? ''}
        onChange={event =>
          table.getColumn('asset')?.setFilterValue(event.target.value)
        }
        className="h-8 w-[150px] lg:w-[250px]"
      />
      <DataTableToolbarFiltersCategory />

      {isLoadingHoldings && <Spinner className="animate-spin" />}
      {/* {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )} */}
    </>
  );
}
