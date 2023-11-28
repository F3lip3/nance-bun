import { PlusCircle } from '@phosphor-icons/react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { useHoldings } from '@/hooks/useHoldings';
import { Table } from '@tanstack/react-table';
import { useState } from 'react';

interface DataTableSetCategoryProps<TData> {
  table?: Table<TData>;
}

export function DataTableSetCategory<TData>({
  table
}: DataTableSetCategoryProps<TData>) {
  const [open, setOpen] = useState(false);

  const { isLoadingCategories, categories, setHoldingsCategory } =
    useHoldings();

  const handleSetCategory = async (category_id: string) => {
    const holdings = table
      ?.getSelectedRowModel()
      ?.rows?.map<string>(row => row.getValue('select'));

    if (holdings?.length) {
      setOpen(false);
      table?.toggleAllRowsSelected(false);

      await setHoldingsCategory({
        category_id,
        holdings
      });

      toast({ title: 'Category set successfully.' });
    } else {
      toast({ title: 'No holdings selected', variant: 'destructive' });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          Set Category
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="end">
        {isLoadingCategories ? (
          <Skeleton className="h-9 w-full rounded-full" />
        ) : (
          <Command>
            <CommandInput placeholder="Select a category" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {categories?.map(category => (
                  <CommandItem
                    key={category.id}
                    onSelect={() => handleSetCategory(category.id)}
                  >
                    <span>{category.name}</span>
                  </CommandItem>
                ))}
                <CommandSeparator />
                <CommandItem key="none" onSelect={() => handleSetCategory('')}>
                  <span>Clear</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}
