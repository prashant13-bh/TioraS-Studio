

'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { getUserDashboardData } from '@/app/actions/user-actions';
import { format } from 'date-fns';
import { redirect, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { useEffect, useState } from 'react';
import type { Design, Order } from '@/lib/types';


export default function DashboardPage() {
    const { user, loading } = useUser();
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState<{savedDesigns: Design[], orderHistory: Order[]}>({ savedDesigns: [], orderHistory: [] });
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login?redirect=/dashboard');
        } else if (user) {
            getUserDashboardData().then(data => {
                setDashboardData(data);
                setIsDataLoading(false);
            });
        }
    }, [user, loading, router]);


  if (loading || isDataLoading) {
      return <div className="container mx-auto px-4 py-8 text-center">Loading your dashboard...</div>
  }
  
  if (!user) {
      return null; // Redirect is handling this case
  }

  const { savedDesigns, orderHistory } = dashboardData;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Shipped':
        return 'default';
      case 'Delivered':
        return 'outline';
      case 'Pending':
      case 'Processing':
        return 'secondary';
      case 'Cancelled':
          return 'destructive';
      default:
        return 'secondary';
    }
  };
  
  const displayName = user.displayName || user.email?.split('@')[0] || 'designer';

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter">
          My Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
            Welcome back, {displayName}! Here are your creations and recent orders.
        </p>
      </header>
      
      <Tabs defaultValue="designs">
        <TabsList>
          <TabsTrigger value="designs">Saved Designs ({savedDesigns.length})</TabsTrigger>
          <TabsTrigger value="orders">Order History ({orderHistory.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="designs">
          <Card>
            <CardHeader>
              <CardTitle>My Saved Designs</CardTitle>
              <CardDescription>A gallery of your AI-generated creations.</CardDescription>
            </CardHeader>
            <CardContent>
               {savedDesigns.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {savedDesigns.map((design) => (
                        <Card key={design.id} className="group relative">
                            <div className="relative aspect-square w-full overflow-hidden rounded-t-lg">
                            <Image src={design.imageUrl} alt={design.name} fill className="object-cover"/>
                            </div>
                            <div className="p-4">
                            <h3 className="font-semibold truncate">{design.name}</h3>
                            <p className="text-sm text-muted-foreground">{design.product}</p>
                            </div>
                        </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex h-48 flex-col items-center justify-center text-center">
                        <h2 className="text-xl font-semibold">No Designs Yet</h2>
                        <p className="mt-2 text-muted-foreground">
                            Head to the AI Studio to create your first design.
                        </p>
                    </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders">
          <Card>
             <CardHeader>
              <CardTitle>My Order History</CardTitle>
              <CardDescription>A list of all your past orders.</CardDescription>
            </CardHeader>
            <CardContent>
                {orderHistory.length > 0 ? (
                     <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orderHistory.map((order: any) => ( // Using any for mock data compatibility
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                                <TableCell>{format(new Date(order.createdAt || order.date), 'PPP')}</TableCell>
                                <TableCell>
                                <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="flex h-48 flex-col items-center justify-center text-center">
                        <h2 className="text-xl font-semibold">No Orders Yet</h2>
                        <p className="mt-2 text-muted-foreground">
                            You haven&apos;t placed any orders yet.
                        </p>
                    </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
