
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MobileNav } from './mobile-nav';
import { CartSheet } from './cart-sheet';
import { User, LogOut, Shield } from 'lucide-react';
import { useUser } from '@/firebase';
import { useAuth } from '@/firebase/provider';
import { useRouter } from 'next/navigation';

const navLinks = [
  { title: 'Catalog', href: '/catalog' },
  { title: 'AI Studio', href: '/design-studio' },
  { title: 'Collections', href: '/collections' },
  { title: 'Our Story', href: '/about' },
];

const ADMIN_EMAILS = ['tyoras9686@gmail.com', 'ph293815@gmail.com'];

export function Navbar() {
  const { user, loading } = useUser();
  const { auth } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/');
    }
  };
  
  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-headline text-2xl font-bold text-yellow-400">
              TioraS.
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                {link.title}
              </Link>
            ))}
             {isAdmin && (
              <Link href="/admin" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">Admin</Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {!loading &&
            (user ? (
              <>
                <Button variant="ghost" asChild size="icon" className="hidden md:inline-flex">
                  <Link href="/dashboard">
                    <User className="size-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="hidden md:inline-flex">
                  <LogOut className="size-5" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="hidden md:inline-flex">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="hidden md:inline-flex">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            ))}

          <CartSheet />
          <MobileNav navLinks={navLinks} />
        </div>
      </div>
    </header>
  );
}
