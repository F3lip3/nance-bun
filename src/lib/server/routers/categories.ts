import { z } from 'zod';

import { TRPCError } from '@trpc/server';
import { protectedProcedure, router } from '../trpc';

const addCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string()
});

const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  holdings: z.number().optional()
});

const categoriesSchema = z.array(categorySchema);

export type AddCategoryEntity = z.infer<typeof addCategorySchema>;
export type CategoryEntity = z.infer<typeof categorySchema>;

export const categoriesRouter = router({
  addCategory: protectedProcedure
    .input(addCategorySchema)
    .output(categorySchema)
    .mutation(
      async ({ ctx: { cache, db, userId: user_id }, input: { id, name } }) => {
        const exists = await db.category.count({
          where: {
            user_id,
            name,
            id: { not: id ?? '' }
          }
        });

        if (exists) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'A category with the provided name already exists'
          });
        }

        const dbCategory = await db.category.upsert({
          create: {
            user_id,
            name
          },
          update: { name },
          where: {
            id: id ?? ''
          }
        });

        const category = categorySchema.parse(dbCategory);

        const cacheKey = `user:${user_id}-categories`;
        const cachedCategories = await cache.get(cacheKey);
        if (cachedCategories !== null) {
          const parsedCategories = categoriesSchema.parse(
            JSON.parse(cachedCategories)
          );

          const updatedCategories = id
            ? parsedCategories.map(c => (c.id === id ? category : c))
            : [...parsedCategories, category];

          await cache.set(cacheKey, JSON.stringify(updatedCategories));
          await cache.expire(cacheKey, 60 * 60 * 24);
        }

        return category;
      }
    ),
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
    }),
  removeCategory: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx: { cache, db, userId: user_id }, input }) => {
      const existingCategory = await db.category.findUnique({
        where: { id: input, user_id }
      });

      if (!existingCategory) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Category not found'
        });
      }

      await db.$transaction([
        db.holding.updateMany({
          where: {
            user_id,
            category_id: input
          },
          data: {
            category_id: null
          }
        }),
        db.category.update({
          where: {
            id: input,
            user_id
          },
          data: {
            status: 'removed',
            removed_at: new Date()
          }
        })
      ]);

      const cacheKey = `user:${user_id}-categories`;
      const cachedCategories = await cache.get(cacheKey);
      if (cachedCategories !== null) {
        const parsedCategories = categoriesSchema.parse(
          JSON.parse(cachedCategories)
        );

        const remainingCategories = parsedCategories.filter(
          c => c.id !== input
        );

        await cache.set(cacheKey, JSON.stringify(remainingCategories));
        await cache.expire(cacheKey, 60 * 60 * 24);
      }
    })
});
