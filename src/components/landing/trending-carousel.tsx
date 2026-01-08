'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  media: { type: string; url: string }[];
  isNew?: boolean;
}

export function TrendingCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { firestore: db } = initializeFirebase();
        const productsQuery = query(
          collection(db, 'products'),
          orderBy('createdAt', 'desc'),
          limit(8)
        );
        const snapshot = await getDocs(productsQuery);
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="bg-muted/50 py-24 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Trending Now
            </h2>
            <p className="mt-2 text-muted-foreground">
              Discover our latest collection.
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/catalog">View All <ArrowRight className="ml-2 size-4" /></Link>
          </Button>
        </div>

        <div className="relative">
          {loading ? (
            <div className="flex gap-6 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="min-w-[280px] md:min-w-[320px] space-y-3">
                  <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div 
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
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No products yet. Add some from the admin panel!</p>
              <Button asChild className="mt-4">
                <Link href="/admin/products/new">Add First Product</Link>
              </Button>
            </div>
          )}
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
