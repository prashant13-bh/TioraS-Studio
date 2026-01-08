'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowUpCircle, ArrowDownCircle, History } from 'lucide-react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

interface StockMovement {
  id: string;
  productId: string;
  productName?: string;
  quantity: number;
  type: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT';
  reason?: string;
  createdAt: Date;
}

export default function MovementsPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const { firestore: db } = initializeFirebase();
        let movementsQuery = query(
          collection(db, 'stockMovements'),
          orderBy('createdAt', 'desc')
        );

        if (filter !== 'all') {
          movementsQuery = query(
            collection(db, 'stockMovements'),
            where('type', '==', filter),
            orderBy('createdAt', 'desc')
          );
        }

        const movementsSnap = await getDocs(movementsQuery);
        const movementsData = movementsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as StockMovement[];
        setMovements(movementsData);
      } catch (error) {
        console.error('Error fetching movements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, [filter]);

  const totalIn = movements.filter(m => m.type === 'STOCK_IN').reduce((sum, m) => sum + m.quantity, 0);
  const totalOut = movements.filter(m => m.type === 'STOCK_OUT').reduce((sum, m) => sum + m.quantity, 0);

  if (loading) {
    return <div className="flex h-96 items-center justify-center">Loading movements...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/inventory">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Stock Movement History</h1>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Movements</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{movements.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Stock In</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+{totalIn}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Out</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">-{totalOut}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Movements</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="STOCK_IN">Stock In</SelectItem>
              <SelectItem value="STOCK_OUT">Stock Out</SelectItem>
              <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.length > 0 ? (
                movements.map(movement => (
                  <TableRow key={movement.id}>
                    <TableCell>
                      {movement.createdAt.toLocaleDateString()} {movement.createdAt.toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={movement.type === 'STOCK_IN' ? 'default' : 'secondary'}>
                        {movement.type === 'STOCK_IN' && <ArrowUpCircle className="h-3 w-3 mr-1" />}
                        {movement.type === 'STOCK_OUT' && <ArrowDownCircle className="h-3 w-3 mr-1" />}
                        {movement.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{movement.productName || movement.productId}</TableCell>
                    <TableCell className={movement.type === 'STOCK_IN' ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                      {movement.type === 'STOCK_IN' ? '+' : '-'}{movement.quantity}
                    </TableCell>
                    <TableCell>{movement.reason || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No stock movements found
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
