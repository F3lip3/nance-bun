import z from 'zod';

import {
  FetchTickerPriceEntity,
  FetchTickerPriceResponse
} from '@/lib/server/container/providers/FinanceProvider/entities/FetchTickerPriceEntity';
import { TickerEntity } from '../../entities/TickerEntity';
import { IFinanceProvider } from '../../interfaces/IFinanceProvider';
import { QuoteSchema } from './entities/Quote';

const API_URL = 'https://query2.finance.yahoo.com';

const YahooSearchSchema = z.object({
  count: z.number(),
  quotes: z.array(QuoteSchema)
});

export class YahooFinanceProvider implements IFinanceProvider {
  public async fetchTickersPrices(
    tickers: FetchTickerPriceEntity[]
  ): Promise<FetchTickerPriceResponse[]> {
    throw new Error('Method not implemented.');
  }

  public async searchTickers(ticker: string): Promise<TickerEntity[]> {
    const response = await fetch(
      `${API_URL}/v1/finance/search?q=${ticker}&newCount=0&navCount=0`
    );

    const json = await response.json();
    const data = YahooSearchSchema.parse(json);

    if (data.count === 0) return [];

    return data.quotes
      .filter(quote => !!quote.shortname && !!quote.longname)
      .map(quote => ({
        code: quote.symbol,
        exchange: quote.exchange,
        shortname: quote.shortname ?? '',
        sector: quote.sector,
        industry: quote.industry,
        type: quote.quoteType,
        longname: quote.longname ?? '',
        source: 'YahooFinance'
      }));
  }
}
