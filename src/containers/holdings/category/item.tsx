import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { CategoryEntity } from '@/lib/server/routers/categories';
import { PencilSimpleLine, TrashSimple } from '@phosphor-icons/react';

interface ListItemProps {
  category: CategoryEntity;
}

export const CategoryListItem = ({ category }: ListItemProps) => {
  return (
    <div className="group relative flex flex-row items-center gap-1 rounded-sm border px-4 py-2">
      <div className="flex flex-1 flex-row text-sm">
        <span>{category.name}</span>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="invisible rounded-full group-hover:visible"
          >
            <PencilSimpleLine size={18} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Edit</TooltipContent>
      </Tooltip>
      {!category.holdings && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="invisible rounded-full group-hover:visible"
            >
              <TrashSimple size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Remove</TooltipContent>
        </Tooltip>
      )}
      {category.holdings && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="ml-2 cursor-default">
              {category.holdings}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="left">Num of holdings</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
