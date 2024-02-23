import { NextResponse } from 'next/server';

import { verifySignatureEdge } from '@upstash/qstash/dist/nextjs';

import { importTransactionsSchema } from '@/lib/server/routers/transactions-import';
import { api } from '@/lib/trpc/api';

const handler = async (req: Request) => {
  const data = await req.json();
  const parse = importTransactionsSchema.safeParse(data);
  if (!parse.success)
    return NextResponse.json(parse.error.issues, { status: 400 });

  const { import_id } = parse.data;

  await api.transactionsImport.start.mutate({ import_id });

  return NextResponse.json({
    status: 'sucess',
    message: 'Transactions import process started!'
  });
};

export const POST = verifySignatureEdge(handler);
