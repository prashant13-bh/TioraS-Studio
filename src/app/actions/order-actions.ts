
'use server';

import { z } from 'zod';
import type { CartItem, ShippingAddress, Order, OrderItem } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { customAlphabet } from 'nanoid';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';

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

  const { firestore: db } = initializeFirebase();

  try {
    const orderNumber = `ORD-${nanoid()}`;
    const batch = writeBatch(db);

    // 1. Create Order Document
    const orderRef = doc(collection(db, 'orders'));
    const orderData = {
        userId,
        orderNumber,
        total,
        shippingAddr,
        status: 'Pending',
        itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    batch.set(orderRef, orderData);

    // 2. Add Order Items to subcollection
    items.forEach((item) => {
        const itemRef = doc(collection(orderRef, 'orderItems'));
        const itemData: OrderItem = {
            id: itemRef.id,
            orderId: orderRef.id,
            productId: item.id,
            quantity: item.quantity,
            size: item.selectedSize,
            color: item.selectedColor,
            price: item.price,
            name: item.name,
            image: item.image,
        };
        batch.set(itemRef, itemData);
    });

    await batch.commit();

    revalidatePath('/admin');
    revalidatePath('/admin/orders');
    revalidatePath('/dashboard');
    revalidatePath('/orders');

    return { success: true, orderId: orderRef.id };
  } catch (error) {
    console.error('Failed to create order:', error);
    return { success: false, message: 'Could not create order in database.' };
  }
}
