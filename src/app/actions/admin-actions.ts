
'use server';

import type { AdminDashboardData, Design, Order, OrderItem, UserProfile } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { subDays, format, startOfDay } from 'date-fns';
import { getFirebaseAdmin } from '@/firebase/server-config';
import { FieldValue } from 'firebase-admin/firestore';

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
    const admin = getFirebaseAdmin();
    const db = admin.firestore;

    const ordersSnapshot = await db.collectionGroup('orders').get();
    const usersSnapshot = await db.collection('users').get();

    const totalRevenue = ordersSnapshot.docs.reduce((sum, doc) => sum + (doc.data().total || 0), 0);
    const totalOrders = ordersSnapshot.size;
    const pendingOrders = ordersSnapshot.docs.filter(doc => doc.data().status === 'Pending').length;
    const activeUsers = usersSnapshot.size;

    const recentOrdersQuery = db.collectionGroup('orders').orderBy('createdAt', 'desc').limit(5);
    const recentOrdersSnapshot = await recentOrdersQuery.get();
    const recentOrders: Order[] = recentOrdersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));

    const sevenDaysAgo = startOfDay(subDays(new Date(), 6));
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i));
    const salesByDay = last7Days.map(day => ({
        name: format(day, 'MMM d'),
        total: 0,
    })).reverse();
    
    const recentOrdersForChart = await db.collectionGroup('orders').where('createdAt', '>=', sevenDaysAgo.toISOString()).get();
    recentOrdersForChart.forEach(doc => {
        const order = doc.data() as Order;
        const orderDate = new Date(order.createdAt);
        const dayStr = format(orderDate, 'MMM d');
        const dayData = salesByDay.find(d => d.name === dayStr);
        if (dayData) {
            dayData.total += order.total;
        }
    });
    

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      activeUsers,
      recentOrders,
      salesByDay,
    };
}


export async function getAllOrders({ query }: { query?: string }): Promise<Order[]> {
    const admin = getFirebaseAdmin();
    const db = admin.firestore;
    
    const ordersSnapshot = await db.collectionGroup('orders').orderBy('createdAt', 'desc').get();
    const orders = ordersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Order);

    if (query) {
        const lowercasedQuery = query.toLowerCase();
        return orders.filter(order => 
            order.shippingAddr.name.toLowerCase().includes(lowercasedQuery) ||
            order.shippingAddr.email.toLowerCase().includes(lowercasedQuery) ||
            order.orderNumber.toLowerCase().includes(lowercasedQuery)
        );
    }
    return orders;
}

export async function getAllUsers(): Promise<UserProfile[]> {
    const admin = getFirebaseAdmin();
    const db = admin.firestore;

    const usersSnapshot = await db.collection('users').get();
    const adminRolesSnapshot = await db.collection('roles_admin').get();
    const adminIds = new Set(adminRolesSnapshot.docs.map(doc => doc.id));

    const users: UserProfile[] = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            displayName: data.displayName || null,
            email: data.email || null,
            photoURL: data.photoURL || null,
            createdAt: data.createdAt,
            isAdmin: adminIds.has(doc.id),
        };
    });
    
    return users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAllDesigns({ status }: { status?: Design['status'] | 'All' }): Promise<Design[]> {
    const admin = getFirebaseAdmin();
    const db = admin.firestore;

    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = db.collectionGroup('designs').orderBy('createdAt', 'desc');

    if (status && status !== 'All') {
        query = query.where('status', '==', status);
    }

    const designsSnapshot = await query.get();
    return designsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Design);
}


export async function updateDesignStatus(designId: string, userId: string, status: 'Approved' | 'Rejected') {
    if (!userId || !designId) return { success: false, message: 'User ID and Design ID are required.' };
    
    const admin = getFirebaseAdmin();
    const db = admin.firestore;
    const designRef = db.collection('users').doc(userId).collection('designs').doc(designId);

    try {
        await designRef.update({ status: status, updatedAt: FieldValue.serverTimestamp() });
        revalidatePath('/admin/reviews');
        return { success: true };
    } catch (error) {
        console.error("Error updating design status:", error);
        return { success: false, message: 'Failed to update design status.' };
    }
}


export async function updateOrderStatus(orderId: string, userId: string, status: Order['status']) {
    if (!userId || !orderId) return { success: false, message: 'User ID and Order ID are required.' };
    
    const admin = getFirebaseAdmin();
    const db = admin.firestore;
    const orderRef = db.collection('users').doc(userId).collection('orders').doc(orderId);

    try {
        await orderRef.update({ status, updatedAt: FieldValue.serverTimestamp() });
        revalidatePath('/admin/orders');
        revalidatePath(`/admin/orders/${orderId}`);
        revalidatePath('/admin');
        return { success: true, message: `Order status updated to ${status}` };
    } catch (error) {
         console.error("Error updating order status:", error);
        return { success: false, message: 'Order not found or failed to update.' };
    }
}


export async function grantAdminRole(userId: string) {
    const admin = getFirebaseAdmin();
    const db = admin.firestore;
    const roleRef = db.collection('roles_admin').doc(userId);

    try {
        await roleRef.set({ isAdmin: true });
        revalidatePath('/admin/users');
        return { success: true, message: 'Admin role granted.' };
    } catch (error) {
        console.error("Error granting admin role:", error);
        return { success: false, message: 'Failed to grant admin role.' };
    }
}


export async function revokeAdminRole(userId: string) {
     const admin = getFirebaseAdmin();
    const db = admin.firestore;
    const roleRef = db.collection('roles_admin').doc(userId);

    try {
        await roleRef.delete();
        revalidatePath('/admin/users');
        return { success: true, message: 'Admin role revoked.' };
    } catch (error) {
        console.error("Error revoking admin role:", error);
        return { success: false, message: 'Failed to revoke admin role.' };
    }
}


export async function getOrderById(orderId: string, userId: string): Promise<(Order & {items: OrderItem[]}) | null> {
    if (!userId || !orderId) return null;

    const admin = getFirebaseAdmin();
    const db = admin.firestore;

    const orderRef = db.collection('users').doc(userId).collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) return null;

    const itemsSnapshot = await orderRef.collection('orderItems').get();
    const items: OrderItem[] = itemsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as OrderItem));
    
    return { ...orderDoc.data(), id: orderDoc.id, items } as Order & {items: OrderItem[]};
}

// These are not used by the admin panel but are needed for other parts of the app.
// I will connect them to Firestore in a subsequent step.
export async function addDesign(design: Design) {
   // To be implemented
}

export async function addOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) {
    // To be implemented
    const newOrder: Order = {
        ...order,
        id: `ord_${Date.now()}`,
        orderNumber: `ORD-MOCK`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    return newOrder;
}
