import { CurrencySelector } from '@/app/(main)/(investments)/portfolios/components/CurrencySelector';
import { Heading } from '@/components/Heading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { trpc } from '@/lib/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from '@phosphor-icons/react';
import { useForm } from 'react-hook-form';
import z from 'zod';

type AddPortfolioProps = {
  insideDialog: boolean;
  success: () => void;
};

export const AddPortfolioSchema = z.object({
  name: z.string({
    required_error: 'Inform the portfolio name.'
  }),
  currency_id: z.string({
    required_error: 'Please select a currency.'
  })
});

export type AddPortfolioForm = z.infer<typeof AddPortfolioSchema>;

export const AddPortfolio = ({ insideDialog, success }: AddPortfolioProps) => {
  const { mutateAsync: addPortfolio } =
    trpc.portfolios.addPortfolio.useMutation();

  const form = useForm<AddPortfolioForm>({
    resolver: zodResolver(AddPortfolioSchema)
  });

  const onSubmit = async ({ name, currency_id }: AddPortfolioForm) => {
    await addPortfolio({ name, currency_id });

    toast({ title: 'Portfolio created!' });

    form.reset();
    success();
  };

  const FormContainer = () => {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="New portfolio name"
                    className="w-[340px] rounded"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CurrencySelector form={form} className="w-[340px] rounded" />

          <Button type="submit" className="rounded">
            Submit
          </Button>
        </form>
      </Form>
    );
  };

  if (insideDialog) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="absolute bottom-4 right-4 m-0 h-12 w-12 rounded-full p-0"
          >
            <Plus size="24" className="text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New portfolio</DialogTitle>
          </DialogHeader>
          <main className="py-8">
            <FormContainer />
          </main>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <main className="flex w-full flex-col">
      <Heading size="lg" className="mb-4 font-medium">
        New portfolio
      </Heading>
      <FormContainer />
    </main>
  );
};
