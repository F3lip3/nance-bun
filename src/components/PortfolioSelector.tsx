'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { AddPortfolio } from '@/containers/AddPortfolio';
import { usePortfolio } from '@/hooks/usePortfolio';
import { cn } from '@/lib/utils/functions';
import { CaretDownIcon, CheckIcon } from '@radix-ui/react-icons';

export const PortfolioSelector = () => {
  const { portfolio, portfolios, setPortfolio } = usePortfolio();

  if (!portfolios) {
    return <Skeleton className="h-9 w-24 rounded" />;
  }

  if (!portfolios.length) {
    return (
      <AddPortfolio insideDialog={true} success={pf => setPortfolio(pf.id)} />
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-auto justify-between rounded border-none text-lg shadow-none"
        >
          {portfolios.find(pf => pf.id === portfolio)?.name ||
            'Select a portfolio'}
          <CaretDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 rounded p-2" align="start">
        <Command>
          <CommandEmpty>No portfolios found.</CommandEmpty>
          <CommandGroup>
            {portfolios.map(pf => (
              <CommandItem
                value={pf.id}
                key={pf.id}
                className="rounded"
                onSelect={() => {
                  setPortfolio(pf.id);
                }}
              >
                {pf.name}
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    pf.id === portfolio ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
