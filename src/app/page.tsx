import { Hero } from '@/components/landing/hero';
import { Vision } from '@/components/landing/vision';
import { HowItWorks } from '@/components/landing/how-it-works';
import { FeatureShowcase } from '@/components/landing/feature-showcase';
import { TrendingCarousel } from '@/components/landing/trending-carousel';
import { Newsletter } from '@/components/landing/newsletter';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Vision />
      <HowItWorks />
      <FeatureShowcase />
      <TrendingCarousel />
      <Newsletter />
    </div>
  );
}