'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mb-8 rounded-full bg-green-500/10 p-6 text-green-500"
      >
        <CheckCircle2 className="size-24" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-4 font-headline text-4xl font-bold tracking-tighter md:text-6xl"
      >
        Order Confirmed!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 max-w-md text-lg text-muted-foreground"
      >
        Thank you for your purchase. Your order <span className="font-mono font-bold text-foreground">#{orderId?.slice(-6).toUpperCase()}</span> has been placed successfully.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <Button asChild size="lg" className="h-14 px-8 font-bold">
          <Link href="/orders">
            <Package className="mr-2 size-5" />
            View Order History
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-14 px-8 font-semibold">
          <Link href="/catalog">
            Continue Shopping <ArrowRight className="ml-2 size-5" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="container text-center py-24">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}