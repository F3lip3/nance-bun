import { Heading } from '@/components/Heading';
import { trpc } from '@/lib/trpc/client';

export default function Portfolios() {
  const { data: portfolios } = trpc.portfolios.getPortfolios.useQuery();

  return (
    <main>
      <Heading size="lg" className="font-thin">
        Portfolios
      </Heading>
    </main>
  );
}
