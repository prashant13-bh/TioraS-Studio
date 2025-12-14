
'use server';

import type { Product } from '@/lib/types';
import { getFirebaseAdmin } from '@/firebase/server-config';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { firestore as admin } from 'firebase-admin';

export async function getProducts({
  category,
  limit,
}: {
  category?: string;
  limit?: number;
}): Promise<{ products: Product[] }> {
  try {
    const { firestore } = getFirebaseAdmin();
    let query: admin.Query = firestore.collection('products');

    if (category && category !== 'All') {
      query = query.where('category', '==', category);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const snapshot = await query.get();
    if (snapshot.empty) {
        return { products: [] };
    }
    
    const products: Product[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            sizes: Array.isArray(data.sizes) ? data.sizes : [],
            colors: Array.isArray(data.colors) ? data.colors : [],
            images: Array.isArray(data.images) ? data.images : [],
        } as Product;
    });

    return { products };
  } catch (error) {
    console.error('Failed to fetch products from Firestore:', error);
    return { products: [] };
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { firestore } = getFirebaseAdmin();
    const doc = await firestore.collection('products').doc(id).get();

    if (!doc.exists) {
        return null;
    }

    const data = doc.data();
    if (!data) return null;

    return {
        id: doc.id,
        ...data,
        sizes: Array.isArray(data.sizes) ? data.sizes : [],
        colors: Array.isArray(data.colors) ? data.colors : [],
        images: Array.isArray(data.images) ? data.images : [],
    } as Product;

  } catch (error) {
    console.error(`Failed to fetch product with id ${id} from Firestore:`, error);
    return null;
  }
}

const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.coerce.number().min(0, 'Price must be a positive number'),
    category: z.string().min(1, 'Category is required'),
    sizes: z.array(z.string()).min(1, 'At least one size is required.'),
    colors: z.array(z.string()).min(1, 'At least one color is required.'),
    images: z.array(z.string().url()).min(1, 'At least one image URL is required.'),
    isNew: z.boolean(),
});


export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const validatedData = productSchema.safeParse(data);
    if (!validatedData.success) {
        console.error("Validation failed:", validatedData.error.flatten());
        return { success: false, message: 'Invalid product data.' };
    }
    
    try {
        const { firestore } = getFirebaseAdmin();
        const now = new Date().toISOString();
        const newProduct = {
            ...validatedData.data,
            createdAt: now,
            updatedAt: now,
        };
        const docRef = await firestore.collection('products').add(newProduct);
        revalidatePath('/admin/products');
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Failed to create product:', error);
        return { success: false, message: 'Failed to create product.' };
    }
}

export async function updateProduct(id: string, data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const validatedData = productSchema.safeParse(data);
    if (!validatedData.success) {
        console.error("Validation failed:", validatedData.error.flatten());
        return { success: false, message: 'Invalid product data.' };
    }

    try {
        const { firestore } = getFirebaseAdmin();
        const now = new Date().toISOString();
        const updatedProduct = {
            ...validatedData.data,
            updatedAt: now,
        };
        await firestore.collection('products').doc(id).update(updatedProduct);
        revalidatePath('/admin/products');
        revalidatePath(`/products/${id}`);
        return { success: true };
    } catch (error: any) {
        console.error(`Failed to update product ${id}:`, error);
        return { success: false, message: 'Failed to update product.' };
    }
}
