'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

export function Newsletter() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 bg-primary/5"></div>
      <div className="absolute -top-24 -left-24 size-96 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-purple-500/10 blur-3xl"></div>

      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 font-headline text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Join the Revolution
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 text-lg text-muted-foreground"
          >
            Be the first to know about new AI models, exclusive drops, and community challenges.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-4 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-12 bg-background/50 backdrop-blur-sm"
            />
            <Button type="submit" size="lg" className="h-12 px-8 font-bold">
              Subscribe <Send className="ml-2 size-4" />
            </Button>
          </motion.form>
          
          <p className="mt-4 text-xs text-muted-foreground">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
}
