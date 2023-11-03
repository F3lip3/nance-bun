import { NextResponse } from 'next/server';

import { verifySignatureEdge } from '@upstash/qstash/dist/nextjs';

import { computeHoldingSchema } from '@/lib/server/routers/holdings';
import { api } from '@/lib/trpc/api';

const handler = async (req: Request) => {
  const data = await req.json();
  const parse = computeHoldingSchema.safeParse(data);
  if (!parse.success)
    return NextResponse.json(parse.error.issues, { status: 400 });

  const { asset_id, portfolio_id, user_id } = parse.data;

  await api.holdings.computeHoldings.mutate({
    asset_id,
    portfolio_id,
    user_id
  });

  return NextResponse.json({
    status: 'sucess',
    message: 'Holdings computed successfully!'
  });
};

export const POST = verifySignatureEdge(handler);
