import { Header } from '@/containers/common/header';
import { Menu } from '@/containers/common/menu';
import { PortfolioProvider } from '@/contexts/portfolio.context';

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <PortfolioProvider>
      <section className="flex h-screen flex-col overflow-hidden">
        <Header />
        <Menu />
        <main className="flex h-full flex-col p-8">{children}</main>
      </section>
    </PortfolioProvider>
  );
}
