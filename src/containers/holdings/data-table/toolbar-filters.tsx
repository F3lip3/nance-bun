import { Table } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import { useHoldings } from '@/hooks/use-holdings';

import { Skeleton } from '@/components/ui/skeleton';
import { DataTableToolbarFiltersCategory } from './toolbar-filters-category';

interface DataTableToolbarFiltersProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbarFilters<TData>({
  table
}: DataTableToolbarFiltersProps<TData>) {
  const { isLoadingHoldings, holdings } = useHoldings();

  if (isLoadingHoldings) {
    return <Skeleton className="h-8 w-[250px]" />;
  }

  if (!holdings?.length) {
    return <></>;
  }

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
    </>
  );
}
