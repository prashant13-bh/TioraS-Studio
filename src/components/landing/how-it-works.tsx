'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Wand2, Shirt } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    icon: <Lightbulb className="size-10 text-yellow-500" />,
    title: '1. Imagine',
    description: 'Describe your vision in plain text. "A cyberpunk dragon on a neon city background."',
  },
  {
    icon: <Wand2 className="size-10 text-purple-500" />,
    title: '2. Visualize',
    description: 'Our AI generates stunning, high-resolution designs in seconds. Refine until it\'s perfect.',
  },
  {
    icon: <Shirt className="size-10 text-blue-500" />,
    title: '3. Wear',
    description: 'We print your masterpiece on premium fabric and ship it directly to your door.',
  },
];

export function HowItWorks() {
  return (
    <section className="bg-muted/30 py-24 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            From Prompt to Product
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three simple steps to create your own fashion line.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="h-full border-none bg-background/50 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-2 hover:shadow-md">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 rounded-full bg-background p-4 shadow-inner">
                    {step.icon}
                  </div>
                  <h3 className="mb-3 font-headline text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
