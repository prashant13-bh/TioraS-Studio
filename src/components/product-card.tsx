"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, ShoppingCart, Sparkles } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryMedia =
    product.media.find((m) => m.type === "image") || product.media[0];
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { toast } = useToast();

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast({ title: "Removed from wishlist", variant: "default" });
    } else {
      addToWishlist(product);
      toast({ title: "❤️ Added to wishlist", variant: "default" });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Add to cart functionality
    toast({
      title: "🛒 Added to cart!",
      description: product.name,
      variant: "default",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="group relative w-full h-full overflow-hidden rounded-2xl border-0 shadow-lg transition-all duration-500 hover:shadow-2xl bg-gradient-to-br from-background via-background to-muted/20">
        <Link href={`/products/${product.id}`} className="flex flex-col h-full">
          {/* Image Container with Gradient Overlay */}
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
            {/* Shimmer Loading Effect */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}

            {primaryMedia.type === "image" ? (
              <Image
                src={primaryMedia.url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className={cn(
                  "object-cover transition-all duration-700",
                  imageLoaded ? "scale-100 blur-0" : "scale-105 blur-sm",
                  "group-hover:scale-110",
                )}
                onLoad={() => setImageLoaded(true)}
                priority={false}
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                <Sparkles className="size-12 text-primary/50 animate-pulse" />
              </div>
            )}

            {/* Premium Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Top Badges */}
            <div className="absolute left-2 top-2 flex flex-col gap-1.5 md:left-3 md:top-3 z-10">
              {product.isNew && (
                <Badge className="text-[10px] md:text-xs px-2 py-0.5 bg-gradient-to-r from-primary to-primary/80 font-bold shadow-lg backdrop-blur-sm border-0">
                  ✨ New
                </Badge>
              )}
              {(product.stock ?? 0) < 10 && (
                <Badge className="text-[10px] md:text-xs px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 font-bold shadow-lg backdrop-blur-sm border-0">
                  🔥 Low Stock
                </Badge>
              )}
            </div>

            {/* Wishlist Button - Glass Morphism */}
            <Button
              size="icon"
              variant="secondary"
              className={cn(
                "absolute right-2 top-2 z-10 size-9 md:size-11 rounded-full shadow-xl transition-all duration-300 backdrop-blur-md md:right-3 md:top-3",
                "border border-white/20",
                isWishlisted
                  ? "bg-gradient-to-br from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 scale-100"
                  : "bg-white/90 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 hover:scale-110",
              )}
              onClick={toggleWishlist}
            >
              <Heart
                className={cn(
                  "size-4 md:size-5 transition-all",
                  isWishlisted && "fill-current animate-pulse",
                )}
              />
            </Button>

            {/* Quick Action Buttons - Slide up on hover */}
            <div className="absolute bottom-3 left-3 right-3 flex gap-2 translate-y-20 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:bottom-4 md:left-4 md:right-4 z-10">
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 h-9 md:h-10 rounded-xl bg-white/95 dark:bg-black/70 backdrop-blur-xl shadow-xl border border-white/20 hover:bg-white dark:hover:bg-black/80 font-semibold text-xs md:text-sm"
                onClick={handleQuickAdd}
              >
                <ShoppingCart className="size-3.5 md:size-4 mr-1.5" />
                Quick Add
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-primary/95 text-primary-foreground backdrop-blur-xl shadow-xl border border-primary/20 hover:bg-primary"
                asChild
              >
                <Link href={`/products/${product.id}`}>
                  <Eye className="size-4 md:size-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Product Info with Gradient Background */}
          <div className="p-3 md:p-4 bg-gradient-to-b from-transparent to-muted/30 flex-1 flex flex-col">
            <h3 className="line-clamp-2 font-headline text-sm md:text-base font-bold leading-tight group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-[11px] md:text-xs text-muted-foreground font-medium mt-0.5 md:mt-1">
              {product.category}
            </p>

            {/* Price with Gradient */}
            <div className="mt-auto pt-2 md:pt-3 flex items-center justify-between">
              <p className="text-lg md:text-xl font-black bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                ₹{product.price.toLocaleString()}
              </p>

              {/* Stock Indicator */}
              <div className="flex items-center gap-1">
                <div
                  className={cn(
                    "size-1.5 md:size-2 rounded-full",
                    (product.stock ?? 0) > 10 ? "bg-green-500" : "bg-orange-500",
                  )}
                />
                <span className="text-[10px] md:text-xs text-muted-foreground">
                  {(product.stock ?? 0) > 10
                    ? "In Stock"
                    : `Only ${product.stock ?? 0} left`}
                </span>
              </div>
            </div>

            {/* Color Options Preview */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1 mt-2">
                {product.colors.slice(0, 4).map((color, idx) => (
                  <div
                    key={idx}
                    className="size-4 md:size-5 rounded-full border-2 border-background shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-[10px] text-muted-foreground ml-1">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      </Card>
    </motion.div>
  );
}
