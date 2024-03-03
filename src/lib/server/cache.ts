import { env } from '@/lib/env.mjs';
import Redis from 'ioredis';

export const cache = new Redis(env.CACHE_URL);
