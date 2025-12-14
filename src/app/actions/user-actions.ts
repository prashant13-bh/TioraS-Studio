
'use server';

import { getFirebaseAdmin } from '@/firebase/server-config';
import type { Design, Order } from '@/lib/types';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth/server-auth';


export async function getUserDashboardData() {
    const user = await getCurrentUser();
    if (!user) {
        // This should be handled by the page, which will redirect.
        return { savedDesigns: [], orderHistory: [] };
    }

    try {
        const { firestore } = getFirebaseAdmin();
        const designsPromise = firestore.collection(`users/${user.uid}/designs`).orderBy('createdAt', 'desc').get();
        const ordersPromise = firestore.collection(`users/${user.uid}/orders`).orderBy('createdAt', 'desc').get();

        const [designsSnapshot, ordersSnapshot] = await Promise.all([designsPromise, ordersPromise]);

        const savedDesigns: Design[] = designsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Design));

        const orderHistory: Order[] = ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Order));

        return { savedDesigns, orderHistory };
    } catch (error) {
        console.error("Failed to fetch user dashboard data:", error);
        // Return empty arrays in case of a database error to prevent page crash
        return { savedDesigns: [], orderHistory: [] };
    }
}
