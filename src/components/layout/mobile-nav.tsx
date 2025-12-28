
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, Menu, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { TiorasLogo } from '@/components/icons';
import { useUser } from '@/firebase'; // Using the client-side user hook for UI display
import { useAuth } from '@/firebase/provider';
import { useRouter } from 'next/navigation';

interface MobileNavProps {
  navLinks: { title: string; href: string }[];
  isAdmin: boolean;
}

export function MobileNav({ navLinks, isAdmin }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useUser();
  const { auth } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      setIsOpen(false);
      router.push('/');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="size-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <Link href="/" className="mb-8 inline-flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <TiorasLogo className="size-8 text-primary" />
            <span className="font-headline text-2xl font-bold">TioraS.</span>
          </Link>
        </SheetHeader>
        <nav className="flex flex-1 flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="text-lg font-medium text-foreground hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              {link.title}
            </Link>
          ))}
          <hr className="my-4 border-muted" />
          {!loading && user ? (
            <>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <Shield className="size-5" /> Admin Dashboard
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="size-5" /> My Dashboard
                </Link>
              )}
            </>
          ) : (
             <Link
                href="/login"
                className="text-lg font-medium text-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
          )}
        </nav>
        {!loading && user && (
          <div className="mt-auto">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 size-5" /> Logout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
