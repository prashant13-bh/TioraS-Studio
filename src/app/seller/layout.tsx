import { checkVendorStatus } from '@/app/actions/vendor-actions';
import { redirect } from 'next/navigation';
import { SellerClientLayout } from './_components/seller-client-layout';

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isVendor, status } = await checkVendorStatus();

  // Route protection
  if (!isVendor) {
    redirect('/become-a-seller');
  }

  if (status !== 'Active') {
    // Alternatively, redirect to an "under review" page. We'll send them to the application landing page.
    redirect('/become-a-seller');
  }

  return <SellerClientLayout>{children}</SellerClientLayout>;
}
