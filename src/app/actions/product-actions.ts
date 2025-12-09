'use server';

import type { Product } from '@/lib/types';
import productsData from '@/lib/products.json';

export async function getProducts({
  category,
  limit,
}: {
  category?: string;
  limit?: number;
}): Promise<{ products: Product[] }> {
  try {
    let products: Product[] = productsData.products.map(p => ({
        ...p,
        sizes: JSON.parse(p.sizes as any),
        colors: JSON.parse(p.colors as any)
    }));

    if (category && category !== 'All') {
      products = products.filter(p => p.category === category);
    }
    
    if (limit) {
      products = products.slice(0, limit);
    }

    return { products };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return { products: [] };
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = productsData.products.find((p) => p.id === id);

    if (!product) {
      return null;
    }

    return {
      ...product,
      sizes: JSON.parse(product.sizes as any),
      colors: JSON.parse(product.colors as any),
    };
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    return null;
  }
}
