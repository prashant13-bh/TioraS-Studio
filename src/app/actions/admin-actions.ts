
'use server';

import type { AdminDashboardData, Design, Order, OrderItem, UserProfile } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { subDays, format, startOfDay } from 'date-fns';

const MOCK_ORDERS: Order[] = [
    {
        id: 'ord_1',
        userId: 'user_1',
        orderNumber: 'ORD-7005',
        total: 8998.00,
        status: 'Delivered',
        shippingAddr: { name: 'Satoshi Nakamoto', email: 'satoshi@gmx.com', address: '123 Bitcoin Rd', city: 'Cyberspace', state: 'Internet', zip: '10101', phone: '1234567890'},
        createdAt: subDays(new Date(), 2).toISOString(),
        updatedAt: subDays(new Date(), 2).toISOString(),
        itemCount: 2,
    },
    {
        id: 'ord_2',
        userId: 'user_2',
        orderNumber: 'ORD-7004',
        total: 5499.00,
        status: 'Shipped',
        shippingAddr: { name: 'Vitalik Buterin', email: 'vitalik@ethereum.org', address: '456 Ether Lane', city: 'Toronto', state: 'ON', zip: 'M5A 1A1', phone: '1234567890'},
        createdAt: subDays(new Date(), 4).toISOString(),
        updatedAt: subDays(new Date(), 3).toISOString(),
        itemCount: 1,
    },
    {
        id: 'ord_3',
        userId: 'user_1',
        orderNumber: 'ORD-7003',
        total: 2499.00,
        status: 'Processing',
        shippingAddr: { name: 'Satoshi Nakamoto', email: 'satoshi@gmx.com', address: '123 Bitcoin Rd', city: 'Cyberspace', state: 'Internet', zip: '10101', phone: '1234567890'},
        createdAt: subDays(new Date(), 1).toISOString(),
        updatedAt: subDays(new Date(), 1).toISOString(),
        itemCount: 1,
    },
    {
        id: 'ord_4',
        userId: 'user_3',
        orderNumber: 'ORD-7002',
        total: 1499.00,
        status: 'Pending',
        shippingAddr: { name: 'Charles Hoskinson', email: 'charles@cardano.org', address: '789 ADA Blvd', city: 'Boulder', state: 'CO', zip: '80302', phone: '1234567890'},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        itemCount: 1,
    },
    {
        id: 'ord_5',
        userId: 'user_4',
        orderNumber: 'ORD-7001',
        total: 12999.00,
        status: 'Delivered',
        shippingAddr: { name: 'Gavin Wood', email: 'gavin@polkadot.network', address: '101 Polkadot Plaza', city: 'Zug', state: 'Switzerland', zip: '6300', phone: '1234567890'},
        createdAt: subDays(new Date(), 10).toISOString(),
        updatedAt: subDays(new Date(), 10).toISOString(),
        itemCount: 3,
    },
];

const MOCK_USERS: UserProfile[] = [
    { id: 'user_1', displayName: 'Satoshi Nakamoto', email: 'satoshi@gmx.com', photoURL: 'https://i.pravatar.cc/150?u=user_1', createdAt: new Date().toISOString(), isAdmin: true },
    { id: 'user_2', displayName: 'Vitalik Buterin', email: 'vitalik@ethereum.org', photoURL: 'https://i.pravatar.cc/150?u=user_2', createdAt: new Date().toISOString() },
    { id: 'user_3', displayName: 'Charles Hoskinson', email: 'charles@cardano.org', photoURL: 'https://i.pravatar.cc/150?u=user_3', createdAt: new Date().toISOString() },
    { id: 'user_4', displayName: 'Gavin Wood', email: 'gavin@polkadot.network', photoURL: 'https://i.pravatar.cc/150?u=user_4', createdAt: new Date().toISOString() },
];

