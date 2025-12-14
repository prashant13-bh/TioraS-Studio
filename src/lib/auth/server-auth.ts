
import 'server-only';
import { getFirebaseAdmin } from '@/firebase/server-config';
import { cookies } from 'next/headers';
import type { DecodedIdToken } from 'firebase-admin/auth';

// Augment the DecodedIdToken type to include our custom `isAdmin` role
export type UserWithRole = DecodedIdToken & {
    isAdmin?: boolean;
};

/**
 * Verifies a Firebase session cookie and returns the decoded token,
 * augmented with a server-side check for admin role.
 * This should be used in server-side logic to protect resources and get the current user's identity.
 */
export async function getCurrentUser(): Promise<UserWithRole | null> {
    const sessionCookie = cookies().get('__session')?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const { auth, firestore } = getFirebaseAdmin();
        
        // Use the Admin SDK to verify the session cookie.
        const decodedToken = await auth.verifySessionCookie(sessionCookie, true);

        // Securely check for admin role on the server
        const adminRoleDoc = await firestore.collection('roles_admin').doc(decodedToken.uid).get();
        
        const user: UserWithRole = {
            ...decodedToken,
            isAdmin: adminRoleDoc.exists,
        };

        return user;

    } catch (error) {
        // Session cookie is invalid or expired.
        // It's normal for this to happen, so we don't need to log it as a server error.
        return null;
    }
}
