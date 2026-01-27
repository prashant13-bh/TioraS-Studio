import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ClientLayout } from '@/components/layout/client-layout';
import { ThemeProvider } from "@/components/theme-provider"
import { StoreProvider } from '@/lib/store-context';
import { BottomNav } from '@/components/layout/bottom-nav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'TioraS Studio - AI Apparel Design',
  description: 'AI-powered custom apparel design platform with inventory management',
  applicationName: 'TioraS Studio',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TioraS',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'TioraS Studio',
    title: 'TioraS Studio - AI Apparel Design',
    description: 'Create custom apparel designs with AI',
  },
  twitter: {
    card: 'summary',
    title: 'TioraS Studio',
    description: 'AI-powered apparel design platform',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          inter.variable,
          spaceGrotesk.variable
        )}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <StoreProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
              <BottomNav />
            </StoreProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
