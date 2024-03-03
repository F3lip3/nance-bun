'use client';

import { Heading } from '@/components/common/heading';
import { CategoriesManager } from '@/containers/holdings/category/manager';
import { CategoriesProvider } from '@/contexts/categories.context';

export default function Dashboard() {
  return (
    <CategoriesProvider>
      <Heading size="lg" className="font-thin">
        <CategoriesManager triggerText="Manage categories" />
      </Heading>
    </CategoriesProvider>
  );
}
