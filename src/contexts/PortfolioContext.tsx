'use client';

import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState
} from 'react';

import { PortfolioEntity } from '@/lib/server/routers/portfolios';
import { trpc } from '@/lib/trpc/client';
import { RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';

interface PortfolioProviderProps {
  children: React.ReactNode;
}

export interface PortfolioContextData {
  portfolio: string;
  portfolios: PortfolioEntity[] | undefined;
  refetch: <TPageData>(
    options?: RefetchOptions & RefetchQueryFilters<TPageData>
  ) => Promise<unknown>;
  setPortfolio: Dispatch<SetStateAction<string>>;
}

export const PortfolioContext = createContext<PortfolioContextData>(
  {} as PortfolioContextData
);

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({
  children
}) => {
  const [portfolio, setPortfolio] = useState<string>('');

  const { data: portfolios, refetch } =
    trpc.portfolios.getPortfolios.useQuery();

  useEffect(() => {
    if (portfolios) {
      if (portfolios.length > 0 && !portfolio) {
        setPortfolio(portfolios[0].id);
      }
    }
  }, [portfolios, portfolio]);

  return (
    <PortfolioContext.Provider
      value={{ portfolio, portfolios, refetch, setPortfolio }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
