'use client';

import { CartProvider } from '@/lib/cart-context';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Analytics } from "@vercel/analytics/react";
import { usePathname } from 'next/navigation';

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <FirebaseClientProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <FirebaseErrorListener />
          <main className="flex-1">{children}</main>
          {!isAdminPage && <Footer />}
        </div>
        <Toaster />
        <Analytics />
      </CartProvider>
    </FirebaseClientProvider>
  );
}
