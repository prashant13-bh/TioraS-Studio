'use server';

import type { AdminDashboardData, Design, Order, OrderItem, UserProfile, VendorProfile } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { subDays, startOfDay } from 'date-fns';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { verifySession } from '@/app/actions/auth-actions';

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
    const session = await verifySession();
    if (!session || !session.isAdmin) throw new Error('Unauthorized');

    const db = getAdminFirestore();
    try {
        const [ordersSnap, usersSnap, productsSnap, pendingOrdersSnap] = await Promise.all([
            db.collection('orders').get(),
            db.collection('users').get(),
            db.collection('products').get(),
            db.collection('orders').where('status', '==', 'Pending').get()
        ]);

        const totalRevenue = ordersSnap.docs.reduce((sum: number, doc: any) => sum + (doc.data().total || 0), 0);
        const totalOrders = ordersSnap.size;
        const totalProducts = productsSnap.size;
        const pendingOrders = pendingOrdersSnap.size;
        const activeUsers = usersSnap.size;

        const lowStockCount = productsSnap.docs.filter((doc: any) => (doc.data().stock || 0) < 10).length;

        // Category Distribution
        const categoryCount: Record<string, number> = {};
        productsSnap.docs.forEach((doc: any) => {
            const cat = doc.data().category || 'Other';
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
        const categoryDistribution = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));

        const recentOrdersSnap = await db.collection('orders')
            .orderBy('createdAt', 'desc')
            .limit(5)
            .get();

        const recentOrders = recentOrdersSnap.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: typeof doc.data().createdAt === 'string' ? doc.data().createdAt : (doc.data().createdAt as Timestamp).toDate().toISOString(),
        })) as Order[];

        // Sales by day (last 7 days)
        const salesByDay = await Promise.all(Array.from({ length: 7 }, async (_, i) => {
            const date = subDays(new Date(), i);
            const start = startOfDay(date).toISOString();
            const end = new Date(startOfDay(date).getTime() + 86400000).toISOString();
            
            const snap = await db.collection('orders')
                .where('createdAt', '>=', start)
                .where('createdAt', '<', end)
                .get();
            
            return {
                name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                sales: snap.docs.reduce((sum: number, doc: any) => sum + (doc.data().total || 0), 0),
                orders: snap.size
            };
        }));

        return {
            totalRevenue,
            totalOrders,
            totalProducts,
            pendingOrders,
            activeUsers,
            lowStockCount,
            recentOrders,
            salesByDay: salesByDay.reverse(),
            categoryDistribution
        };
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        return {
            totalRevenue: 0,
            totalOrders: 0,
            totalProducts: 0,
            pendingOrders: 0,
            activeUsers: 0,
            lowStockCount: 0,
            recentOrders: [],
            salesByDay: [],
            categoryDistribution: []
        };
    }
}

export async function getAllOrders({ query }: { query?: string }): Promise<Order[]> {
    const session = await verifySession();
    if (!session || !session.isAdmin) return [];

    const db = getAdminFirestore();
    try {
        let ordersQuery: any = db.collection('orders').orderBy('createdAt', 'desc');
        const snapshot = await ordersQuery.get();
        let orders = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
        })) as Order[];

        if (query) {
            const lowQuery = query.toLowerCase();
            orders = orders.filter(o => 
                o.orderNumber?.toLowerCase().includes(lowQuery) ||
                o.shippingAddr?.name?.toLowerCase().includes(lowQuery) ||
                o.shippingAddr?.email?.toLowerCase().includes(lowQuery)
            );
        }
        return orders;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        return [];
    }
}

export async function getAllUsers(): Promise<UserProfile[]> {
    const session = await verifySession();
    if (!session || !session.isAdmin) return [];

    const db = getAdminFirestore();
    try {
        const snapshot = await db.collection('users').get();
        return snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
        })) as UserProfile[];
    } catch (error) {
        console.error('Error fetching all users:', error);
        return [];
    }
}

