'use server';

import { z } from 'zod';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { verifySession } from '@/app/actions/auth-actions';
import { Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import type { VendorProfile, Address, PayoutSettings } from '@/lib/types';

// Validation schemas tailored for the onboarding form
const addressSchema = z.object({
  line1: z.string().min(5, 'Street address is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(5, 'Valid Zip/PIN code is required'),
});

const capabilitiesSchema = z.object({
  dtfPrinting: z.boolean().default(false),
  embroidery: z.boolean().default(false),
  cutAndSew: z.boolean().default(false),
}).refine(data => data.dtfPrinting || data.embroidery || data.cutAndSew, {
  message: "You must select at least one manufacturing capability.",
  path: ["root"]
});

const payoutSchema = z.object({
  bankName: z.string().min(2, 'Bank Name is required'),
  accountName: z.string().min(2, 'Account Holder Name is required'),
  accountNumber: z.string().min(5, 'Account Number is required'),
  ifscCode: z.string().min(5, 'IFSC/Swift routing code is required'),
  upiId: z.string().optional(),
});

const vendorApplicationSchema = z.object({
  storeName: z.string().min(3, 'Store Name must be at least 3 characters'),
  description: z.string().min(20, 'Please provide a brief description (min 20 chars)'),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(10, 'Valid contact number is required'),
  address: addressSchema,
  capabilities: capabilitiesSchema,
  payoutSettings: payoutSchema,
});

export async function submitVendorApplicationAction(formData: any) {
  const session = await verifySession();
  
  if (!session) {
    return { success: false, message: 'You must be logged in to apply as a seller.' };
  }

  // Validate the incoming form payload against Zod
  const validation = vendorApplicationSchema.safeParse(formData);

  if (!validation.success) {
    console.error('Vendor Validation Error:', validation.error.flatten());
    return { 
      success: false, 
      message: 'Invalid application data.',
      errors: validation.error.flatten().fieldErrors 
    };
  }

  const db = getAdminFirestore();

  try {
    // Check if user already applied
    const existingDoc = await db.collection('vendors').doc(session.uid).get();
    if (existingDoc.exists) {
        return { success: false, message: 'You have already submitted a vendor application.' };
    }

    const validData = validation.data;
    
    // Create the store slug (lowercase, alphanumeric, dashes)
    const storeSlug = validData.storeName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const now = Timestamp.now();
    
    // Construct the VendorProfile payload adhering strictly to our types.ts schema
    const newVendorProfile: VendorProfile = {
      id: session.uid,
      storeName: validData.storeName,
      storeSlug,
      description: validData.description,
      status: "Pending", // Always starts as pending for Admin review
      contactEmail: validData.contactEmail,
      contactPhone: validData.contactPhone,
      address: {
          id: `addr_${Date.now()}`,
          userId: session.uid,
          label: 'Business',
          name: validData.storeName,
          phone: validData.contactPhone,
          ...validData.address,
          isDefault: true,
          createdAt: new Date().toISOString()
      },
      capabilities: validData.capabilities,
      metrics: {
        totalSales: 0,
        totalOrders: 0,
        rating: 0,
        reviewCount: 0,
      },
      payoutSettings: validData.payoutSettings,
      // Temporarily store as ISO strings for insertion, Firestore allows this or Timestamp
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Note: To perfectly match Firebase-Admin timestamping, we override it right before inserting.
    // However, our type strictly wants strings right now. Let's send it as is.
    await db.collection('vendors').doc(session.uid).set(newVendorProfile);

    // Optionally: Update user's profile to reflect they are an applicant
    // NOT converting them to Admin, just a flag if needed. We'll rely on the vendor document existence.

    revalidatePath('/admin/vendors');
    return { success: true, message: 'Application submitted successfully! Please await admin approval.' };

  } catch (error: any) {
    console.error('Failed to submit vendor application:', error);
    return { success: false, message: error.message || 'Failed to submit application. Please try again.' };
  }
}

export async function checkVendorStatus() {
  const session = await verifySession();
  if (!session) return { isVendor: false, status: null };

  try {
     const db = getAdminFirestore();
     const doc = await db.collection('vendors').doc(session.uid).get();
     
     if (!doc.exists) {
         return { isVendor: false, status: null };
     }

     const vendorData = doc.data() as VendorProfile;
     return { 
         isVendor: true, 
         status: vendorData.status 
     };
  } catch(error) {
     console.error("Checking vendor status failed", error);
     return { isVendor: false, status: null };
  }
}

export async function updateVendorStatusAction(vendorId: string, status: "Pending" | "Active" | "Suspended") {
  const session = await verifySession();
  if (!session || !session.isAdmin) {
      return { success: false, message: 'Unauthorized. Admin access required.' };
  }

  const db = getAdminFirestore();

  try {
      await db.collection('vendors').doc(vendorId).update({
          status,
          updatedAt: new Date().toISOString()
      });
      revalidatePath('/admin/vendors');
      return { success: true, message: `Vendor marked as ${status}.` };
  } catch(error: any) {
      console.error("Error updating vendor status:", error);
      return { success: false, message: error.message || 'Failed to update vendor status.' };
  }
}

// ─── Order Fulfillment Actions ──────────────────────────────

const VALID_ORDER_STATUSES = ['pre-press', 'printing', 'packing', 'shipped'] as const;
type OrderFulfillmentStatus = typeof VALID_ORDER_STATUSES[number];

export async function updateOrderStatusAction(orderId: string, newStatus: string) {
  const session = await verifySession();
  if (!session) {
      return { success: false, message: 'Unauthorized.' };
  }

  if (!VALID_ORDER_STATUSES.includes(newStatus as OrderFulfillmentStatus)) {
      return { success: false, message: 'Invalid order status.' };
  }

  const db = getAdminFirestore();

  try {
      // Map kanban status to a user-facing order status
      const displayStatusMap: Record<string, string> = {
          'pre-press': 'Processing',
          'printing': 'Printing',
          'packing': 'Packing',
          'shipped': 'Shipped',
      };

      await db.collection('orders').doc(orderId).update({
          fulfillmentStatus: newStatus,
          status: displayStatusMap[newStatus] || 'Processing',
          updatedAt: new Date().toISOString()
      });

      revalidatePath('/seller/orders');
      return { success: true, message: `Order moved to ${newStatus}.` };
  } catch(error: any) {
      console.error("Error updating order status:", error);
      return { success: false, message: error.message || 'Failed to update order status.' };
  }
}

export async function getVendorOrders() {
  const session = await verifySession();
  if (!session) return [];

  const db = getAdminFirestore();
  
  try {
      // Filter by vendorId (which is the session user's ID for vendors)
      const snapshot = await db.collection('orders')
          .where('vendorId', '==', session.uid)
          .orderBy('createdAt', 'desc')
          .limit(50)
          .get();

      return snapshot.docs.map((doc: any) => {
          const data = doc.data();
          return {
              id: doc.id,
              orderNumber: data.orderNumber || doc.id,
              product: data.items?.[0]?.name || 'Custom Order',
              customer: data.shippingAddr?.name || 'Customer',
              status: data.fulfillmentStatus || 'pre-press',
              priority: data.isSyog ? 'high' : 'normal',
              type: data.isSyog ? 'syog' : 'dtf',
              total: data.total || 0,
          };
      });
  } catch (error) {
      console.error("Error fetching vendor orders:", error);
      return [];
  }
}
