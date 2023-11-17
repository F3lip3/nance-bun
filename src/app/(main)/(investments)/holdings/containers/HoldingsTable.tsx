import { DataTable } from '@/components/DataTable';
import { useHoldings } from '@/hooks/useHoldings';

import { holdingsColumns } from './HoldingsColumns';

export const HoldingsTable: React.FC = () => {
  const { holdings, isLoadingHoldings } = useHoldings();

  if (isLoadingHoldings) return <>Loading...</>;
  if (!holdings) return <>Empty</>;

  return (
    <div className="pb-10 pt-2">
      <DataTable
        columns={holdingsColumns}
        data={holdings}
        defaultSort={{ id: 'weight', desc: true }}
      />
    </div>
  );
};
