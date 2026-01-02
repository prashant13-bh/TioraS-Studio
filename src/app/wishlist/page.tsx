'use client';

import { useWishlist } from '@/lib/wishlist-context';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function WishlistPage() {
  const { items, loading } = useWishlist();

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 size-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-5xl">My Wishlist</h1>
        <p className="mt-2 text-muted-foreground">Your curated collection of artisan designs.</p>
      </header>

      {items.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <div className="mb-6 rounded-full bg-muted p-6">
            <Heart className="size-16 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Your wishlist is empty</h2>
          <p className="mb-8 max-w-md text-muted-foreground">
            Save your favorite pieces here to keep track of what you love.
          </p>
          <Button asChild size="lg" className="h-14 px-8 font-bold">
            <Link href="/catalog">
              Explore Collections <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
