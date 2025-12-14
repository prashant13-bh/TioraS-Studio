
'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AddToCartForm({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    const imageToAdd = product.media.find(m => m.type === 'image')?.url || product.media[0].url;
    addToCart({
      id: product.id,
      name: product.name,
      image: imageToAdd,
      price: product.price,
      selectedSize,
      selectedColor,
    });
  };

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block text-sm font-medium">Size</Label>
        {product.sizes.length > 1 ? (
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger>
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent>
              {product.sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="font-medium">{product.sizes[0]}</p>
        )}
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">Color</Label>
        <RadioGroup
          value={selectedColor}
          onValueChange={setSelectedColor}
          className="flex gap-2"
        >
          {product.colors.map((color) => (
            <RadioGroupItem
              key={color}
              value={color}
              id={`color-${color}`}
              className="size-8 rounded-full border-2"
              style={{ backgroundColor: color }}
              aria-label={color}
            >
              <span className="sr-only">{color}</span>
            </RadioGroupItem>
          ))}
        </RadioGroup>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            <Minus className="size-4" />
          </Button>
          <span className="w-10 text-center text-lg font-bold">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(1)}
          >
            <Plus className="size-4" />
          </Button>
        </div>
        <Button size="lg" className="flex-1 font-bold" onClick={handleAddToCart}>
          <ShoppingBag className="mr-2 size-5" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
