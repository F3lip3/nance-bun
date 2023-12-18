import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { DropzoneState, useDropzone } from 'react-dropzone';

import { parse } from 'papaparse';

import { ImportButton } from '@/components/transactions/import-button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Validate } from '@/containers/transactions/import-validate';
import { usePortfolio } from '@/hooks/use-portfolio';
import { trpc } from '@/lib/trpc/client';
import { sleep } from '@/lib/utils/functions';
import { ImportTransactionsSchema, Transaction } from '@/schemas/transaction';
import { ListPlus } from '@phosphor-icons/react';

type ValidationStatus = 'error' | 'in_progress' | 'success';
type ValidationType = 'assets' | 'structure';

interface ImportTransactionsContext {
  dropzoneState: DropzoneState;
  validationStatus: Map<ValidationType, ValidationStatus>;
}

const ImportTransactionsContext = createContext<ImportTransactionsContext>(
  {} as ImportTransactionsContext
);

export const ImportTransactions = () => {
  const { portfolio } = usePortfolio();

  const [assetsCodes, setAssetsCodes] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [validationStatus, setValidationStatus] = useState<
    Map<ValidationType, ValidationStatus>
  >(new Map());

  const { data: assets } = trpc.assets.findAssets.useQuery(
    assetsCodes.join(',')
  );

  const dropzoneState = useDropzone({
    multiple: false,
    accept: {
      'text/csv': ['.csv']
    }
  });

  const setValidation = (type: ValidationType, status: ValidationStatus) => {
    setValidationStatus(map => new Map(map.set(type, status)));
  };

  const fetchAssets = useCallback((transactions: Transaction[]) => {
    setValidation('assets', 'in_progress');
    setAssetsCodes(transactions.map(trans => trans.asset_code));
  }, []);

  const parseCsv = useCallback(
    (csv: File | string) => {
      parse(csv, {
        delimiter: ';',
        complete: function (results) {
          const rawCsv = results.data?.filter(
            x => (x as unknown[]).length === 6
          );
          const parseResult = ImportTransactionsSchema.safeParse(rawCsv);
          if (parseResult.success) {
            setValidation('structure', 'success');
            setTransactions(parseResult.data);
            fetchAssets(parseResult.data);
          } else {
            console.info(results.data);
            console.error(parseResult.error);
          }
        }
      });
    },
    [fetchAssets]
  );

  useEffect(() => {
    const start = async () => {
      setValidation('structure', 'in_progress');
      await sleep(1500);
      parseCsv(dropzoneState.acceptedFiles[0]);
    };

    if (dropzoneState.acceptedFiles.length) {
      start();
    }
  }, [dropzoneState.acceptedFiles, parseCsv, portfolio]);

  useEffect(() => {
    if (assetsCodes.length && assets !== undefined) {
      if (assets.length === 0) {
        setValidation('assets', 'success');
      } else {
        setValidation('assets', 'error');
        toast({ title: 'No assets found!', variant: 'destructive' });
      }
    }
  }, [assets, assetsCodes]);

  return (
    <ImportTransactionsContext.Provider
      value={{ dropzoneState, validationStatus }}
    >
      <Dialog>
        <DialogTrigger asChild>
          <ImportButton variant="ghost" size="icon" className="rounded-full">
            <ListPlus size={24} />
          </ImportButton>
        </DialogTrigger>
        <DialogContent className="min-w-[40rem]">
          <Validate />
        </DialogContent>
      </Dialog>
    </ImportTransactionsContext.Provider>
  );
};

export const useImportTransactions = (): ImportTransactionsContext => {
  const context = useContext(ImportTransactionsContext);
  if (!context) {
    throw new Error(
      'useImportTransactions must be used within a ImportTransactions'
    );
  }

  return context;
};
