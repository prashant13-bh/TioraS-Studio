"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { fetchUserDashboardData } from "@/lib/firestore-actions";
import { format } from "date-fns";
import { useUser } from "@/firebase";
import { useEffect, useState } from "react";
import type { Design, Order } from "@/lib/types";
import { ShoppingBag, Palette, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [dashboardData, setDashboardData] = useState<{
    savedDesigns: Design[];
    orderHistory: Order[];
  }>({ savedDesigns: [], orderHistory: [] });
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserDashboardData(user.uid).then((data) => {
        setDashboardData(data);
        setIsDataLoading(false);
      });
    }
  }, [user]);

  if (loading || isDataLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (!user) return null;

  const { savedDesigns, orderHistory } = dashboardData;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Shipped":
        return "default";
      case "Delivered":
        return "outline";
      case "Pending":
      case "Processing":
        return "secondary";
      case "Cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">


      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderHistory.length}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime orders placed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Designs</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedDesigns.length}</div>
            <p className="text-xs text-muted-foreground">
              AI designs in your gallery
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Recent Orders</h2>
          <Button variant="ghost" asChild>
            <Link href="/dashboard/orders" className="flex items-center gap-2">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        {orderHistory.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orderHistory.slice(0, 3).map((order: any) => (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    #{order.orderNumber}
                  </CardTitle>
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{order.total.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(order.createdAt || order.date), "PPP")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex h-32 items-center justify-center text-muted-foreground">
              No orders yet.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Designs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Recent Designs</h2>
          <Button variant="ghost" asChild>
            <Link href="/dashboard/designs" className="flex items-center gap-2">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {savedDesigns.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {savedDesigns.slice(0, 4).map((design) => (
              <Card key={design.id} className="overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={design.imageUrl}
                    alt={design.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate">{design.name}</h3>
                  <p className="text-sm text-muted-foreground">{design.product}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex h-32 items-center justify-center text-muted-foreground">
              No designs saved yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
