import z from 'zod';

import { YahooFinanceProvider } from '@/lib/server/container/providers/FinanceProvider/implementations/YahooFinance/YahooFinanceProvider';
import { protectedProcedure, router } from '../trpc';

export const AssetSchema = z.object({
  code: z.string(),
  exchange: z.string(),
  shortname: z.string(),
  sector: z.string().optional(),
  industry: z.string().optional(),
  type: z.string().optional(),
  longname: z.string(),
  source: z.string()
});

export type AssetEntity = z.infer<typeof AssetSchema>;

export const assetsRouter = router({
  findAssets: protectedProcedure
    .input(z.object({ code: z.string().optional() }))
    .output(z.array(AssetSchema))
    .query(async ({ input: { code } }) => {
      if (!code) return [];

      const provider = new YahooFinanceProvider();
      const tickers = await provider.searchTickers(code);

      if (!tickers.length) return [];

      return tickers.map(ticker => AssetSchema.parse(ticker));
    })
});
