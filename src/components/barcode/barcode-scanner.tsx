'use client';

import { useState, useCallback } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onClose?: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleScan = useCallback((result: any) => {
    if (result && result[0]?.rawValue) {
      onScan(result[0].rawValue);
      setIsScanning(false);
    }
  }, [onScan]);

  const handleError = useCallback((error: any) => {
    console.error('Scanner error:', error);
    setError('Camera access denied or not available');
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Camera className="h-5 w-5" />
          Scan Barcode
        </CardTitle>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => setError(null)}>Try Again</Button>
          </div>
        ) : isScanning ? (
          <div className="aspect-square overflow-hidden rounded-lg">
            <Scanner
              onScan={handleScan}
              onError={handleError}
              constraints={{
                facingMode: 'environment'
              }}
              styles={{
                container: { width: '100%', height: '100%' }
              }}
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Barcode scanned successfully!</p>
            <Button onClick={() => setIsScanning(true)}>Scan Another</Button>
          </div>
        )}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Point your camera at a barcode to scan
        </p>
      </CardContent>
    </Card>
  );
}
