import {
  PortfolioContext,
  PortfolioContextData
} from '@/contexts/portfolio.context';
import { useContext } from 'react';

export const usePortfolio = (): PortfolioContextData => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }

  return context;
};
