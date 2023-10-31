import { cache } from '@/lib/server/cache';
import { prisma } from '@/lib/server/prisma';

import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

import { getUserAuth } from '../auth/utils';

export async function createContext(opts?: FetchCreateContextFnOptions) {
  const { session, userId } = await getUserAuth();

  return {
    cache,
    userId,
    db: prisma,
    session: session,
    headers: opts && Object.fromEntries(opts.req.headers)
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
