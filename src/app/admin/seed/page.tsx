'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { collection, addDoc, Timestamp, getDocs } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { Database, Check, AlertCircle } from 'lucide-react';

const SEED_PRODUCTS = [
  {
    name: 'TioraS Signature Tee',
    description: 'Experience the perfect blend of comfort and style with our signature tee. Made from 100% premium pima cotton.',
    price: 2499,
    category: 'T-Shirt',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#000000', '#FFFFFF', '#4B5563'],
    media: [{ type: 'image', url: 'https://picsum.photos/seed/tshirt1/600/800' }],
    isNew: true,
    stock: 50,
    sku: 'TS-SIG-001',
  },
  {
    name: 'Urban Explorer Hoodie',
    description: 'Our Urban Explorer Hoodie is crafted from heavyweight fleece-back jersey for maximum warmth and comfort.',
    price: 5499,
    category: 'Hoodie',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#1F2937', '#9CA3AF'],
    media: [{ type: 'image', url: 'https://picsum.photos/seed/hoodie1/600/800' }],
    isNew: true,
    stock: 30,
    sku: 'HD-URB-001',
  },
  {
    name: 'Tech-Wear Jacket',
    description: 'A versatile, all-weather jacket made from water-resistant technical fabric with sealed seams.',
    price: 8999,
    category: 'Jacket',
    sizes: ['M', 'L', 'XL'],
    colors: ['#000000'],
    media: [{ type: 'image', url: 'https://picsum.photos/seed/jacket1/600/800' }],
    isNew: false,
    stock: 20,
    sku: 'JK-TCH-001',
  },
  {
    name: 'Minimalist Logo Cap',
    description: 'A classic six-panel cap made from durable cotton twill with subtle embroidered logo.',
    price: 1499,
    category: 'Cap',
    sizes: ['One Size'],
    colors: ['#000000', '#F3F4F6'],
    media: [{ type: 'image', url: 'https://picsum.photos/seed/cap1/600/800' }],
    isNew: false,
    stock: 100,
    sku: 'CP-MIN-001',
  },
  {
    name: 'Everyday Comfort Tee',
    description: 'A reliable and comfortable t-shirt for everyday wear, made from soft-touch cotton.',
    price: 1999,
    category: 'T-Shirt',
    sizes: ['S', 'M', 'L'],
    colors: ['#374151', '#E5E7EB'],
    media: [{ type: 'image', url: 'https://picsum.photos/seed/tshirt2/600/800' }],
    isNew: false,
    stock: 75,
    sku: 'TS-EVR-001',
  },
];

export default function SeedDatabasePage() {
  const [seeding, setSeeding] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [productCount, setProductCount] = useState<number | null>(null);

  const checkProducts = async () => {
    try {
      const { firestore: db } = initializeFirebase();
      const snapshot = await getDocs(collection(db, 'products'));
      setProductCount(snapshot.size);
    } catch (error) {
      console.error('Error checking products:', error);
    }
  };

  const seedDatabase = async () => {
    setSeeding(true);
    setStatus('idle');
    
    try {
      const { firestore: db } = initializeFirebase();
      
      for (const product of SEED_PRODUCTS) {
        await addDoc(collection(db, 'products'), {
          ...product,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }
      
      setStatus('success');
      toast.success(`Added ${SEED_PRODUCTS.length} products to database!`);
      await checkProducts();
    } catch (error) {
      console.error('Error seeding database:', error);
      setStatus('error');
      toast.error('Failed to seed database');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Seed Database
          </CardTitle>
          <CardDescription>
            Add sample products to your Firestore database for testing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={checkProducts} variant="outline">
              Check Products Count
            </Button>
            {productCount !== null && (
              <span className="text-muted-foreground">
                {productCount} products in database
              </span>
            )}
          </div>

          <Button 
            onClick={seedDatabase} 
            disabled={seeding}
            className="w-full gap-2"
          >
            {seeding ? 'Seeding...' : 'Seed 5 Sample Products'}
          </Button>

          {status === 'success' && (
            <div className="flex items-center gap-2 text-green-500">
              <Check className="h-4 w-4" />
              Products added successfully!
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              Failed to add products. Check console for details.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
