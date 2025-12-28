'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface TrendingCarouselProps {
  products: any[];
}

export function TrendingCarousel({ products }: TrendingCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-muted/30 py-24 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Trending Now
            </h2>
            <p className="mt-2 text-muted-foreground">
              Discover what the community is creating.
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/catalog">View All <ArrowRight className="ml-2 size-4" /></Link>
          </Button>
        </div>

        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="min-w-[280px] md:min-w-[320px] snap-start"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild className="w-full">
            <Link href="/catalog">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
