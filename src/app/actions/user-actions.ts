
'use server';

import { getFirebaseAdmin } from '@/firebase/server-config';
import type { Design, Order } from '@/lib/types';
import { cookies } from 'next/headers';

async function getAuthenticatedUser() {
    const { auth } = getFirebaseAdmin();
    const sessionCookie = cookies().get('session')?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
        return decodedToken;
    } catch (error) {
        console.error('Error verifying session cookie:', error);
        return null;
    }
}

export async function getUserDashboardData() {
    const user = await getAuthenticatedUser();

    if (!user) {
        return { savedDesigns: [], orderHistory: [] };
    }

    const { firestore } = getFirebaseAdmin();
    const userId = user.uid;

    try {
        // Fetch saved designs
        const designsSnapshot = await firestore.collection('users').doc(userId).collection('designs').orderBy('createdAt', 'desc').get();
        const savedDesigns = designsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Design[];

        // Fetch order history
        const ordersSnapshot = await firestore.collection('users').doc(userId).collection('orders').orderBy('createdAt', 'desc').get();
        const orderHistory = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];

        return { savedDesigns, orderHistory };
    } catch (error) {
        console.error('Failed to fetch user dashboard data:', error);
        return { savedDesigns: [], orderHistory: [] };
    }
}
