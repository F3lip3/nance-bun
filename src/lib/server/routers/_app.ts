import { router } from '@/lib/server/trpc';

import { assetsRouter } from '@/lib/server/routers/assets';
import { categoriesRouter } from '@/lib/server/routers/categories';
import { currenciesRouter } from '@/lib/server/routers/currencies';
import { holdingsRouter } from '@/lib/server/routers/holdings';
import { portfoliosRouter } from '@/lib/server/routers/portfolios';
import { transactionsRouter } from '@/lib/server/routers/transactions';

export const appRouter = router({
  assets: assetsRouter,
  categories: categoriesRouter,
  currencies: currenciesRouter,
  holdings: holdingsRouter,
  portfolios: portfoliosRouter,
  transactions: transactionsRouter
});

export type AppRouter = typeof appRouter;
