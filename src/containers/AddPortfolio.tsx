import { useForm } from 'react-hook-form';
import z from 'zod';

import { CurrencySelector } from '@/components/CurrencySelector';
import { Heading } from '@/components/Heading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
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
import { usePortfolio } from '@/hooks/usePortfolio';
import { PortfolioEntity } from '@/lib/server/routers/portfolios';
import { trpc } from '@/lib/trpc/client';
import { cn } from '@/lib/utils/functions';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';

type AddPortfolioProps = {
  insideDialog: boolean;
  success: (portfolio: PortfolioEntity) => void;
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
  const { refetch } = usePortfolio();

  const { mutateAsync: addPortfolio, isLoading } =
    trpc.portfolios.addPortfolio.useMutation();

  const form = useForm<AddPortfolioForm>({
    resolver: zodResolver(AddPortfolioSchema)
  });

  const onSubmit = async ({ name, currency_id }: AddPortfolioForm) => {
    const newPortfolio = await addPortfolio({ name, currency_id });

    toast({ title: 'Portfolio created!' });

    form.reset();

    refetch();
    success(newPortfolio);
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
            disabled={isLoading}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="New portfolio name"
                    className="min-w-[340px] rounded"
                    autoFocus
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CurrencySelector
            form={form}
            name="currency_id"
            className="min-w-[340px] rounded"
            label="Currency"
            placeholder="Search currencies..."
          />

          <Button
            type="submit"
            className={cn(
              ' gap-2 rounded',
              isLoading && 'cursor-default opacity-70'
            )}
          >
            {isLoading ? (
              <>
                <ReloadIcon className="animate-spin" /> wait...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </Form>
    );
  };

  if (insideDialog) {
    return (
      <Dialog open={true} modal={true}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>New portfolio</DialogTitle>
            <DialogDescription>
              Add a new portfolio and start managing your investments...
            </DialogDescription>
          </DialogHeader>
          <main className="py-2">
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
