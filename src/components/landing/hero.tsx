'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-background text-center">
      {/* Background Image with Zoom Effect */}
      <div className="absolute inset-0 -z-20">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="relative h-full w-full"
        >
          <img
            src="/assets/hero-bg.png"
            alt="Futuristic Fashion Background"
            className="h-full w-full object-cover opacity-60"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background"></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm backdrop-blur-sm"
        >
          <Sparkles className="mr-2 size-3 text-yellow-500" />
          <span className="text-muted-foreground">The Future of Fashion is Here</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mb-6 max-w-5xl font-headline text-6xl font-extrabold tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl"
        >
          Design Your <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Legacy
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          Where Artificial Intelligence meets Artisan Craftsmanship.
          <br />
          Create, customize, and wear your unique vision.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button asChild size="lg" className="h-14 px-8 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
            <Link href="/design-studio">
              Start Designing <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-semibold backdrop-blur-sm transition-all hover:bg-accent/50">
            <Link href="/catalog">Explore Collection</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
