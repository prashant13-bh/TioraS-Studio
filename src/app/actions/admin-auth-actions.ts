'use server';

import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isAdminEmail } from '@/lib/admin-config';

export async function checkAdminAccess() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('__session')?.value;

  if (!sessionCookie) {
    return false;
  }

  try {
    const auth = getAdminAuth();
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    // 1. Check direct config email match
    if (isAdminEmail(decodedClaims.email)) return true;
    
    // 2. Check custom user claims
    if (decodedClaims.admin === true) return true;
    
    // 3. Check Firestore document role
    const db = getAdminFirestore();
    const userDoc = await db.collection('users').doc(decodedClaims.uid).get();
    return userDoc.exists && userDoc.data()?.role === 'admin';
  } catch (error) {
    return false;
  }
}

export async function setAdminRole(uid: string) {
  try {
    const auth = getAdminAuth();
    await auth.setCustomUserClaims(uid, { admin: true });
    return { success: true };
  } catch (error) {
    console.error('Error setting admin role:', error);
    return { success: false, error: 'Failed to set admin role' };
  }
}

export async function removeAdminRole(uid: string) {
  try {
    const auth = getAdminAuth();
    await auth.setCustomUserClaims(uid, { admin: false });
    return { success: true };
  } catch (error) {
    console.error('Error removing admin role:', error);
    return { success: false, error: 'Failed to remove admin role' };
  }
}
