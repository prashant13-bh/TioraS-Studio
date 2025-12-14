
import { getCurrentUser } from '@/lib/auth/server-auth';
import { redirect } from 'next/navigation';
import { AdminClientLayout } from './_components/admin-client-layout';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // This is the server-side gatekeeper. If the user is not authenticated
  // or does not have the `isAdmin` flag, they are redirected.
  if (!user || !user.isAdmin) {
    redirect('/');
  }

  // If the user is an admin, we render the client-side layout which
  // contains the navigation and other UI elements.
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
