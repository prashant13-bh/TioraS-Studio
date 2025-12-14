

import { redirect } from 'next/navigation';
import { AdminClientLayout } from './_components/admin-client-layout';
import type { UserProfile } from '@/lib/types';

// Mock implementation to allow admin access during development
// In a real scenario, this would be replaced with secure server-side session validation
const getMockAdminUser = async (): Promise<UserProfile | null> => {
    // This mock user assumes an admin is logged in.
    // To test non-admin access, you can return null.
    return {
        id: 'admin_user_id',
        displayName: 'Admin User',
        email: 'admin@tioras.com',
        photoURL: null,
        isAdmin: true,
        createdAt: new Date().toISOString(),
    };
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMockAdminUser();

  // If the user is not an admin, they are redirected.
  if (!user || !user.isAdmin) {
    redirect('/');
  }

  // If the user is an admin, we render the client-side layout which
  // contains the navigation and other UI elements.
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
