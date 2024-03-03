import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { RemoveCategory } from '@/containers/holdings/category/remove';
import { useCategories } from '@/hooks/use-categories';
import { CategoryEntity } from '@/lib/server/routers/categories';
import { PencilSimpleLine } from '@phosphor-icons/react';

interface ListItemProps {
  category: CategoryEntity;
}

export const CategoryListItem = ({ category }: ListItemProps) => {
  const { setEditCategory } = useCategories();

  return (
    <div className="group relative flex flex-row items-center gap-1 rounded-sm border px-4 py-2">
      <div className="flex flex-1 flex-row text-sm">
        <span>{category.name}</span>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="invisible rounded-full group-hover:visible"
        onClick={() => setEditCategory(category)}
      >
        <PencilSimpleLine size={18} />
      </Button>
      <RemoveCategory category={category} />
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0}>
            <Badge
              variant="secondary"
              className="ml-2 cursor-default"
              style={{ pointerEvents: 'none' }}
            >
              {category.holdings ?? 0}
            </Badge>
          </span>
        </TooltipTrigger>
        <TooltipContent side="left">Num of holdings</TooltipContent>
      </Tooltip>
    </div>
  );
};
