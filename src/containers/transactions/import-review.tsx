import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useImportTransactions } from '@/containers/transactions/import';
import { cn, formatDate, formatNumber } from '@/lib/utils/functions';
import {
  Transaction,
  TransactionStatus,
  TransactionToImport
} from '@/schemas/transaction';
import { CheckCircle, CircleNotch, WarningCircle } from '@phosphor-icons/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';

import { ThreeDots } from 'react-loader-spinner';

type TransactionError = {
  error: string;
  occurrences: number;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    id: 'select',
    accessorFn: data => ({ error: data.error, status: data.status }),
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row, getValue }) => {
      const data = getValue<{ error: string; status: TransactionStatus }>();

      if (data.status === 'error') {
        return (
          <div className="flex items-center justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <WarningCircle
                  className="ml-2 self-center text-red-500"
                  size="22"
                />
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-red-400 text-red-950">
                <p>{data.error}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      }

      if (data.status === 'importing') {
        return (
          <div className="flex items-center justify-center">
            <CircleNotch
              size="22"
              className="ml-2 animate-spin self-center text-blue-500"
            />
          </div>
        );
      }

      if (data.status === 'done') {
        return (
          <div className="flex items-center justify-center">
            <CheckCircle
              size="22"
              className="ml-2 self-center text-green-500"
            />
          </div>
        );
      }

      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      );
    }
  },
  {
    accessorKey: 'date',
    header: 'Date',
    enableSorting: false,
    enableColumnFilter: false,
    accessorFn: data => formatDate(data.date)
  },
  {
    accessorKey: 'type',
    header: 'Type',
    enableSorting: false,
    enableColumnFilter: false
  },
  {
    accessorKey: 'asset',
    header: 'Asset',
    enableSorting: false,
    enableColumnFilter: false,
    accessorFn: data => data.asset?.code ?? data.asset_code
  },
  {
    accessorKey: 'shares',
    header: 'Shares',
    enableSorting: false,
    enableColumnFilter: false,
    accessorFn: data => formatNumber(data.shares)
  },
  {
    accessorKey: 'cost_per_share',
    header: 'Cost per Shares',
    enableSorting: false,
    enableColumnFilter: false,
    accessorFn: data =>
      formatNumber(data.cost_per_share, {
        currency: data.asset && data.error ? 'USD' : data.currency
      })
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
    enableSorting: false,
    enableColumnFilter: false
  }
];

export const Review = () => {
  const {
    finishImport,
    resetImport,
    startTransactionsImport,
    step,
    transactions
  } = useImportTransactions();

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    data: transactions,
    columns
  });

  const handleImport = async () => {
    await startTransactionsImport(
      table
        .getSelectedRowModel()
        .rows.map(row => row.original as TransactionToImport)
        .filter(trn => !trn.error)
    );
  };

  const errors = Array.from(
    transactions
      .filter(trn => trn.error)
      .reduce(
        (acc, curr) => acc.set(curr.error!, (acc.get(curr.error!) || 0) + 1),
        new Map<string, number>()
      ),
    ([error, occurrences]) => ({ error, occurrences })
  ) as TransactionError[];

  const numOfErrors = errors.reduce((acc, err) => acc + err.occurrences, 0);
  const numOfRows = table.getFilteredRowModel().rows.length;
  const numOfSelectedRows = table.getIsAllRowsSelected()
    ? numOfRows - numOfErrors
    : table.getFilteredSelectedRowModel().rows.length;

  return (
    <>
      {/* <div className="max-h-[calc(100vh-588px)] overflow-y-auto overflow-x-hidden border"> */}
      <ScrollArea className="max-h-[calc(100vh-588px)] border">
        <Table className="border-separate border-spacing-0">
          <TableHeader className="sticky top-0 z-10 m-0 bg-background">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'border-separate border-spacing-1 border-b text-center',
                      (header.column.columnDef.meta as any)?.align === 'left' &&
                        'text-left',
                      (header.column.columnDef.meta as any)?.align ===
                        'right' && 'text-right'
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
                        'h-[39px] border-separate border-spacing-1 border-b text-center',
                        table.getRowModel().rows?.length - 1 === rowIndex &&
                          'border-none',
                        (cell.column.columnDef.meta as any)?.align === 'left' &&
                          'text-left',
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
        </Table>
        <div className="sticky -bottom-px m-0 flex flex-row items-center justify-between gap-1 border-t bg-background p-2 text-sm text-muted-foreground">
          <div className="pl-2">
            {numOfSelectedRows} of {numOfRows} transactions selected.
          </div>
          <div className="flex flex-col items-end">
            {errors.length > 0 &&
              errors.map((err, eIx) => (
                <div
                  key={`err${eIx}`}
                  className="flex flex-row items-center gap-1"
                >
                  {`${err.error.toLowerCase()}:`}
                  <span className="text-right font-mono font-medium text-red-400">
                    {err.occurrences}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </ScrollArea>
      <DialogFooter>
        {step === 'done' ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => finishImport()}
          >
            Finish
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => resetImport()}
              disabled={step === 'import'}
            >
              Get back
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleImport()}
              disabled={numOfSelectedRows === 0 || step === 'import'}
            >
              {step === 'import' ? (
                <>
                  Importing&nbsp;&nbsp;&nbsp;
                  <ThreeDots height="16" width="16" color="white" />
                </>
              ) : (
                'Import selected'
              )}
            </Button>
          </>
        )}
      </DialogFooter>
    </>
  );
};
