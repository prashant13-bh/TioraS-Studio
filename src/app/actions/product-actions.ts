'use server';

import type { Product } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { verifySession } from '@/app/actions/auth-actions';

// Validation schemas
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
  isNew: z.boolean().optional(),
  stock: z.coerce.number().min(0).optional(),
  sku: z.string().optional(),
});

export async function getProducts({
  category,
  limit,
}: {
  category?: string;
  limit?: number;
}): Promise<{ products: Product[] }> {
  try {
    const db = getAdminFirestore();
    let productsQuery = db.collection('products').orderBy('createdAt', 'desc');

    if (category && category !== 'All') {
      productsQuery = productsQuery.where('category', '==', category);
    }

    if (limit) {
      productsQuery = productsQuery.limit(limit);
    }

    const snapshot = await productsQuery.get();
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp)?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: (doc.data().updatedAt as Timestamp)?.toDate?.()?.toISOString() || new Date().toISOString(),
    })) as Product[];

    return { products };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [] };
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const db = getAdminFirestore();
    const productDoc = await db.collection('products').doc(id).get();
    
    if (!productDoc.exists) {
      return null;
    }

    const data = productDoc.data();
    return {
      id: productDoc.id,
      ...data,
      createdAt: (data?.createdAt as Timestamp)?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: (data?.updatedAt as Timestamp)?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  const session = await verifySession();
  if (!session || !session.isAdmin) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const validation = productSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message };
    }

    const db = getAdminFirestore();
    const productData = {
      ...data,
      stock: data.stock || 0,
      sku: data.sku || `SKU-${Date.now()}`,
      isNew: data.isNew ?? true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await db.collection('products').add(productData);
    
    revalidatePath('/admin/products');
    revalidatePath('/catalog');
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: 'Failed to create product' };
  }
}

export async function updateProduct(id: string, data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  const session = await verifySession();
  if (!session || !session.isAdmin) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const validation = productSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message };
    }

    const db = getAdminFirestore();
    await db.collection('products').doc(id).update({
      ...data,
      updatedAt: Timestamp.now(),
    });
    
    revalidatePath('/admin/products');
    revalidatePath(`/products/${id}`);
    revalidatePath('/catalog');
    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: 'Failed to update product' };
  }
}

export async function deleteProduct(id: string) {
  const session = await verifySession();
  if (!session || !session.isAdmin) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const db = getAdminFirestore();
    await db.collection('products').doc(id).delete();
    
    revalidatePath('/admin/products');
    revalidatePath('/catalog');
    return { success: true, message: 'Product deleted successfully.' };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}

// Get product categories
export async function getCategories(): Promise<string[]> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection('products').get();
    const categories = new Set<string>();
    snapshot.docs.forEach(doc => {
      const category = doc.data().category;
      if (category) categories.add(category);
    });
    return Array.from(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Update stock
export async function updateProductStock(productId: string, newStock: number) {
  const session = await verifySession();
  if (!session || !session.isAdmin) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const db = getAdminFirestore();
    await db.collection('products').doc(productId).update({
      stock: newStock,
      updatedAt: Timestamp.now(),
    });
    
    revalidatePath('/admin/products');
    revalidatePath('/admin/inventory');
    return { success: true };
  } catch (error) {
    console.error('Error updating stock:', error);
    return { success: false, error: 'Failed to update stock' };
  }
}


