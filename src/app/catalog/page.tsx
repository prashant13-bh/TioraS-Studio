import { getProducts } from '@/app/actions/product-actions';
import ProductCard from '@/components/product-card';
import { ProductFilters } from '@/components/product-filters';
import type { Category } from '@/lib/types';
import { Suspense } from 'react';

export const metadata = {
    title: 'Catalog | TioraS',
    description: 'Explore our collection of premium menswear.',
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: {
    category?: Category;
  };
}) {
  const category = searchParams?.category || 'All';
  const { products } = await getProducts({ category });

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-5xl">
          Our Collection
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Discover meticulously crafted pieces for the modern man.
        </p>
      </header>

      <Suspense>
        <ProductFilters currentCategory={category} />
      </Suspense>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-semibold">No Products Found</h2>
          <p className="mt-2 text-muted-foreground">
            There are no products available in the &quot;{category}&quot; category.
          </p>
        </div>
      )}
    </div>
  );
}
