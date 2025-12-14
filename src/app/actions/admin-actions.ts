
'use server';

import { getFirebaseAdmin } from '@/firebase/server-config';
import type { AdminDashboardData, Design, Order, OrderItem, UserProfile } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { customAlphabet } from 'nanoid';
import { subDays, format, startOfDay } from 'date-fns';
import type { firestore as admin } from 'firebase-admin';

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  try {
    const { firestore } = getFirebaseAdmin();
    
    // Fetch all orders using a collection group query
    const ordersSnapshot = await firestore.collectionGroup('orders').get();
    const allOrders: Order[] = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));

    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(order => order.status === 'Pending').length;

    let activeUsers = 0;
    try {
        const usersSnapshot = await firestore.collection('users').get();
        activeUsers = usersSnapshot.size;
    } catch (userError) {
        console.warn("Could not fetch users, displaying 0 active users.", userError);
        // If users collection doesn't exist or there's an error, we default to 0
    }

    // Sort orders by creation date to get the most recent ones
    const recentOrders = allOrders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    // Calculate sales data for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i));
    const salesByDay = last7Days.map(day => ({
        name: format(day, 'MMM d'),
        total: 0,
    })).reverse();

    const sevenDaysAgo = startOfDay(subDays(new Date(), 6));

    allOrders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        if (orderDate >= sevenDaysAgo) {
            const dayStr = format(orderDate, 'MMM d');
            const dayData = salesByDay.find(d => d.name === dayStr);
            if (dayData) {
                dayData.total += order.total;
            }
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
  } catch (error) {
    console.error('Failed to fetch admin dashboard data from Firestore:', error);
    // Return a default state in case of error
    return {
      totalRevenue: 0,
      totalOrders: 0,
      pendingOrders: 0,
      activeUsers: 0,
      recentOrders: [],
      salesByDay: [],
    };
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const { firestore } = getFirebaseAdmin();
    const ordersSnapshot = await firestore.collectionGroup('orders').orderBy('createdAt', 'desc').get();
    
    if (ordersSnapshot.empty) {
      return [];
    }

    const allOrders: Order[] = ordersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        itemCount: data.itemCount || (data.items ? data.items.length : 0),
      } as Order;
    });

    return allOrders;
  } catch (error) {
    console.error('Failed to fetch all orders from Firestore:', error);
    return [];
  }
}

export async function getAllUsers(): Promise<UserProfile[]> {
    try {
        const { firestore } = getFirebaseAdmin();
        const usersSnapshot = await firestore.collection('users').orderBy('createdAt', 'desc').get();
        const adminRolesSnapshot = await firestore.collection('roles_admin').get();
        const adminIds = new Set(adminRolesSnapshot.docs.map(doc => doc.id));

        if (usersSnapshot.empty) {
            return [];
        }
        
        const users: UserProfile[] = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                isAdmin: adminIds.has(doc.id),
            } as UserProfile;
        });

        return users;
    } catch (error) {
        console.error('Failed to fetch all users from Firestore:', error);
        return [];
    }
}


export async function getAllDesigns({ status }: { status?: Design['status'] | 'All' }): Promise<Design[]> {
    try {
        const { firestore } = getFirebaseAdmin();
        const designsSnapshot = await firestore.collectionGroup('designs').orderBy('createdAt', 'desc').get();

        if (designsSnapshot.empty) {
            return [];
        }

        let designs: Design[] = designsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Design));

        if (status && status !== 'All') {
            designs = designs.filter(design => design.status === status);
        }

        return designs;

    } catch (error) {
        console.error('Failed to fetch designs from Firestore:', error);
        return [];
    }
}


export async function updateDesignStatus(designId: string, userId: string, status: 'Approved' | 'Rejected') {
    try {
        const { firestore } = getFirebaseAdmin();
        const designRef = firestore.collection('users').doc(userId).collection('designs').doc(designId);

        await designRef.update({ status: status, updatedAt: new Date().toISOString() });

        revalidatePath('/admin/reviews');
        return { success: true };
    } catch (error) {
        console.error(`Failed to update design ${designId} status:`, error);
        return { success: false, message: 'Database update failed.' };
    }
}

export async function updateOrderStatus(orderId: string, userId: string, status: Order['status']) {
    try {
        const { firestore } = getFirebaseAdmin();
        const orderRef = firestore.collection('users').doc(userId).collection('orders').doc(orderId);

        await orderRef.update({ status: status });

        revalidatePath('/admin/orders');
        revalidatePath(`/admin/orders/${orderId}`);
        revalidatePath('/admin');
        return { success: true, message: `Order status updated to ${status}` };
    } catch (error) {
        console.error(`Failed to update order ${orderId} status:`, error);
        return { success: false, message: 'Database update failed.' };
    }
}


export async function grantAdminRole(userId: string) {
    try {
        const { firestore } = getFirebaseAdmin();
        await firestore.collection('roles_admin').doc(userId).set({ isAdmin: true });
        revalidatePath('/admin/users');
        return { success: true, message: 'Admin role granted.' };
    } catch (error) {
        console.error(`Failed to grant admin role to ${userId}:`, error);
        return { success: false, message: 'Failed to grant admin role.' };
    }
}

export async function revokeAdminRole(userId: string) {
    try {
        const { firestore } = getFirebaseAdmin();
        await firestore.collection('roles_admin').doc(userId).delete();
        revalidatePath('/admin/users');
        return { success: true, message: 'Admin role revoked.' };
    } catch (error) {
        console.error(`Failed to revoke admin role for ${userId}:`, error);
        return { success: false, message: 'Failed to revoke admin role.' };
    }
}

// These functions are added to simulate the database
export async function addDesign(design: Design) {
    // This is a mock function and should be replaced with Firestore logic
}

const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

export async function addOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const newOrder: Order = {
        ...order,
        id: `ord_${Date.now()}`,
        orderNumber: `ORD-${nanoid()}`,
        createdAt: now,
        updatedAt: now,
    };
    // This was for mock data, should be implemented with Firestore
    return newOrder;
}

export async function getOrderById(orderId: string, userId: string): Promise<(Order & {items: OrderItem[]}) | null> {
    try {
        const { firestore } = getFirebaseAdmin();
        const orderRef = firestore.collection('users').doc(userId).collection('orders').doc(orderId);
        
        const orderDoc = await orderRef.get();

        if (!orderDoc.exists) {
            return null;
        }

        const itemsSnapshot = await orderRef.collection('orderItems').get();
        const items: OrderItem[] = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrderItem));

        return {
            id: orderDoc.id,
            ...(orderDoc.data() as Omit<Order, 'id'>),
            items,
        };

    } catch (error) {
        console.error('Failed to get order by id:', error);
        return null;
    }
}
