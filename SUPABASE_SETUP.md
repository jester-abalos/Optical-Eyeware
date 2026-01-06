# Supabase Product Fetching Setup

This guide explains how to set up and use the Supabase product fetching functionality for your Optical Clinic Management System.

## 1. Environment Setup

Update your `.env.local` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anonymous_key
```

To get these values:
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL and anon/public key

## 2. Available Functions

### Product Service (`services/supabaseService.ts`)

- `fetchAllProducts()` - Fetches all products from the inventory table
- `fetchProductsByCategory(category)` - Fetches products filtered by category
- `fetchProductCategories()` - Gets all unique product categories
- `fetchProductById(id)` - Gets a single product by its ID
- `subscribeToInventoryChanges(callback)` - Sets up real-time subscription for inventory changes
- `unsubscribeFromInventoryChanges(channel)` - Cleans up real-time subscription

### React Hook (`hooks/useProducts.ts`)

The `useProducts` hook provides easy access to product data with real-time updates:

```tsx
import { useProducts } from '../hooks/useProducts';

const MyComponent = () => {
  const { 
    products, 
    categories, 
    loading, 
    error, 
    loadProductsByCategory 
  } = useProducts();

  // Products update automatically in real-time!
};
```

## 3. Real-Time Features

### Automatic Updates
- Products automatically update when changes are made in the database
- No need to manually refresh the page
- Supports INSERT, UPDATE, and DELETE operations

### Real-Time Subscription
The system listens for changes to the `inventory` table and automatically updates the UI:

```typescript
// This is handled automatically by the useProducts hook
const channel = subscribeToInventoryChanges((updatedProducts) => {
  setProducts(updatedProducts);
});
```

## 4. Product Data Structure

Products from your database have the following structure:

```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  supplier?: string;
  description?: string;
  frame_type?: string;
  lens_type?: string;
  color?: string;
  size?: string;
  image?: string;
  brand?: string;        // Derived from supplier
  features?: string[];   // Derived from description
  colors?: string[];     // Derived from color
  created_at: string;
  updated_at: string;
}
```

## 5. Usage Examples

### Basic Product List with Real-Time Updates

```tsx
import ProductList from '../components/ProductList';

// In your App.tsx or route:
<ProductList />
```

### Custom Product Display with Real-Time

```tsx
import { useProducts } from '../hooks/useProducts';

const CustomProductDisplay = () => {
  const { products, loading, error } = useProducts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
          <p>Stock: {product.stock}</p>
          <p>Category: {product.category}</p>
        </div>
      ))}
    </div>
  );
};
```

### Dynamic Category Filtering

```tsx
import { useProducts } from '../hooks/useProducts';

const CategoryFilter = () => {
  const { categories, loadProductsByCategory } = useProducts();

  return (
    <select onChange={(e) => loadProductsByCategory(e.target.value)}>
      <option value="">All Categories</option>
      {categories.map(category => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
};
```

## 6. Database Schema

The service expects your Supabase database to have an `inventory` table with the following structure (based on your schema):

```sql
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock INT DEFAULT 0 CHECK (stock >= 0),
  price NUMERIC(10,2),
  supplier VARCHAR(255),
  description TEXT,
  frame_type VARCHAR(100),
  lens_type VARCHAR(100),
  color VARCHAR(100),
  size VARCHAR(100),
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## 7. Real-Time Setup in Supabase

To enable real-time functionality:

1. **Enable Realtime for your table**:
   ```sql
   ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
   
   -- Add realtime publication
   ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
   ```

2. **Set up RLS policies** (already included in your schema):
   ```sql
   CREATE POLICY "Allow all operations on inventory" ON inventory FOR ALL USING (true) WITH CHECK (true);
   ```

## 8. Error Handling

The service includes comprehensive error handling:

- Network errors are caught and logged
- Loading states are provided for async operations
- Error messages are user-friendly
- Console logging for debugging
- Real-time subscription errors are handled gracefully

## 9. Performance Considerations

- Products are cached in the hook state
- Categories are loaded once and reused
- Real-time subscriptions are automatically cleaned up on unmount
- Consider implementing pagination for large inventories
- Images are handled with fallback for broken URLs

## 10. Mock Data Removal

The system has been updated to completely remove mock data:

- `MOCK_PRODUCTS` import removed from `App.tsx`
- LocalStorage product caching removed
- All product data now comes from Supabase
- Real-time updates replace manual refresh

## 11. Testing Real-Time Updates

To test real-time functionality:

1. Open your application in two browser tabs
2. Make changes to the inventory table in Supabase Dashboard
3. Watch both tabs update automatically

You can test:
- Adding new products
- Updating existing products (price, stock, etc.)
- Deleting products

## 12. Next Steps

- Add product search functionality
- Implement product CRUD operations
- Add inventory management features
- Create product detail pages
- Add shopping cart functionality
- Set up product notifications for low stock
