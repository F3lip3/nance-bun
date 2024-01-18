import { Skeleton } from '@/components/ui/skeleton';
import { CategoryListItem } from '@/containers/holdings/category/item';
import { useCategories } from '@/hooks/use-categories';
import { FolderSimpleStar } from '@phosphor-icons/react';

export const CategoryList = () => {
  const { categories, isLoadingCategories } = useCategories();

  return (
    <div className="my-8 flex flex-1 flex-col gap-1">
      {isLoadingCategories && (
        <>
          <Skeleton className="my-2 h-8 w-full rounded-full" />
          <Skeleton className="my-2 h-8 w-full rounded-full" />
          <Skeleton className="my-2 h-8 w-full rounded-full" />
        </>
      )}
      {!isLoadingCategories && !categories?.length && (
        <div className="my-auto flex flex-col items-center justify-center py-8">
          <FolderSimpleStar size={48} />
          <span className="text-sm text-muted-foreground">
            No categories found!
          </span>
        </div>
      )}
      {!isLoadingCategories && categories?.length && (
        <>
          {categories.map(category => (
            <CategoryListItem key={category.id} category={category} />
          ))}
        </>
      )}
    </div>
  );
};
