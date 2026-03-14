'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { updateVendorStatusAction } from '@/app/actions/vendor-actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Ban, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from 'lucide-react';

export default function VendorStatusActions({ vendorId, currentStatus }: { vendorId: string, currentStatus: string }) {
   const [isUpdating, setIsUpdating] = useState(false);
   const { toast } = useToast();

   const handleUpdate = async (newStatus: "Pending" | "Active" | "Suspended") => {
      setIsUpdating(true);
      const res = await updateVendorStatusAction(vendorId, newStatus);
      setIsUpdating(false);

      if (res.success) {
          toast({ title: 'Success', description: res.message });
      } else {
          toast({ title: 'Failed', description: res.message, variant: 'destructive' });
      }
   }

   return (
       <DropdownMenu>
         <DropdownMenuTrigger asChild>
           <Button variant="ghost" className="h-8 w-8 p-0" disabled={isUpdating}>
             {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
           </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
           <DropdownMenuLabel>Change Status</DropdownMenuLabel>
           <DropdownMenuSeparator />
           
           {currentStatus !== 'Active' && (
             <DropdownMenuItem onClick={() => handleUpdate('Active')} className="text-green-600">
               <CheckCircle className="mr-2 h-4 w-4" /> Approve
             </DropdownMenuItem>
           )}
           
           {currentStatus !== 'Suspended' && (
             <DropdownMenuItem onClick={() => handleUpdate('Suspended')} className="text-red-600">
               <Ban className="mr-2 h-4 w-4" /> Suspend
             </DropdownMenuItem>
           )}
           
           {currentStatus !== 'Pending' && (
             <DropdownMenuItem onClick={() => handleUpdate('Pending')} className="text-yellow-600">
               <Clock className="mr-2 h-4 w-4" /> Mark Pending
             </DropdownMenuItem>
           )}
         </DropdownMenuContent>
       </DropdownMenu>
   )
}
