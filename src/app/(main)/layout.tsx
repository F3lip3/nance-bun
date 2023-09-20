import { SideMenu } from '@/containers/SideMenu';
import { UserButton } from '@clerk/nextjs';

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <section className="flex h-screen flex-row">
      <aside className="w-80 bg-zinc-950">
        <SideMenu />
      </aside>
      <main className="flex w-screen flex-col">
        <header className="flex h-16 items-center justify-between px-6">
          <span>&nbsp;</span>
          <UserButton afterSignOutUrl="/" />
        </header>
        <section className="flex p-6">{children}</section>
      </main>
    </section>
  );
}
