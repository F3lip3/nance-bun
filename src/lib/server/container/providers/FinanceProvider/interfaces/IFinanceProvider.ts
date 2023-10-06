import { TickerEntity } from '../entities/TickerEntity';

export interface IFinanceProvider {
  searchTickers(ticker: string): Promise<TickerEntity[]>;
}
