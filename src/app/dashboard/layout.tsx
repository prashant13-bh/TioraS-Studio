"use client";

import { CustomerSidebar } from "./_components/customer-sidebar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { TiorasLogo } from "@/components/icons";
import Link from "next/link";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading dashboard...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <div className="px-7">
                  <Link href="/" className="flex items-center gap-2 font-bold">
                    <TiorasLogo className="h-6 w-6" />
                    <span className="font-headline">TioraS Studio</span>
                  </Link>
                </div>
                <div className="my-4 px-7">
                   <CustomerSidebar />
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2 font-bold md:hidden">
              <TiorasLogo className="h-6 w-6" />
              <span className="font-headline">TioraS Studio</span>
            </Link>
             <div className="hidden md:flex items-center gap-2 font-bold">
                <Link href="/" className="flex items-center gap-2">
                    <TiorasLogo className="h-6 w-6" />
                    <span className="font-headline text-lg">TioraS Studio</span>
                </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-sm text-muted-foreground hidden md:inline-block">
                Welcome, {user.displayName || user.email?.split('@')[0]}
             </span>
             <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
             </div>
          </div>
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <CustomerSidebar />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden pb-24 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
