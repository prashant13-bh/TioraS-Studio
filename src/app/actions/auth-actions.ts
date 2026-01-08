'use server';

import { cookies } from 'next/headers';
import { getAdminAuth } from '@/lib/firebase-admin';

const SESSION_COOKIE_NAME = '__session';
const EXPIRES_IN = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function createSession(idToken: string) {
  try {
    const auth = getAdminAuth();
    
    // Verify the ID token first
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Create a session cookie
    if (decodedToken) {
      const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: EXPIRES_IN });
      const cookieStore = await cookies();
      
      cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
        maxAge: EXPIRES_IN,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
      });
      
      return { success: true };
    }
    return { success: false, error: 'Invalid token' };
  } catch (error) {
    console.error('Error creating session:', error);
    return { success: false, error: 'Failed to create session' };
  }
}

export async function removeSession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    return { success: true };
  } catch (error) {
    console.error('Error removing session:', error);
    return { success: false, error: 'Failed to remove session' };
  }
}

export async function verifySession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return null;
    }

    const auth = getAdminAuth();
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      picture: decodedClaims.picture,
      isAdmin: decodedClaims.email === 'ph293815@gmail.com' || decodedClaims.email === 'tyoras9686@gmail.com' || decodedClaims.email === 'dsmullam@gmail.com'
    };
  } catch (error) {
    // Session verification failed (expired, invalid, etc.)
    return null;
  }
}
