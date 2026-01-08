'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2, FileDown } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { downloadInvoice } from '@/lib/invoice-generator';

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([{ name: '', quantity: 1, price: 0, total: 0 }]);
  const [taxRate, setTaxRate] = useState(18);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const { firestore: db } = initializeFirebase();
      const productsSnap = await getDocs(collection(db, 'products'));
      const productsData = productsSnap.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        price: doc.data().price || 0
      }));
      setProducts(productsData);
    };
    fetchProducts();
  }, []);

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    if (field === 'name') {
      newItems[index].name = value as string;
      const product = products.find(p => p.name === value);
      if (product) {
        newItems[index].price = product.price;
        newItems[index].total = product.price * newItems[index].quantity;
      }
    } else if (field === 'quantity' || field === 'price') {
      newItems[index][field] = Number(value);
      newItems[index].total = newItems[index].quantity * newItems[index].price;
    }
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax;

  const generateInvoiceNumber = () => {
    const date = new Date();
    return `INV-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || items.length === 0 || items.some(i => !i.name)) {
      toast.error('Please fill customer name and add at least one item');
      return;
    }

    setLoading(true);
    try {
      const { firestore: db } = initializeFirebase();
      const invoiceNumber = generateInvoiceNumber();

      const invoiceData = {
        number: invoiceNumber,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        items,
        subtotal,
        tax,
        taxRate,
        total,
        notes,
        status: 'DRAFT',
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, 'invoices'), invoiceData);

      // Generate and download PDF
      downloadInvoice({
        invoiceNumber,
        date: new Date(),
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: customerAddress
        },
        items,
        subtotal,
        tax,
        taxRate,
        total,
        notes,
        companyName: 'TioraS Studio',
        companyAddress: 'Premium Fashion House'
      });

      toast.success('Invoice created and downloaded!');
      router.push('/admin/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/invoices">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">New Invoice</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Details */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Customer Name *</Label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 9876543210"
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Customer address"
              />
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Invoice Items</CardTitle>
            <Button type="button" onClick={addItem} variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid gap-4 md:grid-cols-5 items-end">
                <div className="space-y-2 md:col-span-2">
                  <Label>Product</Label>
                  <Select value={item.name} onValueChange={(v) => updateItem(index, 'name', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(p => (
                        <SelectItem key={p.id} value={p.name}>
                          {p.name} - ₹{p.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">₹{item.total.toFixed(2)}</span>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Totals & Notes */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes for the invoice..."
                rows={4}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>Tax</span>
                  <Input
                    type="number"
                    className="w-16 h-8"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                  />
                  <span>%</span>
                </div>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="gap-2">
            <FileDown className="h-4 w-4" />
            {loading ? 'Creating...' : 'Create & Download Invoice'}
          </Button>
          <Link href="/admin/invoices">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
