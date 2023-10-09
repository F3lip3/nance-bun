import { router } from '@/lib/server/trpc';

import { assetsRouter } from '@/lib/server/routers/assets';
import { categoriesRouter } from '@/lib/server/routers/categories';
import { currenciesRouter } from '@/lib/server/routers/currencies';
import { portfoliosRouter } from '@/lib/server/routers/portfolios';
import { transactionsRouter } from '@/lib/server/routers/transactions';

export const appRouter = router({
  assets: assetsRouter,
  categories: categoriesRouter,
  currencies: currenciesRouter,
  portfolios: portfoliosRouter,
  transactions: transactionsRouter
});

export type AppRouter = typeof appRouter;
