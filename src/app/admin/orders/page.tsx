
import { getAllOrders } from '@/app/actions/admin-actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Order } from '@/lib/types';
import { OrderTable } from './_components/order-table';

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams?: { query?: string };
}) {
  const query = searchParams?.query || '';
  // The page now fetches all orders, and the client component handles filtering.
  const orders: Order[] = await getAllOrders({});

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
        <CardDescription>
          A list of all orders placed on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* The new client component receives all orders and the initial query */}
        <OrderTable orders={orders} initialQuery={query} />
      </CardContent>
    </Card>
  );
}
