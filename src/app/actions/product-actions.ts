'use server';

import { prisma } from '@/lib/prisma';
import type { Product } from '@/lib/types';

export async function getProducts({
  category,
  limit,
}: {
  category?: string;
  limit?: number;
}): Promise<{ products: Product[] }> {
  try {
    const whereClause = category && category !== 'All' ? { category } : {};
    
    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const parsedProducts = products.map((product) => ({
      ...product,
      sizes: JSON.parse(product.sizes),
      colors: JSON.parse(product.colors),
    }));

    return { products: parsedProducts };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return { products: [] };
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return null;
    }

    return {
      ...product,
      sizes: JSON.parse(product.sizes),
      colors: JSON.parse(product.colors),
    };
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    return null;
  }
}
