
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
    
    const orderData: Omit<Order, 'id' | 'items' | 'itemCount'> = {
        orderNumber,
        total,
        shippingAddr,
        status: 'Pending',
        createdAt: now,
        updatedAt: now,
        userId: userId,
    };

    await newOrderRef.set(orderData);

    // In a real app, you would fetch product details from the DB
    // For now, we continue to use the cart item details
    const orderItems: OrderItem[] = items.map(item => ({
        id: item.id, // Reusing product id for simplicity as OrderItem ID
        orderId: newOrderRef.id,
        productId: item.id,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
        price: item.price, // Price at time of purchase
        createdAt: now,
        updatedAt: now,
        product: { 
            ...item, 
            description: '', 
            category: '', 
            sizes: [], 
            colors: [], 
            images: [item.image], 
            isNew: false, 
            createdAt: now, 
            updatedAt: now 
        }
    }));

    // Firestore doesn't directly store the nested 'items' array on the Order doc
    // in this model. The UI will fetch them from the subcollection.
    // However, we can store a summary if needed, e.g., itemCount.
    await newOrderRef.update({ itemCount: items.length });

    revalidatePath('/admin');
    revalidatePath('/admin/orders');
    revalidatePath('/dashboard');

    return { success: true, orderId: newOrderRef.id };
  } catch (error) {
    console.error('Failed to create order:', error);
    return { success: false, message: 'Could not create order in database.' };
  }
}
