'use server';

import { auth } from 'firebase-admin';
import { getFirebaseAdminApp } from '@/firebase/admin';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Initialize Firebase Admin
const adminApp = getFirebaseAdminApp();

export async function checkAdminAccess() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    return false;
  }

  try {
    const decodedClaims = await auth(adminApp).verifySessionCookie(sessionCookie, true);
    return decodedClaims.admin === true;
  } catch (error) {
    return false;
  }
}

export async function setAdminRole(uid: string) {
  try {
    await auth(adminApp).setCustomUserClaims(uid, { admin: true });
    return { success: true };
  } catch (error) {
    console.error('Error setting admin role:', error);
    return { success: false, error: 'Failed to set admin role' };
  }
}

export async function removeAdminRole(uid: string) {
  try {
    await auth(adminApp).setCustomUserClaims(uid, { admin: false });
    return { success: true };
  } catch (error) {
    console.error('Error removing admin role:', error);
    return { success: false, error: 'Failed to remove admin role' };
  }
}
