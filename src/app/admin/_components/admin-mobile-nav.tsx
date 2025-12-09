'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { TiorasLogo } from '@/components/icons';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
    href: string;
    icon: LucideIcon;
    label: string;
}

interface AdminMobileNavProps {
  navItems: NavItem[];
}

export function AdminMobileNav({ navItems }: AdminMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
         <nav className="grid gap-2 text-lg font-medium">
            <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold mb-4"
                onClick={() => setIsOpen(false)}
            >
                <TiorasLogo className="h-6 w-6 text-primary" />
                <span className="font-headline">TioraS Admin</span>
            </Link>
             {navItems.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              ))}
         </nav>
      </SheetContent>
    </Sheet>
  );
}
