'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 font-headline text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Have a question about your order, our AI technology, or just want to say hello? 
            We'd love to hear from you.
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid gap-6">
              <Card>
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <MapPin className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-headline text-lg font-semibold">Visit Us</h3>
                    <p className="mt-1 text-muted-foreground">
                      Talikoti Sub Post Office,<br />
                      Talikoti, Muddebihal,<br />
                      Vijayapura, Karnataka, India - 586214
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Mail className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-headline text-lg font-semibold">Email Us</h3>
                    <p className="mt-1 text-muted-foreground">
                      support@tioras.com<br />
                      partnerships@tioras.com
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Phone className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-headline text-lg font-semibold">Call Us</h3>
                    <p className="mt-1 text-muted-foreground">
                      +91 73536 76454<br />
                      <span className="text-sm">(Mon-Fri, 9am - 6pm IST)</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardContent className="p-8">
                <h3 className="mb-6 font-headline text-2xl font-bold">Send us a Message</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="first-name" className="text-sm font-medium">First name</label>
                      <Input id="first-name" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last-name" className="text-sm font-medium">Last name</label>
                      <Input id="last-name" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <Textarea id="message" placeholder="Tell us more..." className="min-h-[150px]" />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message <Send className="ml-2 size-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}