import React, { useState, useEffect } from 'react';
import { fetchAllProducts, fetchProductCategories, fetchProductsByCategory } from '../services/supabaseService';
import { Product } from '../types';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load categories
        const categoriesData = await fetchProductCategories();
        setCategories(categoriesData);
        
        // Load products
        const productsData = selectedCategory === 'all' 
          ? await fetchAllProducts()
          : await fetchProductsByCategory(selectedCategory);
        
        setProducts(productsData);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please check your Supabase configuration.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCategory]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Catalog</h1>
      
      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Category:
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                }}
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.category}</p>
              {product.description && (
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
                <span className={`text-sm px-2 py-1 rounded ${
                  product.stock > 10 
                    ? 'bg-green-100 text-green-800' 
                    : product.stock > 0 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  Stock: {product.stock}
                </span>
              </div>
              {product.frame_type && (
                <p className="text-xs text-gray-500">Frame: {product.frame_type}</p>
              )}
              {product.lens_type && (
                <p className="text-xs text-gray-500">Lens: {product.lens_type}</p>
              )}
              {product.color && (
                <p className="text-xs text-gray-500">Color: {product.color}</p>
              )}
              {product.size && (
                <p className="text-xs text-gray-500">Size: {product.size}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
