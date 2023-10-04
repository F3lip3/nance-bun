'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { AddPortfolio } from '@/app/(main)/(investments)/portfolios/containers/AddPortfolio';
import { trpc } from '@/lib/trpc/client';

export default function Portfolios() {
  const router = useRouter();

  const { data: portfolios } = trpc.portfolios.getPortfolios.useQuery();

  useEffect(() => {
    if ((portfolios?.length ?? 0) > 0) {
      router.push('/dashboard');
    }
  }, [portfolios, router]);

  return (
    <AddPortfolio
      insideDialog={false}
      success={() => console.info('SUCCESS')}
    />
  );
}
