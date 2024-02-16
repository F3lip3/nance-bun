import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { parse } from 'papaparse';

import { ImportButton } from '@/components/transactions/import-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { usePortfolio } from '@/hooks/use-portfolio';
import { cn, sleep } from '@/lib/utils/functions';
import { ImportTransactionsSchema, Transaction } from '@/schemas/transaction';
import {
  CheckCircle,
  CircleNotch,
  FileCsv,
  ListPlus,
  XCircle
} from '@phosphor-icons/react';

type ImportStatus = 'error' | 'in_progress' | 'success';
type ImportStep = 'structure' | 'import';

const IMPORT_LIST_LIMIT = 100;

export const ImportTransactions = () => {
  const { portfolio: portfolio_id } = usePortfolio();

  const [open, setOpen] = useState(false);
  const [validationStatus, setValidationStatus] = useState<
    Map<ImportStep, ImportStatus>
  >(new Map());

  const dropzoneState = useDropzone({
    multiple: false,
    accept: {
      'text/csv': ['.csv']
    }
  });

  const importTransactions = useCallback(
    async (transactions: Transaction[]) => {
      await sleep(1000);
      setValidation('import', 'in_progress');
      console.info('transactions', transactions);
    },
    []
  );

  const parseCsv = useCallback(
    (csv: File | string) => {
      parse(csv, {
        delimiter: ',',
        complete: async function (results) {
          const parseResult = ImportTransactionsSchema.safeParse(results.data);
          if (parseResult.success) {
            if (parseResult.data.length > IMPORT_LIST_LIMIT) {
              setValidation('structure', 'error');
              toast({
                title: `The import file must not have more than ${IMPORT_LIST_LIMIT} transactions!`,
                variant: 'destructive'
              });
              return;
            }
            setValidation('structure', 'success');
            await importTransactions(parseResult.data);
          } else {
            setValidation('structure', 'error');
            console.info(results.data);
            console.error(parseResult.error);
          }
        }
      });
    },
    [importTransactions]
  );

  const setValidation = (type: ImportStep, status: ImportStatus) => {
    setValidationStatus(map => new Map(map.set(type, status)));
  };

  useEffect(() => {
    const start = async () => {
      setValidation('structure', 'in_progress');
      await sleep(1000);
      parseCsv(dropzoneState.acceptedFiles[0]);
    };

    if (dropzoneState.acceptedFiles.length) {
      start();
    }
  }, [dropzoneState.acceptedFiles, parseCsv]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ImportButton variant="ghost" size="icon" className="rounded-full">
          <ListPlus size={24} />
        </ImportButton>
      </DialogTrigger>
      <DialogContent className="min-w-[48rem] max-w-5xl">
        <DialogHeader>
          <DialogTitle>Import Transactions</DialogTitle>
          <DialogDescription asChild>
            <div>
              The content must have the following columns:
              <ul className="list-inside list-disc pl-2 pt-2">
                <li>Transaction date</li>
                <li>Transaction type</li>
                <li>Asset code</li>
                <li>Shares</li>
                <li>Cost per share</li>
                <li>Currency</li>
                <li>Category</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-start gap-4">
          <div
            {...dropzoneState.getRootProps({
              className: cn(
                'border border-dashed p-8 outline-none w-full',
                (dropzoneState.isDragActive ||
                  dropzoneState.isFileDialogActive) &&
                  'border-cyan-600',
                dropzoneState.isDragAccept && 'border-green-600',
                dropzoneState.isDragReject && 'border-destructive'
              )
            })}
          >
            <input {...dropzoneState.getInputProps()} />
            <p className="cursor-pointer">
              Paste the content or import a CSV file clicking here or dropping
              the file.
            </p>
          </div>
          {dropzoneState.acceptedFiles?.length > 0 && (
            <div className="flex w-full flex-row items-start justify-between gap-4">
              <div className="flex flex-row items-center gap-1 text-muted-foreground">
                <FileCsv size={40} />
                <div className="flex flex-col">
                  {dropzoneState.acceptedFiles[0].name}
                  <small>{dropzoneState.acceptedFiles[0].size} bytes</small>
                </div>
              </div>
              {validationStatus.size > 0 && (
                <ul className="flex flex-col items-end justify-center text-sm">
                  {[...validationStatus.keys()].map(type => (
                    <li key={type} className="flex flex-row items-center gap-2">
                      <span className="text-muted-foreground">
                        {type === 'structure' && 'validating csv structure'}
                        {type === 'import' && 'scheduling transactions import'}
                      </span>
                      {validationStatus.get(type) === 'in_progress' && (
                        <CircleNotch
                          size={16}
                          className="animate-spin text-yellow-600"
                        />
                      )}
                      {validationStatus.get(type) === 'success' && (
                        <CheckCircle size={16} className="text-green-600" />
                      )}
                      {validationStatus.get(type) === 'error' && (
                        <XCircle size={16} className="text-red-600" />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
