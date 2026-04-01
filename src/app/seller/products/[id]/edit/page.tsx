import { getProductById } from '@/app/actions/product-actions';
import { verifySession } from '@/app/actions/auth-actions';
import { notFound, redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SellerProductForm } from '../../../_components/product-form';

export const metadata = {
    title: 'Edit Product | Vendor Central',
    description: 'Update your product details.',
};

export default async function SellerEditProductPage({ params: p }: { params: Promise<{ id: string }> }) {
  const params = await p;
  const session = await verifySession();
  if (!session || !session.isVendor) {
    redirect('/login');
  }

  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  // Ensure ownership
  if (product.vendorId !== session.uid) {
    redirect('/seller/products');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Product: {product.name}</CardTitle>
        <CardDescription>
          Update the details of your product below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SellerProductForm product={product} />
      </CardContent>
    </Card>
  );
}
