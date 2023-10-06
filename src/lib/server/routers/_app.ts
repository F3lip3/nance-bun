import { router } from '@/lib/server/trpc';

import { assetsRouter } from '@/lib/server/routers/assets';
import { categoriesRouter } from '@/lib/server/routers/categories';
import { currenciesRouter } from '@/lib/server/routers/currencies';
import { portfoliosRouter } from '@/lib/server/routers/portfolios';

export const appRouter = router({
  assets: assetsRouter,
  categories: categoriesRouter,
  currencies: currenciesRouter,
  portfolios: portfoliosRouter
});

export type AppRouter = typeof appRouter;
