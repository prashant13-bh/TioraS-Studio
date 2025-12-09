'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import type { CartItem, ShippingAddress } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const orderItemSchema = z.object({
  id: z.string(),
  quantity: z.number().min(1),
  selectedSize: z.string(),
  selectedColor: z.string(),
  price: z.number(),
});

const shippingAddressSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP code is required'),
  phone: z.string().min(1, 'Phone number is required'),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  total: z.number(),
  shippingAddr: shippingAddressSchema,
});

async function getNextOrderNumber() {
  const lastOrder = await prisma.order.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (lastOrder && lastOrder.orderNumber) {
    const lastNum = parseInt(lastOrder.orderNumber.split('-')[1]);
    return `ORD-${lastNum + 1}`;
  }

  return 'ORD-7001';
}

export async function createOrderAction(
  items: CartItem[],
  total: number,
  shippingAddr: ShippingAddress
) {
  const validation = createOrderSchema.safeParse({
    items,
    total,
    shippingAddr,
  });

  if (!validation.success) {
    console.error('Order validation failed:', validation.error.flatten());
    return { success: false, message: 'Invalid order data.' };
  }

  try {
    const orderNumber = await getNextOrderNumber();
    
    const createdOrder = await prisma.order.create({
      data: {
        orderNumber,
        total,
        shippingAddr: JSON.stringify(shippingAddr),
        items: {
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            size: item.selectedSize,
            color: item.selectedColor,
            price: item.price,
          })),
        },
      },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/orders');

    return { success: true, orderId: createdOrder.id };
  } catch (error) {
    console.error('Failed to create order:', error);
    return { success: false, message: 'Could not create order.' };
  }
}
