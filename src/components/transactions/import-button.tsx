import { forwardRef } from 'react';

import { ButtonProps, buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils/functions';

export const ImportButton = forwardRef<HTMLButtonElement, ButtonProps>(
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
