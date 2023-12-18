import z from 'zod';

export const QuoteSchema = z.object({
  exchange: z.string(),
  shortname: z.string().optional(),
  quoteType: z.string(),
  symbol: z.string(),
  index: z.string(),
  score: z.number(),
  typeDisp: z.string(),
  longname: z.string().optional(),
  exchDisp: z.string().optional(),
  sector: z.string().optional(),
  sectorDisp: z.string().optional(),
  industry: z.string().optional(),
  industryDisp: z.string().optional(),
  dispSecIndFlag: z.boolean().optional(),
  isYahooFinance: z.boolean(),
  prevName: z.string().optional(),
  nameChangeDate: z.string().optional()
});

export type Quote = z.infer<typeof QuoteSchema>;
