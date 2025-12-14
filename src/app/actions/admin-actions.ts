
'use server';

import type { AdminDashboardData, Design, Order, OrderItem, UserProfile } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { customAlphabet } from 'nanoid';
import { subDays, format, startOfDay } from 'date-fns';
import { getMockDashboardData } from '@/lib/mock-data';

// MOCK DATA IMPLEMENTATION
let mockOrders: Order[] = [
    { id: 'ord_1', userId: 'user_1', orderNumber: 'ORD-7005', total: 8998.00, status: 'Delivered', itemCount: 2, shippingAddr: { name: 'Jane Doe', email: 'jane@example.com', address: '456 Park Ave', city: 'Delhi', state: 'Delhi', zip: '110001', phone: '9876543210' }, createdAt: subDays(new Date(), 2).toISOString(), updatedAt: subDays(new Date(), 2).toISOString() },
    { id: 'ord_2', userId: 'user_2', orderNumber: 'ORD-7004', total: 4999.00, status: 'Shipped', itemCount: 1, shippingAddr: { name: 'John Smith', email: 'john@example.com', address: '789 Broadway', city: 'Mumbai', state: 'Maharashtra', zip: '400001', phone: '9876543210' }, createdAt: subDays(new Date(), 5).toISOString(), updatedAt: subDays(new Date(), 3).toISOString() },
    { id: 'ord_3', userId: 'user_1', orderNumber: 'ORD-7003', total: 2499.00, status: 'Pending', itemCount: 1, shippingAddr: { name: 'Jane Doe', email: 'jane@example.com', address: '456 Park Ave', city: 'Delhi', state: 'Delhi', zip: '110001', phone: '9876543210' }, createdAt: subDays(new Date(), 1).toISOString(), updatedAt: subDays(new Date(), 1).toISOString() },
];
let mockUsers: UserProfile[] = [
    { id: 'user_1', displayName: 'Jane Doe', email: 'jane@example.com', photoURL: 'https://i.pravatar.cc/150?u=jane', createdAt: new Date().toISOString(), isAdmin: true },
    { id: 'user_2', displayName: 'John Smith', email: 'john@example.com', photoURL: 'https://i.pravatar.cc/150?u=john', createdAt: new Date().toISOString(), isAdmin: false },
];
let mockDesigns: Design[] = [
    { id: 'des_1', userId: 'user_1', name: 'Cosmic Wolf', product: 'Hoodie', imageUrl: 'https://picsum.photos/seed/301/400/400', status: 'Approved', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), prompt: 'a cosmic wolf howling' },
    { id: 'des_2', userId: 'user_2', name: 'Sunset City', product: 'T-Shirt', imageUrl: 'https://picsum.photos/seed/302/400/400', status: 'Rejected', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), prompt: 'a vibrant sunset over a city' },
    { id: 'des_3', userId: 'user_2', name: 'Geometry', product: 'Jacket', imageUrl: 'https://picsum.photos/seed/303/400/400', status: 'Draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), prompt: 'abstract geometric patterns' },
];


export async function getAdminDashboardData(): Promise<AdminDashboardData> {
    const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = mockOrders.length;
    const pendingOrders = mockOrders.filter(order => order.status === 'Pending').length;
    const activeUsers = mockUsers.length;

    const recentOrders = [...mockOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i));
    const salesByDay = last7Days.map(day => ({
        name: format(day, 'MMM d'),
        total: 0,
    })).reverse();

     const sevenDaysAgo = startOfDay(subDays(new Date(), 6));

    mockOrders.forEach(order => {
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
}

export async function getAllOrders({ query }: { query?: string }): Promise<Order[]> {
  if (query) {
    const lowercasedQuery = query.toLowerCase();
    return mockOrders.filter(order => 
        order.shippingAddr.name.toLowerCase().includes(lowercasedQuery) ||
        order.shippingAddr.email.toLowerCase().includes(lowercasedQuery) ||
        order.orderNumber.toLowerCase().includes(lowercasedQuery)
    );
  }
  return [...mockOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAllUsers(): Promise<UserProfile[]> {
    return [...mockUsers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}


export async function getAllDesigns({ status }: { status?: Design['status'] | 'All' }): Promise<Design[]> {
    const sortedDesigns = [...mockDesigns].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (status && status !== 'All') {
        return sortedDesigns.filter(design => design.status === status);
    }
    return sortedDesigns;
}


export async function updateDesignStatus(designId: string, userId: string, status: 'Approved' | 'Rejected') {
    const designIndex = mockDesigns.findIndex(d => d.id === designId);
    if (designIndex > -1) {
        mockDesigns[designIndex].status = status;
        revalidatePath('/admin/reviews');
        return { success: true };
    }
    return { success: false, message: 'Design not found.' };
}

export async function updateOrderStatus(orderId: string, userId: string, status: Order['status']) {
    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
     if (orderIndex > -1) {
        mockOrders[orderIndex].status = status;
        revalidatePath('/admin/orders');
        revalidatePath(`/admin/orders/${orderId}`);
        revalidatePath('/admin');
        return { success: true, message: `Order status updated to ${status}` };
    }
    return { success: false, message: 'Order not found.' };
}


export async function grantAdminRole(userId: string) {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        mockUsers[userIndex].isAdmin = true;
        revalidatePath('/admin/users');
        return { success: true, message: 'Admin role granted.' };
    }
    return { success: false, message: 'User not found.' };
}

export async function revokeAdminRole(userId: string) {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        mockUsers[userIndex].isAdmin = false;
        revalidatePath('/admin/users');
        return { success: true, message: 'Admin role revoked.' };
    }
    return { success: false, message: 'User not found.' };
}

const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

export async function addDesign(design: Design) {
    mockDesigns.unshift(design);
}

export async function addOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const newOrder: Order = {
        ...order,
        id: `ord_${Date.now()}`,
        orderNumber: `ORD-${nanoid()}`,
        createdAt: now,
        updatedAt: now,
    };
    mockOrders.unshift(newOrder);
    return newOrder;
}

export async function getOrderById(orderId: string, userId: string): Promise<(Order & {items: OrderItem[]}) | null> {
    const order = mockOrders.find(o => o.id === orderId && o.userId === userId);
    if (!order) return null;
    
    // Simulate finding order items
    const items: OrderItem[] = [
        { id: 'item_1', orderId: orderId, productId: 'prod_1', quantity: 1, size: 'M', color: '#000000', price: 2499, name: 'Tioras Signature Tee', image: 'https://picsum.photos/seed/1/600/800' },
        { id: 'item_2', orderId: orderId, productId: 'prod_2', quantity: 1, size: 'L', color: '#FFFFFF', price: 6499, name: 'Tioras Hoodie', image: 'https://picsum.photos/seed/2/600/800' },
    ];

    return { ...order, items };
}
