import { DataTable } from '@/components/DataTable';
import { useHoldings } from '@/hooks/useHoldings';

import { holdingsColumns } from './HoldingsColumns';

export const HoldingsTable: React.FC = () => {
  const { isLoading, holdings } = useHoldings();

  if (isLoading) return <>Loading...</>;
  if (!holdings) return <>Empty</>;

  return (
    <div className="px-2 py-10">
      <DataTable
        columns={holdingsColumns}
        data={holdings}
        defaultSort={{ id: 'weight', desc: true }}
      />
    </div>
  );
};
