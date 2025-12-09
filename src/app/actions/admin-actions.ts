'use server';

import type { AdminDashboardData, Design, Order } from '@/lib/types';
import { revalidatePath } from 'next/cache';

// MOCK DATA - In a real app, this would come from a database
let orders: Order[] = [];
let designs: Design[] = [];
let nextOrderId = 1;


export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  try {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;

    // Mock active users as it's not implemented
    const activeUsers = 1;

    const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

    return {
      totalRevenue: totalRevenue || 0,
      totalOrders,
      pendingOrders,
      activeUsers,
      recentOrders,
    };
  } catch (error) {
    console.error('Failed to fetch admin dashboard data:', error);
    // Return a default state on error
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
    console.error('Failed to fetch all orders:', error);
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


// These functions are added to simulate the database
export function addOrder(order: Order) {
    orders.push(order);
}

export function addDesign(design: Design) {
    designs.push(design);
}

export function getNextOrderId() {
    return `ORD-700${nextOrderId++}`;
}

export async function getOrderById(orderId: string): Promise<Order | undefined> {
    return orders.find(o => o.id === orderId);
}
