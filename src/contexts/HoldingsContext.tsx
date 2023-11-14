'use client';

import { createContext, useEffect, useState } from 'react';

import { HoldingEntity } from '@/lib/server/routers/holdings';
import { trpc } from '@/lib/trpc/client';

interface HoldingsProviderProps {
  children: React.ReactNode;
}

export interface HoldingsContextData {
  isLoading: boolean;
  holdings?: HoldingEntity[];
}

export const HoldingsContext = createContext<HoldingsContextData>(
  {} as HoldingsContextData
);

export const HoldingsProvider: React.FC<HoldingsProviderProps> = ({
  children
}) => {
  const [holdings, setHoldings] = useState<HoldingEntity[]>([]);

  const { data: serverHoldings, isLoading } =
    trpc.holdings.getHoldings.useQuery();

  useEffect(() => {
    if (!serverHoldings?.length) {
      setHoldings([]);
    } else {
      setHoldings(serverHoldings);
    }
  }, [serverHoldings]);

  return (
    <HoldingsContext.Provider value={{ holdings, isLoading }}>
      {children}
    </HoldingsContext.Provider>
  );
};
