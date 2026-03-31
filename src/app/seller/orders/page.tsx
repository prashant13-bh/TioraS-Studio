'use client';

import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Printer, PackageOpen, Truck, Clock, GripVertical, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { updateOrderStatusAction, getVendorOrders } from '@/app/actions/vendor-actions';

interface KanbanOrder {
  id: string;
  orderNumber: string;
  product: string;
  customer: string;
  status: string;
  priority: string;
  type: string;
  total: number;
}

const COLUMNS = [
  { id: 'pre-press', title: 'Pre-Press (Pending)', icon: Clock, color: 'border-t-yellow-500' },
  { id: 'printing', title: 'Printing / Stitching', icon: Printer, color: 'border-t-blue-500' },
  { id: 'packing', title: 'Ready to Pack', icon: PackageOpen, color: 'border-t-orange-500' },
  { id: 'shipped', title: 'Shipped', icon: Truck, color: 'border-t-green-500' },
];

// Fallback demo orders when Firestore is empty
const DEMO_ORDERS: KanbanOrder[] = [
  { id: 'demo-1', orderNumber: 'ORD-1029', product: 'Oversized Anime Hoodie', customer: 'Rahul D.', status: 'pre-press', priority: 'high', type: 'dtf', total: 1299 },
  { id: 'demo-2', orderNumber: 'ORD-1031', product: 'Custom Gym Tee', customer: 'Priya S.', status: 'pre-press', priority: 'normal', type: 'embroidery', total: 799 },
  { id: 'demo-3', orderNumber: 'ORD-1033', product: 'SYOG Upcycle Jacket', customer: 'Amit K.', status: 'printing', priority: 'normal', type: 'syog', total: 0 },
  { id: 'demo-4', orderNumber: 'ORD-1034', product: 'Minimalist Cap', customer: 'Neha M.', status: 'packing', priority: 'low', type: 'embroidery', total: 499 },
  { id: 'demo-5', orderNumber: 'ORD-1036', product: 'Streetwear Cargo Pants', customer: 'Karan J.', status: 'shipped', priority: 'normal', type: 'dtf', total: 1899 },
];

export default function SellerOrdersKanban() {
  const [orders, setOrders] = useState<KanbanOrder[]>(DEMO_ORDERS);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch live orders on mount
  useEffect(() => {
    async function loadOrders() {
      try {
        const liveOrders = await getVendorOrders();
        if (liveOrders.length > 0) {
          setOrders(liveOrders as KanbanOrder[]);
        }
        // If no live orders, keep demo data
      } catch {
        // Keep demo data on error
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  const getOrdersByStatus = useCallback(
    (status: string) => orders.filter(o => o.status === status),
    [orders]
  );

  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination, source } = result;

    // Dropped outside a column or same position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const newStatus = destination.droppableId;

    // Optimistic update
    setOrders(prev =>
      prev.map(o => (o.id === draggableId ? { ...o, status: newStatus } : o))
    );

    // Only call Firestore for real orders (not demo)
    if (!draggableId.startsWith('demo-')) {
      setUpdatingId(draggableId);
      const res = await updateOrderStatusAction(draggableId, newStatus);
      setUpdatingId(null);

      if (!res.success) {
        // Revert on failure
        setOrders(prev =>
          prev.map(o => (o.id === draggableId ? { ...o, status: source.droppableId } : o))
        );
        toast({ title: 'Failed', description: res.message, variant: 'destructive' });
      } else {
        toast({ title: 'Order Updated', description: res.message });
      }
    } else {
      toast({ title: 'Demo Mode', description: `Moved to ${newStatus} (not saved — demo order)` });
    }
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    if (priority === 'low') return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'dtf': return <Badge variant="outline" className="text-[10px]">DTF Print</Badge>;
      case 'embroidery': return <Badge variant="outline" className="text-[10px]">Embroidery</Badge>;
      case 'syog': return <Badge className="text-[10px] bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300">SYOG</Badge>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold font-headline tracking-tight">Production Board</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop orders through your fulfillment pipeline.
            {isLoading && <Loader2 className="inline ml-2 h-3 w-3 animate-spin" />}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">{orders.length} Orders</Badge>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
          {COLUMNS.map(column => {
            const columnOrders = getOrdersByStatus(column.id);
            const Icon = column.icon;

            return (
              <div key={column.id} className={`flex flex-col bg-muted/40 rounded-xl min-w-[280px] lg:min-w-[300px] h-[calc(100vh-13rem)] border-t-4 ${column.color}`}>
                {/* Column Header */}
                <div className="flex items-center justify-between p-4 pb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm font-headline">{column.title}</h3>
                  </div>
                  <Badge variant="secondary" className="rounded-full h-6 w-6 flex items-center justify-center p-0 text-xs">
                    {columnOrders.length}
                  </Badge>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto space-y-2 px-3 pb-3 transition-colors duration-200 ${
                        snapshot.isDraggingOver ? 'bg-primary/5 rounded-b-xl' : ''
                      }`}
                    >
                      {columnOrders.map((order, index) => (
                        <Draggable key={order.id} draggableId={order.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`transition-shadow ${snapshot.isDragging ? 'shadow-xl rotate-1' : ''}`}
                            >
                              <Card className={`border hover:shadow-md transition-all ${
                                updatingId === order.id ? 'opacity-50' : ''
                              }`}>
                                <CardContent className="p-3">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-1">
                                      <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                                        <GripVertical className="h-4 w-4" />
                                      </div>
                                      <span className="text-xs font-bold text-muted-foreground">{order.orderNumber}</span>
                                    </div>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${getPriorityColor(order.priority)}`}>
                                      {order.priority}
                                    </span>
                                  </div>
                                  <p className="font-medium text-sm leading-tight mb-2 line-clamp-2 pl-5">{order.product}</p>
                                  <div className="flex items-center justify-between pl-5">
                                    {getTypeBadge(order.type)}
                                    <span className="text-xs text-muted-foreground">{order.customer}</span>
                                  </div>
                                  {order.total > 0 && (
                                    <div className="text-xs font-semibold text-primary mt-2 pl-5">₹{order.total.toLocaleString()}</div>
                                  )}
                                  {column.id === 'pre-press' && (
                                    <Button variant="secondary" size="sm" className="w-full mt-2 h-7 text-xs">
                                      Download Artwork
                                    </Button>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {columnOrders.length === 0 && !snapshot.isDraggingOver && (
                        <div className="h-20 border-2 border-dashed rounded-lg flex items-center justify-center text-xs text-muted-foreground mt-2">
                          Drop orders here
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
