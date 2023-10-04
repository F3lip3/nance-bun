import { UseFormReturn } from 'react-hook-form';

import { CaretSortIcon, CheckIcon, ReloadIcon } from '@radix-ui/react-icons';

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/lib/trpc/client';
import { useCallback, useState } from 'react';

type CategorySelectorProps = {
  form: UseFormReturn<any, any, undefined>;
};

export const CategorySelector = ({ form }: CategorySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [addError, setAddError] = useState('');
  const [addState, setAddState] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [search, setSearch] = useState('');

  const { data: categories, refetch } =
    trpc.categories.getCategories.useQuery();

  const { mutateAsync: addCategory } =
    trpc.categories.addCategory.useMutation();

  const addNewCategory = useCallback(
    async (name: string) => {
      if (!name) {
        setAddError('Category name is required.');
        return;
      }

      setAddState('loading');

      const newCategory = await addCategory({ name });

      await refetch();

      form.setValue('category', newCategory.id);

      setOpen(false);
      setAddError('');
      setAddState('');
      setSearch('');
      setNewCategory('');
    },
    [addCategory, form, refetch]
  );

  const handleAddCategoryInputKeyboardEvent = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const name = e.currentTarget.value;
    if (e.key === 'Enter') {
      e.preventDefault();
      if (name.length > 3) {
        addNewCategory(name);
      }
    }
  };

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Category:</FormLabel>
          {categories ? (
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
                      ? categories.find(category => category.id === field.value)
                          ?.name
                      : 'Select category'}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[335px] p-0">
                {categories.length === 0 && (
                  <section className="flex flex-col gap-2 p-4">
                    <small>No categories found!</small>
                    <div className="flex flex-row gap-2">
                      <Input
                        type="text"
                        placeholder="New category name..."
                        className="rounded-s"
                        value={newCategory}
                        onChange={e => setNewCategory(e.currentTarget.value)}
                        onKeyUp={handleAddCategoryInputKeyboardEvent}
                        disabled={addState === 'loading'}
                      />
                      <Button
                        className="rounded-e"
                        type="button"
                        disabled={
                          newCategory.length <= 3 || addState === 'loading'
                        }
                        onClick={() => addNewCategory(newCategory)}
                      >
                        {addState === 'loading' ? (
                          <ReloadIcon className="animate-spin" />
                        ) : (
                          'Add'
                        )}
                      </Button>
                    </div>
                  </section>
                )}
                {categories.length > 0 && (
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
                      {categories.map(category => (
                        <CommandItem
                          value={category.name}
                          key={category.id}
                          onSelect={() => {
                            form.setValue('category', category.id);
                            setOpen(false);
                          }}
                        >
                          {category.name}
                          <CheckIcon
                            className={cn(
                              'ml-auto h-4 w-4',
                              category.id === field.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                )}
                {search?.length > 3 && (
                  <section className="w-full px-4 pb-4">
                    <Button
                      size="sm"
                      className="w-full rounded"
                      onClick={() => addNewCategory(search)}
                      type="button"
                      disabled={addState === 'loading'}
                    >
                      {addState === 'loading' ? (
                        <ReloadIcon className="animate-spin" />
                      ) : (
                        'Add'
                      )}
                    </Button>
                  </section>
                )}
              </PopoverContent>
            </Popover>
          ) : (
            <Skeleton className="h-9 w-full rounded-full" />
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
