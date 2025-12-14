import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProductForm } from '../_components/product-form';

export const metadata = {
    title: 'New Product | TioraS Admin',
    description: 'Add a new product to the store.',
};

export default function NewProductPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
        <CardDescription>
          Fill out the details below to add a new product to your inventory.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProductForm />
      </CardContent>
    </Card>
  );
}
