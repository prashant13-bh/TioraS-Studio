import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group relative w-full overflow-hidden rounded-lg border-2 shadow-sm transition-all duration-300 hover:shadow-xl">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={`${product.category.toLowerCase()} clothing`}
          />
          {product.isNew && (
            <Badge className="absolute left-2 top-2 text-xs px-1.5 py-0.5 md:left-3 md:top-3 md:text-sm md:px-2 md:py-0.5 bg-primary font-bold">
              New
            </Badge>
          )}
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
