'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { assignOrderToVendor } from '@/app/actions/admin-actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VendorProfile } from '@/lib/types';

interface VendorAssignmentProps {
  orderId: string;
  currentVendorId?: string;
  vendors: VendorProfile[];
}

export function OrderVendorAssignment({ orderId, currentVendorId, vendors }: VendorAssignmentProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const [selectedVendor, setSelectedVendor] = useState(currentVendorId || "");

  const handleAssign = async () => {
    if (!selectedVendor) return;
    
    setIsUpdating(true);
    try {
      const res = await assignOrderToVendor(orderId, selectedVendor);
      if (res.success) {
        toast({ title: 'Success', description: res.message });
      } else {
        toast({ title: 'Error', description: res.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to assign vendor', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold">Assign Fulfillment Vendor</label>
      <div className="flex gap-2">
        <Select value={selectedVendor} onValueChange={setSelectedVendor}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a vendor" />
          </SelectTrigger>
          <SelectContent>
            {vendors.length === 0 ? (
              <SelectItem value="none" disabled>No active vendors</SelectItem>
            ) : (
              vendors.map((vendor) => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  {vendor.storeName}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <Button 
          size="sm" 
          onClick={handleAssign} 
          disabled={isUpdating || !selectedVendor || selectedVendor === currentVendorId}
        >
          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
          Assign
        </Button>
      </div>
      {currentVendorId && (
        <p className="text-xs text-muted-foreground">
          Currently assigned to: {vendors.find(v => v.id === currentVendorId)?.storeName || "Unknown Vendor"}
        </p>
      )}
    </div>
  );
}
