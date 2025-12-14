
import type { UserProfile } from '@/lib/types';

// Mock user store
const MOCK_USERS: (UserProfile & { password?: string })[] = [
    {
        id: 'admin-user-id',
        email: 'admin@tioras.com',
        displayName: 'Tioras Admin',
        isAdmin: true,
        createdAt: new Date().toISOString(),
        photoURL: 'https://i.pravatar.cc/150?u=admin'
    },
    {
        id: 'regular-user-id',
        email: 'user@tioras.com',
        displayName: 'Regular User',
        isAdmin: false,
        createdAt: new Date().toISOString(),
        photoURL: 'https://i.pravatar.cc/150?u=user'
    }
];

// This is a placeholder for a real session management system (like cookies)
let currentUserId: string | null = 'admin-user-id'; // Default to admin for demonstration

/**
 * @description Mock function to simulate retrieving the current user from a session.
 * This is for SERVER-SIDE use only.
 * @returns {Promise<UserProfile | null>} The user object with an `isAdmin` flag, or null.
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
    if (!currentUserId) {
        return null;
    }
    const user = MOCK_USERS.find(u => u.id === currentUserId);
    return user || null;
}

/**
 * Mock function to simulate a login process.
 * In a real app, this would set a secure session cookie.
 */
export function mockLogin(userId: string) {
    currentUserId = userId;
}

/**
 * Mock function to simulate a logout process.
 */
export function mockLogout() {
    currentUserId = null;
}
