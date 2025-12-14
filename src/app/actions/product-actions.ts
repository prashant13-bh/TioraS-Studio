
'use server';

import type { Product } from '@/lib/types';
import productsData from '@/lib/products.json';

const allProducts: Product[] = productsData.products.map((p: any) => ({
  ...p,
  sizes: JSON.parse(p.sizes),
  colors: JSON.parse(p.colors),
  images: JSON.parse(p.images),
}));

export async function getProducts({
  category,
  limit,
}: {
  category?: string;
  limit?: number;
}): Promise<{ products: Product[] }> {
  try {
    let filteredProducts = allProducts;

    if (category && category !== 'All') {
      filteredProducts = allProducts.filter(p => p.category === category);
    }
    
    if (limit) {
      filteredProducts = filteredProducts.slice(0, limit);
    }
    
    return { products: filteredProducts };
  } catch (error) {
    console.error('Failed to fetch products from mock data:', error);
    return { products: [] };
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = allProducts.find(p => p.id === id);
    return product || null;
  } catch (error) {
    console.error(`Failed to fetch product with id ${id} from mock data:`, error);
    return null;
  }
}
