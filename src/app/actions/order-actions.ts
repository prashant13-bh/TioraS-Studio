
'use server';

import { z } from 'zod';
import type { CartItem, ShippingAddress, Order, OrderItem } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { getFirebaseAdmin } from '@/firebase/server-config';
import { getProductById } from './product-actions';
import { customAlphabet } from 'nanoid';
import { auth } from 'firebase-admin';

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
  items: z.array(orderItemSchema).min(1),
  total: z.number(),
  shippingAddr: shippingAddressSchema,
});

export async function createOrderAction(
  items: CartItem[],
  total: number,
  shippingAddr: ShippingAddress
): Promise<{ success: boolean; message?: string; orderId?: string }> {
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
    const { firestore } = getFirebaseAdmin();
    const user = await auth().currentUser; // Assuming a way to get the current user server-side
    
    if (!user) {
        return { success: false, message: 'User not authenticated.' };
    }

    const orderNumber = `ORD-${nanoid()}`;
    const now = new Date();
    
    const userOrdersCollection = firestore.collection(`users/${user.uid}/orders`);
    const newOrderRef = userOrdersCollection.doc();

    const createdOrder: Omit<Order, 'id' | 'items'> = {
        orderNumber,
        total,
        shippingAddr: shippingAddr,
        status: 'Pending',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        userId: user.uid,
    };
    
    await newOrderRef.set(createdOrder);

    const orderItemsCollection = newOrderRef.collection('orderItems');
    for (const item of items) {
        const product = await getProductById(item.id);
        if (!product) throw new Error(`Product with id ${item.id} not found`);

        const orderItem: Omit<OrderItem, 'id' | 'product'> = {
            orderId: newOrderRef.id,
            productId: item.id,
            quantity: item.quantity,
            size: item.selectedSize,
            color: item.selectedColor,
            price: item.price,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        };
        await orderItemsCollection.add(orderItem);
    }

    revalidatePath('/admin');
    revalidatePath('/admin/orders');
    revalidatePath('/dashboard');

    return { success: true, orderId: newOrderRef.id };
  } catch (error) {
    console.error('Failed to create order:', error);
    return { success: false, message: 'Could not create order.' };
  }
}
