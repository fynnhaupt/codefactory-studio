import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { cn } from 'cn';
import './globals.css';

import { ThemeProvider } from '@/components/global/theme-provider';
import { Toaster } from '@/components/ui/toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'CodeFactory Studio',
  description:
    'Open-source, self-hosted typescript platform for orchestrating software factories through a dashboard.'
};

export default function RootLayout({ children }: LayoutProps<'/[locale]'>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, 'antialiased')}>
      <head>
        <meta name="apple-mobile-web-app-title" content="CF Studio" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            {children}
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
