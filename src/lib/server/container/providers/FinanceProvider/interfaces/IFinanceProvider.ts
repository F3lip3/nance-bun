import {
  FetchTickerPriceEntity,
  FetchTickerPriceResponse
} from '../entities/FetchTickerPriceEntity';
import { TickerEntity } from '../entities/TickerEntity';

export interface IFinanceProvider {
  fetchTickersPrices(
    tickers: FetchTickerPriceEntity[]
  ): Promise<FetchTickerPriceResponse[]>;
  searchTickers(ticker: string): Promise<TickerEntity[]>;
}
