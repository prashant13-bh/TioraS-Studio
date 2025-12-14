
'use server';

import type { Product, ProductMedia } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// MOCK DATA
const mockProducts: Product[] = [
    {
        id: 'prod_1',
        name: 'Tioras Signature Tee',
        description: 'Experience the perfect blend of comfort and style with the Tioras Signature Tee. Made from 100% premium pima cotton, this t-shirt offers a soft, breathable fit that lasts all day. Featuring a minimalist embroidered logo, it\'s a versatile staple for any modern wardrobe.',
        price: 2499.00,
        category: 'T-Shirt',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#000000', '#FFFFFF', '#6B7280'],
        media: [{ type: 'image', url: 'https://picsum.photos/seed/1/600/800' }],
        isNew: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'prod_2',
        name: 'Urban Explorer Hoodie',
        description: 'The Urban Explorer Hoodie is engineered for life on the move. Crafted from a durable fleece-back jersey, it provides warmth without the weight. With a structured hood, subtle branding, and a relaxed fit, it\'s the ultimate layer for city adventures.',
        price: 6499.00,
        category: 'Hoodie',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#1F2937', '#4B5563'],
        media: [{ type: 'image', url: 'https://picsum.photos/seed/2/600/800' }],
        isNew: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
     {
        id: 'prod_3',
        name: 'Tech-Twill Jacket',
        description: 'A modern take on a classic silhouette. The Tech-Twill Jacket is made from a water-resistant technical fabric, offering protection from the elements without compromising on style. Features include a sleek zip closure, functional pockets, and a tailored fit.',
        price: 12999.00,
        category: 'Jacket',
        sizes: ['M', 'L', 'XL'],
        colors: ['#000000', '#374151'],
        media: [{ type: 'image', url: 'https://picsum.photos/seed/3/600/800' }],
        isNew: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'prod_4',
        name: 'Minimalist Logo Cap',
        description: 'The perfect finishing touch. Our Minimalist Logo Cap is crafted from durable cotton twill and features an adjustable strap for a custom fit. The understated, embroidered Tioras logo adds a touch of refined branding.',
        price: 1899.00,
        category: 'Cap',
        sizes: ['One Size'],
        colors: ['#000000', '#F3F4F6'],
        media: [{ type: 'image', url: 'https://picsum.photos/seed/4/600/800' }],
        isNew: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export async function getProducts({
  category,
  limit,
}: {
  category?: string;
  limit?: number;
}): Promise<{ products: Product[] }> {
  let products = [...mockProducts];
  if (category && category !== 'All') {
    products = products.filter(p => p.category === category);
  }
  if (limit) {
    products = products.slice(0, limit);
  }
  return { products };
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = mockProducts.find(p => p.id === id);
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
    const validatedData = productSchema.safeParse(data);
    if (!validatedData.success) {
        console.error("Validation failed:", validatedData.error.flatten());
        return { success: false, message: 'Invalid product data.' };
    }
    
    const now = new Date().toISOString();
    const newProduct: Product = {
        id: `prod_${Date.now()}`,
        ...validatedData.data,
        createdAt: now,
        updatedAt: now,
    };
    mockProducts.unshift(newProduct);
    revalidatePath('/admin/products');
    return { success: true, id: newProduct.id };
}

export async function updateProduct(id: string, data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const validatedData = productSchema.safeParse(data);
    if (!validatedData.success) {
        console.error("Validation failed:", validatedData.error.flatten());
        return { success: false, message: 'Invalid product data.' };
    }

    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
        return { success: false, message: 'Product not found.' };
    }

    const now = new Date().toISOString();
    const updatedProduct = {
        ...mockProducts[productIndex],
        ...validatedData.data,
        updatedAt: now,
    };
    mockProducts[productIndex] = updatedProduct;

    revalidatePath('/admin/products');
    revalidatePath(`/products/${id}`);
    return { success: true };
}

export async function deleteProduct(id: string) {
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex > -1) {
        mockProducts.splice(productIndex, 1);
        revalidatePath('/admin/products');
        revalidatePath('/catalog');
        return { success: true, message: 'Product deleted successfully.' };
    }
    return { success: false, message: 'Failed to delete product.' };
}
