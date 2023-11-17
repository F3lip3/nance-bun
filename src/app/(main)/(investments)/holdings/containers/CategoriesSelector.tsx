import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useHoldings } from '@/hooks/useHoldings';

export const CategoriesSelector: React.FC = () => {
  const { categories, category, setCategory } = useHoldings();

  return (
    <ToggleGroup
      type="single"
      value={category}
      onValueChange={value => setCategory(value)}
      className="justify-start pb-2 pt-4"
    >
      <ToggleGroupItem value="all" aria-label="All holdings">
        All holdings
      </ToggleGroupItem>
      {categories?.map(ct => (
        <ToggleGroupItem key={ct.id} value={ct.id} aria-label={ct.name}>
          {ct.name}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
