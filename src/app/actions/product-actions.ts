
'use server';

import type { Product } from '@/lib/types';
import { getFirebaseAdmin } from '@/firebase/server-config';
import { collection, getDocs, doc, getDoc, query, where, limit as firestoreLimit } from 'firebase-admin/firestore';

export async function getProducts({
  category,
  limit,
}: {
  category?: string;
  limit?: number;
}): Promise<{ products: Product[] }> {
  try {
    const { firestore } = await getFirebaseAdmin();
    const productsCollection = firestore.collection('products');
    
    let q: FirebaseFirestore.Query = productsCollection;

    if (category && category !== 'All') {
      q = q.where('category', '==', category);
    }
    
    if (limit) {
      q = q.limit(limit);
    }

    const querySnapshot = await q.get();
    const products = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Firebase Admin SDK returns timestamps, so we need to convert them.
        // This is a simplified conversion. For production, you might want more robust handling.
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
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
    const { firestore } = await getFirebaseAdmin();
    const productDocRef = firestore.doc(`products/${id}`);
    const docSnap = await productDocRef.get();

    if (!docSnap.exists) {
      return null;
    }
    
    const data = docSnap.data();

    if (!data) {
        return null;
    }

    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
    } as Product;
  } catch (error) {
    console.error(`Failed to fetch product with id ${id} from Firestore:`, error);
    return null;
  }
}
