import { Badge } from '@/components/ui/badge';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils/functions';
import Link from 'next/link';
import { ReactNode } from 'react';

type MenuItemProps = {
  active?: string;
  amount?: number;
  compact?: boolean;
  link: string;
  children: ReactNode;
} & ButtonProps;

export const MenuItem = ({
  active,
  amount,
  children,
  compact,
  link,
  ...props
}: MenuItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        'flex w-full justify-between gap-2 rounded py-5',
        `hover:${active}`,
        active,
        { 'px-2': !!compact }
      )}
      asChild
      {...props}
    >
      <Link href={link}>
        <span className="flex flex-row items-center gap-2">{children}</span>
        {amount !== undefined && (
          <Badge className="rounded" variant="secondary">
            {amount}
          </Badge>
        )}
      </Link>
    </Button>
  );
};
