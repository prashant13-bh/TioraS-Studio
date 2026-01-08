'use server';

import { getAdminFirestore } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { AdminDashboardData, Design, Order } from '@/lib/types';
import { format, subDays } from 'date-fns';
import { verifySession } from '@/app/actions/auth-actions';

export async function fetchAdminDashboardData(): Promise<AdminDashboardData> {
  const session = await verifySession();
  if (!session || !session.isAdmin) {
    // Return empty data for unauthorized access, or throw error
    console.error('Unauthorized access to admin dashboard data');
    return {
      totalRevenue: 0,
      totalOrders: 0,
      pendingOrders: 0,
      activeUsers: 0,
      recentOrders: [],
      salesByDay: [],
    };
  }

  const db = getAdminFirestore();
  try {
    // Fetch all orders to calculate revenue and stats
    const ordersSnapshot = await db.collection('orders').get();
    const orders = ordersSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp)?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: (doc.data().updatedAt as Timestamp)?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Order));

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'Pending').length;

    // Fetch users count
    const usersSnapshot = await db.collection('users').get();
    const activeUsers = usersSnapshot.size;

    // Get recent orders
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // Mock sales chart data
    const salesByDay = Array.from({ length: 7 }, (_, i) => ({
        name: format(subDays(new Date(), i), 'MMM d'),
        total: Math.floor(Math.random() * 5000) + 1000,
    })).reverse();

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      activeUsers,
      recentOrders,
      salesByDay,
    };
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
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

export async function fetchUserDashboardData(userId: string) {
  const session = await verifySession();
  if (!session || session.uid !== userId) {
    console.error('Unauthorized access to user dashboard data');
    return { savedDesigns: [], orderHistory: [] };
  }

  const db = getAdminFirestore();
  try {
    // Fetch user's designs
    const designsSnapshot = await db.collection('users').doc(userId).collection('designs')
      .orderBy('createdAt', 'desc')
      .get();
      
    const savedDesigns = designsSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp)?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: (doc.data().updatedAt as Timestamp)?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Design));

    // Fetch user's orders
    const ordersSnapshot = await db.collection('orders')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
      
    const orderHistory = ordersSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp)?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: (doc.data().updatedAt as Timestamp)?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Order));

    return {
      savedDesigns,
      orderHistory
    };
  } catch (error) {
    console.error("Error fetching user dashboard data:", error);
    return { savedDesigns: [], orderHistory: [] };
  }
}

export async function fetchOrderById(orderId: string): Promise<Order | null> {
  const session = await verifySession();
  if (!session) return null;

  const db = getAdminFirestore();
  try {
    const orderDoc = await db.collection('orders').doc(orderId).get();

    if (orderDoc.exists) {
      const data = orderDoc.data();
      // Ensure user owns the order or is admin
      if (data?.userId !== session.uid && !session.isAdmin) {
         return null;
      }

      return { 
        id: orderDoc.id, 
        ...data,
        createdAt: (data?.createdAt as Timestamp)?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: (data?.updatedAt as Timestamp)?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as Order;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}
