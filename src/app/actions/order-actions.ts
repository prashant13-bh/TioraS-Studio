'use server';

import { z } from 'zod';
import type { CartItem, ShippingAddress, Order, OrderItem } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { addOrder, getNextOrderId } from './admin-actions';
import { getProductById } from './product-actions';

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
    const orderNumber = await getNextOrderId();
    const now = new Date().toISOString();
    
    const createdOrder: Order = {
        id: `ord_${Date.now()}`,
        orderNumber,
        total,
        shippingAddr: shippingAddr,
        status: 'Pending',
        createdAt: now,
        updatedAt: now,
        items: await Promise.all(items.map(async (item) => {
            const product = await getProductById(item.id);
            if (!product) throw new Error(`Product with id ${item.id} not found`);
            return {
                id: `item_${Date.now()}_${item.id}`,
                orderId: '', // will be set when order is created
                productId: item.id,
                quantity: item.quantity,
                size: item.selectedSize,
                color: item.selectedColor,
                price: item.price,
                createdAt: now,
                updatedAt: now,
                product: product,
            };
        }))
    };
    
    await addOrder(createdOrder);

    revalidatePath('/admin');
    revalidatePath('/admin/orders');

    return { success: true, orderId: createdOrder.id };
  } catch (error) {
    console.error('Failed to create order:', error);
    return { success: false, message: 'Could not create order.' };
  }
}
