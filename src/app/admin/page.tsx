
'use client';

import { fetchAdminDashboardData } from '@/lib/firestore-actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Package, Users, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { SalesChart } from './_components/sales-chart';
import { useEffect, useState } from 'react';
import type { AdminDashboardData } from '@/lib/types';

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDashboardData().then(dashboardData => {
      setData(dashboardData);
      setLoading(false);
    });
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Shipped':
        return 'default';
      case 'Processing':
        return 'secondary';
      case 'Delivered':
        return 'outline';
      case 'Cancelled':
        return 'destructive';
      case 'Pending':
      default:
        return 'destructive';
    }
  };

  if (loading) {
      return <div className="flex h-96 items-center justify-center">Loading dashboard data...</div>;
  }

  if (!data) {
      return <div className="flex h-96 items-center justify-center">Failed to load data.</div>;
  }

  return (
    <div className="grid gap-4 md:gap-8 auto-rows-max">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Based on all orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Total orders placed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Orders awaiting processing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Total registered users
            </p>
          </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="xl:col-span-2">
                <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                    <CardDescription>Revenue from the last 7 days.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SalesChart data={data.salesByDay} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>An overview of the most recent orders.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {data.recentOrders.length > 0 ? (
                        data.recentOrders.map((order) => (
                            <TableRow key={order.id} className="hover:bg-muted/50">
                            <TableCell>
                                <div className="font-medium">{order.shippingAddr?.name || 'Unknown'}</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                {order.createdAt ? format(new Date(order.createdAt), 'PP') : 'N/A'}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">₹{order.total?.toFixed(2) || '0.00'}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center text-muted-foreground">No recent orders</TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
       </div>
    </div>
  );
}
