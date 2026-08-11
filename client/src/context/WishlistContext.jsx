import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { wishlistService } from '../services/wishlistService';
import { storage } from '../utils/helpers';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState([]);

  const extractProducts = (data) => {
    const rawProds = data?.data?.products || data?.products || [];
    return rawProds.filter((p) => p && typeof p === 'object' && p.title);
  };

  const fetchWishlist = useCallback(async () => {
    if (isLoggedIn) {
      try {
        const data = await wishlistService.getWishlist();
        const serverProds = extractProducts(data);
        if (serverProds && serverProds.length > 0) {
          setProducts(serverProds);
        } else {
          setProducts(storage.get('rz_wishlist') || []);
        }
      } catch {
        setProducts(storage.get('rz_wishlist') || []);
      }
    } else {
      setProducts(storage.get('rz_wishlist') || []);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = useCallback(
    (productId) => products.some((p) => (p._id || p.id || p) === productId),
    [products]
  );

  const toggleWishlist = useCallback(async (product) => {
    const targetId = product._id || product.id || product;

    setProducts((prev) => {
      const exists = prev.some((p) => (p._id || p.id || p) === targetId);
      let updated;
      if (exists) {
        updated = prev.filter((p) => (p._id || p.id || p) !== targetId);
      } else {
        updated = [...prev, product];
      }
      storage.set('rz_wishlist', updated);
      return updated;
    });

    if (isLoggedIn && targetId) {
      try {
        const data = await wishlistService.toggleWishlist(targetId);
        const serverProds = extractProducts(data);
        if (serverProds && serverProds.length > 0) {
          setProducts(serverProds);
        }
      } catch (err) {
        console.warn('Wishlist backend sync note:', err?.message);
      }
    }
  }, [isLoggedIn]);

  const removeFromWishlist = useCallback(async (productId) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => (p._id || p.id || p) !== productId);
      storage.set('rz_wishlist', updated);
      return updated;
    });

    if (isLoggedIn && productId) {
      try {
        await wishlistService.removeFromWishlist(productId);
      } catch (err) {
        console.warn('Remove wishlist note:', err?.message);
      }
    }
  }, [isLoggedIn]);

  return (
    <WishlistContext.Provider value={{ products, isInWishlist, toggleWishlist, removeFromWishlist, fetchWishlist, count: products.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
