'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import type { Order, OrderItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Package, MapPin, CreditCard, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { user, loading: userLoading } = useUser();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadOrderData = async () => {
      if (user && id) {
        const { firestore: db } = initializeFirebase();
        const orderRef = doc(db, 'orders', id as string);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const orderData = { id: orderSnap.id, ...orderSnap.data() } as Order;
          
          // Security check: ensure order belongs to user
          if (orderData.userId !== user.uid) {
            router.push('/orders');
            return;
          }

          setOrder(orderData);

          // Fetch items from subcollection
          const itemsRef = collection(orderRef, 'orderItems');
          const itemsSnap = await getDocs(itemsRef);
          const itemsData = itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrderItem));
          setItems(itemsData);
        }
      }
      setLoading(false);
    };

    if (!userLoading) {
      loadOrderData();
    }
  }, [user, userLoading, id, router]);

  if (userLoading || loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 size-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Package className="mb-4 size-16 text-muted-foreground" />
        <h1 className="mb-2 text-2xl font-bold">Order not found</h1>
        <p className="mb-8 text-muted-foreground">We couldn't find the order you're looking for.</p>
        <Button asChild>
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/orders">
          <ChevronLeft className="mr-2 size-4" />
          Back to Orders
        </Link>
      </Button>

      <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-5xl">Order Details</h1>
            <Badge variant={
              order.status === 'Delivered' ? 'default' :
              order.status === 'Shipped' ? 'secondary' :
              order.status === 'Processing' ? 'outline' : 'destructive'
            } className="h-fit">
              {order.status}
            </Badge>
          </div>
          <p className="mt-2 text-muted-foreground">
            Order <span className="font-mono font-bold text-foreground">#{order.orderNumber}</span> • Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy')}
          </p>
        </div>
        <Button variant="outline" className="md:w-fit">
          Download Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-5 text-primary" />
                Items ({order.itemCount})
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 py-6 first:pt-0 last:pb-0">
                  <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg border">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Size: <span className="font-semibold text-foreground">{item.size}</span> • 
                        Color: <span className="inline-block h-3 w-3 rounded-full ml-1" style={{ backgroundColor: item.color }}></span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Qty: <span className="font-bold">{item.quantity}</span></p>
                      <p className="font-bold text-primary">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Order Timeline (Mock) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-5 text-primary" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="size-3 rounded-full bg-primary" />
                    <div className="h-full w-0.5 bg-border" />
                  </div>
                  <div>
                    <p className="font-bold">Order Placed</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(order.createdAt), 'MMM d, yyyy • h:mm a')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="size-3 rounded-full bg-muted" />
                  </div>
                  <div>
                    <p className="font-bold text-muted-foreground">Processing</p>
                    <p className="text-sm text-muted-foreground italic">Expected within 24 hours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="size-5 text-primary" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed">
              <p className="font-bold">{order.shippingAddr.name}</p>
              <p>{order.shippingAddr.address}</p>
              <p>{order.shippingAddr.city}, {order.shippingAddr.state} {order.shippingAddr.zip}</p>
              <p className="mt-2 font-semibold">Phone: {order.shippingAddr.phone}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="size-5 text-primary" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-500 font-bold">FREE</span>
              </div>
              <div className="flex justify-between border-t pt-3 text-base font-bold">
                <span>Total Amount</span>
                <span className="text-primary text-lg">₹{order.total.toFixed(2)}</span>
              </div>
              <p className="mt-4 rounded-lg bg-muted/50 p-2 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
                Paid via Credit Card
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
