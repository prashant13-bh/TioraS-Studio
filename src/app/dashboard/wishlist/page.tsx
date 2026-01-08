'use client';

import { useWishlist } from '@/lib/wishlist-context';
import ProductCard from '@/components/product-card';
import { Loader2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WishlistPage() {
  const { items, loading } = useWishlist();

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">


      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Heart className="h-10 w-10 text-muted-foreground opacity-50" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Your wishlist is empty</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
            Browse our collection and save your favorite items to your wishlist.
          </p>
          <Button asChild>
            <Link href="/catalog">Explore Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
