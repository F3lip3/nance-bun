import { Badge } from '@/components/ui/badge';
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
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useHoldings } from '@/hooks/use-holdings';
import { cn } from '@/lib/utils/functions';
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';

export function DataTableToolbarFiltersCategory() {
  const { categories, selectedCategories, setSelectedCategories } =
    useHoldings();

  if (!categories) {
    return <Skeleton />;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          Category
          {selectedCategories?.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedCategories.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedCategories.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedCategories.length} selected
                  </Badge>
                ) : (
                  categories
                    .filter(category =>
                      selectedCategories.includes(category.id)
                    )
                    .map(category => (
                      <Badge
                        variant="secondary"
                        key={category.id}
                        className="rounded-sm px-1 font-normal"
                      >
                        {category.name}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Category" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {categories.map(category => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <CommandItem
                    key={category.id}
                    onSelect={() => {
                      if (isSelected) {
                        setSelectedCategories(prev =>
                          prev.filter(item => item !== category.id)
                        );
                      } else {
                        setSelectedCategories(prev => [...prev, category.id]);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    <span>{category.name}</span>
                    <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                      {category.holdings ?? 0}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedCategories.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setSelectedCategories([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
