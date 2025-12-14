
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { Video } from 'lucide-react';

interface ProductImageGalleryProps {
  product: Product;
}

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState(product.media[0]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg">
        {selectedMedia.type === 'image' ? (
             <Image
                key={selectedMedia.url}
                src={selectedMedia.url}
                alt={product.name}
                fill
                className="object-cover animate-in fade-in-25"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
                data-ai-hint={`${product.category.toLowerCase()} clothing`}
            />
        ) : (
            <video
                key={selectedMedia.url}
                src={selectedMedia.url}
                controls
                autoPlay
                loop
                muted
                className="size-full object-cover"
            >
                Your browser does not support the video tag.
            </video>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {product.media.map((media, index) => (
          <button
            key={index}
            onClick={() => setSelectedMedia(media)}
            className={cn(
              'relative aspect-square w-full overflow-hidden rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              selectedMedia.url === media.url ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80'
            )}
          >
            {media.type === 'image' ? (
                 <Image
                    src={media.url}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="20vw"
                />
            ) : (
                <div className="flex size-full items-center justify-center bg-muted">
                    <Video className="size-8 text-muted-foreground" />
                </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
