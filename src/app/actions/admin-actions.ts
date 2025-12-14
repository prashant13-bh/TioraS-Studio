
'use server';

import type { AdminDashboardData, Design, Order, OrderItem } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { customAlphabet } from 'nanoid';

// MOCK DATA - In a real app, this would come from a database
let designs: Design[] = [
    { id: 'des_1', name: 'Cosmic Wolf', prompt: 'a wolf howling at a cosmic moon', product: 'Hoodie', imageUrl: 'https://picsum.photos/seed/301/400/400', status: 'Draft', createdAt: '2024-07-28T10:00:00Z', updatedAt: '2024-07-28T10:00:00Z' },
    { id: 'des_2', name: 'Sunset City', prompt: 'a vibrant sunset over a futuristic city', product: 'T-Shirt', imageUrl: 'https://picsum.photos/seed/302/400/400', status: 'Approved', createdAt: '2024-07-27T15:30:00Z', updatedAt: '2024-07-27T15:30:00Z' },
    { id: 'des_3', name: 'Abstract Geometry', prompt: 'a minimalist design with geometric shapes', product: 'Jacket', imageUrl: 'https://picsum.photos/seed/303/400/400', status: 'Rejected', createdAt: '2024-07-26T09:00:00Z', updatedAt: '2024-07-26T09:00:00Z' },
];

let orders: Order[] = [
    { id: 'ord_7001', userId: 'user_1', orderNumber: 'ORD-7001', total: 12999.00, status: 'Delivered', shippingAddr: { name: 'Alice Johnson', email: 'alice@example.com', address: '123 Tech Avenue', city: 'Deville', state: 'CA', zip: '90210', phone: '111-222-3333'}, createdAt: '2024-07-28T10:00:00Z', updatedAt: '2024-07-28T10:00:00Z', items: [], itemCount: 1 },
    { id: 'ord_7002', userId: 'user_2', orderNumber: 'ORD-7002', total: 6999.00, status: 'Shipped', shippingAddr: { name: 'Bob Williams', email: 'bob@example.com', address: '456 Code Lane', city: 'Binary Beach', state: 'FL', zip: '33101', phone: '444-555-6666'}, createdAt: '2024-07-29T11:30:00Z', updatedAt: '2024-07-29T11:30:00Z', items: [], itemCount: 1 },
    { id: 'ord_7003', userId: 'user_1', orderNumber: 'ORD-7003', total: 2499.00, status: 'Processing', shippingAddr: { name: 'Alice Johnson', email: 'alice@example.com', address: '123 Tech Avenue', city: 'Deville', state: 'CA', zip: '90210', phone: '111-222-3333'}, createdAt: '2024-07-30T14:00:00Z', updatedAt: '2024-07-30T14:00:00Z', items: [], itemCount: 1 },
    { id: 'ord_7004', userId: 'user_3', orderNumber: 'ORD-7004', total: 1999.00, status: 'Pending', shippingAddr: { name: 'Charlie Brown', email: 'charlie@example.com', address: '789 Logic Blvd', city: 'Data Point', state: 'TX', zip: '75001', phone: '777-888-9999'}, createdAt: '2024-07-31T09:00:00Z', updatedAt: '2024-07-31T09:00:00Z', items: [], itemCount: 1 },
    { id: 'ord_7005', userId: 'user_2', orderNumber: 'ORD-7005', total: 8998.00, status: 'Pending', shippingAddr: { name: 'Bob Williams', email: 'bob@example.com', address: '456 Code Lane', city: 'Binary Beach', state: 'FL', zip: '33101', phone: '444-555-6666'}, createdAt: '2024-07-31T16:20:00Z', updatedAt: '2024-07-31T16:20:00Z', items: [], itemCount: 2 },
];


export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  try {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'Pending').length;
    
    // Using a Set to count unique userIds
    const activeUsers = new Set(orders.map(order => order.userId)).size;

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      activeUsers,
      recentOrders,
    };
  } catch (error) {
    console.error('Failed to fetch admin dashboard data from mock data:', error);
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
    return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Failed to fetch all orders from mock data:', error);
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
    orders.push(newOrder);
    return newOrder;
}

export async function getOrderById(orderId: string): Promise<Order | undefined> {
    return orders.find(o => o.id === orderId);
}
