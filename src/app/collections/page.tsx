import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'Collections | TioraS',
  description: 'Explore our curated collections and limited edition drops.',
};

const collectionImages = PlaceHolderImages.filter(img => img.id.startsWith('collection-'));

export default function CollectionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-5xl">
          Curated Collections
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Limited edition drops and our most exclusive designs.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="group relative col-span-1 sm:col-span-2">
          <div className="relative h-80 w-full overflow-hidden rounded-lg">
            <Image
              src="https://picsum.photos/seed/201/1200/400"
              alt="Urban Explorer Collection"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="man urban"
            />
             <div className="absolute inset-0 bg-black/50" />
          </div>
           <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                <h2 className="font-headline text-4xl font-bold">Urban Explorer</h2>
                <p className="mt-2 text-lg">Technical fabrics for the modern city.</p>
                <Button asChild className="mt-4" variant="secondary"><Link href="/catalog?category=Jacket">Shop Now</Link></Button>
            </div>
        </Card>

        {collectionImages.map((image, index) => (
            <Card key={index} className="group relative">
            <div className="relative h-80 w-full overflow-hidden rounded-lg">
                <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={image.imageHint}
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>
            <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="font-headline text-xl font-bold">Collection 0{index + 1}</h3>
            </div>
            </Card>
        ))}

        <Card className="group relative">
          <div className="relative h-80 w-full overflow-hidden rounded-lg">
            <Image
              src="https://picsum.photos/seed/202/600/400"
              alt="Minimalist Collection"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="minimalist fashion"
            />
             <div className="absolute inset-0 bg-black/50" />
          </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                <h2 className="font-headline text-2xl font-bold">Minimalist</h2>
                 <Button asChild className="mt-4" variant="secondary"><Link href="/catalog?category=T-Shirt">Shop Tees</Link></Button>
            </div>
        </Card>
      </div>
    </div>
  );
}
