import { z } from 'zod';

import { cache } from '@/lib/server/cache';
import { prisma } from '@/lib/server/prisma';
import { protectedProcedure, router } from '@/lib/server/trpc';

const portfolioSchema = z.object({
  id: z.string(),
  name: z.string(),
  currency: z.object({
    code: z.string(),
    name: z.string()
  }),
  status: z.string()
});

const portfoliosSchema = z.array(portfolioSchema);

export type PortfolioEntity = z.infer<typeof portfolioSchema>;

export const portfoliosRouter = router({
  addPortfolio: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(200),
        currency_id: z.string()
      })
    )
    .output(portfolioSchema)
    .mutation(async ({ ctx: { userId }, input }) => {
      const newPortfolio = await prisma.portfolio.create({
        data: {
          name: input.name,
          user_id: userId,
          currency_id: input.currency_id
        },
        select: {
          id: true,
          name: true,
          currency: {
            select: {
              code: true,
              name: true
            }
          },
          status: true
        }
      });

      const portfolio = portfolioSchema.parse(newPortfolio);

      const cacheKey = `user:${userId}-portfolios`;
      const cachedPortfolios = await cache.get(cacheKey);
      if (cachedPortfolios !== null) {
        const portfolios = portfoliosSchema.parse(JSON.parse(cachedPortfolios));
        await cache.set(cacheKey, JSON.stringify([...portfolios, portfolio]));
        await cache.expire(cacheKey, 60 * 60 * 24);
      }

      return portfolio;
    }),
  getPortfolios: protectedProcedure
    .output(portfoliosSchema)
    .query(async ({ ctx: { userId } }) => {
      const cacheKey = `user:${userId}-portfolios`;
      const cachedPortfolios = await cache.get(cacheKey);
      if (cachedPortfolios !== null) {
        return portfoliosSchema.parse(JSON.parse(cachedPortfolios));
      }

      const rawPortfolios = await prisma.portfolio.findMany({
        where: { user_id: userId, status: 'ACTIVE' },
        select: {
          id: true,
          name: true,
          currency: {
            select: {
              code: true,
              name: true
            }
          },
          status: true
        }
      });

      const portfolios = portfoliosSchema.parse(rawPortfolios);

      await cache.set(cacheKey, JSON.stringify(portfolios));
      await cache.expire(cacheKey, 60 * 60 * 24);

      return portfolios;
    })
});