export async function getAllDesigns({ status }: { status?: Design['status'] | 'All' }): Promise<Design[]> {
    const session = await verifySession();
    if (!session || !session.isAdmin) return [];

    const db = getAdminFirestore();
    try {
        let collection = db.collection('designs');
        let designsQuery: any = collection.orderBy('createdAt', 'desc');
        
        if (status && status !== 'All') {
            designsQuery = designsQuery.where('status', '==', status);
        }

        const snapshot = await designsQuery.get();
        return snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
        })) as Design[];
    } catch (error) {
        console.error('Error fetching all designs:', error);
        return [];
    }
}

export async function updateDesignStatus(designId: string, userId: string, status: 'Approved' | 'Rejected') {
    const session = await verifySession();
    if (!session || !session.isAdmin) return { success: false, error: 'Unauthorized' };

    const db = getAdminFirestore();
    try {
        await db.collection('designs').doc(designId).update({
            status,
            updatedAt: new Date().toISOString()
        });
        revalidatePath('/admin/reviews');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update design status' };
    }
}

export async function updateOrderStatus(orderId: string, userId: string, status: Order['status']) {
    const session = await verifySession();
    if (!session || !session.isAdmin) return { success: false, error: 'Unauthorized' };

    const db = getAdminFirestore();
    try {
        await db.collection('orders').doc(orderId).update({
            status,
            updatedAt: new Date().toISOString()
        });
        revalidatePath('/admin/orders');
        revalidatePath(`/admin/orders/${orderId}`);
        return { success: true, message: `Order status updated to ${status}` };
    } catch (error) {
        return { success: false, error: 'Failed to update order status' };
    }
}

export async function assignOrderToVendor(orderId: string, vendorId: string) {
    const session = await verifySession();
    if (!session || !session.isAdmin) return { success: false, error: 'Unauthorized' };

    const db = getAdminFirestore();
    try {
        await db.collection('orders').doc(orderId).update({
            vendorId,
            updatedAt: new Date().toISOString(),
            fulfillmentStatus: 'assigned'
        });
        revalidatePath('/admin/orders');
        revalidatePath(`/admin/orders/${orderId}`);
        revalidatePath('/seller/orders');
        return { success: true, message: 'Vendor assigned successfully' };
    } catch (error) {
        return { success: false, error: 'Failed to assign vendor' };
    }
}

export async function grantAdminRole(userId: string) {
    const session = await verifySession();
    if (!session || !session.isAdmin) return { success: false, error: 'Unauthorized' };

    const db = getAdminFirestore();
    try {
        await db.collection('users').doc(userId).update({ isAdmin: true });
        revalidatePath('/admin/users');
        return { success: true, message: 'Admin role granted.' };
    } catch (error) {
        return { success: false, error: 'Failed to grant admin role' };
    }
}

export async function revokeAdminRole(userId: string) {
    const session = await verifySession();
    if (!session || !session.isAdmin) return { success: false, error: 'Unauthorized' };

    const db = getAdminFirestore();
    try {
        await db.collection('users').doc(userId).update({ isAdmin: false });
        revalidatePath('/admin/users');
        return { success: true, message: 'Admin role revoked.' };
    } catch (error) {
        return { success: false, error: 'Failed to revoke admin role' };
    }
}

export async function getOrderById(orderId: string): Promise<(Order & {items: OrderItem[]}) | null> {
    const session = await verifySession();
    if (!session || !session.isAdmin) return null;

    const db = getAdminFirestore();
    try {
        const orderDoc = await db.collection('orders').doc(orderId).get();
        if (!orderDoc.exists) return null;

        const itemsSnap = await orderDoc.ref.collection('orderItems').get();
        const items = itemsSnap.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        })) as OrderItem[];

        return {
            id: orderDoc.id,
            ...orderDoc.data(),
            items
        } as (Order & {items: OrderItem[]});
    } catch (error) {
        console.error('Error fetching order details:', error);
        return null;
    }
}

export async function getAllVendors(): Promise<VendorProfile[]> {
    const session = await verifySession();
    if (!session || !session.isAdmin) return [];

    const db = getAdminFirestore();
    try {
        const snapshot = await db.collection('vendors').where('status', '==', 'Active').get();
        return snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        })) as VendorProfile[];
    } catch (error) {
        console.error('Error fetching vendors:', error);
        return [];
    }
}
