import { NextResponse } from 'next/server';

import { verifySignatureEdge } from '@upstash/qstash/dist/nextjs';

import { RapidAPIYahooFinanceProvider } from '@/lib/server/container/providers/finance/implementations/rapid-api-yahoo-finance/rapid-api-yahoo-finance.provider';
import { api } from '@/lib/trpc/api';

const handler = async () => {
  const assets = await api.assets.getAllAssets.query();
  const financeAPI = new RapidAPIYahooFinanceProvider();
  const updatedPrices = await financeAPI.fetchTickersPrices(assets);

  await api.assets.updatePrices.mutate(
    updatedPrices
      .filter(item => !!item.current_price)
      .map(item => ({
        id: item.id,
        current_price: item.current_price ?? 0
      }))
  );

  return NextResponse.json({
    status: 'success',
    message: 'Assets prices updated successfully!'
  });
};

export const POST = verifySignatureEdge(handler);
