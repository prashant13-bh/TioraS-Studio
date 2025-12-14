
'use client';

import { useState, useMemo } from 'react';
import type { Order } from '@/lib/types';
import { Search } from '@/components/search';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { OrderActions } from './order-actions';

interface OrderTableProps {
  orders: Order[];
  initialQuery?: string;
}

export function OrderTable({ orders, initialQuery = '' }: OrderTableProps) {
  const [query, setQuery] = useState(initialQuery);

  const filteredOrders = useMemo(() => {
    if (!query) {
      return orders;
    }
    const lowercasedQuery = query.toLowerCase();
    return orders.filter(
      (order) =>
        order.shippingAddr.name.toLowerCase().includes(lowercasedQuery) ||
        order.shippingAddr.email.toLowerCase().includes(lowercasedQuery) ||
        order.orderNumber.toLowerCase().includes(lowercasedQuery)
    );
  }, [query, orders]);

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

  return (
    <div className="space-y-4">
      <div className="pt-2">
        <Search
          placeholder="Search by name, email, or order #"
          onSearchChange={setQuery}
          initialQuery={initialQuery}
        />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell text-center">Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>
                  <div className="font-medium">{order.shippingAddr.name}</div>
                  <div className="hidden text-sm text-muted-foreground sm:inline-block">
                    {order.shippingAddr.email}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(new Date(order.createdAt), 'MM/dd/yyyy')}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-center">
                  {order.itemCount || 0}
                </TableCell>
                <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <OrderActions orderId={order.id} userId={order.userId} currentStatus={order.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filteredOrders.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No orders found for &quot;{query}&quot;.
        </div>
      )}
    </div>
  );
}
