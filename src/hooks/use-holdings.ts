import {
  HoldingsContext,
  HoldingsContextData
} from '@/contexts/holdings.context';
import { useContext } from 'react';

export const useHoldings = (): HoldingsContextData => {
  const context = useContext(HoldingsContext);
  if (!context) {
    throw new Error('useHoldings must be used within a HoldingsProvider');
  }

  return context;
};
