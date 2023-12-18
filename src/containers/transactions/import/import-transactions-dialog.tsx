import { forwardRef } from 'react';

import { ListPlus } from '@phosphor-icons/react';

import { ButtonProps, buttonVariants } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

import { cn } from '@/lib/utils/functions';

import { ImportTransactionsDialogStep1 } from './import-transactions-dialog-step1';

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

export const ImportTransactionsDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ImportButton variant="ghost" size="icon" className="rounded-full">
          <ListPlus size={24} />
        </ImportButton>
      </DialogTrigger>
      <DialogContent className="min-w-[40rem]">
        <ImportTransactionsDialogStep1 />
      </DialogContent>
    </Dialog>
  );
};
