
import { getFirebaseAdmin } from '@/firebase/server-config';
import { cookies } from 'next/headers';
import type { UserRecord } from 'firebase-admin/auth';
import 'server-only';

export type UserWithRole = UserRecord & { isAdmin: boolean };

/**
 * @description Retrieves the current user from the session cookie and determines their admin status.
 * This function is for SERVER-SIDE use only.
 * @returns {Promise<UserWithRole | null>} The user object with an `isAdmin` flag, or null if not authenticated.
 */
export async function getCurrentUser(): Promise<UserWithRole | null> {
    const sessionCookie = cookies().get('__session')?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const admin = getFirebaseAdmin();
        const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
        
        // Get the full user record to access all properties
        const userRecord = await admin.auth().getUser(decodedToken.uid);

        // Check for admin role in Firestore
        const adminRoleDoc = await admin.firestore().collection('roles_admin').doc(decodedToken.uid).get();
        const isAdmin = adminRoleDoc.exists;

        return {
            ...userRecord,
            isAdmin,
        };

    } catch (error) {
        // This will catch expired cookies, invalid cookies, etc.
        // console.error('Error verifying session cookie:', error);
        return null;
    }
}
