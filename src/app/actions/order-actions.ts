
'use server';

import { z } from 'zod';
import type { CartItem, ShippingAddress, Order, OrderItem } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { customAlphabet } from 'nanoid';
import { getFirebaseAdmin } from '@/firebase/server-config';

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
    const { firestore } = getFirebaseAdmin();
    const orderNumber = `ORD-${nanoid()}`;
    const now = new Date().toISOString();
    
    const newOrderRef = firestore.collection('users').doc(userId).collection('orders').doc();
    
    const orderData: Omit<Order, 'id' | 'items'> = {
        orderNumber,
        total,
        shippingAddr,
        status: 'Pending',
        createdAt: now,
        updatedAt: now,
        userId: userId,
        itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
    };

    await newOrderRef.set(orderData);

    const orderItemsBatch = firestore.batch();
    items.forEach(item => {
        const orderItemRef = newOrderRef.collection('orderItems').doc();
        // Simplified OrderItem, referencing product by ID instead of nesting the object
        const orderItem: Omit<OrderItem, 'id'> = {
            orderId: newOrderRef.id,
            productId: item.id,
            quantity: item.quantity,
            size: item.selectedSize,
            color: item.selectedColor,
            price: item.price, // Price at time of purchase
            name: item.name, // Denormalize for easier display
            image: item.image, // Denormalize for easier display
        };
        orderItemsBatch.set(orderItemRef, orderItem);
    });

    await orderItemsBatch.commit();

    revalidatePath('/admin');
    revalidatePath('/admin/orders');
    revalidatePath('/dashboard');

    return { success: true, orderId: newOrderRef.id };
  } catch (error) {
    console.error('Failed to create order:', error);
    return { success: false, message: 'Could not create order in database.' };
  }
}
