'use client';

import { Logo } from '@/components/Logo';
import { MenuItem } from '@/components/MenuItem';
import { UserButton } from '@clerk/nextjs';
import {
  ChartLineUp,
  Gear,
  GridFour,
  House,
  PiggyBank,
  Swap
} from '@phosphor-icons/react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type MainMenu = 'home' | 'investments' | 'settings';

export const SideMenu = () => {
  const pathname = usePathname();

  const activeMainMenu = useMemo<MainMenu>(() => {
    const investmentsMenus = ['/dashboard', '/assets', '/transactions'];
    const settingsMenus = ['/settings'];

    if (investmentsMenus.some(item => pathname.startsWith(item)))
      return 'investments';

    if (settingsMenus.some(item => pathname.startsWith(item)))
      return 'settings';

    return 'home';
  }, [pathname]);

  return (
    <section className="flex flex-1 flex-row">
      <section className="flex w-16 flex-col items-center justify-between border-r border-neutral-950 bg-neutral-900 pb-4">
        <header>
          <Logo className="h-20 w-20" />
          <nav className="mt-4 flex flex-1 justify-center">
            <ul className="flex w-full flex-col items-center gap-2">
              <li>
                <MenuItem
                  link="/"
                  compact={true}
                  variant={activeMainMenu === 'home' ? 'secondary' : 'ghost'}
                >
                  <House size="24" weight="regular" />
                </MenuItem>
              </li>
              <li>
                <MenuItem link="/dashboard" compact={true}>
                  <ChartLineUp size="24" weight="regular" />
                </MenuItem>
              </li>
            </ul>
          </nav>
        </header>
        <footer className="flex w-full flex-col items-center gap-4">
          <nav className="mt-4 flex w-full flex-1 justify-center border-b border-neutral-950 pb-4">
            <ul className="flex w-full flex-col items-center gap-2">
              <li>
                <MenuItem
                  link="/settings"
                  compact={true}
                  variant={
                    activeMainMenu === 'settings' ? 'secondary' : 'ghost'
                  }
                >
                  <Gear size="24" weight="regular" />
                </MenuItem>
              </li>
            </ul>
          </nav>
          <UserButton afterSignOutUrl="/" />
        </footer>
      </section>
      {activeMainMenu === 'investments' && (
        <section className="flex w-64 flex-1 flex-col items-center gap-8 border-r border-neutral-950 bg-neutral-900 py-4">
          <nav className="flex w-full px-4">
            <ul className="flex w-full flex-col gap-2">
              <li>
                <MenuItem
                  link="/dashboard"
                  active={
                    pathname.startsWith('/dashboard') ? 'bg-neutral-800' : ''
                  }
                >
                  <GridFour size="24" weight="regular" /> Dashboard
                </MenuItem>
              </li>
              <li>
                <MenuItem
                  link="/assets"
                  active={
                    pathname.startsWith('/assets') ? 'bg-neutral-800' : ''
                  }
                  amount={0}
                >
                  <PiggyBank size="24" weight="regular" />
                  Assets
                </MenuItem>
              </li>
              <li>
                <MenuItem
                  link="/transactions"
                  active={
                    pathname.startsWith('/transactions') ? 'bg-neutral-800' : ''
                  }
                >
                  <Swap size="24" weight="regular" /> Transactions
                </MenuItem>
              </li>
            </ul>
          </nav>
        </section>
      )}
    </section>
  );
};
