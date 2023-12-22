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
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Validate } from '@/containers/transactions/import-validate';
import { usePortfolio } from '@/hooks/use-portfolio';
import { AssetEntity } from '@/lib/server/routers/assets';
import { trpc } from '@/lib/trpc/client';
import { sleep } from '@/lib/utils/functions';
import { ImportTransactionsSchema, Transaction } from '@/schemas/transaction';
import { ListPlus } from '@phosphor-icons/react';

type ValidationStatus = 'error' | 'in_progress' | 'success';
type ValidationType = 'assets' | 'structure' | 'transactions';

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

  const { data: assetsList } = trpc.assets.findAssets.useQuery(
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

  const fillTransactionsAssets = useCallback((assets: AssetEntity[]) => {
    setValidation('transactions', 'in_progress');
    console.info('HERE');
    setTransactions(trans =>
      trans.map(tran => ({
        ...tran,
        asset: assets?.find(asset => asset.code.startsWith(tran.asset_code))
      }))
    );
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

  const valid = validationStatus.get('transactions') === 'success';

  const validateTransactions = useCallback(() => {
    setValidation('transactions', 'success');
    console.info(transactions);
  }, [transactions]);

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
    if (
      assetsCodes.length &&
      assetsList !== undefined &&
      validationStatus.get('assets') === 'in_progress'
    ) {
      if (assetsList.length !== 0) {
        setValidation('assets', 'success');
        fillTransactionsAssets(assetsList);
      } else {
        setValidation('assets', 'error');
        toast({ title: 'No assets found!', variant: 'destructive' });
      }
    }
  }, [
    assetsList,
    assetsCodes,
    fillTransactionsAssets,
    validationStatus,
    validateTransactions
  ]);

  useEffect(() => {
    if (validationStatus.get('transactions') === 'in_progress') {
      validateTransactions();
    }
  }, [validateTransactions, validationStatus]);

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
          {valid && (
            <DialogFooter>
              <Button type="button" variant="secondary">
                Proceed
              </Button>
            </DialogFooter>
          )}
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
