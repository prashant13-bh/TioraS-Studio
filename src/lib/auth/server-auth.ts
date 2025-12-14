
import 'server-only';
import { getFirebaseAdmin } from '@/firebase/server-config';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { firebaseConfig } from '@/firebase/config';

// Augment the DecodedIdToken type to include our custom `isAdmin` role
export type UserWithRole = DecodedIdToken & {
    isAdmin?: boolean;
};

async function getJwks() {
    const res = await fetch(`https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`);
    if (!res.ok) {
        throw new Error('Failed to fetch JWKS for token verification.');
    }
    return res.json();
}

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
        const { keys } = await getJwks();
        const { payload } = await jwtVerify(sessionCookie, (header, alg) => {
            const key = keys.find((k: { kid: string }) => k.kid === header.kid);
            if (!key) {
                throw new Error('JWK not found for the given kid');
            }
            // A simple way to import JWK to a format `jose` understands.
            return Promise.resolve(new TextEncoder().encode(JSON.stringify(key)));
        }, {
            issuer: `https://securetoken.google.com/${firebaseConfig.projectId}`,
            audience: firebaseConfig.projectId,
            algorithms: ['RS256']
        });
        
        let decodedToken = payload as UserWithRole;

        // Securely check for admin role on the server
        const { firestore } = getFirebaseAdmin();
        const adminRoleDoc = await firestore.collection('roles_admin').doc(decodedToken.uid).get();
        
        if (adminRoleDoc.exists) {
            decodedToken.isAdmin = true;
        } else {
            decodedToken.isAdmin = false;
        }

        return decodedToken;

    } catch (error) {
        console.error('Failed to verify session cookie or check admin role:', error);
        return null;
    }
}