const MOCK_DESIGNS: Design[] = [
    { id: 'des_1', userId: 'user_1', name: 'Cosmic Wolf', prompt: 'a wolf howling at a cosmic moon', product: 'Hoodie', imageUrl: 'https://picsum.photos/seed/401/400', status: 'Approved', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'des_2', userId: 'user_2', name: 'Synthwave Sunset', prompt: 'a synthwave sunset over a retro city', product: 'T-Shirt', imageUrl: 'https://picsum.photos/seed/402/400', status: 'Draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'des_3', userId: 'user_3', name: 'Geometric Bear', prompt: 'a bear made of geometric shapes', product: 'Jacket', imageUrl: 'https://picsum.photos/seed/403/400', status: 'Rejected', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'des_4', userId: 'user_4', name: 'Floral Skull', prompt: 'a skull made of flowers', product: 'Cap', imageUrl: 'https://picsum.photos/seed/404/400', status: 'Draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
    const totalRevenue = MOCK_ORDERS.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = MOCK_ORDERS.length;
    const pendingOrders = MOCK_ORDERS.filter(order => order.status === 'Pending').length;
    const activeUsers = MOCK_USERS.length;

    const recentOrders = [...MOCK_ORDERS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

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
}


export async function getAllOrders({ query }: { query?: string }): Promise<Order[]> {
    if (query) {
        const lowercasedQuery = query.toLowerCase();
        return MOCK_ORDERS.filter(order => 
            order.shippingAddr.name.toLowerCase().includes(lowercasedQuery) ||
            order.shippingAddr.email.toLowerCase().includes(lowercasedQuery) ||
            order.orderNumber.toLowerCase().includes(lowercasedQuery)
        );
    }
    return MOCK_ORDERS;
}

export async function getAllUsers(): Promise<UserProfile[]> {
    return MOCK_USERS;
}

export async function getAllDesigns({ status }: { status?: Design['status'] | 'All' }): Promise<Design[]> {
    if (status && status !== 'All') {
        return MOCK_DESIGNS.filter(d => d.status === status);
    }
    return MOCK_DESIGNS;
}


export async function updateDesignStatus(designId: string, userId: string, status: 'Approved' | 'Rejected') {
    console.log(`MOCK: Updating design ${designId} for user ${userId} to ${status}`);
    revalidatePath('/admin/reviews');
    return { success: true };
}


export async function updateOrderStatus(orderId: string, userId: string, status: Order['status']) {
    console.log(`MOCK: Updating order ${orderId} for user ${userId} to ${status}`);
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/admin');
    return { success: true, message: `Order status updated to ${status}` };
}


export async function grantAdminRole(userId: string) {
    console.log(`MOCK: Granting admin role to ${userId}`);
    revalidatePath('/admin/users');
    return { success: true, message: 'Admin role granted.' };
}


export async function revokeAdminRole(userId: string) {
    console.log(`MOCK: Revoking admin role for ${userId}`);
    revalidatePath('/admin/users');
    return { success: true, message: 'Admin role revoked.' };
}


export async function getOrderById(orderId: string, userId: string): Promise<(Order & {items: OrderItem[]}) | null> {
    const order = MOCK_ORDERS.find(o => o.id === orderId && o.userId === userId);
    if (!order) return null;

    // Mocking order items
    const items: OrderItem[] = [
        { id: 'item_1', orderId: orderId, productId: 'prod_1', quantity: 1, size: 'M', color: '#000000', price: 2499.00, name: 'Tioras Signature Tee', image: 'https://picsum.photos/seed/101/600/800' },
        { id: 'item_2', orderId: orderId, productId: 'prod_2', quantity: 1, size: 'L', color: '#1F2937', price: 5499.00, name: 'Urban Explorer Hoodie', image: 'https://picsum.photos/seed/103/600/800' },
    ];
    
    return { ...order, items: items.slice(0, order.itemCount) };
}

// These are not used by the admin panel but are needed for other parts of the app.
export async function addDesign(design: Design) {
   console.log('MOCK: Adding design', design);
}

export async function addOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) {
    console.log('MOCK: Adding order', order);
    const newOrder: Order = {
        ...order,
        id: `ord_${Date.now()}`,
        orderNumber: `ORD-MOCK-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    return newOrder;
}
