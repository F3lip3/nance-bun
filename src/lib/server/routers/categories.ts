import { z } from 'zod';

import { protectedProcedure, router } from '../trpc';

const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  holdings: z.number().optional()
});

const categoriesSchema = z.array(categorySchema);

export type CategoryEntity = z.infer<typeof categorySchema>;

export const categoriesRouter = router({
  addCategory: protectedProcedure
    .input(z.object({ name: z.string() }))
    .output(categorySchema)
    .mutation(async ({ ctx: { cache, db, userId }, input: { name } }) => {
      const newCategory = await db.category.create({
        data: {
          name,
          user_id: userId
        }
      });

      const category = categorySchema.parse(newCategory);

      const cacheKey = `user:${userId}-categories`;
      const cachedCategories = await cache.get(cacheKey);
      if (cachedCategories !== null) {
        const categories = categoriesSchema.parse(JSON.parse(cachedCategories));
        await cache.set(cacheKey, JSON.stringify([...categories, category]));
        await cache.expire(cacheKey, 60 * 60 * 24);
      }

      return category;
    }),
  getCategories: protectedProcedure
    .output(categoriesSchema)
    .query(async ({ ctx: { cache, db, userId } }) => {
      const cacheKey = `user:${userId}-categories`;
      const cachedCategories = await cache.get(cacheKey);
      if (cachedCategories !== null) {
        return categoriesSchema.parse(JSON.parse(cachedCategories));
      }

      const rawCategories = await db.category.findMany({
        where: { user_id: userId, status: 'active' },
        include: {
          _count: {
            select: { holdings: true }
          }
        }
      });

      const categories = categoriesSchema.parse(
        rawCategories.map(category => ({
          ...category,
          holdings: category._count.holdings
        }))
      );

      await cache.set(cacheKey, JSON.stringify(categories));
      await cache.expire(cacheKey, 60 * 60 * 24);

      return categories;
    })
});
