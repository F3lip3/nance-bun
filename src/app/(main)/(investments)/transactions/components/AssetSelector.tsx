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
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { trpc } from '@/lib/trpc/client';
import { cn } from '@/lib/utils/functions';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

type AssetSelectorProps = {
  form: UseFormReturn<any, any, undefined>;
};

export const AssetSelector = ({ form }: AssetSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data: assets } = trpc.assets.findAssets.useQuery({ code: search });

  // const assets = useMemo(() => {

  //   return data;
  // }, [search]);

  return (
    <FormField
      control={form.control}
      name="asset"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Asset:</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'w-full justify-between',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value
                    ? assets?.find(asset => asset.code === field.value.code)
                        ?.code
                    : 'Search assets'}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[335px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search assets..."
                  className="h-9"
                  value={search}
                  onValueChange={setSearch}
                />
                <CommandEmpty className="flex flex-col gap-2 p-4">
                  <small>
                    No asset with name or code like{' '}
                    <Badge className="rounded" variant="secondary">
                      {search}
                    </Badge>{' '}
                    was found.
                  </small>
                </CommandEmpty>
                <CommandGroup>
                  {assets?.map(asset => (
                    <CommandItem
                      value={asset.code}
                      key={asset.code}
                      onSelect={() => {
                        form.setValue('asset', asset);
                        setOpen(false);
                      }}
                    >
                      {asset.code} - {asset.longname}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          asset.code === field.value.code
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
