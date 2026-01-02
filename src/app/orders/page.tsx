'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { fetchUserDashboardData } from '@/lib/firestore-actions';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Clock, ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function OrdersPage() {
  const { user, loading: userLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (user) {
        const data = await fetchUserDashboardData(user.uid);
        setOrders(data.orderHistory);
      }
      setLoading(false);
    };

    if (!userLoading) {
      loadOrders();
    }
  }, [user, userLoading]);

  if (userLoading || loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 size-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Clock className="mb-4 size-16 text-muted-foreground" />
        <h1 className="mb-2 text-2xl font-bold">Please log in</h1>
        <p className="mb-8 text-muted-foreground">You need to be logged in to view your order history.</p>
        <Button asChild>
          <Link href="/login">Login Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-5xl">Order History</h1>
        <p className="mt-2 text-muted-foreground">Track and manage your recent purchases.</p>
      </header>

      {orders.length === 0 ? (
        <Card className="border-dashed py-24 text-center">
          <CardContent className="flex flex-col items-center">
            <ShoppingBag className="mb-4 size-16 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-bold">No orders yet</h2>
            <p className="mb-8 text-muted-foreground">Looks like you haven't placed any orders yet.</p>
            <Button asChild size="lg">
              <Link href="/catalog">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <Package className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Number</p>
                        <p className="font-mono font-bold">{order.orderNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</p>
                        <p className="font-semibold">{format(new Date(order.createdAt), 'MMM d, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total</p>
                        <p className="font-bold text-primary">₹{order.total.toFixed(2)}</p>
                      </div>
                      <Badge variant={
                        order.status === 'Delivered' ? 'default' :
                        order.status === 'Shipped' ? 'secondary' :
                        order.status === 'Processing' ? 'outline' : 'destructive'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between py-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <p>{order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}</p>
                    <span>•</span>
                    <p>Shipping to {order.shippingAddr.city}</p>
                  </div>
                  <Button variant="ghost" className="group" asChild>
                    <Link href={`/orders/${order.id}`}>
                      View Details
                      <ChevronRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
