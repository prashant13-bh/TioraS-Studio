'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, MapPin, Plus } from 'lucide-react';
import type { Address } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
}

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  return (
    <Card className="relative overflow-hidden">
      {address.isDefault && (
        <div className="absolute right-0 top-0 rounded-bl-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          Default
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {address.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm">
          <p className="font-semibold">{address.name}</p>
          <p>{address.line1}</p>
          {address.line2 && <p>{address.line2}</p>}
          <p>
            {address.city}, {address.state} {address.pincode}
          </p>
          <p className="text-muted-foreground mt-2">{address.phone}</p>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => onEdit(address)}>
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Address?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this address? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(address.id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
