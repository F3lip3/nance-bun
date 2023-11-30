import { forwardRef } from 'react';

import { ListPlus } from '@phosphor-icons/react';

import { ButtonProps, buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils/functions';

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
  return (
    <ImportButton variant="ghost" size="icon" className="rounded-full">
      <ListPlus size={24} />
    </ImportButton>
  );
};
