import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | TioraS',
  description: 'Get in touch with the TioraS team.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Contact Us
        </h1>
        <p className="mt-2 text-md text-muted-foreground md:text-lg">
          We&apos;re here to help. Reach out with any questions or feedback.
        </p>
      </header>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
        <div>
            <h2 className="font-headline mb-4 text-xl font-bold md:text-2xl">Send us a Message</h2>
            <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your Name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Question about an order" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Your message..." rows={5} />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
            </form>
        </div>
        <div className="space-y-8">
             <h2 className="font-headline mb-4 text-xl font-bold md:text-2xl">Contact Information</h2>
            <div className='space-y-4'>
                <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                        <Mail className="size-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Email</h3>
                        <p className="text-sm text-muted-foreground">For support and inquiries.</p>
                        <a href="mailto:support@tioras.com" className="break-all text-primary hover:underline">support@tioras.com</a>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                        <Phone className="size-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Phone</h3>
                        <p className="text-sm text-muted-foreground">Mon-Fri, 9am-5pm IST.</p>
                        <a href="tel:+919876543210" className="text-primary hover:underline">+91 987 654 3210</a>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                        <MapPin className="size-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Our Office</h3>
                        <p className="text-muted-foreground">123 Design Lane, Tech Park</p>
                        <p className="text-muted-foreground">Mumbai, Maharashtra 400001, India</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}