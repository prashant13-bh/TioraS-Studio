
import { AdminClientLayout } from './_components/admin-client-layout';
import { getCurrentUser } from '@/lib/auth/mock-auth'; // Using mock auth
import { redirect } from 'next/navigation';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
