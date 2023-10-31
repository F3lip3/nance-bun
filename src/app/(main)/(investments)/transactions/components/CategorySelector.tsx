import { useCallback, useEffect, useState } from 'react';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';

import { CaretSortIcon, CheckIcon, ReloadIcon } from '@radix-ui/react-icons';

import { trpc } from '@/lib/trpc/client';
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

type CategorySelectorProps<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder: string;
};

export const CategorySelector = <T extends FieldValues>({
  form,
  name,
  label,
  placeholder
}: CategorySelectorProps<T>) => {
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
    async (newCategoryName: string) => {
      if (!newCategoryName) {
        setAddError('Category name is required.');
        return;
      }

      setAddState('loading');

      const newCategory = await addCategory({ name: newCategoryName });

      await refetch();

      form.setValue(name, newCategory.id as PathValue<T, Path<T>>);

      setOpen(false);
      setAddError('');
      setAddState('');
      setSearch('');
      setNewCategory('');
    },
    [addCategory, form, name, refetch]
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

  const handleCategoryChange = (category_id: string) => {
    form.setValue(name, category_id as PathValue<T, Path<T>>);

    window.localStorage.setItem('default_category', category_id);

    setOpen(false);
  };

  useEffect(() => {
    if (categories?.length) {
      const defaultCategory = window.localStorage.getItem('default_category');

      if (
        defaultCategory &&
        categories.some(category => category.id === defaultCategory)
      ) {
        form.setValue(name, defaultCategory as PathValue<T, Path<T>>);
      } else {
        setOpen(true);
      }
    }
  }, [categories, form, name]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          {categories ? (
            <Popover open={open} onOpenChange={setOpen} modal={false}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    ref={field.ref}
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
                      : placeholder}
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
                          onSelect={() => handleCategoryChange(category.id)}
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
