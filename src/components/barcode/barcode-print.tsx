'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarcodeGenerator } from './barcode-generator';
import { Printer } from 'lucide-react';

interface BarcodePrintProps {
  products: {
    id: string;
    name: string;
    sku?: string;
    price?: number;
  }[];
}

export function BarcodePrint({ products }: BarcodePrintProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Barcode Labels</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 10mm;
            }
            .labels-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 5mm;
            }
            .label {
              border: 1px solid #ddd;
              padding: 5mm;
              text-align: center;
              page-break-inside: avoid;
            }
            .product-name {
              font-size: 10px;
              font-weight: bold;
              margin-bottom: 2mm;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .product-price {
              font-size: 12px;
              font-weight: bold;
              margin-top: 2mm;
            }
            canvas {
              max-width: 100%;
              height: auto;
            }
            @media print {
              body { margin: 0; padding: 5mm; }
            }
          </style>
        </head>
        <body>
          <div class="labels-grid">
            ${printRef.current.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Print Barcode Labels</CardTitle>
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          Print Labels
        </Button>
      </CardHeader>
      <CardContent>
        <div ref={printRef} className="grid grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="label border p-4 text-center rounded">
              <p className="product-name text-sm font-medium truncate">{product.name}</p>
              <BarcodeGenerator
                value={product.sku || product.id}
                format="code128"
                height={40}
                className="mx-auto"
              />
              {product.price && (
                <p className="product-price font-bold">₹{product.price}</p>
              )}
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No products selected for printing
          </p>
        )}
      </CardContent>
    </Card>
  );
}
