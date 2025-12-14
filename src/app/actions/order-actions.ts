
'use server';

import { z } from 'zod';
import type { CartItem, ShippingAddress, Order, OrderItem } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { customAlphabet } from 'nanoid';
import { addOrder } from './admin-actions'; // Using mock admin action

const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

const orderItemSchema = z.object({
  id: z.string(),
  quantity: z.number().min(1),
  selectedSize: z.string(),
  selectedColor: z.string(),
  price: z.number(),
  name: z.string(),
  image: z.string(),
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
  userId: z.string().min(1, 'User ID is required.'),
  items: z.array(orderItemSchema).min(1),
  total: z.number(),
  shippingAddr: shippingAddressSchema,
});

export async function createOrderAction(
  userId: string,
  items: CartItem[],
  total: number,
  shippingAddr: ShippingAddress
): Promise<{ success: boolean; message?: string; orderId?: string }> {
  const validation = createOrderSchema.safeParse({
    userId,
    items,
    total,
    shippingAddr,
  });

  if (!validation.success) {
    console.error('Order validation failed:', validation.error.flatten());
    return { success: false, message: 'Invalid order data.' };
  }

  try {
    const newOrderData = {
        userId: userId,
        total: total,
        shippingAddr: shippingAddr,
        status: 'Pending' as const,
        itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
    };

    // Using the mock `addOrder` function
    const newOrder = await addOrder(newOrderData);

    revalidatePath('/admin');
    revalidatePath('/admin/orders');
    revalidatePath('/dashboard');

    return { success: true, orderId: newOrder.id };
  } catch (error) {
    console.error('Failed to create order:', error);
    return { success: false, message: 'Could not create order in database.' };
  }
}
