'use client';

import Link from 'next/link';
import {
  Home,
  Package,
  FileText,
  User,
  Settings,
  Store,
  KanbanSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { TiorasLogo } from '@/components/icons';
import { Menu } from 'lucide-react';

const navItems = [
  { href: '/seller', icon: Home, label: 'Dashboard' },
  { href: '/seller/orders', icon: KanbanSquare, label: 'Order Fulfillment' },
  { href: '/seller/syog', icon: Package, label: 'SYOG Processing' },
  { href: '/seller/invoices', icon: FileText, label: 'Invoices & Payouts' },
  { href: '/seller/store', icon: Store, label: 'Store Profile' },
  { href: '/seller/settings', icon: Settings, label: 'Settings' },
];

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { checkVendorStatus } from '@/app/actions/vendor-actions';

export function SellerClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [vendorCheck, setVendorCheck] = useState<{ isVendor: boolean; status: string | null } | null>(null);

  useEffect(() => {
    async function verify() {
        if (!loading && user) {
            const res = await checkVendorStatus();
            setVendorCheck(res);
            if (!res.isVendor || res.status !== 'Active') {
               router.push('/become-a-seller');
            }
        } else if (!loading && !user) {
             router.push('/login');
        }
    }
    verify();
  }, [user, loading, router]);

  if (loading || !vendorCheck) {
    return <div className="flex h-screen items-center justify-center">Loading seller portal...</div>;
  }

  if (!user || vendorCheck.status !== 'Active') {
    return null; // Layout.tsx should handle this on the server, but client backup
  }

  return (
    <div className={`grid min-h-screen w-full transition-all duration-300 ${isSidebarOpen ? "md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]" : "md:grid-cols-[0px_1fr]"}`}>
      <div className={`hidden border-r bg-muted/40 md:block overflow-hidden ${!isSidebarOpen && 'hidden'}`}>
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <TiorasLogo className="size-6 text-primary" />
              <span className="font-headline tracking-tighter">Vendor Central</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 mt-4">
              {navItems.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-secondary/50"
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
                  View the live customer-facing site.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <Link href="/">Exit Portal</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {/* Desktop Header */}
        <header className="hidden md:flex h-14 items-center justify-between gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
          <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="shrink-0"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
              <span className="font-semibold text-lg font-headline tracking-tight text-muted-foreground">Seller Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
               <span className="text-sm font-medium pr-2 border-r">{user.email}</span>
               <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold ml-2">ACTIVE SELER</span>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <TiorasLogo className="size-6 text-primary" />
                  <span className="font-headline tracking-tighter">Vendor Central</span>
                </Link>
                {navItems.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={label}
                    href={href}
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Exit Portal</CardTitle>
                    <CardDescription>
                      View the live site.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" variant="outline" className="w-full" asChild>
                      <Link href="/">Back to Shop</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
             <span className="font-semibold font-headline">Seller Dashboard</span>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
