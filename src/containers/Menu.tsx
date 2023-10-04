'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { cn } from '@/lib/utils/functions';

type MenuItemProps = {
  name: string;
  href: string;
  active: boolean;
};

export const Menu = () => {
  const pathname = usePathname();

  const menuItems = useMemo<MenuItemProps[]>(() => {
    return [
      {
        name: 'Dashboard',
        href: '/dashboard',
        active: pathname.startsWith('/dashboard')
      },
      {
        name: 'Assets',
        href: '/assets',
        active: pathname.startsWith('/assets')
      },
      {
        name: 'Transactions',
        href: '/transactions',
        active: pathname.startsWith('/transactions')
      }
    ];
  }, [pathname]);

  return (
    <nav className="flex w-full flex-row border-b border-b-neutral-700 px-8">
      {menuItems.map(item => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            'mb-[-1px] border-b px-4 py-4',
            item.active
              ? 'border-b-blue-500'
              : 'border-b-neutral-700 hover:border-b-slate-400'
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};
