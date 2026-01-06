import { createClient } from '@supabase/supabase-js';
import { Product } from '../types';
import { supabaseConfig } from '../src/config/supabase';

// Try to get environment variables first, fallback to config
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || supabaseConfig.url;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || supabaseConfig.anonKey;

// Debug: Log what we're using
console.log('Supabase URL source:', import.meta.env.VITE_SUPABASE_URL ? 'Environment' : 'Config file');
console.log('Supabase Key source:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Environment' : 'Config file');

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration');
  console.error('URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.error('Key:', supabaseAnonKey ? '✓ Set' : '✗ Missing');
} else {
  console.log('✅ Supabase configuration loaded successfully');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
});

export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    console.log('🔄 Fetching all products from Supabase...');
    
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching products:', error);
      throw error;
    }

    console.log('✅ Raw data from Supabase:', data);
    
    // Transform inventory items to product format
    const transformedProducts = data.map((item): Product => ({
      id: item.id,
      name: item.name,
      category: item.category,
      stock: item.stock || 0,
      price: Number(item.price) || 0,
      supplier: item.supplier,
      description: item.description,
      frame_type: item.frame_type,
      lens_type: item.lens_type,
      color: item.color,
      size: item.size,
      image: item.image,
      brand: item.supplier || 'Unknown',
      features: item.description ? [item.description] : [],
      colors: item.color ? [item.color] : [],
      created_at: item.created_at,
      updated_at: item.updated_at
    }));

    console.log('✅ Transformed products:', transformedProducts.length, 'items');
    console.log('📦 Available categories:', [...new Set(transformedProducts.map(p => p.category))]);
    
    return transformedProducts;
  } catch (error) {
    console.error('❌ Failed to fetch products:', error);
    throw error;
  }
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    console.log(`🔄 Fetching products for category: "${category}"`);
    
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .ilike('category', `%${category}%`) // Use ilike for flexible matching
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching products by category:', error);
      throw error;
    }

    console.log(`✅ Found ${data.length} products for category "${category}"`);

    return data.map((item): Product => ({
      id: item.id,
      name: item.name,
      category: item.category,
      stock: item.stock || 0,
      price: Number(item.price) || 0,
      supplier: item.supplier,
      description: item.description,
      frame_type: item.frame_type,
      lens_type: item.lens_type,
      color: item.color,
      size: item.size,
      image: item.image,
      brand: item.supplier || 'Unknown',
      features: item.description ? [item.description] : [],
      colors: item.color ? [item.color] : [],
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  } catch (error) {
    console.error('❌ Failed to fetch products by category:', error);
    throw error;
  }
};

export const fetchProductCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('category')
      .order('category');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    // Get unique categories
    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }

    return {
      ...data,
      brand: data.supplier || 'Unknown',
      features: data.description ? [data.description] : [],
      colors: data.color ? [data.color] : [],
    };
  } catch (error) {
    console.error('Failed to fetch product by ID:', error);
    return null;
  }
};

// Real-time subscription for inventory changes
export const subscribeToInventoryChanges = (callback: (products: Product[]) => void) => {
  console.log('🔄 Setting up real-time subscription for inventory changes...');
  
  try {
    const channel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'inventory'
        },
        async (payload) => {
          console.log('🔔 Inventory change detected:', payload);
          console.log('📝 Change type:', payload.eventType);
          console.log('📦 Changed data:', payload.new || payload.old);
          
          // Refetch all products when any change occurs
          try {
            console.log('🔄 Refetching all products...');
            const updatedProducts = await fetchAllProducts();
            console.log('✅ Products refetched:', updatedProducts.length, 'items');
            callback(updatedProducts);
          } catch (error) {
            console.error('❌ Error refetching products after change:', error);
          }
        }
      )
      .subscribe((status, err) => {
        console.log('📡 Subscription status:', status);
        
        // Handle subscription errors
        if (err) {
          console.error('❌ Real-time subscription error:', err);
          return;
        }
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time subscription active!');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Real-time subscription error - Channel error occurred');
        } else if (status === 'TIMED_OUT') {
          console.error('⏰ Real-time subscription error - Connection timed out');
        } else if (status === 'CLOSED') {
          console.log('🔌 Real-time subscription closed');
        } else {
          console.log('📡 Unknown subscription status:', status);
        }
      });

    return channel;
  } catch (error) {
    console.error('❌ Failed to set up real-time subscription:', error);
    // Return a dummy channel that won't cause issues
    return {
      unsubscribe: () => console.log('🔇 Unsubscribing from inventory changes')
    } as any;
  }
};

// Unsubscribe from real-time changes
export const unsubscribeFromInventoryChanges = (channel: any) => {
  try {
    if (channel && typeof channel.unsubscribe === 'function') {
      supabase.removeChannel(channel);
      console.log('🔇 Unsubscribed from inventory changes');
    } else {
      console.log('🔇 No active inventory subscription to unsubscribe');
    }
  } catch (error) {
    console.error('❌ Error unsubscribing from inventory changes:', error);
  }
};
