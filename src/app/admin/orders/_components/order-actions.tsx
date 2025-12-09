'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Truck, CheckCircle } from 'lucide-react';
import { updateOrderStatus } from '@/app/actions/admin-actions';
import { useToast } from '@/hooks/use-toast';
import { useState, useTransition } from 'react';
import type { Order } from '@/lib/types';

interface OrderActionsProps {
  orderId: string;
  currentStatus: Order['status'];
}

export function OrderActions({ orderId, currentStatus }: OrderActionsProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleStatusUpdate = (status: 'Shipped' | 'Delivered') => {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, status);
      if (result.success) {
        toast({
          title: 'Status Updated',
          description: result.message,
        });
      } else {
        toast({
          title: 'Update Failed',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isPending}>
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>View Details</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleStatusUpdate('Shipped')}
          disabled={isPending || ['Shipped', 'Delivered'].includes(currentStatus)}
        >
          <Truck className="mr-2 h-4 w-4" />
          Mark as Shipped
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusUpdate('Delivered')}
          disabled={isPending || currentStatus === 'Delivered'}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark as Delivered
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
