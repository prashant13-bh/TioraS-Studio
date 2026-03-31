import { getAdminFirestore } from '@/lib/firebase-admin';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, Printer, PackageOpen, Truck, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface TrackingStep {
  id: string;
  label: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}

const TRACKING_STEPS: TrackingStep[] = [
  { id: 'pre-press', label: 'Order Confirmed', description: 'Your order has been received and queued for production.', icon: Sparkles },
  { id: 'printing', label: 'In Production', description: 'Your design is being printed or stitched by a local artisan.', icon: Printer },
  { id: 'packing', label: 'Quality Check & Packing', description: 'Your garment has been inspected and is being carefully packed.', icon: PackageOpen },
  { id: 'shipped', label: 'Shipped', description: 'Your package is on its way! Expect delivery within 2-4 business days.', icon: Truck },
];

function getStepIndex(status: string | undefined): number {
  const map: Record<string, number> = {
    'Pending': 0, 'Processing': 0, 'pre-press': 0,
    'Printing': 1, 'printing': 1,
    'Packing': 2, 'packing': 2,
    'Shipped': 3, 'shipped': 3,
    'Delivered': 4,
  };
  return map[status || ''] ?? 0;
}

export default async function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getAdminFirestore();

  let order: any = null;

  try {
    const doc = await db.collection('orders').doc(id).get();
    if (doc.exists) {
      order = { id: doc.id, ...doc.data() };
    }
  } catch (err) {
    console.error("Error fetching order for tracking:", err);
  }

  if (!order) {
    notFound();
  }

  const currentStepIndex = getStepIndex(order.fulfillmentStatus || order.status);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-muted/30 border-b">
        <div className="container max-w-3xl mx-auto px-4 py-8">
          <Link href="/dashboard/orders" className="text-sm text-primary hover:underline mb-4 block">&larr; Back to Orders</Link>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Track Your Order</h1>
          <p className="text-muted-foreground mt-1">
            Order <span className="font-semibold text-foreground">{order.orderNumber || order.id}</span>
          </p>
        </div>
      </div>

      <div className="container max-w-3xl mx-auto px-4 py-10">
        
        {/* Status Badge */}
        <div className="flex items-center gap-3 mb-10">
          <Badge variant={currentStepIndex >= 3 ? 'default' : 'secondary'} className="text-sm px-3 py-1">
            {currentStepIndex >= 3 ? '✓ Shipped' : 'In Progress'}
          </Badge>
          {order.isSyog && (
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-sm px-3 py-1">
              SYOG Upcycle
            </Badge>
          )}
        </div>

        {/* Visual Timeline */}
        <div className="relative">
          {TRACKING_STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isFuture = index > currentStepIndex;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex gap-4 pb-10 last:pb-0">
                {/* Vertical Line + Icon */}
                <div className="flex flex-col items-center">
                  <div className={`
                    h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500
                    ${isCompleted ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : ''}
                    ${isCurrent ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 animate-pulse' : ''}
                    ${isFuture ? 'bg-muted text-muted-foreground border-2 border-dashed' : ''}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : isCurrent ? (
                      <Icon className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </div>
                  {/* Connecting line */}
                  {index < TRACKING_STEPS.length - 1 && (
                    <div className={`w-0.5 flex-1 mt-2 transition-colors duration-500 ${
                      isCompleted ? 'bg-green-500' : 'bg-muted'
                    }`} />
                  )}
                </div>

                {/* Content */}
                <div className={`pt-1.5 pb-4 ${isFuture ? 'opacity-40' : ''}`}>
                  <h3 className={`font-semibold text-base font-headline ${isCurrent ? 'text-primary' : ''}`}>
                    {step.label}
                    {isCurrent && (
                      <span className="ml-2 text-xs font-normal bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Card */}
        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Details of your order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order Number</span>
              <span className="font-medium">{order.orderNumber || order.id}</span>
            </div>
            {order.total !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold text-primary">₹{Number(order.total).toLocaleString()}</span>
              </div>
            )}
            {order.shippingAddr?.name && order.shippingAddr.name !== 'Pending Match' && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping To</span>
                <span className="font-medium">{order.shippingAddr.name}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Placed On</span>
              <span className="font-medium">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
