import { AdminClientLayout } from './_components/admin-client-layout';
import { checkAdminAccess } from '@/app/actions/admin-auth-actions';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await checkAdminAccess();

  if (!isAdmin) {
    redirect('/login');
  }

  return <AdminClientLayout>{children}</AdminClientLayout>;
}
