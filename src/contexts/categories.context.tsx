import { Dispatch, SetStateAction, createContext, useState } from 'react';

import {
  AddCategoryEntity,
  CategoryEntity
} from '@/lib/server/routers/categories';
import { trpc } from '@/lib/trpc/client';

interface CategoriesProviderProps {
  children: React.ReactNode;
}

export interface CategoriesContextData {
  addCategory: (data: AddCategoryEntity) => Promise<boolean>;
  editCategory: CategoryEntity | null;
  categories?: CategoryEntity[];
  isLoadingCategories: boolean;
  removeCategory: (id: string) => Promise<boolean>;
  saving: boolean;
  setEditCategory: Dispatch<SetStateAction<CategoryEntity | null>>;
}

export const CategoriesContext = createContext<CategoriesContextData>(
  {} as CategoriesContextData
);

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({
  children
}) => {
  const [editCategory, setEditCategory] = useState<CategoryEntity | null>(null);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    refetch
  } = trpc.categories.getCategories.useQuery();

  const { mutateAsync: addCategoryMutation, isLoading: saving } =
    trpc.categories.addCategory.useMutation();

  const { mutateAsync: removeCategoryMutation } =
    trpc.categories.removeCategory.useMutation();

  const addCategory = async (data: AddCategoryEntity): Promise<boolean> => {
    try {
      await addCategoryMutation(data);
      await refetch();
      return true;
    } catch (err) {
      return false;
    }
  };

  const removeCategory = async (id: string) => {
    try {
      await removeCategoryMutation(id);
      await refetch();
      return true;
    } catch (err) {
      return false;
    }
  };

  return (
    <CategoriesContext.Provider
      value={{
        addCategory,
        editCategory,
        categories,
        isLoadingCategories,
        removeCategory,
        saving,
        setEditCategory
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
