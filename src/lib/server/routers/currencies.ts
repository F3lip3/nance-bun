import { prisma } from '@/lib/server/prisma';
import { protectedProcedure, router } from '@/lib/server/trpc';
import { z } from 'zod';

export const currenciesRouter = router({
  getCurrencies: protectedProcedure
    .output(
      z.array(
        z.object({
          id: z.string(),
          code: z.string(),
          name: z.string()
        })
      )
    )
    .query(async () => {
      const currencies = await prisma.currency.findMany({
        select: {
          id: true,
          code: true,
          name: true
        }
      });

      return currencies;
    })
});
