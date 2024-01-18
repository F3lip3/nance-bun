import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCategories } from '@/hooks/use-categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '@phosphor-icons/react';

const categoryFormSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, { message: 'Category name must be at least 3 characters' })
});

type categoryFormEntity = z.infer<typeof categoryFormSchema>;

export const CategoryForm = () => {
  const [success, setSuccess] = useState<string>('');

  const { addCategory, saving } = useCategories();

  const form = useForm<categoryFormEntity>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: ''
    }
  });

  const onSubmit = async (data: categoryFormEntity) => {
    const result = await addCategory({
      id: data.id,
      name: data.name
    });

    if (result) {
      form.reset();

      setSuccess(
        data.id
          ? 'Category updated successfully'
          : 'New category added successfully'
      );

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } else {
      form.setError('name', {
        message: `Failed to ${data.id ? 'update' : 'add new'} category.`
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category name</FormLabel>
              <FormControl>
                <Input placeholder="Category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!success && (
          <Button
            type="submit"
            size="sm"
            disabled={saving}
            className="w-32 transition-all"
          >
            {saving && (
              <div className="flex flex-row items-center justify-center gap-2">
                <span>Saving</span>
                <Spinner className="animate-spin" />
              </div>
            )}
            {!saving && !success && <span>Save changes</span>}
          </Button>
        )}
        {success && (
          <span className="text-sm font-bold text-green-700">{success}</span>
        )}
      </form>
    </Form>
  );
};
