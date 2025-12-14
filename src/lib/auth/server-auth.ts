
import 'server-only';
import { getFirebaseAdmin } from '@/firebase/server-config';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { firebaseConfig } from '@/firebase/config';

async function getJwks() {
    const res = await fetch(`https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`);
    return res.json();
}

/**
 * Verifies a Firebase session cookie and returns the decoded token.
 * This should be used in server-side logic (Server Components, Route Handlers, Server Actions)
 * to protect resources and get the current user's identity.
 */
export async function getCurrentUser(): Promise<DecodedIdToken | null> {
    const sessionCookie = cookies().get('__session')?.value;

    if (!sessionCookie) {
        // Session cookie is not available.
        return null;
    }

    try {
        // We need to verify the cookie against the public keys from Google.
        const { keys } = await getJwks();
        const { payload } = await jwtVerify(sessionCookie, (header, alg) => {
            // Find the key that matches the key ID from the token header.
            const key = keys.find((k: { kid: string }) => k.kid === header.kid);
            if (!key) {
                throw new Error('JWK not found for the given kid');
            }
            // A simple way to import JWK to a format `jose` understands.
            // In a real app, you might want a more robust import mechanism.
            return Promise.resolve(new TextEncoder().encode(JSON.stringify(key)));
        }, {
            issuer: `https://securetoken.google.com/${firebaseConfig.projectId}`,
            audience: firebaseConfig.projectId,
            algorithms: ['RS256']
        });
        
        // Type assertion to treat the payload as a DecodedIdToken.
        // You might want more robust validation in a production app.
        return payload as DecodedIdToken;

    } catch (error) {
        console.error('Failed to verify session cookie:', error);
        return null;
    }
}
