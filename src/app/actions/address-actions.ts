'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getServerFirestore } from '@/lib/firebase-server';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import type { Address } from '@/lib/types';

const addressSchema = z.object({
  userId: z.string().min(1),
  label: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(10),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(6),
  isDefault: z.boolean(),
});

export async function addAddressAction(data: Omit<Address, 'id' | 'createdAt'>) {
  const validated = addressSchema.safeParse(data);
  
  if (!validated.success) {
    return { success: false, message: 'Invalid address data' };
  }

  try {
    const db = getServerFirestore();
    const addressesRef = collection(db, 'users', data.userId, 'addresses');

    // If setting as default, unset other defaults
    if (data.isDefault) {
      const q = query(addressesRef, where('isDefault', '==', true));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((d) => {
        batch.update(d.ref, { isDefault: false });
      });
      await batch.commit();
    }

    const newAddress = {
      ...data,
      createdAt: new Date().toISOString(),
    };

    await addDoc(addressesRef, newAddress);
    revalidatePath('/dashboard/addresses');
    return { success: true, message: 'Address added successfully' };
  } catch (error) {
    console.error('Error adding address:', error);
    return { success: false, message: 'Failed to add address' };
  }
}

export async function updateAddressAction(userId: string, addressId: string, data: Partial<Address>) {
  try {
    const db = getServerFirestore();
    const addressRef = doc(db, 'users', userId, 'addresses', addressId);
    const addressesRef = collection(db, 'users', userId, 'addresses');

    // If setting as default, unset other defaults
    if (data.isDefault) {
      const q = query(addressesRef, where('isDefault', '==', true));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((d) => {
        if (d.id !== addressId) {
            batch.update(d.ref, { isDefault: false });
        }
      });
      await batch.commit();
    }

    await updateDoc(addressRef, data);
    revalidatePath('/dashboard/addresses');
    return { success: true, message: 'Address updated successfully' };
  } catch (error) {
    console.error('Error updating address:', error);
    return { success: false, message: 'Failed to update address' };
  }
}

export async function deleteAddressAction(userId: string, addressId: string) {
  try {
    const db = getServerFirestore();
    const addressRef = doc(db, 'users', userId, 'addresses', addressId);
    await deleteDoc(addressRef);
    revalidatePath('/dashboard/addresses');
    return { success: true, message: 'Address deleted successfully' };
  } catch (error) {
    console.error('Error deleting address:', error);
    return { success: false, message: 'Failed to delete address' };
  }
}
