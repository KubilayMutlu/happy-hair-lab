import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, ProductVariant, CartItem } from '@/types/product';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((product: Product, variant?: ProductVariant, quantity = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.variant?.id === variant?.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { product, variant, quantity }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, variantId?: string) => {
    setItems(prev => 
      prev.filter(item => 
        !(item.product.id === productId && item.variant?.id === variantId)
      )
    );
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.product.id === productId && item.variant?.id === variantId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce((sum, item) => {
    const price = item.variant?.price ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
