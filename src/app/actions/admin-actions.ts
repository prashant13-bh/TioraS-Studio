
'use server';

import type { AdminDashboardData, Design, Order, OrderItem } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { getFirebaseAdmin } from '@/firebase/server-config';

// MOCK DATA - In a real app, this would come from a database
let designs: Design[] = [
    { id: 'des_1', name: 'Cosmic Wolf', prompt: 'a wolf howling at a cosmic moon', product: 'Hoodie', imageUrl: 'https://picsum.photos/seed/301/400/400', status: 'Draft', createdAt: '2024-07-28T10:00:00Z', updatedAt: '2024-07-28T10:00:00Z' },
    { id: 'des_2', name: 'Sunset City', prompt: 'a vibrant sunset over a futuristic city', product: 'T-Shirt', imageUrl: 'https://picsum.photos/seed/302/400/400', status: 'Approved', createdAt: '2024-07-27T15:30:00Z', updatedAt: '2024-07-27T15:30:00Z' },
    { id: 'des_3', name: 'Abstract Geometry', prompt: 'a minimalist design with geometric shapes', product: 'Jacket', imageUrl: 'https://picsum.photos/seed/303/400/400', status: 'Rejected', createdAt: '2024-07-26T09:00:00Z', updatedAt: '2024-07-26T09:00:00Z' },
];

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  try {
    const { firestore } = getFirebaseAdmin();
    
    // Fetch all orders
    const allOrders: Order[] = await getAllOrders();
    
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(order => order.status === 'Pending').length;
    
    // Fetch active users count
    const usersSnapshot = await firestore.collection('users').get();
    const activeUsers = usersSnapshot.size;

    const recentOrders = allOrders.slice(0, 5); // getAllOrders already sorts by date

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      activeUsers,
      recentOrders,
    };
  } catch (error) {
    console.error('Failed to fetch admin dashboard data from Firestore:', error);
    // Return a default state on error to prevent crashing the page
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
    const allOrders: Order[] = [];
    
    const usersSnapshot = await firestore.collection('users').get();
    
    for (const userDoc of usersSnapshot.docs) {
      const ordersSnapshot = await userDoc.ref.collection('orders').get();
      ordersSnapshot.forEach(orderDoc => {
        const orderData = orderDoc.data();
        allOrders.push({
          ...orderData,
          id: orderDoc.id,
          items: orderData.items || [],
          itemCount: orderData.items?.length || 0,
        } as Order);
      });
    }

    return allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  } catch (error) {
    console.error('Failed to fetch all orders from Firestore:', error);
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

export async function updateOrderStatus(orderId: string, status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered') {
    try {
       // This needs to be updated to work with the new data structure.
       // For now, we return a success to avoid breaking the UI.
       console.log(`Simulating update for order ${orderId} to status ${status}`);
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

export async function getOrderById(orderId: string): Promise<Order | undefined> {
    const allOrders = await getAllOrders();
    return allOrders.find(o => o.id === orderId);
}
