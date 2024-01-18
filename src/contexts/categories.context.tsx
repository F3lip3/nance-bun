import { createContext } from 'react';

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
  categories?: CategoryEntity[];
  isLoadingCategories: boolean;
  saving: boolean;
}

export const CategoriesContext = createContext<CategoriesContextData>(
  {} as CategoriesContextData
);

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({
  children
}) => {
  const {
    data: categories,
    isLoading: isLoadingCategories,
    refetch
  } = trpc.categories.getCategories.useQuery();

  const { mutateAsync: addCategoryMutation, isLoading: saving } =
    trpc.categories.addCategory.useMutation();

  const addCategory = async (data: AddCategoryEntity): Promise<boolean> => {
    try {
      await addCategoryMutation(data);
      await refetch();
      return true;
    } catch (err) {
      return false;
    }
  };

  return (
    <CategoriesContext.Provider
      value={{ addCategory, categories, isLoadingCategories, saving }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
