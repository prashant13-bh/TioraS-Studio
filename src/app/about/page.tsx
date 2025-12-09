import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const metadata = {
  title: 'About Us | TioraS',
  description: 'The story behind TioraS and our mission to redefine menswear.',
};

const aboutImage = PlaceHolderImages.find(img => img.id === 'about-us');

export default function AboutPage() {
  return (
    <div>
      <section className="relative h-80 w-full">
        {aboutImage && (
             <Image
                src={aboutImage.imageUrl}
                alt={aboutImage.description}
                fill
                className="object-cover"
                data-ai-hint={aboutImage.imageHint}
              />
        )}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <h1 className="font-headline text-5xl font-bold tracking-tighter text-white md:text-7xl">
            Our Story
          </h1>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
        <div className="space-y-8 text-lg text-foreground">
          <h2 className="font-headline text-4xl font-bold text-primary">
            The Fusion of Code and Cloth.
          </h2>
          <p>
            TioraS was born from a simple yet profound question: What if your style could be as unique as your imagination? In a world of mass-produced fashion, we saw an opportunity to bring true personalization back to the forefront, powered by the limitless potential of artificial intelligence.
          </p>
          <p>
            Our journey began not in a fashion studio, but in front of a command line. We are a team of technologists, artists, and fashion enthusiasts who believe that the future of apparel lies at the intersection of human creativity and machine intelligence. We spent countless hours developing a platform that could translate abstract ideas into tangible, wearable art.
          </p>
          <h2 className="font-headline text-4xl font-bold text-primary">
            Our Mission
          </h2>
          <p>
            Our mission is to empower individual expression. We provide the tools for you to become the designer. TioraS is more than just a clothing brand; it's a platform for creation. We handle the complexities of AI and the logistics of production so you can focus on what matters most: bringing your vision to life.
          </p>
          <p>
            Every piece is crafted on-demand with a commitment to quality and sustainability. We use premium materials and ethical manufacturing processes, ensuring that your unique design is not only visually stunning but also made to last. Join us in pioneering the new era of personalized fashion.
          </p>
        </div>
      </section>
    </div>
  );
}
