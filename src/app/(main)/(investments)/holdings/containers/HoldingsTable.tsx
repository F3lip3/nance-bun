import { useHoldings } from '@/hooks/useHoldings';

import { HoldingsDataTable } from '../components/DataTable/DataTable';
import { HoldingsDataTableColumns } from '../components/DataTable/DataTableColumns';

export const HoldingsTable: React.FC = () => {
  const { holdings, isLoadingHoldings } = useHoldings();

  if (isLoadingHoldings) return <>Loading...</>;
  if (!holdings) return <>Empty</>;

  return (
    <div className="pb-10 pt-2">
      <HoldingsDataTable
        columns={HoldingsDataTableColumns}
        data={holdings}
        defaultSort={{ id: 'weight', desc: true }}
      />
    </div>
  );
};
