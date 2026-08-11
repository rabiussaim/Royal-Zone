import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';
import { storage } from '../utils/helpers';

const CartContext = createContext();

const getLocalCart = () => storage.get('rz_cart') || [];
const saveLocalCart = (items) => storage.set('rz_cart', items);

export const CartProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Compute totals safely
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = items.reduce((sum, item) => {
    const price = item.price || item.product?.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const extractItems = (data) => {
    const rawItems = data?.data?.items || data?.items || [];
    const parsed = rawItems.map((item) => {
      if (item.product && typeof item.product === 'object') {
        return {
          _id: item._id || item.product._id,
          productId: item.product._id,
          title: item.product.title,
          price: item.product.price,
          image: item.product.images?.[0] || '',
          quantity: item.quantity || 1,
          size: item.size,
        };
      }
      return item;
    });
    // Filter out empty/null items
    return parsed.filter((i) => i && (i.title || i.price));
  };

  const fetchCart = useCallback(async () => {
    if (isLoggedIn) {
      setLoading(true);
      try {
        const data = await cartService.getCart();
        const serverItems = extractItems(data);
        // Always trust server data when logged in (even empty cart is valid)
        setItems(serverItems);
        saveLocalCart(serverItems);
      } catch {
        // Server unavailable — fall back to local
        setItems(getLocalCart());
      } finally {
        setLoading(false);
      }
    } else {
      setItems(getLocalCart());
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (product, quantity = 1, size = null) => {
    const targetId = product._id || product.id || Date.now().toString();
    const newItem = {
      _id: targetId,
      productId: targetId,
      title: product.title || 'Luxury Product',
      price: product.price || 0,
      image: product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80',
      quantity,
      size,
    };

    // Optimistic update
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => (i.productId || i._id) === targetId && i.size === size
      );
      let updated;
      if (existingIndex > -1) {
        updated = prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...prev, newItem];
      }
      saveLocalCart(updated);
      return updated;
    });

    // Background backend sync if logged in
    if (isLoggedIn && targetId) {
      try {
        const data = await cartService.addToCart(targetId, quantity, size);
        const serverItems = extractItems(data);
        if (serverItems && serverItems.length > 0) {
          setItems(serverItems);
        }
      } catch (err) {
        console.warn('Cart backend sync note:', err?.message);
      }
    }
  }, [isLoggedIn]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (quantity < 1) return;
    setItems((prev) => {
      const updated = prev.map((i) =>
        (i._id === itemId || i.productId === itemId) ? { ...i, quantity } : i
      );
      saveLocalCart(updated);
      return updated;
    });

    if (isLoggedIn) {
      try {
        const data = await cartService.updateCartItem(itemId, quantity);
        const serverItems = extractItems(data);
        if (serverItems && serverItems.length > 0) setItems(serverItems);
      } catch (err) {
        console.warn('Cart quantity update note:', err?.message);
      }
    }
  }, [isLoggedIn]);

  const removeItem = useCallback(async (itemId) => {
    // Step 1: Optimistic local removal — sirf yeh 1 item remove karo
    setItems((prev) => {
      const updated = prev.filter((i) => i._id !== itemId && i.productId !== itemId);
      saveLocalCart(updated);
      return updated;
    });

    // Step 2: Server sync (background) — agar server empty return kare to local state mat override karo
    if (isLoggedIn) {
      try {
        const data = await cartService.removeFromCart(itemId);
        const serverItems = extractItems(data);
        // Functional setState — current is whatever is in state RIGHT NOW (after optimistic update)
        setItems((current) => {
          // Agar server ne empty array diya aur local mein items hain to local rakhein
          if (serverItems.length === 0 && current.length > 0) {
            return current;
          }
          // Server ne sahi items diye — use karo
          saveLocalCart(serverItems);
          return serverItems;
        });
      } catch (err) {
        console.warn('Cart item removal note:', err?.message);
        // Error pe local optimistic state maintain rahegi
      }
    }
  }, [isLoggedIn]);

  const clearCart = useCallback(async () => {
    setItems([]);
    saveLocalCart([]);
    if (isLoggedIn) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.warn('Cart clear note:', err?.message);
      }
    }
  }, [isLoggedIn]);

  return (
    <CartContext.Provider value={{ items, itemCount, subtotal, loading, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
