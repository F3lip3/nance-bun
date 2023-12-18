import { FetchTickerPriceEntity } from '../entities/fetch-ticker-price.entity';
import { TickerEntity } from '../entities/ticker.entity';

export interface IFinanceProvider {
  fetchTickersPrices(
    tickers: FetchTickerPriceEntity[]
  ): Promise<FetchTickerPriceEntity[]>;
  searchTickers(ticker: string): Promise<TickerEntity[]>;
}
