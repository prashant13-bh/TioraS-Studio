'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { TiorasLogo } from '@/components/icons';

interface MobileNavProps {
  navLinks: { title: string; href: string }[];
}

export function MobileNav({ navLinks }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

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
            <span className="font-headline text-2xl font-bold">TioraS</span>
          </Link>
        </SheetHeader>
        <nav className="flex flex-col gap-4">
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
          <Link
            href="/admin"
            className="text-lg font-medium text-foreground hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Admin
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
