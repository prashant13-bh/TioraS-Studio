'use server';

import { getAdminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function checkAdminAccess() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('__session')?.value;

  if (!sessionCookie) {
    return false;
  }

  try {
    const auth = getAdminAuth();
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    return decodedClaims.admin === true;
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
