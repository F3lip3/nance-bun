import { NextResponse } from 'next/server';
import { z } from 'zod';

import { RapidAPIYahooFinanceProvider } from '@/lib/server/container/providers/FinanceProvider/implementations/RapidAPIYahooFinance/RapidAPIYahooFinanceProvider';
import { api } from '@/lib/trpc/api';

const handlerProps = z.object({
  user_id: z.string()
});

const handler = async (req: Request) => {
  const json = await req.json();
  const body = handlerProps.safeParse(json);
  if (!body.success)
    return NextResponse.json(body.error.issues, { status: 400 });

  const holdings = await api.holdings.getAssets.query({
    user_id: body.data.user_id
  });

  if (!holdings.length)
    return NextResponse.json({ message: 'No holding found!' }, { status: 404 });

  const financeAPI = new RapidAPIYahooFinanceProvider();
  const priceList = await financeAPI.fetchTickersPrices(holdings);

  await api.holdings.updatePrices.mutate(
    priceList
      .filter(item => !!item.price)
      .map(item => ({
        id: item.id,
        code: item.code,
        price: item.price ?? 0
      }))
  );

  return NextResponse.json({
    status: 'succcess',
    message: 'Current price fetched for all holdings!'
  });
};

export const POST = handler;
