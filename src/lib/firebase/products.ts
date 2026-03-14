import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { getSdks } from '@/firebase/index';
import type { Product } from '@/lib/types';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import { getFirestore } from 'firebase/firestore';

// Helper to reliably get firestore on server or client
const getDb = () => {
    const apps = getApps();
    const app = apps.length ? apps[0] : initializeApp(firebaseConfig);
    return getFirestore(app);
};

const PRODUCTS_COLLECTION = 'products';

export async function getProducts(): Promise<Product[]> {
  try {
    const db = getDb();
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const db = getDb();
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

export async function getFeaturedProducts(amount: number = 4): Promise<Product[]> {
    try {
      const db = getDb();
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const q = query(productsRef, where('isNew', '==', true), limit(amount));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
}
