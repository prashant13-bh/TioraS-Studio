import Link from 'next/link';
import { TiorasLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Github, Twitter, Instagram } from 'lucide-react';

const footerLinks = {
  shop: [
    { title: 'Catalog', href: '/catalog' },
    { title: 'Collections', href: '/collections' },
    { title: 'Design Studio', href: '/design-studio' },
  ],
  company: [
    { title: 'About Us', href: '/about' },
    { title: 'Contact', href: '/contact' },
    { title: 'FAQ', href: '/faq' },
  ],
  legal: [
    { title: 'Privacy Policy', href: '/legal/privacy' },
    { title: 'Terms of Service', href: '/legal/terms' },
  ],
};

const socialLinks = [
  { icon: <Twitter className="size-5" />, href: '#' },
  { icon: <Instagram className="size-5" />, href: '#' },
  { icon: <Github className="size-5" />, href: '#' },
];

export function Footer() {
  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <TiorasLogo className="size-8 text-primary" />
              <span className="font-headline text-2xl font-bold">TioraS</span>
            </Link>
            <p className="mb-4 max-w-sm text-muted-foreground">
              Stay ahead of the curve. Subscribe for exclusive drops and AI design news.
            </p>
            <form className="flex w-full max-w-sm gap-2">
              <Input type="email" placeholder="Enter your email" />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
          <div>
            <h3 className="mb-4 font-headline font-semibold">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-headline font-semibold">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-headline font-semibold">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TioraS. All rights reserved.
          </p>
          <div className="mt-4 flex gap-4 sm:mt-0">
            {socialLinks.map((link, index) => (
              <Link key={index} href={link.href} className="text-muted-foreground hover:text-primary">
                {link.icon}
                <span className="sr-only">Social media</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
