import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';

type NumberInputProps<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  label: string;
  name: Path<TFieldValues>;
  placeholder: string;
};

export const NumberInput = <T extends FieldValues>({
  form,
  label,
  name,
  placeholder
}: NumberInputProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type="number"
              {...field}
              onChange={e =>
                form.setValue(
                  name,
                  (e.currentTarget.value
                    ? Number(e.currentTarget.value)
                    : '') as PathValue<T, Path<T>>
                )
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
