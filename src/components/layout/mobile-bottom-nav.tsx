'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wand2, ShoppingCart, User, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Wand2, label: 'Create', href: '/design-studio' },
  { icon: ShoppingCart, label: 'Cart', href: '/cart' },
  { icon: Heart, label: 'Wishlist', href: '/wishlist' },
  { icon: User, label: 'Profile', href: '/dashboard' },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border shadow-2xl">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full group"
            >
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-gradient-to-r from-primary via-secondary to-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon with Active State */}
              <div className={cn(
                "relative flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-300",
                isActive 
                  ? "bg-gradient-to-br from-primary/20 to-secondary/20 text-primary scale-105" 
                  : "text-muted-foreground group-hover:text-foreground group-hover:bg-muted/50"
              )}>
                <Icon className={cn(
                  "size-5 transition-all",
                  isActive && "scale-110"
                )} />
                
                {/* Glow Effect on Active */}
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 blur-md -z-10 animate-pulse" />
                )}
              </div>

              {/* Label */}
              <span className={cn(
                "text-[10px] font-medium mt-0.5 transition-all",
                isActive 
                  ? "text-foreground font-bold" 
                  : "text-muted-foreground"
              )}>
                {item.label}
              </span>

              {/* Ripple Effect on Tap */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 scale-0 group-active:scale-100 transition-transform duration-300 rounded-2xl" />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
