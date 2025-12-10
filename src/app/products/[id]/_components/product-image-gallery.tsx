
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

interface ProductImageGalleryProps {
  product: Product;
}

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg">
        <Image
          key={selectedImage}
          src={selectedImage}
          alt={product.name}
          fill
          className="object-cover animate-in fade-in-25"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
          data-ai-hint={`${product.category.toLowerCase()} clothing`}
        />
      </div>
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {product.images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={cn(
              'relative aspect-square w-full overflow-hidden rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              selectedImage === image ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80'
            )}
          >
            <Image
              src={image}
              alt={`${product.name} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="20vw"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
