import React, { useState, useEffect } from 'react';
import { fetchAllProducts, fetchProductCategories, fetchProductsByCategory } from '../services/supabaseService';
import { Product } from '../types';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get unique colors from products
  const availableColors = Array.from(new Set(products.map(p => p.color).filter(Boolean))) as string[];

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

  // Filter products by color
  const filteredProducts = selectedColor === 'all' 
    ? products 
    : products.filter(product => product.color === selectedColor);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(price);
  };

  // Get color hex code for common colors
  const getColorHex = (colorName: string) => {
    const colors: { [key: string]: string } = {
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#EF4444',
      'blue': '#3B82F6',
      'green': '#10B981',
      'yellow': '#F59E0B',
      'brown': '#92400E',
      'gray': '#6B7280',
      'grey': '#6B7280',
      'silver': '#9CA3AF',
      'gold': '#F59E0B',
      'pink': '#EC4899',
      'purple': '#8B5CF6',
      'orange': '#F97316',
      'tortoise': '#92400E',
      'clear': '#E5E7EB'
    };
    return colors[colorName?.toLowerCase()] || '#E5E7EB';
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= 5) return { text: `Only ${stock} left`, color: 'bg-orange-100 text-orange-800' };
    if (stock <= 10) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
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
      
      {/* Filters Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex-1">
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

          {/* Color Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Color:
            </label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Colors</option>
              {availableColors.map((color) => (
                <option key={color} value={color}>
                  {color ? color.charAt(0).toUpperCase() + color.slice(1) : color}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedCategory !== 'all' || selectedColor !== 'all') && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedCategory !== 'all' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedColor !== 'all' && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {selectedColor ? selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1) : selectedColor}
                <button
                  onClick={() => setSelectedColor('all')}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedColor('all');
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock);
          return (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group">
              {/* Product Image */}
              <div className="relative">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                    }}
                  />
                )}
                
                {/* Stock Badge */}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                  {stockStatus.text}
                </div>
              </div>

              <div className="p-4">
                {/* Product Name and Brand */}
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  {product.brand && (
                    <p className="text-sm text-gray-500">by {product.brand}</p>
                  )}
                </div>

                {/* Category */}
                <p className="text-sm text-gray-600 mb-3">
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                    {product.category}
                  </span>
                </p>

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Color Display */}
                {product.color && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-600">Color:</span>
                    <div className="flex items-center gap-1">
                      <div 
                        className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm"
                        style={{ backgroundColor: getColorHex(product.color) }}
                        title={product.color}
                      ></div>
                      <span className="text-sm font-medium text-gray-800">
                        {product.color ? product.color.charAt(0).toUpperCase() + product.color.slice(1) : product.color}
                      </span>
                    </div>
                  </div>
                )}

                {/* Frame and Lens Type Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.frame_type && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                      {product.frame_type}
                    </span>
                  )}
                  {product.lens_type && (
                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                      {product.lens_type}
                    </span>
                  )}
                  {product.size && (
                    <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-medium">
                      Size: {product.size}
                    </span>
                  )}
                </div>

                {/* Price and Stock */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </span>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">
                      {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg mb-2">No products found</p>
          <p className="text-gray-400 text-sm">
            Try adjusting your filters or check back later
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
