import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/app/actions/product-actions';
import { ArrowRight, Bot, Palette, Sparkles, Zap, Star, ShieldCheck, Truck } from 'lucide-react';
import ProductCard from '@/components/product-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default async function Home() {
  const { products } = await getProducts({});
  const featuredProducts = products.slice(0, 4);

  const features = [
    {
      icon: <Bot className="size-10 text-primary" />,
      title: 'AI-Powered Design',
      description: 'Create unique, one-of-a-kind apparel with our advanced AI design studio. Your imagination is the only limit.',
    },
    {
      icon: <Palette className="size-10 text-primary" />,
      title: 'Premium Materials',
      description: 'We use only the finest, sustainably sourced fabrics to ensure your custom pieces feel as good as they look.',
    },
    {
      icon: <Zap className="size-10 text-primary" />,
      title: 'Instant Visualization',
      description: 'See your designs come to life instantly with our real-time 3D preview technology before you buy.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-background py-20 text-center md:py-32 lg:py-40">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <Badge variant="outline" className="mb-6 animate-fade-in px-4 py-2 text-sm backdrop-blur-sm">
            <Sparkles className="mr-2 size-4 text-yellow-500" />
            <span>The Future of Fashion is Here</span>
          </Badge>
          
          <h1 className="mx-auto mb-6 max-w-4xl font-headline text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            Design Your <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Legacy</span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Experience the perfect fusion of artificial intelligence and artisan craftsmanship. 
            Create, customize, and wear your unique vision.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-8 text-lg font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl">
              <Link href="/design-studio">
                Start Designing <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg font-semibold backdrop-blur-sm transition-all hover:bg-accent/50">
              <Link href="/catalog">Explore Collection</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Why Choose TioraS?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Redefining the fashion industry with technology and quality.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-none bg-background/60 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 rounded-full bg-primary/10 p-4">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 font-headline text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Trending Now
              </h2>
              <p className="mt-2 text-muted-foreground">
                Discover our most popular AI-generated designs.
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/catalog">View All <ArrowRight className="ml-2 size-4" /></Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link href="/catalog">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="border-y bg-accent/20 py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="size-8 text-primary" />
              <h3 className="font-bold">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">Encrypted transactions for your peace of mind.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Truck className="size-8 text-primary" />
              <h3 className="font-bold">Global Shipping</h3>
              <p className="text-sm text-muted-foreground">We deliver your custom creations worldwide.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Star className="size-8 text-primary" />
              <h3 className="font-bold">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">Satisfaction guaranteed on every order.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 -z-10 bg-primary"></div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
        
        <div className="container px-4 text-center text-primary-foreground md:px-6">
          <h2 className="mb-6 font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Ready to Create?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg opacity-90 md:text-xl">
            Join thousands of creators who are redefining fashion with TioraS. 
            Start your design journey today.
          </p>
          <Button asChild size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold shadow-xl transition-transform hover:scale-105">
            <Link href="/design-studio">
              Launch Design Studio
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}