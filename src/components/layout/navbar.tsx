import Link from 'next/link';
import { TiorasLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { MobileNav } from './mobile-nav';

const navLinks = [
  { title: 'Catalog', href: '/catalog' },
  { title: 'AI Studio', href: '/design-studio' },
  { title: 'Collections', href: '/collections' },
  { title: 'Our Story', href: '/about' },
];

export function Navbar() {
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
          <Button variant="ghost" asChild className="hidden text-sm font-medium text-gray-300 transition-colors hover:text-white md:inline-flex">
            <Link href="/admin">Admin</Link>
          </Button>
          <MobileNav navLinks={navLinks} />
        </div>
      </div>
    </header>
  );
}
