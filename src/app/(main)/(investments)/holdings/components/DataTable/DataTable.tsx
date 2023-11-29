'use client';

import { useMemo, useState } from 'react';

import {
  Column,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { useHoldings } from '@/hooks/useHoldings';
import { cn } from '@/lib/utils/functions';
import { ArrowDown, ArrowUp } from '@phosphor-icons/react';

import { Skeleton } from '@/components/ui/skeleton';
import { HoldingEntity } from '@/lib/server/routers/holdings';
import { HoldingsDataTableColumns } from './DataTableColumns';
import { DataTableToolbar } from './DataTableToolbar';

interface SortContainerProps<TData, TValue> {
  children: React.ReactNode;
  column: Column<TData, TValue>;
}

const SortContainer = <TData, TValue>({
  children,
  column
}: SortContainerProps<TData, TValue>) => {
  if (!column.getCanSort()) return <>{children}</>;

  return (
    <Button
      className="gap-2"
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {children}
      {column.getIsSorted() === 'asc' && <ArrowUp />}
      {column.getIsSorted() === 'desc' && <ArrowDown />}
    </Button>
  );
};

export const HoldingsDataTable = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'weight', desc: true }
  ]);

  const { holdings, isLoadingHoldings } = useHoldings();

  const data = useMemo<HoldingEntity[]>(() => {
    return isLoadingHoldings
      ? Array(10).fill({} as HoldingEntity)
      : (holdings as HoldingEntity[]);
  }, [isLoadingHoldings, holdings]);

  const columns = useMemo(() => {
    return isLoadingHoldings
      ? HoldingsDataTableColumns.map(column => ({
          ...column,
          cell: () => <Skeleton className="my-2 h-8 w-full rounded-full" />
        }))
      : HoldingsDataTableColumns;
  }, [isLoadingHoldings]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    state: { columnFilters, sorting }
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="max-h-[calc(100vh-276px)] overflow-y-auto overflow-x-hidden rounded-md border">
        <Table className="border-separate border-spacing-x-0 border-spacing-y-0">
          <TableHeader className="sticky top-0 z-10 m-0 bg-background">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'border-separate border-spacing-1 border-b text-left',
                        (header.column.columnDef.meta as any)?.align ===
                          'center' && 'text-center',
                        (header.column.columnDef.meta as any)?.align ===
                          'right' && 'text-right'
                      )}
                    >
                      <SortContainer column={header.column}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </SortContainer>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'border-separate border-spacing-1 border-b text-left',
                        table.getRowModel().rows?.length - 1 === rowIndex &&
                          'border-none',
                        (cell.column.columnDef.meta as any)?.align ===
                          'center' && 'text-center',
                        (cell.column.columnDef.meta as any)?.align ===
                          'right' && 'text-right'
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {!isLoadingHoldings &&
            table.getFooterGroups().length > 0 &&
            (table.getRowModel().rows?.length ?? 0) > 0 && (
              <TableFooter className="sticky bottom-0 m-0 bg-background">
                {table.getFooterGroups().map(footerGroup => (
                  <TableRow key={footerGroup.id}>
                    {footerGroup.headers.map(footer => (
                      <TableHead
                        key={footer.id}
                        className={cn(
                          'border-separate border-spacing-1 border-t text-left',
                          (footer.column.columnDef.meta as any)?.align ===
                            'center' && 'text-center',
                          (footer.column.columnDef.meta as any)?.align ===
                            'right' && 'text-right'
                        )}
                      >
                        {footer.isPlaceholder
                          ? null
                          : flexRender(
                              footer.column.columnDef.footer,
                              footer.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableFooter>
            )}
        </Table>
      </div>
    </div>
  );
};
