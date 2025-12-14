'use server';

import type { Product } from '@/lib/types';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, doc, getDoc, query, where, limit as firestoreLimit } from 'firebase/firestore';

export async function getProducts({
  category,
  limit,
}: {
  category?: string;
  limit?: number;
}): Promise<{ products: Product[] }> {
  try {
    const { firestore } = initializeFirebase();
    const productsCollection = collection(firestore, 'products');
    
    let q = query(productsCollection);

    if (category && category !== 'All') {
      q = query(q, where('category', '==', category));
    }
    
    if (limit) {
      q = query(q, firestoreLimit(limit));
    }

    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];

    return { products };
  } catch (error) {
    console.error('Failed to fetch products from Firestore:', error);
    return { products: [] };
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { firestore } = initializeFirebase();
    const productDocRef = doc(firestore, 'products', id);
    const docSnap = await getDoc(productDocRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Product;
  } catch (error) {
    console.error(`Failed to fetch product with id ${id} from Firestore:`, error);
    return null;
  }
}
