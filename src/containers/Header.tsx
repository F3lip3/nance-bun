import { Logo } from '@/components/Logo';
import { PortfolioSelector } from '@/components/PortfolioSelector';
import { ThemeSelector } from '@/components/ThemeSelector';
import { UserButton } from '@clerk/nextjs';

export const Header = () => {
  return (
    <header className="flex flex-row items-center justify-between pl-4 pr-8 pt-4">
      <section className="flex flex-row items-center justify-center">
        <Logo className="h-20 w-20" />
        <PortfolioSelector />
      </section>
      <section className="flex flex-row items-center justify-center gap-4">
        <ThemeSelector />
        <UserButton afterSignOutUrl="/" />
      </section>
    </header>
  );
};
