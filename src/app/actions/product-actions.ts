
'use server';

import type { Product, ProductMedia } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getFirebaseAdmin } from '@/firebase/server-config';
import { FieldValue } from 'firebase-admin/firestore';

const db = getFirebaseAdmin().firestore;
const productsCollection = db.collection('products');


export async function getProducts({
  category,
  limit,
}: {
  category?: string;
  limit?: number;
}): Promise<{ products: Product[] }> {
    let query: FirebaseFirestore.Query = productsCollection;
    
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
    
    const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Product));

    return { products };
}

export async function getProductById(id: string): Promise<Product | null> {
    const doc = await productsCollection.doc(id).get();
    if (!doc.exists) {
        return null;
    }
    return { id: doc.id, ...doc.data() } as Product;
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
    
    try {
        const docRef = await productsCollection.add({
            ...validatedData.data,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });
        revalidatePath('/admin/products');
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error creating product:", error);
        return { success: false, message: 'Failed to create product in database.' };
    }
}

export async function updateProduct(id: string, data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const validatedData = productSchema.safeParse(data);
    if (!validatedData.success) {
        console.error("Validation failed:", validatedData.error.flatten());
        return { success: false, message: 'Invalid product data.' };
    }

    try {
        await productsCollection.doc(id).update({
            ...validatedData.data,
            updatedAt: FieldValue.serverTimestamp(),
        });

        revalidatePath('/admin/products');
        revalidatePath(`/products/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating product:", error);
        return { success: false, message: 'Product not found or failed to update.' };
    }
}

export async function deleteProduct(id: string) {
    try {
        await productsCollection.doc(id).delete();
        revalidatePath('/admin/products');
        revalidatePath('/catalog');
        return { success: true, message: 'Product deleted successfully.' };
    } catch (error) {
        console.error("Error deleting product:", error);
        return { success: false, message: 'Failed to delete product.' };
    }
}
