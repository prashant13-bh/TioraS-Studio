'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { initializeFirebase } from '@/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { addAddressAction, updateAddressAction, deleteAddressAction } from '@/app/actions/address-actions';
import { AddressForm } from '@/components/dashboard/address-form';
import { AddressCard } from '@/components/dashboard/address-card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Address } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AddressesPage() {
  const { user, loading: userLoading } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const { firestore: db } = initializeFirebase();
    const addressesRef = collection(db, 'users', user.uid, 'addresses');
    const q = query(addressesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Address[];
      setAddresses(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAdd = () => {
    setEditingAddress(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleDelete = async (addressId: string) => {
    if (!user) return;
    const result = await deleteAddressAction(user.uid, addressId);
    if (result.success) {
      toast({ title: 'Success', description: result.message });
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
  };

  const handleSubmit = async (data: any) => {
    if (!user) return;

    let result;
    if (editingAddress) {
      result = await updateAddressAction(user.uid, editingAddress.id, data);
    } else {
      result = await addAddressAction({ ...data, userId: user.uid });
    }

    if (result.success) {
      toast({ title: 'Success', description: result.message });
      setIsDialogOpen(false);
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           {/* No headline as per user request */}
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Plus className="h-10 w-10 text-muted-foreground opacity-50" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No addresses found</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
            Add a shipping address to speed up checkout.
          </p>
          <Button onClick={handleAdd}>Add Address</Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          </DialogHeader>
          <AddressForm
            initialData={editingAddress}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
