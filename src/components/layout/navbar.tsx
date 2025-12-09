import Link from 'next/link';
import { TiorasLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { MobileNav } from './mobile-nav';
import { CartSheet } from './cart-sheet';

const navLinks = [
  { title: 'Catalog', href: '/catalog' },
  { title: 'Collections', href: '/collections' },
  { title: 'Design Studio', href: '/design-studio' },
  { title: 'About', href: '/about' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <TiorasLogo className="size-8 text-primary" />
            <span className="hidden font-headline text-2xl font-bold sm:inline-block">
              TioraS
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-primary md:inline-flex">
            <Link href="/admin">Admin</Link>
          </Button>
          <CartSheet />
          <MobileNav navLinks={navLinks} />
        </div>
      </div>
    </header>
  );
}
