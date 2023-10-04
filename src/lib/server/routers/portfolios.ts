import { z } from 'zod';

import { prisma } from '@/lib/server/prisma';
import { protectedProcedure, router } from '@/lib/server/trpc';

const portfolioOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  currency: z.object({
    code: z.string(),
    name: z.string()
  }),
  status: z.string()
});

export type PortfolioEntity = z.infer<typeof portfolioOutputSchema>;

export const portfoliosRouter = router({
  addPortfolio: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(200),
        currency_id: z.string()
      })
    )
    .output(portfolioOutputSchema)
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

      return newPortfolio;
    }),
  getPortfolios: protectedProcedure
    .output(z.array(portfolioOutputSchema))
    .query(async ({ ctx: { userId } }) => {
      const portfolios = await prisma.portfolio.findMany({
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

      return portfolios;
    })
});
