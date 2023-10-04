import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/lib/trpc/client';
import { cn } from '@/lib/utils/functions';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

type CurrencySelectorProps = {
  className?: string;
  form: UseFormReturn<any, any, undefined>;
};

export const CurrencySelector = ({
  className,
  form
}: CurrencySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data: currencies } = trpc.currencies.getCurrencies.useQuery();

  return (
    <FormField
      control={form.control}
      name="currency_id"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Currency:</FormLabel>
          {currencies ? (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      'w-full justify-between',
                      className,
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value
                      ? currencies.find(currency => currency.id === field.value)
                          ?.name
                      : 'Select currency'}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[340px] p-0">
                {currencies.length === 0 ? (
                  <section className="flex flex-col gap-2 p-4">
                    <small>No currencies found!</small>
                  </section>
                ) : (
                  <Command>
                    <CommandInput
                      placeholder="Search currencies..."
                      className="h-9"
                      value={search}
                      onValueChange={setSearch}
                    />
                    <CommandEmpty className="flex flex-col gap-2 p-4">
                      <small>
                        Currency{' '}
                        <Badge className="rounded" variant="secondary">
                          {search}
                        </Badge>{' '}
                        does not exists.
                      </small>
                    </CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-80">
                        {currencies.map(currency => (
                          <CommandItem
                            value={currency.id}
                            key={currency.id}
                            onSelect={() => {
                              form.setValue('currency_id', currency.id);
                              setOpen(false);
                            }}
                          >
                            {currency.code} - {currency.name}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                currency.id === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </Command>
                )}
              </PopoverContent>
            </Popover>
          ) : (
            <Skeleton className="h-9 w-full rounded-full" />
          )}
        </FormItem>
      )}
    />
  );
};
