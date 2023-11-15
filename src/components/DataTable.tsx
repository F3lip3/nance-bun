'use client';

import { useState } from 'react';

import {
  Column,
  ColumnDef,
  ColumnSort,
  SortingState,
  flexRender,
  getCoreRowModel,
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
import { cn } from '@/lib/utils/functions';
import { ArrowDown, ArrowUp } from '@phosphor-icons/react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultSort?: ColumnSort;
}

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

export const DataTable = <TData, TValue>({
  columns,
  data,
  defaultSort
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>(
    defaultSort ? [defaultSort] : []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting }
  });

  return (
    <div className="max-h-[calc(100vh-360px)] overflow-y-auto overflow-x-hidden rounded-md border">
      <Table className="table-fixed border-separate border-spacing-x-0 border-spacing-y-0">
        <TableHeader className="sticky top-0 m-0 bg-zinc-900">
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
                      (cell.column.columnDef.meta as any)?.align === 'center' &&
                        'text-center',
                      (cell.column.columnDef.meta as any)?.align === 'right' &&
                        'text-right'
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {table.getFooterGroups().length && table.getRowModel().rows?.length && (
          <TableFooter className="sticky bottom-0 m-0 bg-zinc-900">
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
  );
};
