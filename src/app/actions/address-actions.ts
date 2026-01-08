'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getAdminFirestore } from '@/lib/firebase-admin';
import type { Address } from '@/lib/types';
import { verifySession } from '@/app/actions/auth-actions';

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
  const session = await verifySession();
  if (!session || session.uid !== data.userId) {
    return { success: false, message: 'Unauthorized' };
  }

  const validated = addressSchema.safeParse(data);
  
  if (!validated.success) {
    return { success: false, message: 'Invalid address data' };
  }

  try {
    const db = getAdminFirestore();
    const addressesRef = db.collection('users').doc(data.userId).collection('addresses');

    // If setting as default, unset other defaults
    if (data.isDefault) {
      const snapshot = await addressesRef.where('isDefault', '==', true).get();
      const batch = db.batch();
      snapshot.docs.forEach((d) => {
        batch.update(d.ref, { isDefault: false });
      });
      await batch.commit();
    }

    const newAddress = {
      ...data,
      createdAt: new Date().toISOString(),
    };

    await addressesRef.add(newAddress);
    revalidatePath('/dashboard/addresses');
    return { success: true, message: 'Address added successfully' };
  } catch (error) {
    console.error('Error adding address:', error);
    return { success: false, message: 'Failed to add address' };
  }
}

export async function updateAddressAction(userId: string, addressId: string, data: Partial<Address>) {
  const session = await verifySession();
  if (!session || session.uid !== userId) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const db = getAdminFirestore();
    const addressRef = db.collection('users').doc(userId).collection('addresses').doc(addressId);
    const addressesRef = db.collection('users').doc(userId).collection('addresses');

    // If setting as default, unset other defaults
    if (data.isDefault) {
      const snapshot = await addressesRef.where('isDefault', '==', true).get();
      const batch = db.batch();
      snapshot.docs.forEach((d) => {
        if (d.id !== addressId) {
            batch.update(d.ref, { isDefault: false });
        }
      });
      await batch.commit();
    }

    await addressRef.update(data);
    revalidatePath('/dashboard/addresses');
    return { success: true, message: 'Address updated successfully' };
  } catch (error) {
    console.error('Error updating address:', error);
    return { success: false, message: 'Failed to update address' };
  }
}

export async function deleteAddressAction(userId: string, addressId: string) {
  const session = await verifySession();
  if (!session || session.uid !== userId) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const db = getAdminFirestore();
    await db.collection('users').doc(userId).collection('addresses').doc(addressId).delete();
    revalidatePath('/dashboard/addresses');
    return { success: true, message: 'Address deleted successfully' };
  } catch (error) {
    console.error('Error deleting address:', error);
    return { success: false, message: 'Failed to delete address' };
  }
}


