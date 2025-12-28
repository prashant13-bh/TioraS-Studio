'use client';

import { motion } from 'framer-motion';

export function Vision() {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 font-headline text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl"
          >
            "Where Artificial Intelligence Meets <span className="text-primary">Artisan Craftsmanship</span>"
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground md:text-xl"
          >
            We believe that the future of fashion is personal. By fusing generative AI with premium manufacturing, 
            we empower you to become the designer. No more mass-produced generic wear. 
            This is fashion, reimagined by you.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
