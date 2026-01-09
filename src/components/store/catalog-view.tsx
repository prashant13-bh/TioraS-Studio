'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/product-card';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useStore } from '@/lib/store-context';
import { StoreSwitcher } from './store-switcher';
import type { Product } from '@/lib/types';

const CATEGORIES = ['All', 'T-Shirt', 'Hoodie', 'Jacket', 'Cap'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

export function CatalogView() {
  const { vibe } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 20000]);

  // Derived filter options
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { firestore: db } = initializeFirebase();
        const productsQuery = query(
          collection(db, 'products'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(productsQuery);
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productsData);
        setFilteredProducts(productsData);

        // Extract unique sizes and colors
        const sizes = new Set<string>();
        const colors = new Set<string>();
        productsData.forEach(p => {
          p.sizes.forEach(s => sizes.add(s));
          p.colors.forEach(c => colors.add(c));
        });
        setAvailableSizes(Array.from(sizes).sort());
        setAvailableColors(Array.from(colors).sort());

      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Vibe Filter
    // If a product has a vibe set, it must match the current store vibe.
    // If it doesn't have a vibe, we might show it in all or default to Gen Z?
    // Let's assume strict filtering: Show if vibe matches OR if product has no vibe (legacy).
    // Or better: Show if vibe matches.
    if (vibe) {
       result = result.filter(p => !p.vibe || p.vibe === vibe);
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Size filter
    if (selectedSize) {
      result = result.filter(p => p.sizes.includes(selectedSize));
    }

    // Color filter
    if (selectedColor) {
      result = result.filter(p => p.colors.includes(selectedColor));
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description?.toLowerCase().includes(query)
      );
    }

    // Price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, selectedSize, selectedColor, searchQuery, sortBy, priceRange, vibe]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedSize(null);
    setSelectedColor(null);
    setSearchQuery('');
    setSortBy('newest');
    setPriceRange([0, 20000]);
  };

  const activeFiltersCount = [
    selectedCategory !== 'All',
    selectedSize !== null,
    selectedColor !== null,
    searchQuery !== '',
    priceRange[0] > 0 || priceRange[1] < 20000,
  ].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/80"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Sizes */}
      {availableSizes.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Sizes</h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map(size => (
              <Badge
                key={size}
                variant={selectedSize === size ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80 w-8 h-8 flex items-center justify-center p-0"
                onClick={() => setSelectedSize(selectedSize === size ? null : size)}
              >
                {size}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {availableColors.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {availableColors.map(color => (
              <div
                key={color}
                className={`w-6 h-6 rounded-full cursor-pointer border ${selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : 'border-input'}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={20000}
          step={500}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="ghost" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 pb-20 md:pb-8">
      {/* Header with Store Switcher */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b">
        <h1 className="text-2xl font-bold font-headline hidden md:block">Store</h1>
        
        {/* Mobile Search Bar (Full Width) */}
        <div className="w-full md:w-auto flex-1 md:max-w-md flex gap-2">
             <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
             {/* Mobile Filter Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden shrink-0">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
        </div>

        <StoreSwitcher />
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
          <Card>
            <CardContent className="pt-6">
              <FilterContent />
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Results Count & Sort */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground text-sm">
              {filteredProducts.length} results
            </p>
             <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Filter className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold">No Products Found</h2>
              <p className="mt-2 text-muted-foreground text-sm">
                Try adjusting your filters or switching vibes.
              </p>
              <Button onClick={clearFilters} variant="link" className="mt-2">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
