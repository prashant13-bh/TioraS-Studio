
'use client';

import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { CartProvider } from '@/lib/cart-context';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { usePathname } from 'next/navigation';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

// export const metadata: Metadata = {
//   title: 'TioraS AI Menswear',
//   description: 'Premium AI-powered men\'s clothing e-commerce platform.',
//   icons: {
//     icon: '/favicon.ico',
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="en" className="dark">
      <head>
          <title>TioraS AI Menswear</title>
          <meta name="description" content="Premium AI-powered men's clothing e-commerce platform." />
          <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-black font-body antialiased',
          inter.variable,
          spaceGrotesk.variable
        )}
      >
        <FirebaseClientProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <FirebaseErrorListener />
              <main className="flex-1">{children}</main>
              {!isAdminPage && <Footer />}
            </div>
            <Toaster />
          </CartProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
