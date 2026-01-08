import { initializeFirebase } from '@/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import type { AdminDashboardData, Design, Order, UserProfile } from '@/lib/types';
import { format, subDays } from 'date-fns';

// Remove top-level initialization
// const { firestore: db } = initializeFirebase();

export async function fetchAdminDashboardData(): Promise<AdminDashboardData> {
  const { firestore: db } = initializeFirebase();
  try {
    // Fetch all orders to calculate revenue and stats
    // In a production app, use aggregation queries or Cloud Functions
    const ordersRef = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersRef);
    const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'Pending').length;

    // Fetch users count
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const activeUsers = usersSnapshot.size;

    // Get recent orders (already have all orders, just sort and slice)
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // Mock sales chart data for now as it requires complex aggregation
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
    // Return empty/default data on error to prevent crash
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
  const { firestore: db } = initializeFirebase();
  try {
    // Fetch user's designs
    const designsRef = collection(db, 'users', userId, 'designs');
    const designsQuery = query(designsRef, orderBy('createdAt', 'desc'));
    const designsSnapshot = await getDocs(designsQuery);
    const savedDesigns = designsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Design));

    // Fetch user's orders
    const ordersRef = collection(db, 'orders');
    const ordersQuery = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const ordersSnapshot = await getDocs(ordersQuery);
    const orderHistory = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));

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
  const { firestore: db } = initializeFirebase();
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);

    if (orderSnap.exists()) {
      return { id: orderSnap.id, ...orderSnap.data() } as Order;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}
