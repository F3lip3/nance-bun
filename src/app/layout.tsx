import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Toaster } from '@/components/ui/toaster';
import TrpcProvider from '@/lib/trpc/Provider';
import { ClerkProvider } from '@clerk/nextjs';

import { ThemeProvider } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils/functions';
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
    <html lang="en" className="h-full">
      <body
        className={cn('relative h-full font-sans antialiased', inter.className)}
      >
        <main className="relative flex min-h-screen flex-col">
          <div className="flex-1 flex-grow">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ClerkProvider>
                <TrpcProvider>
                  {children}
                  <Toaster />
                </TrpcProvider>
              </ClerkProvider>
            </ThemeProvider>
          </div>
        </main>
      </body>
    </html>
  );
}
