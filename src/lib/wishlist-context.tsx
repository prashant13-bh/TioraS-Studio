'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { initializeFirebase } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        const { firestore: db } = initializeFirebase();
        const wishlistRef = collection(db, 'wishlists');
        const q = query(wishlistRef, where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const wishlistItems = snap.docs.map(doc => doc.data().product as Product);
        setItems(wishlistItems);
      } else {
        setItems([]);
      }
      setLoading(false);
    };

    loadWishlist();
  }, [user]);

  const addToWishlist = async (product: Product) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your wishlist.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { firestore: db } = initializeFirebase();
      const wishId = `${user.uid}_${product.id}`;
      await setDoc(doc(db, 'wishlists', wishId), {
        userId: user.uid,
        productId: product.id,
        product: product,
        createdAt: new Date().toISOString()
      });

      setItems(prev => [...prev, product]);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been saved to your wishlist.`,
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast({
        title: "Error",
        description: "Could not add to wishlist. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const { firestore: db } = initializeFirebase();
      const wishId = `${user.uid}_${productId}`;
      await deleteDoc(doc(db, 'wishlists', wishId));

      setItems(prev => prev.filter(item => item.id !== productId));
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
