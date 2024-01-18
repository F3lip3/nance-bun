import { useContext } from 'react';

import {
  CategoriesContext,
  CategoriesContextData
} from '@/contexts/categories.context';

export const useCategories = (): CategoriesContextData => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }

  return context;
};
