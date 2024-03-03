import { useState } from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/lib/trpc/client';

type CurrencySelectorProps<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder: string;
  className?: string;
};

export const CurrencySelector = <T extends FieldValues>({
  className,
  form,
  name,
  label,
  placeholder
}: CurrencySelectorProps<T>) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data: currencies } = trpc.currencies.getCurrencies.useQuery(
    undefined,
    {
      staleTime: Infinity
    }
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          {currencies ? (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={className}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency.id} value={currency.id}>
                    {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Skeleton className="h-9 w-full rounded-full" />
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
