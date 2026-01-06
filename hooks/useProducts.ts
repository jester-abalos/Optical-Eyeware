import { useState, useEffect, useRef } from 'react';
import { 
  fetchAllProducts, 
  fetchProductCategories, 
  fetchProductsByCategory, 
  fetchProductById,
  subscribeToInventoryChanges,
  unsubscribeFromInventoryChanges
} from '../services/supabaseService';
import { Product } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<any>(null);

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadProductsByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🎯 Loading products for category: "${category}"`);
      const data = await fetchProductsByCategory(category);
      setProducts(data);
      console.log(`✅ Loaded ${data.length} products for category "${category}"`);
    } catch (err) {
      setError('Failed to load products by category');
      console.error('❌ Category loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setError(null);
      const data = await fetchProductCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    }
  };

  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      setError(null);
      return await fetchProductById(id);
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
      return null;
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    const setupRealTimeSubscription = () => {
      // Subscribe to inventory changes
      const channel = subscribeToInventoryChanges((updatedProducts) => {
        setProducts(updatedProducts);
        console.log('Products updated in real-time');
      });
      
      channelRef.current = channel;
    };

    // Initial data load
    loadAllProducts();
    loadCategories();
    
    // Setup real-time subscription
    setupRealTimeSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (channelRef.current) {
        unsubscribeFromInventoryChanges(channelRef.current);
      }
    };
  }, []);

  return {
    products,
    categories,
    loading,
    error,
    loadAllProducts,
    loadProductsByCategory,
    loadCategories,
    getProductById,
  };
};
