'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Video, Heart } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist-context';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryMedia = product.media.find(m => m.type === 'image') || product.media[0];
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Card className="group relative w-full overflow-hidden rounded-lg border-2 shadow-sm transition-all duration-300 hover:shadow-xl">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          {primaryMedia.type === 'image' ? (
            <Image
              src={primaryMedia.url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={`${product.category.toLowerCase()} clothing`}
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-muted">
              <Video className="size-12 text-muted-foreground" />
            </div>
          )}
          {product.isNew && (
            <Badge className="absolute left-2 top-2 text-xs px-1.5 py-0.5 md:left-3 md:top-3 md:text-sm md:px-2 md:py-0.5 bg-primary font-bold">
              New
            </Badge>
          )}
          
          <Button
            size="icon"
            variant="secondary"
            className={cn(
              "absolute right-2 top-2 z-10 size-8 rounded-full shadow-md transition-all md:right-3 md:top-3 md:size-10",
              isWishlisted ? "bg-red-500 text-white hover:bg-red-600" : "hover:text-red-500"
            )}
            onClick={toggleWishlist}
          >
            <Heart className={cn("size-4 md:size-5", isWishlisted && "fill-current")} />
          </Button>
        </div>
        <div className="p-2 md:p-4">
          <h3 className="truncate font-headline text-base md:text-lg font-semibold">{product.name}</h3>
          <p className="text-xs md:text-sm text-muted-foreground">{product.category}</p>
          <p className="mt-1 md:mt-2 text-base md:text-lg font-bold text-foreground">
            ₹{product.price.toFixed(2)}
          </p>
        </div>
      </Link>
      <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 flex translate-y-20 flex-col gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <Button asChild size="icon" variant="secondary" className="shadow-md h-8 w-8 md:h-10 md:w-10">
          <Link href={`/products/${product.id}`}><Eye className="size-4 md:size-5" /></Link>
        </Button>
      </div>
    </Card>
  );
}
