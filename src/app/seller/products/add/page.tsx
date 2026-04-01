import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SellerProductForm } from '../../_components/product-form';

export const metadata = {
    title: 'New Product | Vendor Central',
    description: 'Add a new product to your seller catalog.',
};

export default function SellerNewProductPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
        <CardDescription>
          Fill out the details below to add a new product to your catalog.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SellerProductForm />
      </CardContent>
    </Card>
  );
}
