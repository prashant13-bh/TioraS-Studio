import { collection, doc, setDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import { getFirestore } from 'firebase/firestore';
import type { Order, CartItem, ShippingAddress } from '@/lib/types';

const getDb = () => {
    const apps = getApps();
    const app = apps.length ? apps[0] : initializeApp(firebaseConfig);
    return getFirestore(app);
};

const ORDERS_COLLECTION = 'orders';

export async function createOrder(
  userId: string, 
  cartItems: CartItem[], 
  totalAmount: number, 
  shippingAddress: ShippingAddress
): Promise<{ success: boolean; id?: string; error?: any }> {
  try {
    const db = getDb();
    const newOrderRef = doc(collection(db, ORDERS_COLLECTION));
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderPayload: Partial<Order> = {
      id: newOrderRef.id,
      userId,
      orderNumber,
      total: totalAmount,
      status: 'Pending',
      shippingAddr: shippingAddress,
      itemCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
      items: cartItems.map(item => ({
        id: `oi_${Math.random().toString(36).substr(2, 9)}`,
        orderId: newOrderRef.id,
        productId: item.id,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
        price: item.price,
        name: item.name,
        image: item.image
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(newOrderRef, {
        ...orderPayload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    
    return { success: true, id: newOrderRef.id };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error };
  }
}

export async function getUserOrders(userId: string): Promise<Order[]> {
    try {
        const db = getDb();
        const ordersRef = collection(db, ORDERS_COLLECTION);
        const q = query(
            ordersRef, 
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            }
        }) as Order[];
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return [];
    }
}
