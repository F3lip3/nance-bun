import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Toaster } from '@/components/ui/toaster';
import TrpcProvider from '@/lib/trpc/Provider';
import { ClerkProvider } from '@clerk/nextjs';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nance',
  description: 'A simple finance app to organize your finances and investments.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <TrpcProvider>
            {children}
            <Toaster />
          </TrpcProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
