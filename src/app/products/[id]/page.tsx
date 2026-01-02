
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById, getProducts } from '@/app/actions/product-actions';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import ProductCard from '@/components/product-card';
import { AddToCartForm } from './_components/add-to-cart-form';
import { ProductImageGallery } from './_components/product-image-gallery';
import { ProductReviews } from './_components/product-reviews';

export async function generateMetadata({ params: p }: { params: { id: string } }) {
  const params = await p;
  const product = await getProductById(params.id);
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }
  return {
    title: `${product.name} | TioraS`,
    description: product.description,
  };
}

export default async function ProductPage({ params: p }: { params: { id: string } }) {
  const params = await p;
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  const { products: relatedProducts } = await getProducts({
    category: product.category,
    limit: 5,
  });

  // Filter out the current product from related products
  const filteredRelatedProducts = relatedProducts.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-4 md:mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/catalog">Catalog</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        <div className="md:col-span-1">
           <ProductImageGallery product={product} />
           {product.isNew && (
            <Badge className="absolute left-4 top-4 font-bold bg-primary">New Arrival</Badge>
          )}
        </div>

        <div className="md:col-span-1 flex flex-col">
          <h1 className="font-headline text-2xl font-bold tracking-tighter md:text-3xl lg:text-4xl">{product.name}</h1>
          <p className="mt-2 text-xl font-semibold text-foreground md:text-2xl">₹{product.price.toFixed(2)}</p>
          <p className="mt-4 text-muted-foreground">{product.description}</p>
          
          <div className="mt-auto pt-8">
             <AddToCartForm product={product} />
          </div>
        </div>
      </div>

      <ProductReviews productId={product.id} />

      {filteredRelatedProducts.length > 0 && (
        <div className="mt-16 md:mt-24">
          <h2 className="mb-8 text-center font-headline text-2xl font-bold tracking-tighter md:text-3xl">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {filteredRelatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
