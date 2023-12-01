import { forwardRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { CircleNotch, FileCsv, ListPlus } from '@phosphor-icons/react';

import { ButtonProps, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

import { cn } from '@/lib/utils/functions';

type FileValidationStatus = 'in_progress' | 'error' | 'success';

const ImportButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent className="mb-2">
        <p>Import</p>
      </TooltipContent>
    </Tooltip>
  )
);

ImportButton.displayName = 'ImportButton';

export const ImportTransactions: React.FC = () => {
  const [validationStatus, setValidationStatus] =
    useState<FileValidationStatus>('in_progress');

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragActive,
    isDragReject,
    isFileDialogActive
  } = useDropzone({
    multiple: false,
    accept: {
      'text/csv': ['.csv']
    }
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ImportButton variant="ghost" size="icon" className="rounded-full">
          <ListPlus size={24} />
        </ImportButton>
      </DialogTrigger>
      <DialogContent className="min-w-[40rem]">
        <DialogHeader>
          <DialogTitle>Import transactions using a CSV file</DialogTitle>
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
            {...getRootProps({
              className: cn(
                'border border-dashed p-8 outline-none w-full',
                (isDragActive || isFileDialogActive) && 'border-cyan-600',
                isDragAccept && 'border-green-600',
                isDragReject && 'border-destructive'
              )
            })}
          >
            <input {...getInputProps()} />
            <p className="cursor-pointer">
              Paste the content, or drag&apos;n&apos;drop, or click to select
              the CSV file.
            </p>
          </div>
          {acceptedFiles?.length > 0 && (
            <div className="flex w-full flex-row items-center justify-center gap-4">
              <div className="flex flex-row items-center gap-1 text-muted-foreground">
                <FileCsv size={40} />
                <div className="flex flex-col">
                  {acceptedFiles[0].name}
                  <small>{acceptedFiles[0].size} bytes</small>
                </div>
              </div>
              <div className="m-auto flex-1 border border-dashed"></div>
              {validationStatus === 'in_progress' && (
                <div className="flex flex-row items-center gap-2 text-yellow-600">
                  <CircleNotch size={16} className="animate-spin" />
                  <small>validating...</small>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
