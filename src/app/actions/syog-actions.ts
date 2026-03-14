'use server';

import { getAdminFirestore } from '@/lib/firebase-admin';
import { verifySession } from '@/app/actions/auth-actions';

export async function submitSyogRequestAction(data: any) {
    const session = await verifySession();
    if (!session) {
        return { success: false, message: 'You must be logged in.' };
    }

    const db = getAdminFirestore();

    try {
        const syogRef = db.collection('syog_requests').doc();
        
        await syogRef.set({
            id: syogRef.id,
            userId: session.uid,
            ...data,
            status: 'pending_vendor_match',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // Optionally immediately push this into the user's order history as a special type of order
        const orderRef = db.collection('orders').doc();
        await orderRef.set({
            id: orderRef.id,
            userId: session.uid,
            orderNumber: `SYC-${Math.floor(1000 + Math.random() * 9000)}`,
            total: 0, // Pending quote
            status: 'Pending',
            isSyog: true,
            syogRequestId: syogRef.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            shippingAddr: {
                 name: 'Pending Match',
                 address: 'Awaiting Vendor Assignment',
                 city: '', state: '', zip: '', phone: '', email: ''
            }
        });

        return { success: true, message: 'Request submitted successfully.' };
    } catch (error: any) {
        console.error("Failed to submit SYOG request", error);
        return { success: false, message: error.message || 'Internal server error.' };
    }
}
