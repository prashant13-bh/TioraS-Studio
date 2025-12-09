import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
          <Card className="w-full max-w-lg text-center">
            <CardHeader>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <CheckCircle className="size-10 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="mt-4 font-headline text-3xl">
                Order Placed Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Thank you for your purchase. A confirmation email has been sent.
              </p>
              {searchParams.orderId && (
                <p className="mt-4 text-lg">
                  Your Order ID is:{' '}
                  <span className="font-bold text-primary">{searchParams.orderId}</span>
                </p>
              )}
              <div className="mt-8 flex justify-center gap-4">
                <Button asChild>
                  <Link href="/catalog">Continue Shopping</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard">View My Orders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
