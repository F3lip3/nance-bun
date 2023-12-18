import { z } from 'zod';

export const AssetSchema = z.object({
  code: z.string(),
  exchange: z.string(),
  shortname: z.string(),
  sector: z.string().optional(),
  industry: z.string().optional(),
  type: z.string().optional(),
  longname: z.string(),
  source: z.string()
});
