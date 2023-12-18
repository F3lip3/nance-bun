'use client';

import { HoldingsDataTable } from '@/components/holdings/DataTable/DataTable';
import { HoldingsProvider } from '@/contexts/holdings.context';

export default function Assets() {
  return (
    <HoldingsProvider>
      <main className="pb-10">
        <HoldingsDataTable />
      </main>
    </HoldingsProvider>
  );
}
