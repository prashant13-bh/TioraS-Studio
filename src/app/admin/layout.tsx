
import { AdminClientLayout } from './_components/admin-client-layout';
import { getCurrentUser } from '@/lib/auth/mock-auth'; // Using mock auth
import { redirect } from 'next/navigation';


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // In this mock setup, we still perform a "server-side" check.
  // In a real app, getCurrentUser would hit a live auth service.
  if (!user || !user.isAdmin) {
    redirect('/');
  }
  
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
