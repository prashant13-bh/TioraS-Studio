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
import { ArrowRight, Bot, Palette, Zap } from 'lucide-react';
import ProductCard from '@/components/product-card';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default async function Home() {
  const { products: featuredProducts } = await getProducts({ limit: 6 });

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
    <>
      <Navbar />
      <div className="flex flex-col flex-1">
        <section className="relative h-[80vh] w-full overflow-hidden">
          <Starfield
            starCount={2000}
            starColor={[245, 158, 11]}
            speedFactor={0.05}
            backgroundColor="black"
          />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white p-4">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tighter md:text-7xl lg:text-8xl">
              TioraS AI Menswear
            </h1>
            <p className="mt-4 max-w-md sm:max-w-2xl text-md sm:text-lg text-gray-300 md:text-xl">
              Where artificial intelligence meets artisan craftsmanship. Design your
              legacy.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="font-bold">
                <Link href="/design-studio">
                  Start Designing <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-bold border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground">
                <Link href="/catalog">Explore Catalog</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="featured-products" className="w-full bg-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-headline text-3xl md:text-4xl font-bold tracking-tighter lg:text-5xl">
              Featured Products
            </h2>
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
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

        <section id="benefits" className="w-full bg-card py-16 md:py-24">
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
      </div>
      <Footer />
    </>
  );
}
