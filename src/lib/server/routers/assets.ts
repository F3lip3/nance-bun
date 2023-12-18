import z from 'zod';

import { Prisma } from '@prisma/client';

import { protectedProcedure, publicProcedure, router } from '../trpc';

import { YahooFinanceProvider } from '@/lib/server/container/providers/finance/implementations/yahoo-finance/yahoo-finance.provider';

import '../../utils/array.extensions';

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

const AssetsSchema = z.array(
  z.object({
    id: z.string(),
    code: z.string(),
    current_price: z
      .unknown()
      .optional()
      .transform(value =>
        !value || typeof value === 'number'
          ? ((value ?? 0) as number)
          : (value as Prisma.Decimal).toNumber()
      )
  })
);

export type AssetEntity = z.infer<typeof AssetSchema>;

export const assetsRouter = router({
  findAssets: protectedProcedure
    .input(z.string())
    .output(z.array(AssetSchema))
    .query(async ({ ctx, input }) => {
      if (!input) return [];

      const provider = new YahooFinanceProvider();

      const assetCodes = Array.from(new Set(input.split(',')));
      const dbTickers = await Promise.all(
        assetCodes.map(assetCode =>
          ctx.db.asset.findFirst({
            where: {
              code: {
                startsWith: assetCode
              },
              status: 'ACTIVE'
            }
          })
        )
      );

      const existingTickers = dbTickers
        .filter(ticker => ticker !== null)
        .map(ticker => AssetSchema.parse(ticker));

      console.info('ASSET CODES', assetCodes);
      console.info('EXISTING', existingTickers);

      const assetCodesToFetch = existingTickers.length
        ? assetCodes.filter(
            assetCode =>
              !existingTickers.some(ticker => ticker.code.startsWith(assetCode))
          )
        : assetCodes;

      if (assetCodesToFetch.length === 0) {
        return existingTickers;
      }

      if (assetCodesToFetch.length <= 5) {
        const tickers = await provider.searchTickers(
          assetCodesToFetch.join(',')
        );

        if (!tickers.length) return existingTickers;

        return tickers
          .map(ticker => AssetSchema.parse(ticker))
          .concat(existingTickers);
      }

      const chunks = assetCodesToFetch.chunk(5);
      const tickersList = await Promise.all(
        chunks.map(chunk => provider.searchTickers(chunk.join(',')))
      );

      const tickers = tickersList
        .reduce((acc, curr) => [...acc, ...curr], [])
        .map(ticker => AssetSchema.parse(ticker));

      return tickers.concat(existingTickers);
    }),
  getAllAssets: publicProcedure.output(AssetsSchema).query(async ({ ctx }) => {
    const assets = await ctx.db.asset.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        code: true,
        current_price: true
      }
    });

    return AssetsSchema.parse(assets);
  }),
  updatePrices: publicProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          current_price: z.number()
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(
        input.map(({ id, current_price }) =>
          ctx.db.asset.update({
            where: { id },
            data: { current_price }
          })
        )
      );
    })
});
