import { FetchTickerPriceEntity } from '../entities/FetchTickerPriceEntity';
import { TickerEntity } from '../entities/TickerEntity';

export interface IFinanceProvider {
  fetchTickersPrices(
    tickers: FetchTickerPriceEntity[]
  ): Promise<FetchTickerPriceEntity[]>;
  searchTickers(ticker: string): Promise<TickerEntity[]>;
}
