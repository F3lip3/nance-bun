'use client';

import { HoldingsDataTable } from '@/containers/holdings/data-table';
import { CategoriesProvider } from '@/contexts/categories.context';
import { HoldingsProvider } from '@/contexts/holdings.context';

export default function Assets() {
  return (
    <CategoriesProvider>
      <HoldingsProvider>
        <main className="pb-10">
          <HoldingsDataTable />
        </main>
      </HoldingsProvider>
    </CategoriesProvider>
  );
}
