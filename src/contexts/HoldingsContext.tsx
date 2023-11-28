'use client';

import { createContext } from 'react';

import { usePortfolio } from '@/hooks/usePortfolio';
import { CategoryEntity } from '@/lib/server/routers/categories';
import { HoldingEntity } from '@/lib/server/routers/holdings';
import { trpc } from '@/lib/trpc/client';

interface HoldingsProviderProps {
  children: React.ReactNode;
}

interface SetHoldingsCategoryProps {
  category_id: string;
  holdings: string[];
}

export interface HoldingsContextData {
  categories?: CategoryEntity[];
  holdings?: HoldingEntity[];
  isLoadingCategories: boolean;
  isLoadingHoldings: boolean;
  setHoldingsCategory: (props: SetHoldingsCategoryProps) => Promise<void>;
}

export const HoldingsContext = createContext<HoldingsContextData>(
  {} as HoldingsContextData
);

export const HoldingsProvider: React.FC<HoldingsProviderProps> = ({
  children
}) => {
  const { portfolio } = usePortfolio();

  const {
    data: holdings,
    isLoading: isLoadingHoldings,
    refetch
  } = trpc.holdings.getHoldings.useQuery({
    portfolio_id: portfolio,
    category_id: 'all'
  });

  const { data: categories, isLoading: isLoadingCategories } =
    trpc.categories.getCategories.useQuery();

  const { mutateAsync: setCategory } = trpc.holdings.setCategory.useMutation();

  const setHoldingsCategory = async ({
    category_id,
    holdings
  }: SetHoldingsCategoryProps) => {
    await setCategory({
      category_id: category_id ?? null,
      holdings
    });

    refetch();
  };

  return (
    <HoldingsContext.Provider
      value={{
        categories,
        holdings,
        isLoadingCategories,
        isLoadingHoldings,
        setHoldingsCategory
      }}
    >
      {children}
    </HoldingsContext.Provider>
  );
};
