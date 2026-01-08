'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, ArrowUpCircle, ArrowDownCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

interface Product {
  id: string;
  name: string;
  stock: number;
  sku?: string;
}

interface StockMovement {
  id: string;
  productId: string;
  productName?: string;
  quantity: number;
  type: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT';
  reason?: string;
  createdAt: Date;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { firestore: db } = initializeFirebase();
        
        // Fetch products
        const productsSnap = await getDocs(collection(db, 'products'));
        const productsData = productsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productsData);

        // Fetch recent stock movements
        const movementsRef = collection(db, 'stockMovements');
        const movementsQuery = query(movementsRef, orderBy('createdAt', 'desc'), limit(10));
        const movementsSnap = await getDocs(movementsQuery);
        const movementsData = movementsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as StockMovement[];
        setMovements(movementsData);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const lowStockProducts = products.filter(p => (p.stock || 0) < 10);
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  if (loading) {
    return <div className="flex h-96 items-center justify-center">Loading inventory...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <div className="flex gap-2">
          <Link href="/admin/inventory/stock-in">
            <Button className="gap-2">
              <ArrowUpCircle className="h-4 w-4" />
              Stock In
            </Button>
          </Link>
          <Link href="/admin/inventory/stock-out">
            <Button variant="outline" className="gap-2">
              <ArrowDownCircle className="h-4 w-4" />
              Stock Out
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
          </CardContent>
        </Card>
        <Card className={lowStockProducts.length > 0 ? 'border-destructive' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">{product.stock}</Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/inventory/stock-in?productId=${product.id}`}>
                        <Button size="sm">Restock</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Recent Movements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Stock Movements</CardTitle>
          <Link href="/admin/inventory/movements">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.length > 0 ? (
                movements.map(movement => (
                  <TableRow key={movement.id}>
                    <TableCell>
                      <Badge variant={movement.type === 'STOCK_IN' ? 'default' : 'secondary'}>
                        {movement.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{movement.productName || movement.productId}</TableCell>
                    <TableCell className={movement.type === 'STOCK_IN' ? 'text-green-500' : 'text-red-500'}>
                      {movement.type === 'STOCK_IN' ? '+' : '-'}{movement.quantity}
                    </TableCell>
                    <TableCell>{movement.reason || '-'}</TableCell>
                    <TableCell>{movement.createdAt.toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No stock movements yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
