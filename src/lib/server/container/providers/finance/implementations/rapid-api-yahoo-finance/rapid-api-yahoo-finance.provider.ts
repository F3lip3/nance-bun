import { z } from 'zod';

import { env } from '@/lib/env.mjs';

import { FetchTickerPriceEntity } from '../../entities/fetch-ticker-price.entity';
import { TickerEntity } from '../../entities/ticker.entity';
import { IFinanceProvider } from '../../interfaces/finance.provider';

const RAPIDAPI_URL = env.RAPIDAPI_URL;
const RAPIDAPI_KEY = env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = env.RAPIDAPI_HOST;

const RapidAPIResponseSchema = z.object({
  body: z.array(
    z.object({
      regularMarketPrice: z.number(),
      symbol: z.string()
    })
  )
});

export class RapidAPIYahooFinanceProvider implements IFinanceProvider {
  public async fetchTickersPrices(
    tickers: FetchTickerPriceEntity[]
  ): Promise<FetchTickerPriceEntity[]> {
    const tickersList = tickers.map(tc => tc.code).join(',');
    const response = await fetch(
      `${RAPIDAPI_URL}/api/yahoo/qu/quote/${tickersList}`,
      {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST
        }
      }
    );

    const json = await response.json();
    const data = RapidAPIResponseSchema.parse(json);

    if (!data.body.length) return [];

    const mappedData = data.body.map(item => {
      const ticker = tickers.find(tc => tc.code === item.symbol);
      if (ticker) {
        return {
          ...ticker,
          current_price: item.regularMarketPrice
        };
      }

      return {
        id: '',
        code: item.symbol,
        current_price: item.regularMarketPrice
      };
    });

    return mappedData.filter(item => !!item.id);
  }

  public async searchTickers(ticker: string): Promise<TickerEntity[]> {
    throw new Error('Method not implemented.');
  }
}
