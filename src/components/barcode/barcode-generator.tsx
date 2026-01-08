'use client';

import { useEffect, useRef } from 'react';
import bwipjs from 'bwip-js';

interface BarcodeGeneratorProps {
  value: string;
  format?: 'code128' | 'ean13' | 'ean8' | 'upca' | 'qrcode';
  width?: number;
  height?: number;
  includetext?: boolean;
  className?: string;
}

export function BarcodeGenerator({
  value,
  format = 'code128',
  width = 2,
  height = 50,
  includetext = true,
  className = ''
}: BarcodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    try {
      bwipjs.toCanvas(canvasRef.current, {
        bcid: format,
        text: value,
        scale: 3,
        height: height / 3,
        includetext,
        textxalign: 'center',
      });
    } catch (error) {
      console.error('Failed to generate barcode:', error);
    }
  }, [value, format, height, includetext]);

  if (!value) {
    return <div className="text-muted-foreground">No barcode value</div>;
  }

  return (
    <canvas ref={canvasRef} className={className} />
  );
}
