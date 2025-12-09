'use server';

import { prisma } from '@/lib/prisma';
import type { AdminDashboardData, Design, Order } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  try {
    const totalRevenue = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
    });

    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({
      where: { status: 'Pending' },
    });

    // Mock active users as it's not implemented
    const activeUsers = 1;

    const recentOrdersData = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const recentOrders: Order[] = recentOrdersData.map(order => ({
      ...order,
      shippingAddr: JSON.parse(order.shippingAddr),
      items: order.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          sizes: JSON.parse(item.product.sizes),
          colors: JSON.parse(item.product.colors),
        }
      }))
    }));


    return {
      totalRevenue: totalRevenue._sum.total || 0,
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
    const ordersData = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

     return ordersData.map(order => ({
      ...order,
      shippingAddr: JSON.parse(order.shippingAddr),
      items: order.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          sizes: JSON.parse(item.product.sizes),
          colors: JSON.parse(item.product.colors),
        }
      }))
    }));

  } catch (error) {
    console.error('Failed to fetch all orders:', error);
    return [];
  }
}

export async function getAllDesigns(): Promise<Design[]> {
    try {
        const designs = await prisma.design.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return designs;
    } catch (error) {
        console.error('Failed to fetch designs:', error);
        return [];
    }
}


export async function updateDesignStatus(designId: string, status: 'Approved' | 'Rejected') {
    try {
        await prisma.design.update({
            where: { id: designId },
            data: { status },
        });
        revalidatePath('/admin/reviews');
        return { success: true };
    } catch (error) {
        console.error(`Failed to update design ${designId} status:`, error);
        return { success: false, message: 'Database update failed.' };
    }
}
