import { getProducts } from '@/app/actions/product-actions';
import { Hero } from '@/components/landing/hero';
import { Vision } from '@/components/landing/vision';
import { HowItWorks } from '@/components/landing/how-it-works';
import { FeatureShowcase } from '@/components/landing/feature-showcase';
import { TrendingCarousel } from '@/components/landing/trending-carousel';
import { Newsletter } from '@/components/landing/newsletter';

export default async function Home() {
  const { products } = await getProducts({});
  const featuredProducts = products ? products.slice(0, 8) : []; // Fetch more for the carousel

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Vision />
      <HowItWorks />
      <FeatureShowcase />
      <TrendingCarousel products={featuredProducts} />
      <Newsletter />
    </div>
  );
}