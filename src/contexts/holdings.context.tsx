'use client';

import { Dispatch, SetStateAction, createContext } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { usePortfolio } from '@/hooks/use-portfolio';
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
  holdings?: HoldingEntity[];
  isLoadingHoldings: boolean;
  selectedCategories: string[];
  setHoldingsCategory: (props: SetHoldingsCategoryProps) => Promise<void>;
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
}

export const HoldingsContext = createContext<HoldingsContextData>(
  {} as HoldingsContextData
);

export const HoldingsProvider: React.FC<HoldingsProviderProps> = ({
  children
}) => {
  const [selectedCategories, setSelectedCategories] = useLocalStorage<string[]>(
    'holdings_selected_category',
    []
  );

  const { portfolio } = usePortfolio();

  const {
    data: holdings,
    isLoading: isLoadingHoldings,
    refetch
  } = trpc.holdings.getHoldings.useQuery({
    portfolio_id: portfolio,
    categories: Array.from(selectedCategories)
  });

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
        holdings,
        isLoadingHoldings,
        selectedCategories,
        setHoldingsCategory,
        setSelectedCategories
      }}
    >
      {children}
    </HoldingsContext.Provider>
  );
};
