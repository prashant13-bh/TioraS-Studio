
'use server';

import type { Product } from '@/lib/types';
import { getFirebaseAdmin } from '@/firebase/server-config';

export async function getProducts({
  category,
  limit,
}: {
  category?: string;
  limit?: number;
}): Promise<{ products: Product[] }> {
  try {
    const { firestore } = getFirebaseAdmin();
    let query: admin.firestore.Query = firestore.collection('products');

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
             // Firestore might not store arrays correctly if they were not arrays originally
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
