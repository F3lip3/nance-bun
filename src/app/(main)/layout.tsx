import { SideMenu } from '@/containers/SideMenu';

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <section className="flex h-screen flex-row">
      <aside className="flex max-w-[theme(spacing.80)] justify-start">
        <SideMenu />
      </aside>
      <main className="flex flex-1 flex-col">
        <section className="flex flex-1 flex-col items-center p-6">
          <main className="flex w-full max-w-screen-xl flex-1 p-8">
            {children}
          </main>
        </section>
      </main>
    </section>
  );
}
