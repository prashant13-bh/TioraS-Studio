import { getProducts } from '@/app/actions/product-actions';
import { verifySession } from '@/app/actions/auth-actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle, Package, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function SellerProductsPage() {
  const session = await verifySession();
  if (!session || !session.isVendor) {
    redirect('/login');
  }

  const { products } = await getProducts({ vendorId: session.uid });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Manage Products</h1>
          <p className="text-muted-foreground mt-1">Add and manage the products you fulfill.</p>
        </div>
        <Button asChild>
          <Link href="/seller/products/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Catalog</CardTitle>
          <CardDescription>Total {products.length} products listed.</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No products yet</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first product to the catalog.</p>
              <Button asChild>
                <Link href="/seller/products/add">Add Product</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.media?.[0]?.url ? (
                          <div className="relative h-12 w-12 overflow-hidden rounded-md">
                            <Image
                              src={product.media[0].url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-sm font-mono">{product.sku}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={(product.stock || 0) < 10 ? 'destructive' : 'secondary'}>
                          {product.stock || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/seller/products/${product.id}/edit`}>Edit</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
