'use server';

import type { Product } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  Timestamp 
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

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
    const { firestore: db } = initializeFirebase();
    let productsQuery = query(
      collection(db, 'products'),
      orderBy('createdAt', 'desc')
    );

    if (category && category !== 'All') {
      productsQuery = query(
        collection(db, 'products'),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
    }

    if (limit) {
      productsQuery = query(productsQuery, firestoreLimit(limit));
    }

    const snapshot = await getDocs(productsQuery);
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    })) as Product[];

    return { products };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [] };
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { firestore: db } = initializeFirebase();
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      return null;
    }

    return {
      id: productSnap.id,
      ...productSnap.data(),
      createdAt: productSnap.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: productSnap.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const validation = productSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message };
    }

    const { firestore: db } = initializeFirebase();
    const productData = {
      ...data,
      stock: data.stock || 0,
      sku: data.sku || `SKU-${Date.now()}`,
      isNew: data.isNew ?? true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'products'), productData);
    
    revalidatePath('/admin/products');
    revalidatePath('/catalog');
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: 'Failed to create product' };
  }
}

export async function updateProduct(id: string, data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const validation = productSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message };
    }

    const { firestore: db } = initializeFirebase();
    const productRef = doc(db, 'products', id);
    
    await updateDoc(productRef, {
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
  try {
    const { firestore: db } = initializeFirebase();
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
    
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
    const { firestore: db } = initializeFirebase();
    const snapshot = await getDocs(collection(db, 'products'));
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
  try {
    const { firestore: db } = initializeFirebase();
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
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
