import { useEffect, useState } from 'react';
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

  const { addCategory, editCategory, saving, setEditCategory } =
    useCategories();

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
      setEditCategory(null);
      setSuccess(
        data.id
          ? 'Category updated successfully'
          : 'New category added successfully'
      );

      setTimeout(() => {
        setSuccess('');
        form.setFocus('name');
      }, 3000);
    } else {
      form.setError('name', {
        message: `Failed to ${data.id ? 'update' : 'add new'} category.`
      });
    }
  };

  useEffect(() => {
    if (editCategory) {
      form.setValue('id', editCategory.id);
      form.setValue('name', editCategory.name);
      form.setFocus('name');
    } else {
      form.reset();
    }
  }, [editCategory, form]);

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
        <div className="flex flex-row gap-2">
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
          {!!editCategory && (
            <Button
              type="reset"
              size="sm"
              variant="outline"
              disabled={saving}
              onClick={() => setEditCategory(null)}
            >
              Cancel
            </Button>
          )}
          {success && (
            <span className="text-sm font-bold text-green-700">{success}</span>
          )}
        </div>
      </form>
    </Form>
  );
};
