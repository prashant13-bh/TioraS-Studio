
'use server';

import type { AdminDashboardData, Design, Order, OrderItem } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { getFirebaseAdmin } from '@/firebase/server-config';
import { getProductById } from './product-actions';

// MOCK DATA - In a real app, this would come from a database
let designs: Design[] = [];


export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  try {
    const { firestore } = getFirebaseAdmin();
    const ordersCollection = firestore.collectionGroup('orders');
    
    // Efficiently get counts and totals
    const allOrdersSnapshot = await ordersCollection.orderBy('createdAt', 'desc').get();
    
    const totalOrders = allOrdersSnapshot.size;
    const totalRevenue = allOrdersSnapshot.docs.reduce((sum, doc) => sum + (doc.data().total || 0), 0);
    const pendingOrders = allOrdersSnapshot.docs.filter(doc => doc.data().status === 'Pending').length;

    const usersSnapshot = await firestore.collection('users').count().get();
    const activeUsers = usersSnapshot.data().count;

    // Get only the 5 most recent orders for the table from the already fetched snapshot
    const recentOrders = allOrdersSnapshot.docs.slice(0, 5).map(doc => {
        const data = doc.data();
        return { 
            id: doc.id,
             ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        } as Order
    });

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
    const ordersSnapshot = await firestore.collectionGroup('orders').orderBy('createdAt', 'desc').get();
    
    // Note: This fetches all orders and then maps them. For very large datasets,
    // pagination would be required on this page.
    const orders = await Promise.all(ordersSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const itemsSnapshot = await doc.ref.collection('orderItems').get();
      
      const itemsCount = itemsSnapshot.size; // Get count of items instead of fetching them all
      
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        items: [], // Return an empty array or just the count
        itemCount: itemsCount,
      } as Order;
    }));

    return orders;
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
        const { firestore } = getFirebaseAdmin();
        // This query is inefficient as it scans a collection group.
        // A better data model would be a top-level `orders` collection that includes a `userId`
        // or a direct path if the userId is known. For now, we accept the inefficiency.
        const ordersQuery = await firestore.collectionGroup('orders').get();

        let orderDoc;
        ordersQuery.forEach(doc => {
            if (doc.id === orderId) {
                orderDoc = doc;
            }
        });


        if (!orderDoc) {
            return { success: false, message: 'Order not found.' };
        }

        await orderDoc.ref.update({ status: status, updatedAt: new Date() });

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
    const { firestore } = getFirebaseAdmin();
    // This is inefficient. In a real app, you would have the full path or a better query structure.
    const ordersQuery = await firestore.collectionGroup('orders').get();
    let orderDoc;
    ordersQuery.forEach(doc => {
        if (doc.id === orderId) {
            orderDoc = doc;
        }
    });

    if (!orderDoc) {
        return undefined;
    }
    const data = orderDoc.data();

    // Fetch order items
    const itemsSnapshot = await orderDoc.ref.collection('orderItems').get();
    const items = await Promise.all(itemsSnapshot.docs.map(async (itemDoc) => {
        const itemData = itemDoc.data();
        const product = await getProductById(itemData.productId);
        return { ...itemData, id: itemDoc.id, product } as OrderItem;
    }));

    return {
      id: orderDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
      items
    } as Order;
}
