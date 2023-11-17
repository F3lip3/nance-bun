'use client';

import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState
} from 'react';

import { usePortfolio } from '@/hooks/usePortfolio';
import { CategoryEntity } from '@/lib/server/routers/categories';
import { HoldingEntity } from '@/lib/server/routers/holdings';
import { trpc } from '@/lib/trpc/client';

interface HoldingsProviderProps {
  children: React.ReactNode;
}

export interface HoldingsContextData {
  category: string;
  categories?: CategoryEntity[];
  holdings?: HoldingEntity[];
  isLoadingCategories: boolean;
  isLoadingHoldings: boolean;
  setCategory: Dispatch<SetStateAction<string>>;
}

export const HoldingsContext = createContext<HoldingsContextData>(
  {} as HoldingsContextData
);

export const HoldingsProvider: React.FC<HoldingsProviderProps> = ({
  children
}) => {
  const { portfolio } = usePortfolio();

  const [category, setCategory] = useState<string>('all');
  const [holdings, setHoldings] = useState<HoldingEntity[]>([]);

  const { data: serverHoldings, isLoading: isLoadingHoldings } =
    trpc.holdings.getHoldings.useQuery({
      portfolio_id: portfolio,
      category_id: category
    });

  const { data: categories, isLoading: isLoadingCategories } =
    trpc.categories.getCategories.useQuery();

  useEffect(() => {
    if (!serverHoldings?.length) {
      setHoldings([]);
    } else {
      setHoldings(serverHoldings);
    }
  }, [serverHoldings]);

  return (
    <HoldingsContext.Provider
      value={{
        categories,
        category,
        holdings,
        isLoadingCategories,
        isLoadingHoldings,
        setCategory
      }}
    >
      {children}
    </HoldingsContext.Provider>
  );
};
