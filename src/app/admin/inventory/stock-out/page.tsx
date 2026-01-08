'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowDownCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { collection, getDocs, addDoc, doc, updateDoc, increment, Timestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

interface Product {
  id: string;
  name: string;
  stock: number;
}

const STOCK_OUT_REASONS = [
  'Sale',
  'Damaged',
  'Lost',
  'Return to supplier',
  'Sample/Gift',
  'Adjustment',
  'Other'
];

export default function StockOutPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
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

  const selectedProductData = products.find(p => p.id === selectedProduct);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !quantity || !reason) {
      toast.error('Please fill all required fields');
      return;
    }

    const qty = parseInt(quantity);
    if (selectedProductData && qty > selectedProductData.stock) {
      toast.error('Quantity exceeds available stock');
      return;
    }

    setLoading(true);
    try {
      const { firestore: db } = initializeFirebase();
      const finalReason = reason === 'Other' ? customReason : reason;

      // Add stock movement record
      await addDoc(collection(db, 'stockMovements'), {
        productId: selectedProduct,
        productName: selectedProductData?.name,
        quantity: qty,
        type: 'STOCK_OUT',
        reason: finalReason,
        createdAt: Timestamp.now()
      });

      // Update product stock
      const productRef = doc(db, 'products', selectedProduct);
      await updateDoc(productRef, {
        stock: increment(-qty)
      });

      toast.success(`Removed ${qty} units from stock`);
      router.push('/admin/inventory');
    } catch (error) {
      console.error('Error removing stock:', error);
      toast.error('Failed to remove stock');
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
        <h1 className="text-3xl font-bold">Stock Out</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowDownCircle className="h-5 w-5 text-red-500" />
            Record Outgoing Stock
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
                      {product.name} (Available: {product.stock})
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
                max={selectedProductData?.stock || 999}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
              {selectedProductData && (
                <p className="text-sm text-muted-foreground">
                  Available: {selectedProductData.stock} units
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {STOCK_OUT_REASONS.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {reason === 'Other' && (
              <div className="space-y-2">
                <Label htmlFor="customReason">Specify Reason</Label>
                <Textarea
                  id="customReason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Enter custom reason"
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} variant="destructive" className="gap-2">
                <ArrowDownCircle className="h-4 w-4" />
                {loading ? 'Removing...' : 'Remove Stock'}
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
