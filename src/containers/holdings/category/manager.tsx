'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { CategoryForm } from '@/containers/holdings/category/form';
import { CategoryList } from '@/containers/holdings/category/list';

export interface CategoriesProps {
  triggerText: string;
}

export const CategoriesManager = ({ triggerText }: CategoriesProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="w-full border-none">
          {triggerText}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Categories</SheetTitle>
          <SheetDescription>
            Manage your holding&#39;s categories
          </SheetDescription>
        </SheetHeader>
        <CategoryList />
        <SheetFooter className="-mx-6 border-t p-4">
          <CategoryForm />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
