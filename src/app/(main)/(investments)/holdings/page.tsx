'use client';

import { ListHoldings } from '@/app/(main)/(investments)/holdings/containers/ListHoldings';
import { Heading } from '@/components/Heading';
import { HoldingsProvider } from '@/contexts/HoldingsContext';

export default function Assets() {
  return (
    <HoldingsProvider>
      <main>
        <Heading size="lg" className="font-light">
          Holdings
        </Heading>
        <ListHoldings />
      </main>
    </HoldingsProvider>
  );
}
