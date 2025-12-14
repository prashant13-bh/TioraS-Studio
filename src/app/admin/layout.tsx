
import { redirect } from 'next/navigation';
import { AdminClientLayout } from './_components/admin-client-layout';
import { getCurrentUser } from '@/lib/auth/server-auth';


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // If the user is not an admin, they are redirected.
  // This is the secure, server-side gatekeeper for the entire admin section.
  if (!user || !user.isAdmin) {
    redirect('/');
  }

  // If the user is an admin, we render the client-side layout which
  // contains the navigation and other UI elements.
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
