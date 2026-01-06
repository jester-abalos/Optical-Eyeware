
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

interface AdminProps {
  onAddProduct: (product: Product) => void;
}

const Admin: React.FC<AdminProps> = ({ onAddProduct }) => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    supplier: '',
    itemName: '',
    category: 'Optical' as Product['category'],
    description: '',
    price: '',
    frameType: '',
    lensType: '',
    color: '',
    size: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: formData.itemName,
      brand: formData.supplier || 'OptiVision Exclusive',
      price: parseFloat(formData.price) || 0,
      category: formData.category,
      image: imagePreview || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
      description: formData.description,
      features: [formData.frameType, formData.lensType].filter(Boolean),
      colors: formData.color ? formData.color.split(',').map(c => c.trim()) : ['Default'],
      stock: 10,
      frame_type: formData.frameType,
      lens_type: formData.lensType,
      size: formData.size,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    onAddProduct(newProduct);
    navigate('/products');
  };

  return (
    <div className="max-w-3xl mx-auto pt-32 pb-20 px-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-blue-50 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add New Item</h2>
          </div>
          <button onClick={() => navigate('/products')} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          <section className="space-y-6">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Basic Information</h3>
            
            <div className="space-y-2">
              <label htmlFor="admin-supplier" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Supplier</label>
              <input 
                type="text" 
                id="admin-supplier"
                name="supplier"
                autoComplete="organization"
                placeholder="e.g., Essilor, Ray-Ban" 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-300"
                value={formData.supplier}
                onChange={e => setFormData({...formData, supplier: e.target.value})}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="admin-name" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Item Name *</label>
                <input 
                  required
                  type="text" 
                  id="admin-name"
                  name="name"
                  autoComplete="product-title"
                  placeholder="e.g., Ray-Bar" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  value={formData.itemName}
                  onChange={e => setFormData({...formData, itemName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="admin-category" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Category *</label>
                <select 
                  id="admin-category"
                  name="category"
                  autoComplete="organization-title"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none cursor-pointer"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as any})}
                >
                  <option value="Optical">Frame (Optical)</option>
                  <option value="Sunglasses">Sunglasses</option>
                  <option value="Contact Lenses">Contact Lenses</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-price" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Price (PHP) *</label>
              <input 
                required
                type="number" 
                id="admin-price"
                name="price"
                autoComplete="transaction-amount"
                placeholder="0.00" 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-description" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Description</label>
              <textarea 
                rows={4}
                id="admin-description"
                name="description"
                autoComplete="off"
                placeholder="Additional details about this item..." 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-image" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Item Image</label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-200 border-dashed rounded-3xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-all overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-slate-500 font-bold">Choose File</p>
                        <p className="text-xs text-slate-400">PNG, JPG or WEBP</p>
                      </div>
                    )}
                    <input type="file" id="admin-image" name="image" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Optical Eyewear Details</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="admin-frame-type" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Frame Type</label>
                <select 
                  id="admin-frame-type"
                  name="frameType"
                  autoComplete="off"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none cursor-pointer"
                  value={formData.frameType}
                  onChange={e => setFormData({...formData, frameType: e.target.value})}
                >
                  <option value="">Select frame</option>
                  <option value="Full Rim">Full Rim</option>
                  <option value="Half Rim">Half Rim</option>
                  <option value="Rimless">Rimless</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="admin-lens-type" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Lens Type</label>
                <select 
                  id="admin-lens-type"
                  name="lensType"
                  autoComplete="off"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none cursor-pointer"
                  value={formData.lensType}
                  onChange={e => setFormData({...formData, lensType: e.target.value})}
                >
                  <option value="">Select lens</option>
                  <option value="Single Vision">Single Vision</option>
                  <option value="Bifocal">Bifocal</option>
                  <option value="Progressive">Progressive</option>
                  <option value="Blue Cut">Blue Cut</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="admin-color" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Color</label>
                <input 
                  type="text" 
                  id="admin-color"
                  name="color"
                  autoComplete="off"
                  placeholder="e.g., Black, Blue" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  value={formData.color}
                  onChange={e => setFormData({...formData, color: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="admin-size" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Size</label>
                <input 
                  type="text" 
                  id="admin-size"
                  name="size"
                  autoComplete="off"
                  placeholder="e.g., 52-18-140" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  value={formData.size}
                  onChange={e => setFormData({...formData, size: e.target.value})}
                />
              </div>
            </div>
          </section>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => navigate('/products')}
              className="flex-1 py-4 px-6 border-2 border-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] py-4 px-6 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]"
            >
              Add to Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;
