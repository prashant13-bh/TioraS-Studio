'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowUpCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { collection, getDocs, addDoc, doc, updateDoc, increment, Timestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

interface Product {
  id: string;
  name: string;
  stock: number;
}

export default function StockInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProductId = searchParams.get('productId');

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState(preselectedProductId || '');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const { firestore: db } = initializeFirebase();
      const productsSnap = await getDocs(collection(db, 'products'));
      const productsData = productsSnap.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        stock: doc.data().stock || 0
      }));
      setProducts(productsData);
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !quantity) {
      toast.error('Please select a product and enter quantity');
      return;
    }

    setLoading(true);
    try {
      const { firestore: db } = initializeFirebase();
      const qty = parseInt(quantity);

      // Add stock movement record
      await addDoc(collection(db, 'stockMovements'), {
        productId: selectedProduct,
        productName: products.find(p => p.id === selectedProduct)?.name,
        quantity: qty,
        type: 'STOCK_IN',
        reason: reason || 'Stock received',
        createdAt: Timestamp.now()
      });

      // Update product stock
      const productRef = doc(db, 'products', selectedProduct);
      await updateDoc(productRef, {
        stock: increment(qty)
      });

      toast.success(`Added ${qty} units to stock`);
      router.push('/admin/inventory');
    } catch (error) {
      console.error('Error adding stock:', error);
      toast.error('Failed to add stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/inventory">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Stock In</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-green-500" />
            Record Incoming Stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (Current: {product.stock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Supplier delivery, Manufacturing batch"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="gap-2">
                <ArrowUpCircle className="h-4 w-4" />
                {loading ? 'Adding...' : 'Add Stock'}
              </Button>
              <Link href="/admin/inventory">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
