
'use server';

import type { AdminDashboardData, Design, Order, OrderItem } from '@/lib/types';
import { revalidatePath } from 'next/cache';

// MOCK DATA - In a real app, this would come from a database
let designs: Design[] = [
    { id: 'des_1', name: 'Cosmic Wolf', prompt: 'a wolf howling at a cosmic moon', product: 'Hoodie', imageUrl: 'https://picsum.photos/seed/301/400/400', status: 'Draft', createdAt: '2024-07-28T10:00:00Z', updatedAt: '2024-07-28T10:00:00Z' },
    { id: 'des_2', name: 'Sunset City', prompt: 'a vibrant sunset over a futuristic city', product: 'T-Shirt', imageUrl: 'https://picsum.photos/seed/302/400/400', status: 'Approved', createdAt: '2024-07-27T15:30:00Z', updatedAt: '2024-07-27T15:30:00Z' },
    { id: 'des_3', name: 'Abstract Geometry', prompt: 'a minimalist design with geometric shapes', product: 'Jacket', imageUrl: 'https://picsum.photos/seed/303/400/400', status: 'Rejected', createdAt: '2024-07-26T09:00:00Z', updatedAt: '2024-07-26T09:00:00Z' },
];

let orders: Order[] = [
    { id: 'ord_1', userId: 'user_1', orderNumber: 'ORD-7005', total: 8998.00, status: 'Delivered', shippingAddr: { name: 'Alice', email: 'alice@example.com', address: '123 Main St', city: 'City', state: 'State', zip: '12345', phone: '555-1234' }, createdAt: '2024-07-28T12:00:00Z', updatedAt: '2024-07-28T12:00:00Z', items: [], itemCount: 2 },
    { id: 'ord_2', userId: 'user_2', orderNumber: 'ORD-7004', total: 2499.00, status: 'Shipped', shippingAddr: { name: 'Bob', email: 'bob@example.com', address: '456 Oak Ave', city: 'City', state: 'State', zip: '12345', phone: '555-5678' }, createdAt: '2024-07-27T18:45:00Z', updatedAt: '2024-07-27T18:45:00Z', items: [], itemCount: 1 },
    { id: 'ord_3', userId: 'user_1', orderNumber: 'ORD-7003', total: 12999.00, status: 'Pending', shippingAddr: { name: 'Alice', email: 'alice@example.com', address: '123 Main St', city: 'City', state: 'State', zip: '12345', phone: '555-1234' }, createdAt: '2024-07-29T08:30:00Z', updatedAt: '2024-07-29T08:30:00Z', items: [], itemCount: 3 },
];

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  // This now uses mock data and will not fail.
  try {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'Pending').length;
    const activeUsers = 125; // Mocked value
    const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      activeUsers,
      recentOrders,
    };
  } catch (error) {
    console.error('This should not happen with mock data:', error);
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
    // Return a sorted copy of the mock orders
    return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Failed to fetch mock orders:', error);
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
       const orderIndex = orders.findIndex(o => o.id === orderId);
       if (orderIndex > -1) {
           orders[orderIndex].status = status;
           revalidatePath('/admin/orders');
           revalidatePath('/admin');
           return { success: true, message: `Order status updated to ${status}` };
       }
       return { success: false, message: 'Order not found.' };
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
    return orders.find(o => o.id === orderId);
}
