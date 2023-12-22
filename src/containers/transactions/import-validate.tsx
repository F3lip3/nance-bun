import {
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useImportTransactions } from '@/containers/transactions/import';
import { cn } from '@/lib/utils/functions';
import {
  CheckCircle,
  CircleNotch,
  FileCsv,
  XCircle
} from '@phosphor-icons/react';

export const Validate = () => {
  const { dropzoneState, validationStatus } = useImportTransactions();

  return (
    <>
      <DialogHeader>
        <DialogTitle>Import transactions</DialogTitle>
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
            Paste the content or import a CSV file clicking here or dropping the
            file.
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
                      {type === 'assets' && 'validating assets'}
                      {type === 'structure' && 'validating csv structure'}
                      {type === 'transactions' && 'validating transactions'}
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
    </>
  );
};
