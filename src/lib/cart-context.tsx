"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string, size: string, color: string) => void;
  updateQuantity: (
    id: string,
    size: string,
    color: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (
    newItem: Omit<CartItem, "quantity">,
    quantity: number = 1
  ) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) =>
          item.id === newItem.id &&
          item.selectedSize === newItem.selectedSize &&
          item.selectedColor === newItem.selectedColor
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === newItem.id &&
          item.selectedSize === newItem.selectedSize &&
          item.selectedColor === newItem.selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...newItem, quantity }];
    });
    toast({
      title: "Added to Cart",
      description: `${newItem.name} (${quantity}) has been added to your cart.`,
    });
  };

  const removeFromCart = (id: string, size: string, color: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );
  };

  const updateQuantity = (
    id: string,
    size: string,
    color: string,
    quantity: number
  ) => {
    if (quantity < 1) {
      removeFromCart(id, size, color);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id &&
        item.selectedSize === size &&
        item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
