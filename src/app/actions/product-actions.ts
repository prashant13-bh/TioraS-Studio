
'use server';

import type { Product, ProductMedia } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const MOCK_PRODUCTS: Product[] = [
    {
        id: 'prod_1',
        name: 'Tioras Signature Tee',
        description: 'Experience the perfect blend of comfort and style with our signature tee. Made from 100% premium pima cotton, this t-shirt is designed for a relaxed fit and ultimate softness.',
        price: 2499.00,
        category: 'T-Shirt',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['#000000', '#FFFFFF', '#4B5563'],
        media: [
            { type: 'image', url: 'https://picsum.photos/seed/101/600/800' },
            { type: 'image', url: 'https://picsum.photos/seed/102/600/800' },
        ],
        isNew: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'prod_2',
        name: 'Urban Explorer Hoodie',
        description: 'Our Urban Explorer Hoodie is crafted from a heavyweight fleece-back jersey for maximum warmth and comfort. Features a double-lined hood and kangaroo pocket.',
        price: 5499.00,
        category: 'Hoodie',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#1F2937', '#9CA3AF'],
        media: [
             { type: 'image', url: 'https://picsum.photos/seed/103/600/800' },
             { type: 'image', url: 'https://picsum.photos/seed/104/600/800' },
             { type: 'video', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
        ],
        isNew: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'prod_3',
        name: 'Tech-Wear Jacket',
        description: 'A versatile, all-weather jacket made from water-resistant technical fabric. Features sealed seams, multiple utility pockets, and a packable hood.',
        price: 8999.00,
        category: 'Jacket',
        sizes: ['M', 'L', 'XL'],
        colors: ['#000000'],
        media: [
            { type: 'image', url: 'https://picsum.photos/seed/105/600/800' },
        ],
        isNew: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'prod_4',
        name: 'Minimalist Logo Cap',
        description: 'A classic six-panel cap made from durable cotton twill, featuring a subtle embroidered Tioras logo. Adjustable strap for a perfect fit.',
        price: 1499.00,
        category: 'Cap',
        sizes: ['One Size'],
        colors: ['#000000', '#F3F4F6'],
        media: [
            { type: 'image', url: 'https://picsum.photos/seed/106/600/800' },
        ],
        isNew: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
     {
        id: 'prod_5',
        name: 'Everyday Comfort Tee',
        description: 'A reliable and comfortable t-shirt for everyday wear, made from soft-touch cotton.',
        price: 1999.00,
        category: 'T-Shirt',
        sizes: ['S', 'M', 'L'],
        colors: ['#374151', '#E5E7EB'],
        media: [
            { type: 'image', url: 'https://picsum.photos/seed/107/600/800' },
        ],
        isNew: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];


export async function getProducts({
  category,
  limit,
}: {
  category?: string;
  limit?: number;
}): Promise<{ products: Product[] }> {
  let products = MOCK_PRODUCTS;

  if (category && category !== 'All') {
    products = products.filter((p) => p.category === category);
  }

  if (limit) {
    products = products.slice(0, limit);
  }

  return { products };
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  return product || null;
}


const mediaSchema = z.object({
    type: z.enum(['image', 'video']),
    url: z.string().url('Please enter a valid URL.'),
});

const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.coerce.number().min(0, 'Price must be a positive number'),
    category: z.string().min(1, 'Category is required'),
    sizes: z.array(z.string()).min(1, 'At least one size is required.'),
    colors: z.array(z.string()).min(1, 'At least one color is required.'),
    media: z.array(mediaSchema).min(1, 'At least one image or video is required.'),
    isNew: z.boolean(),
});


export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    // This is a mock function
    console.log("Mock createProduct called with:", data);
    revalidatePath('/admin/products');
    return { success: true, id: `prod_${Date.now()}` };
}

export async function updateProduct(id: string, data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    // This is a mock function
    console.log(`Mock updateProduct called for ID ${id} with:`, data);
    revalidatePath('/admin/products');
    revalidatePath(`/products/${id}`);
    return { success: true };
}

export async function deleteProduct(id: string) {
    // This is a mock function
    console.log(`Mock deleteProduct called for ID ${id}`);
    revalidatePath('/admin/products');
    revalidatePath('/catalog');
    return { success: true, message: 'Product deleted successfully.' };
}
