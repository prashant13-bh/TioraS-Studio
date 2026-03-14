import { collection, doc, setDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import { getFirestore } from 'firebase/firestore';
import type { Design } from '@/lib/types';

const getDb = () => {
    const apps = getApps();
    const app = apps.length ? apps[0] : initializeApp(firebaseConfig);
    return getFirestore(app);
};

const DESIGNS_COLLECTION = 'designs';

export async function saveUserDesign(
  userId: string, 
  name: string, 
  prompt: string, 
  product: string, 
  imageUrl: string
): Promise<{ success: boolean; id?: string; error?: any }> {
  try {
    const db = getDb();
    const newDesignRef = doc(collection(db, DESIGNS_COLLECTION));
    
    const designPayload: Partial<Design> = {
      id: newDesignRef.id,
      userId,
      name,
      prompt,
      product,
      imageUrl,
      status: 'Draft',
      createdAt: new Date().toISOString(), // Fallback for strict TS
      updatedAt: new Date().toISOString(),
    };

    // Use serverTimestamp for actual DB write
    await setDoc(newDesignRef, {
        ...designPayload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    
    return { success: true, id: newDesignRef.id };
  } catch (error) {
    console.error('Error saving user design:', error);
    return { success: false, error };
  }
}

export async function getUserDesigns(userId: string): Promise<Design[]> {
    try {
        const db = getDb();
        const designsRef = collection(db, DESIGNS_COLLECTION);
        const q = query(
            designsRef, 
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                // Ensure dates are strings for UI
                createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            }
        }) as Design[];
    } catch (error) {
        console.error('Error fetching user designs:', error);
        return [];
    }
}
