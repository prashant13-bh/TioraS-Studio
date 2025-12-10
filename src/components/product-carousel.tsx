'use client';

import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ProductCard from './product-card';
import type { Product } from '@/lib/types';

export function ProductCarousel({ products }: { products: Product[] }) {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
            <div className="p-1">
              <ProductCard product={product} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-12 hidden sm:flex" />
      <CarouselNext className="mr-12 hidden sm:flex" />
    </Carousel>
  );
}
