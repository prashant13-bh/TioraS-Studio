
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
import { cn } from '@/lib/utils';

export function AddToCartForm({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const imageToAdd = product.media.find(m => m.type === 'image')?.url || product.media[0].url;
    addToCart({
      id: product.id,
      name: product.name,
      image: imageToAdd,
      price: product.price,
      selectedSize,
      selectedColor,
    }, quantity);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  return (
    <div className="space-y-8">
      {/* Size Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-bold uppercase tracking-wider">Select Size</Label>
          <button className="text-xs text-muted-foreground hover:text-primary underline">Size Guide</button>
        </div>
        <div className="flex flex-wrap gap-3">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={cn(
                "min-w-[50px] h-12 px-4 rounded-xl border-2 font-bold transition-all",
                selectedSize === size 
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "border-border hover:border-primary/50 bg-background"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <Label className="mb-3 block text-sm font-bold uppercase tracking-wider">Select Color</Label>
        <div className="flex flex-wrap gap-4">
          {product.colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={cn(
                "size-10 rounded-full border-2 transition-all p-1",
                selectedColor === color ? "border-primary scale-110" : "border-transparent hover:scale-105"
              )}
            >
              <div 
                className="w-full h-full rounded-full shadow-inner" 
                style={{ backgroundColor: color }}
              />
              <span className="sr-only">{color}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity and Add to Cart */}
      <div className="flex flex-col sm:flex-row items-stretch gap-4 pt-4">
        <div className="flex items-center justify-between bg-accent/50 rounded-2xl p-1 border border-border/50">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-xl hover:bg-background"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            <Minus className="size-4" />
          </Button>
          <span className="w-12 text-center text-lg font-bold">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-xl hover:bg-background"
            onClick={() => handleQuantityChange(1)}
          >
            <Plus className="size-4" />
          </Button>
        </div>
        
        <Button 
          size="lg" 
          className="flex-1 h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.02]" 
          onClick={handleAddToCart}
        >
          <ShoppingBag className="mr-2 size-5" />
          Add to Cart
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="size-2 rounded-full bg-green-500" />
          In Stock & Ready to Ship
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="size-2 rounded-full bg-blue-500" />
          Free Shipping Worldwide
        </div>
      </div>
    </div>
  );
}
