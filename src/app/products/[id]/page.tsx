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
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export async function generateMetadata({ params }: { params: { id: string } }) {
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

export default async function ProductPage({ params }: { params: { id: string } }) {
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
    <>
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb className="mb-8">
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
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                data-ai-hint={`${product.category.toLowerCase()} clothing`}
              />
              {product.isNew && (
                <Badge className="absolute left-4 top-4 bg-primary font-bold">New Arrival</Badge>
              )}
            </div>

            <div className="flex flex-col">
              <h1 className="font-headline text-4xl font-bold tracking-tighter">{product.name}</h1>
              <p className="mt-2 text-2xl font-semibold text-foreground">₹{product.price.toFixed(2)}</p>
              <p className="mt-4 text-muted-foreground">{product.description}</p>
              
              <div className="mt-auto pt-8">
                 <AddToCartForm product={product} />
              </div>
            </div>
          </div>

          {filteredRelatedProducts.length > 0 && (
            <div className="mt-16 md:mt-24">
              <h2 className="mb-8 text-center font-headline text-3xl font-bold tracking-tighter">Related Products</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredRelatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
