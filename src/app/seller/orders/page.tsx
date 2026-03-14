'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Printer, PackageOpen, Truck, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data representing a vendor's assigned orders
const initialOrders = [
  { id: 'ORD-1029', product: 'Oversized Anime Hoodie', customer: 'Rahul D.', status: 'pre-press', priority: 'high', type: 'dtf' },
  { id: 'ORD-1031', product: 'Custom Gym Tee', customer: 'Priya S.', status: 'printing', priority: 'normal', type: 'embroidery' },
  { id: 'ORD-1033', product: 'SYOG Upcycle Jacket', customer: 'Amit K.', status: 'packing', priority: 'normal', type: 'syog' },
  { id: 'ORD-1034', product: 'Minimalist Cap', customer: 'Neha M.', status: 'shipped', priority: 'low', type: 'embroidery' },
];

export default function SellerOrdersKanban() {
  const [orders, setOrders] = useState(initialOrders);

  // Future drag and drop implementation would update the state here.
  const getOrdersByStatus = (status: string) => orders.filter(o => o.status === status);

  const getPriorityColor = (priority: string) => {
    if(priority === 'high') return 'bg-red-100 text-red-700';
    if(priority === 'low') return 'bg-gray-100 text-gray-700';
    return 'bg-blue-100 text-blue-700';
  }

  const getTypeBadge = (type: string) => {
      switch(type) {
          case 'dtf': return <Badge variant="outline" className="text-xs">DTF Print</Badge>;
          case 'embroidery': return <Badge variant="outline" className="text-xs">Embroidery</Badge>;
          case 'syog': return <Badge className="text-xs bg-purple-100 text-purple-800 hover:bg-purple-200">SYOG Intake</Badge>;
          default: return null;
      }
  }

  const Column = ({ title, status, icon: Icon }: { title: string, status: string, icon: any }) => {
    const columnOrders = getOrdersByStatus(status);
    return (
      <div className="flex flex-col bg-muted/50 rounded-xl p-4 min-w-[300px] h-[calc(100vh-12rem)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold font-headline">{title}</h3>
          </div>
          <Badge variant="secondary" className="rounded-full">{columnOrders.length}</Badge>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
          {columnOrders.map(order => (
            <Card key={order.id} className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold">{order.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${getPriorityColor(order.priority)}`}>
                    {order.priority}
                  </span>
                </div>
                <p className="font-medium text-sm leading-tight mb-3 line-clamp-2">{order.product}</p>
                <div className="flex items-center justify-between mt-auto">
                    {getTypeBadge(order.type)}
                    <div className="text-xs text-muted-foreground">{order.customer}</div>
                </div>
                {status === 'pre-press' && (
                    <Button variant="secondary" size="sm" className="w-full mt-3 h-7 text-xs">Download Artwork</Button>
                )}
              </CardContent>
            </Card>
          ))}

          {columnOrders.length === 0 && (
              <div className="h-24 border-2 border-dashed rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                  Empty
              </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold font-headline tracking-tight">Production Board</h1>
          <p className="text-sm text-muted-foreground mt-1">Drag and drop orders through your fulfillment pipeline.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm">Filter by DTF</Button>
            <Button variant="outline" size="sm">Filter by Embroidery</Button>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 flex-1">
        <Column title="Pre-Press (Pending)" status="pre-press" icon={Clock} />
        <Column title="Printing / Stitching" status="printing" icon={Printer} />
        <Column title="Ready to Pack" status="packing" icon={PackageOpen} />
        <Column title="Shipped" status="shipped" icon={Truck} />
      </div>
    </div>
  );
}
