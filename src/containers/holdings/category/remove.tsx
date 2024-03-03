import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/use-categories';
import { CategoryEntity } from '@/lib/server/routers/categories';
import { TrashSimple } from '@phosphor-icons/react';

interface RemoveCategoryProps {
  category: CategoryEntity;
}

export const RemoveCategory = ({ category }: RemoveCategoryProps) => {
  const { removeCategory } = useCategories();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="invisible rounded-full group-hover:visible"
        >
          <TrashSimple size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove the category <b>{category.name}</b>?
            <br />
            This action cannot be undone.
            {!!category.holdings
              ? ` This will unlink ${category.holdings} holdings belonging to this category, and the category will be removed from your account!`
              : ' The category will be removed from your account!'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => removeCategory(category.id)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
