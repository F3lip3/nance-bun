import { Header } from '@/containers/Header';
import { Menu } from '@/containers/Menu';
import { PortfolioProvider } from '@/contexts/PortfolioContext';

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <PortfolioProvider>
      <section className="flex h-screen flex-col">
        <Header />
        <Menu />
        <main className="flex h-full flex-col px-4 py-8">{children}</main>
      </section>
    </PortfolioProvider>
  );
}
