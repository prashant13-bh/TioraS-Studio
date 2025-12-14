
'use server';

import { z } from 'zod';
import type { CartItem, ShippingAddress, Order, OrderItem } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { customAlphabet } from 'nanoid';
// Mock data store for orders - in a real app this would be a database
let orders: Order[] = [];

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
    const orderNumber = `ORD-${nanoid()}`;
    const now = new Date().toISOString();
    
    // In a real app, you would get the user ID from the session
    const userId = 'mock_user_id'; 

    const newOrder: Order = {
        id: `order_${Date.now()}`,
        orderNumber,
        total,
        shippingAddr,
        status: 'Pending',
        createdAt: now,
        updatedAt: now,
        userId: userId,
        items: items.map(item => ({
            id: `item_${Date.now()}_${item.id}`,
            orderId: `order_${Date.now()}`,
            productId: item.id,
            quantity: item.quantity,
            size: item.selectedSize,
            color: item.selectedColor,
            price: item.price,
            createdAt: now,
            updatedAt: now,
            // In a real app, you'd fetch the full product object
            product: { ...item, description: '', category: '', sizes: [], colors: [], images: [item.image], isNew: false, createdAt: now, updatedAt: now } 
        }))
    };
    
    orders.push(newOrder);

    revalidatePath('/admin');
    revalidatePath('/admin/orders');
    revalidatePath('/dashboard');

    return { success: true, orderId: newOrder.id };
  } catch (error) {
    console.error('Failed to create order:', error);
    return { success: false, message: 'Could not create order.' };
  }
}
