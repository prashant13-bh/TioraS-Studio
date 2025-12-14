
'use server';

import { getFirebaseAdmin } from '@/firebase/server-config';
import type { AdminDashboardData, Design, Order, OrderItem, UserProfile } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { customAlphabet } from 'nanoid';

// MOCK DATA - In a real app, this would come from a database
let designs: Design[] = [
    { id: 'des_1', name: 'Cosmic Wolf', prompt: 'a wolf howling at a cosmic moon', product: 'Hoodie', imageUrl: 'https://picsum.photos/seed/301/400/400', status: 'Draft', createdAt: '2024-07-28T10:00:00Z', updatedAt: '2024-07-28T10:00:00Z', userId: 'user1' },
    { id: 'des_2', name: 'Sunset City', prompt: 'a vibrant sunset over a futuristic city', product: 'T-Shirt', imageUrl: 'https://picsum.photos/seed/302/400/400', status: 'Approved', createdAt: '2024-07-27T15:30:00Z', updatedAt: '2024-07-27T15:30:00Z', userId: 'user2' },
    { id: 'des_3', name: 'Abstract Geometry', prompt: 'a minimalist design with geometric shapes', product: 'Jacket', imageUrl: 'https://picsum.photos/seed/303/400/400', status: 'Rejected', createdAt: '2024-07-26T09:00:00Z', updatedAt: '2024-07-26T09:00:00Z', userId: 'user1' },
];


export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  try {
    const { firestore } = getFirebaseAdmin();
    const allOrders = await getAllOrders(); // Reuse the optimized function

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

    const recentOrders = allOrders.slice(0, 5); // Already sorted by getAllOrders

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      activeUsers,
      recentOrders,
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
        // Ensure itemCount is present, default to 0 if not on document
        itemCount: data.items?.length || 0, 
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

        if (usersSnapshot.empty) {
            return [];
        }
        
        const users: UserProfile[] = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
            } as UserProfile;
        });

        return users;
    } catch (error) {
        console.error('Failed to fetch all users from Firestore:', error);
        return [];
    }
}


export async function getAllDesigns(): Promise<Design[]> {
    try {
        return [...designs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
        console.error('Failed to fetch designs:', error);
        return [];
    }
}


export async function updateDesignStatus(designId: string, status: 'Approved' | 'Rejected') {
    try {
        const designIndex = designs.findIndex(d => d.id === designId);
        if (designIndex > -1) {
            designs[designIndex].status = status;
            revalidatePath('/admin/reviews');
            return { success: true };
        }
        return { success: false, message: 'Design not found.' };
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
        revalidatePath('/admin');
        return { success: true, message: `Order status updated to ${status}` };
    } catch (error) {
        console.error(`Failed to update order ${orderId} status:`, error);
        return { success: false, message: 'Database update failed.' };
    }
}


// These functions are added to simulate the database
export async function addDesign(design: Design) {
    designs.push(design);
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
    // orders.push(newOrder); // This was for mock data
    return newOrder;
}

export async function getOrderById(orderId: string, userId: string): Promise<Order | undefined> {
    try {
        const { firestore } = getFirebaseAdmin();
        const orderDoc = await firestore.collection('users').doc(userId).collection('orders').doc(orderId).get();
        if (!orderDoc.exists) {
            return undefined;
        }
        return { id: orderDoc.id, ...orderDoc.data() } as Order;
    } catch (error) {
        console.error('Failed to get order by id:', error);
        return undefined;
    }
}
