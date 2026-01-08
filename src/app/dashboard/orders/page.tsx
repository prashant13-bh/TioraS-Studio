"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchUserDashboardData } from "@/lib/firestore-actions";
import { format } from "date-fns";
import { useUser } from "@/firebase";
import { useEffect, useState } from "react";
import type { Order } from "@/lib/types";
import { Eye, Package } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const { user, loading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserDashboardData(user.uid).then((data) => {
        setOrders(data.orderHistory);
        setIsDataLoading(false);
      });
    }
  }, [user]);

  if (loading || isDataLoading) {
    return <div>Loading orders...</div>;
  }

  if (!user) return null;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Shipped": return "default";
      case "Delivered": return "outline";
      case "Pending": return "secondary";
      case "Cancelled": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">


      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            A list of all your past orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                    <TableCell>{format(new Date(order.createdAt || order.date), "PPP")}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center text-center text-muted-foreground">
              <Package className="h-12 w-12 mb-4 opacity-20" />
              <h3 className="text-lg font-semibold">No orders found</h3>
              <p>You haven&apos;t placed any orders yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
