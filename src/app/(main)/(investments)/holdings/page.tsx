'use client';

import { Heading } from '@/components/Heading';
import { HoldingsProvider } from '@/contexts/HoldingsContext';

import { CategoriesSelector } from '@/app/(main)/(investments)/holdings/containers/CategoriesSelector';
import { HoldingsTable } from './containers/HoldingsTable';

export default function Assets() {
  return (
    <HoldingsProvider>
      <main>
        <Heading size="lg" className="font-light">
          Holdings
        </Heading>
        <CategoriesSelector />
        <HoldingsTable />
      </main>
    </HoldingsProvider>
  );
}
