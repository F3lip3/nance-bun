import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { DropzoneState, useDropzone } from 'react-dropzone';

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
import { Review } from '@/containers/transactions/import-review';
import { Validate } from '@/containers/transactions/import-validate';
import { usePortfolio } from '@/hooks/use-portfolio';
import { AssetEntity } from '@/lib/server/routers/assets';
import { trpc } from '@/lib/trpc/client';
import { sleep } from '@/lib/utils/functions';
import { ImportTransactionsSchema, Transaction } from '@/schemas/transaction';
import { ListPlus } from '@phosphor-icons/react';

type Step = 'validation' | 'review' | 'import';
type ValidationStatus = 'error' | 'in_progress' | 'success';
type ValidationType = 'assets' | 'currencies' | 'structure' | 'transactions';

interface ImportTransactionsContext {
  dropzoneState: DropzoneState;
  importTransactions: (transactionsToImport: Transaction[]) => void;
  resetImport: () => void;
  setStep: Dispatch<SetStateAction<Step>>;
  transactions: Transaction[];
  valid: boolean;
  validationStatus: Map<ValidationType, ValidationStatus>;
}

const ImportTransactionsContext = createContext<ImportTransactionsContext>(
  {} as ImportTransactionsContext
);

export const ImportTransactions = () => {
  const { portfolio } = usePortfolio();

  const [assetsCodes, setAssetsCodes] = useState<string[]>([]);
  const [step, setStep] = useState<Step>('validation');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [validationStatus, setValidationStatus] = useState<
    Map<ValidationType, ValidationStatus>
  >(new Map());

  const valid = validationStatus.get('currencies') === 'success';

  const { data: assetsList } = trpc.assets.findAssets.useQuery(
    assetsCodes.join(',')
  );

  const { data: currencies } = trpc.currencies.getCurrencies.useQuery();

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
    setTransactions(trans =>
      trans.map(tran => {
        const asset = assets?.find(asset =>
          asset.code.startsWith(tran.asset_code)
        );
        return {
          ...tran,
          asset,
          error: asset ? '' : 'Asset not found'
        };
      })
    );
  }, []);

  const importTransactions = (transactionsToImport: Transaction[]) => {
    console.info('IMPORT TRANSACTIONS:', transactionsToImport);
  };

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

  const resetImport = () => {
    setAssetsCodes([]);
    setStep('validation');
    setTransactions([]);
    setValidationStatus(new Map());
  };

  const validateCurrencies = useCallback(async () => {
    setValidation('currencies', 'in_progress');
    setTransactions(currentTransactions =>
      currentTransactions.map(trn => ({
        ...trn,
        error: trn.error
          ? trn.error
          : currencies?.some(cr => cr.code === trn.currency)
            ? ''
            : 'Currency not found'
      }))
    );
    await sleep(3000);
    setValidation('currencies', 'success');
  }, [currencies]);

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
  }, [assetsList, assetsCodes, fillTransactionsAssets, validationStatus]);

  useEffect(() => {
    const exec = async () => {
      await sleep(3000);
      setValidation('transactions', 'success');
      await validateCurrencies();
    };

    if (validationStatus.get('transactions') === 'in_progress') exec();
  }, [validateCurrencies, validationStatus]);

  return (
    <ImportTransactionsContext.Provider
      value={{
        dropzoneState,
        importTransactions,
        resetImport,
        setStep,
        transactions,
        valid,
        validationStatus
      }}
    >
      <Dialog>
        <DialogTrigger asChild>
          <ImportButton variant="ghost" size="icon" className="rounded-full">
            <ListPlus size={24} />
          </ImportButton>
        </DialogTrigger>
        <DialogContent className="min-w-[48rem] max-w-5xl">
          <DialogHeader>
            <DialogTitle>Import Transactions</DialogTitle>
            <DialogDescription asChild>
              <>
                {step === 'validation' && (
                  <div>
                    The content must have the following columns:
                    <ul className="list-inside list-disc pl-2 pt-2">
                      <li>Transaction date</li>
                      <li>Transaction type</li>
                      <li>Asset code</li>
                      <li>Shares</li>
                      <li>Cost per share</li>
                      <li>Currency</li>
                    </ul>
                  </div>
                )}
                {step === 'review' && (
                  <small className="text-muted-foreground">
                    Check for inconsistences and select which transactions you
                    would like to import
                  </small>
                )}
              </>
            </DialogDescription>
          </DialogHeader>
          {step === 'validation' && <Validate />}
          {step === 'review' && <Review />}
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
