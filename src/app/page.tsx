
'use client';

import Image from 'next/image';
import Link from 'next/link';
import Starfield from '@/components/starfield';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { getProducts } from '@/app/actions/product-actions';
import { ArrowRight, Bot, Palette, Sparkles, Zap } from 'lucide-react';
import ProductCard from '@/components/product-card';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import Autoplay from "embla-carousel-autoplay"


export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
        const { products } = await getProducts({ limit: 6 });
        setFeaturedProducts(products);
    }
    loadProducts();
  }, [])


  const benefits = [
    {
      icon: <Bot className="size-8 text-primary" />,
      title: 'AI-Powered Designs',
      description: 'Generate unique, one-of-a-kind designs with our state-of-the-art AI design studio.',
    },
    {
      icon: <Palette className="size-8 text-primary" />,
      title: 'Premium Quality',
      description: 'Experience luxury with our meticulously crafted apparel, made from the finest materials.',
    },
    {
      icon: <Zap className="size-8 text-primary" />,
      title: 'Exclusive Drops',
      description: 'Stay ahead of the trend with our limited edition collections and exclusive product drops.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
        <section className="relative w-full overflow-hidden" style={{height: '95vh'}}>
          <Starfield
            starCount={2000}
            starColor={[255, 255, 255]}
            speedFactor={0.05}
            backgroundColor="black"
          />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white p-4">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gray-800/80 px-4 py-1.5 text-sm font-medium">
                <Sparkles className="size-4 text-yellow-400" />
                New: AI-Powered Embroidery Generation
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tighter md:text-7xl lg:text-8xl">
                <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">WEAR YOUR</span><br />
                <span className="text-yellow-400" style={{textShadow: '0 0 15px rgba(250, 204, 21, 0.7)'}}>IMAGINATION</span>
            </h1>
            <p className="mt-4 max-w-md sm:max-w-2xl text-md sm:text-lg text-gray-300 md:text-xl">
              Where artificial intelligence meets artisan craftsmanship. Design your legacy.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="font-bold bg-yellow-400 text-black hover:bg-yellow-500">
                <Link href="/design-studio">
                  Start Designing <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-bold border-2 border-gray-600 bg-transparent text-white hover:bg-gray-800 hover:text-white">
                <Link href="/collections">View Collection</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="featured-products" className="flex w-full flex-col justify-center bg-background py-16 md:py-24" style={{minHeight: '95vh'}}>
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-headline text-3xl md:text-4xl font-bold tracking-tighter lg:text-5xl">
              Featured Products
            </h2>
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
                {featuredProducts.map((product) => (
                  <CarouselItem key={product.id} className="sm:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-12 hidden sm:flex" />
              <CarouselNext className="mr-12 hidden sm:flex" />
            </Carousel>
          </div>
        </section>

        <section id="benefits" className="flex w-full flex-col justify-center bg-card py-16 md:py-24" style={{minHeight: '95vh'}}>
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-headline text-3xl md:text-4xl font-bold tracking-tighter lg:text-5xl">
              Why Choose TioraS?
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {benefits.map((benefit, index) => (
                <Card key={index} className="transform border-2 border-transparent bg-background text-center transition-transform duration-300 hover:scale-105 hover:border-primary hover:shadow-lg">
                  <CardContent className="p-8">
                    <div className="mb-4 flex justify-center">{benefit.icon}</div>
                    <h3 className="mb-2 font-headline text-xl md:text-2xl font-bold">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
