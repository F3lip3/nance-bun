import z from 'zod';

import { YahooFinanceProvider } from '@/lib/server/container/providers/FinanceProvider/implementations/YahooFinance/YahooFinanceProvider';
import { Prisma } from '@prisma/client';
import { protectedProcedure, publicProcedure, router } from '../trpc';

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
    .input(z.object({ code: z.string().optional() }))
    .output(z.array(AssetSchema))
    .query(async ({ input: { code } }) => {
      if (!code) return [];

      const provider = new YahooFinanceProvider();
      const tickers = await provider.searchTickers(code);

      if (!tickers.length) return [];

      return tickers.map(ticker => AssetSchema.parse(ticker));
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
