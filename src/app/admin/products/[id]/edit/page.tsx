import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProductForm } from '../../_components/product-form';
import { getProductById } from '@/app/actions/product-actions';
import { notFound } from 'next/navigation';

export const metadata = {
    title: 'Edit Product | TioraS Admin',
    description: 'Edit an existing product.',
};

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
      notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
        <CardDescription>
          Update the details for &quot;{product.name}&quot;.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProductForm product={product} />
      </CardContent>
    </Card>
  );
}
