
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MobileNav } from './mobile-nav';
import { CartSheet } from './cart-sheet';
import { User, LogOut, Shield, Bell } from 'lucide-react';
import { useUser } from '@/firebase';
import { useAuth } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { isAdminEmail } from '@/lib/admin-config';

const navLinks = [
  { title: 'Catalog', href: '/catalog' },
  { title: 'AI Studio', href: '/design-studio' },
  { title: 'Collections', href: '/collections' },
  { title: 'Our Story', href: '/about' },
];



export function Navbar() {
  const { user, loading } = useUser();
  const { auth } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkUserRole = async () => {
      if (user && !loading) {
        try {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          const isAdm = userData?.role === 'admin' || isAdminEmail(user.email);
          setIsAdmin(isAdm);
        } catch (error) {
          console.error("Error fetching user role:", error);
          setIsAdmin(false);
        }
      } else if (!user && !loading) {
        setIsAdmin(false);
      }
    };
    checkUserRole();
  }, [user, loading]);

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      setIsAdmin(false); // Reset admin status on logout
      router.push('/');
    }
  };

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

          </nav>
        </div>
        <div className="flex items-center gap-2">
          {!loading &&
            (user ? (
              <>
                {isAdmin ? (
                  <Button variant="ghost" asChild className="hidden md:inline-flex">
                    <Link href="/admin">
                      <Shield className="mr-2 size-4" />
                      Admin Dashboard
                    </Link>
                  </Button>
                ) : (
                  <Button variant="ghost" asChild className="hidden md:inline-flex">
                    <Link href="/dashboard">
                      <User className="mr-2 size-4" />
                      My Dashboard
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={handleLogout} className="hidden md:inline-flex">
                  <LogOut className="size-5" />
                </Button>
                <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex">
                  <Link href="/profile">
                    <User className="size-5" />
                    <span className="sr-only">Profile</span>
                  </Link>
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

          <Button variant="ghost" size="icon">
            <Bell className="size-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <CartSheet />
          <MobileNav navLinks={navLinks} isAdmin={isAdmin} />
        </div>
      </div>
    </header>
  );
}
