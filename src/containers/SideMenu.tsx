import { Heading } from '@/components/Heading';
import { Logo } from '@/components/Logo';

export const SideMenu = () => {
  return (
    <section className="flex flex-col items-center py-8">
      <Logo className="h-24 w-24" />
      <Heading size="md" className="-mt-4">
        Nance
      </Heading>
    </section>
  );
};
