'use client';

import { HoldingsProvider } from '@/contexts/HoldingsContext';

import { HoldingsDataTable } from './components/DataTable/DataTable';

export default function Assets() {
  return (
    <HoldingsProvider>
      <main className="pb-10">
        <HoldingsDataTable />
      </main>
    </HoldingsProvider>
  );
}
