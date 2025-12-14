import { getOrderById, updateOrderStatus } from '@/app/actions/admin-actions';
import { notFound, redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const metadata = {
  title: 'Order Details | TioraS Admin',
};

const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Shipped': return 'default';
      case 'Processing': return 'secondary';
      case 'Delivered': return 'outline';
      case 'Cancelled': return 'destructive';
      case 'Pending': default: return 'destructive';
    }
};

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { userId?: string };
}) {
  if (!searchParams.userId) {
    // In a real app, you might want a more graceful error, but for now, this is clear.
    throw new Error('User ID is required to view an order.');
  }

  const order = await getOrderById(params.id, searchParams.userId);

  if (!order) {
    notFound();
  }

  return (
    <div className="grid gap-4 auto-rows-max">
        <div className='flex items-center gap-4'>
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                <Link href="/admin/orders">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Link>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Order {order.orderNumber}
            </h1>
            <Badge variant={getStatusVariant(order.status)} className="ml-auto sm:ml-0">
                {order.status}
            </Badge>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
                 {/* Future actions can go here */}
            </div>
        </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Items ({order.itemCount})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Size</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-4">
                            <div className="relative h-16 w-12 flex-shrink-0">
                                <Image src={item.image} alt={item.name} fill className="rounded-md object-cover" />
                            </div>
                            <span className='font-medium'>{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{item.size}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
             <CardFooter>
                <div className="flex w-full justify-end">
                    <div className="w-full max-w-xs space-y-2">
                        <Separator />
                        <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>₹{order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </CardFooter>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
                <div className="font-semibold">{order.shippingAddr.name}</div>
                <address className="grid gap-0.5 not-italic text-muted-foreground">
                    <span>{order.shippingAddr.address}</span>
                    <span>{order.shippingAddr.city}, {order.shippingAddr.state} {order.shippingAddr.zip}</span>
                </address>
                <Separator />
                 <div className="space-y-1">
                    <div className='font-semibold'>Contact Information</div>
                    <div className="flex items-center justify-between">
                        <span>Email</span>
                        <a href={`mailto:${order.shippingAddr.email}`} className="text-primary underline-offset-4 hover:underline">
                            {order.shippingAddr.email}
                        </a>
                    </div>
                     <div className="flex items-center justify-between">
                        <span>Phone</span>
                        <span>{order.shippingAddr.phone}</span>
                    </div>
                </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
                 <div className="flex items-center justify-between">
                    <span>Order ID</span>
                    <span className="text-muted-foreground break-all">{order.id}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span>Order Date</span>
                    <span className="text-muted-foreground">{format(new Date(order.createdAt), 'PP p')}</span>
                 </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
