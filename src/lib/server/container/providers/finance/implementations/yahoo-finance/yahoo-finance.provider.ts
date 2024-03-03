import z from 'zod';

import { FetchTickerPriceEntity } from '../../entities/fetch-ticker-price.entity';
import { TickerEntity } from '../../entities/ticker.entity';
import { IFinanceProvider } from '../../interfaces/finance.provider';
import { QuoteSchema } from './entities/quote.entity';

const API_URL = 'https://query2.finance.yahoo.com';

const YahooSearchSchema = z.object({
  count: z.number(),
  quotes: z.array(QuoteSchema)
});

export class YahooFinanceProvider implements IFinanceProvider {
  public async fetchTickersPrices(
    tickers: FetchTickerPriceEntity[]
  ): Promise<FetchTickerPriceEntity[]> {
    throw new Error('Method not implemented.');
  }

  public async searchTickers(tickers: string): Promise<TickerEntity[]> {
    const response = await fetch(
      `${API_URL}/v1/finance/search?q=${tickers}&newCount=0&navCount=0`
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
