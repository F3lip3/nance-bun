'use client';

import { Heading } from '@/components/Heading';
import { HoldingsProvider } from '@/contexts/HoldingsContext';

import { HoldingsTable } from './containers/HoldingsTable';

export default function Assets() {
  return (
    <HoldingsProvider>
      <main>
        <Heading size="lg" className="font-light">
          Holdings
        </Heading>
        <HoldingsTable />
      </main>
    </HoldingsProvider>
  );
}
