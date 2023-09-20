import { UseFormReturn } from 'react-hook-form';

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils/functions';

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
  FormDescription,
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
import { useState } from 'react';

type CategorySelectorProps = {
  form: UseFormReturn<any, any, undefined>;
};

export const CategorySelector = ({ form }: CategorySelectorProps) => {
  const { data } = trpc.categories.getCategories.useQuery();
  const [search, setSearch] = useState('');

  const addNewCategory = (value: string) => {
    console.info('add new category:', value);
  };

  return (
    <>
      {data ? (
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Category:</FormLabel>

              <Popover>
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
                        ? data.categories.find(
                            category => category.publicId === field.value
                          )?.name
                        : 'Select category'}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[335px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search categories..."
                      className="h-9"
                      value={search}
                      onValueChange={setSearch}
                    />
                    <CommandEmpty className="flex flex-col gap-2 p-4">
                      <small>
                        Category{' '}
                        <Badge className="rounded" variant="secondary">
                          {search}
                        </Badge>{' '}
                        does not exists.
                      </small>
                    </CommandEmpty>
                    <CommandGroup>
                      {data.categories.map(category => (
                        <CommandItem
                          value={category.name}
                          key={category.publicId}
                          onSelect={() => {
                            form.setValue('category', category.publicId);
                          }}
                        >
                          {category.name}
                          <CheckIcon
                            className={cn(
                              'ml-auto h-4 w-4',
                              category.publicId === field.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                  {search?.length > 3 && (
                    <section className="w-full px-4 pb-4">
                      <Button
                        size="sm"
                        className="w-full rounded"
                        onClick={() => addNewCategory(search)}
                        type="button"
                      >
                        Add
                      </Button>
                    </section>
                  )}
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the category that will be linked to the transaction.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <span>Loading...</span>
      )}
    </>
  );
};
