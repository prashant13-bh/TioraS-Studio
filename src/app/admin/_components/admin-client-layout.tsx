
'use client';

import Link from 'next/link';
import {
  Home,
  Package,
  Palette,
  Shirt,
  Users,
  Warehouse,
  FileText,
  Calendar,
  User,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TiorasLogo } from '@/components/icons';

const navItems = [
  { href: '/admin', icon: Home, label: 'Dashboard' },
  { href: '/admin/orders', icon: Package, label: 'Orders' },
  { href: '/admin/products', icon: Shirt, label: 'Products' },
  { href: '/admin/inventory', icon: Warehouse, label: 'Inventory' },
  { href: '/admin/invoices', icon: FileText, label: 'Invoices' },
  { href: '/admin/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/reviews', icon: Palette, label: 'Design Reviews' },
  { href: '/admin/profile', icon: User, label: 'Profile' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
  { href: '/admin/seed', icon: Package, label: 'Seed Data' },
];

import { useUser } from '@/firebase';
import { isAdminEmail } from '@/lib/admin-config';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || !isAdminEmail(user.email)) {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading admin panel...</div>;
  }

  if (!user || !isAdminEmail(user.email)) {
    return null; // Will redirect
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <TiorasLogo className="size-6 text-primary" />
              <span className="font-headline">TioraS Admin</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Go to Storefront</CardTitle>
                <CardDescription>
                  View the live site as your customers see it.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full" asChild>
                  <Link href="/">View Store</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
