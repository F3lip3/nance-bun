import { z } from 'zod';

import { cache } from '@/lib/server/cache';
import { prisma } from '@/lib/server/prisma';
import { protectedProcedure, router } from '@/lib/server/trpc';

const currenciesSchema = z.array(
  z.object({
    id: z.string(),
    code: z.string(),
    name: z.string()
  })
);

export const currenciesRouter = router({
  getCurrencies: protectedProcedure.output(currenciesSchema).query(async () => {
    const cachedCurrencies = await cache.get('currencies');
    if (cachedCurrencies !== null) {
      return currenciesSchema.parse(JSON.parse(cachedCurrencies));
    }

    const currencies = await prisma.currency.findMany({
      select: {
        id: true,
        code: true,
        name: true
      }
    });

    await cache.set('currencies', JSON.stringify(currencies));
    await cache.expire('currencies', 60 * 60 * 24);

    return currencies;
  })
});
