import { z } from 'zod';

import { prisma } from '@/lib/server/prisma';
import { protectedProcedure, router } from '../trpc';

export const categoriesRouter = router({
  addCategory: protectedProcedure
    .input(z.object({ name: z.string() }))
    .output(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx: { userId }, input: { name } }) => {
      const newCategory = await prisma.categories.create({
        data: {
          name,
          userId
        }
      });

      return {
        id: newCategory.publicId,
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
      const categories = await prisma.categories.findMany({
        where: { userId, status: 'active' }
      });

      return categories.map(category => ({
        id: category.publicId,
        name: category.name
      }));
    })
});
