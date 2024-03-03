import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

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
      render={({ field: { onChange, name, value } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <NumericFormat
              name={name}
              value={value}
              onChange={onChange}
              customInput={Input}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
