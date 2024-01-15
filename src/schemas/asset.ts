import { z } from 'zod';

export const AssetSchema = z.object({
  code: z.string(),
  exchange: z.string(),
  shortname: z.string(),
  sector: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  type: z.string().optional(),
  longname: z.string(),
  source: z.string()
});
