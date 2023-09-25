import { z } from 'zod';

import { prisma } from '@/lib/server/prisma';
import { protectedProcedure, router } from '../trpc';

export const categoriesRouter = router({
  addCategory: protectedProcedure
    .input(z.object({ name: z.string() }))
    .output(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx: { userId }, input: { name } }) => {
      const newCategory = await prisma.category.create({
        data: {
          name,
          user_id: userId
        }
      });

      return {
        id: newCategory.id,
        name: newCategory.name
      };
    }),
  getCategories: protectedProcedure
    .output(
      z.array(
        z.object({
          id: z.string(),
          name: z.string()
        })
      )
    )
    .query(async ({ ctx: { userId } }) => {
      const categories = await prisma.category.findMany({
        where: { user_id: userId, status: 'active' }
      });

      return categories.map(category => ({
        id: category.id,
        name: category.name
      }));
    })
});
