import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { productService } from '../../services/productService';

// Preset luxury image URLs for quick selection
const PRESET_IMAGES = {
  perfume: [
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80',
  ],
  bedsheet: [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
  ],
};

const INITIAL_FORM = {
  title: '',
  description: '',
  longDescription: '',
  price: '',
  oldPrice: '',
  category: 'perfume',
  images: [],
  customImageUrl: '',
  sizes: [],
  stock: '',
  tags: '',
  featured: false,
  bestSeller: false,
  newArrival: false,
  luxuryCollection: false,
};

const SIZE_OPTIONS = {
  perfume: ['30ml', '50ml', '100ml', '150ml', '200ml'],
  bedsheet: ['Single', 'Double', 'Queen', 'King'],
};

const AddProductSection = ({ onSuccess }) => {
  const { isLoggedIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const addPresetImage = (url) => {
    if (!form.images.includes(url)) {
      setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    }
  };

  const addCustomImage = () => {
    const url = form.customImageUrl.trim();
    if (url && !form.images.includes(url)) {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, url],
        customImageUrl: '',
      }));
    }
  };

  const removeImage = (url) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.title.trim()) return toast('Product title is required', 'error');
    if (!form.description.trim()) return toast('Product description is required', 'error');
    if (!form.price || Number(form.price) <= 0) return toast('Valid price is required', 'error');
    if (!form.stock || Number(form.stock) < 0) return toast('Stock quantity is required', 'error');
    if (form.images.length === 0) return toast('At least one image is required', 'error');

    setSubmitting(true);

    try {
      const productData = {
        title: form.title.trim(),
        description: form.description.trim(),
        longDescription: form.longDescription.trim() || undefined,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
        category: form.category,
        images: form.images,
        sizes: form.sizes,
        stock: Number(form.stock),
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        featured: form.featured,
        bestSeller: form.bestSeller,
        newArrival: form.newArrival,
        luxuryCollection: form.luxuryCollection,
      };

      await productService.createProduct(productData);
      toast('🎉 Product added successfully!', 'success');
      setForm(INITIAL_FORM);
      if (onSuccess) onSuccess();
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to add product. Please try again.';
      toast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const presetImages = PRESET_IMAGES[form.category] || PRESET_IMAGES.perfume;
  const sizeOptions = SIZE_OPTIONS[form.category] || [];

  const discount = form.oldPrice && form.price
    ? Math.round(((Number(form.oldPrice) - Number(form.price)) / Number(form.oldPrice)) * 100)
    : 0;

  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-6 sm:px-8 py-6 border-b border-gray-100 dark:border-gray-700"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, transparent 60%)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gold-500/15 flex items-center justify-center text-lg">✨</span>
              Add New Product
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill in the details to add a new product to your store</p>
          </div>
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gold-500 hover:text-gold-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={previewMode ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l4.242 4.242M15 12a3 3 0 01-3 3m3-3a3 3 0 00-3-3m3 3l6.121 6.121" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"} />
              {!previewMode && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
            </svg>
            {previewMode ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className={`grid ${previewMode ? 'grid-cols-1 xl:grid-cols-5 gap-8' : 'grid-cols-1'}`}>
          {/* Form */}
          <form onSubmit={handleSubmit} className={previewMode ? 'xl:col-span-3' : ''}>
            <div className="space-y-6">

              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gold-500/15 text-gold-500 flex items-center justify-center text-xs font-bold">1</span>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Title *</label>
                    <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Oud Al Qamar Premium" className="form-input" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Short Description *</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Brief product description..." className="form-input resize-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Detailed Description</label>
                    <textarea name="longDescription" value={form.longDescription} onChange={handleChange} rows={3} placeholder="Full product details (optional)..." className="form-input resize-none" />
                  </div>
                </div>
              </div>

              {/* Category & Pricing */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gold-500/15 text-gold-500 flex items-center justify-center text-xs font-bold">2</span>
                  Category & Pricing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category *</label>
                    <select name="category" value={form.category} onChange={handleChange} className="form-input">
                      <option value="perfume">Perfume</option>
                      <option value="bedsheet">Bedsheet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price (PKR) *</label>
                    <input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="8500" className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Old Price (PKR)</label>
                    <input name="oldPrice" type="number" min="0" value={form.oldPrice} onChange={handleChange} placeholder="10000" className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Stock Quantity *</label>
                    <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="25" className="form-input" />
                  </div>
                  {discount > 0 && (
                    <div className="flex items-end">
                      <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl text-sm font-bold">
                        🎉 {discount}% OFF
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gold-500/15 text-gold-500 flex items-center justify-center text-xs font-bold">3</span>
                  Available Sizes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                        form.sizes.includes(size)
                          ? 'bg-gold-500 text-white border-gold-500 shadow-md'
                          : 'bg-gray-50 dark:bg-navy-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gold-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gold-500/15 text-gold-500 flex items-center justify-center text-xs font-bold">4</span>
                  Product Images
                </h3>

                {/* Selected images */}
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-4">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative group w-20 h-20 rounded-xl overflow-hidden border-2 border-gold-500/30 shadow-sm">
                        <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(img)}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 bg-gold-500 text-white text-[9px] text-center py-0.5 font-bold">MAIN</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Preset image picker */}
                <p className="text-xs text-gray-400 mb-2">Click to add from preset {form.category} images:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {presetImages.map((img, i) => {
                    const isAdded = form.images.includes(img);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => !isAdded && addPresetImage(img)}
                        disabled={isAdded}
                        className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          isAdded
                            ? 'border-green-500 opacity-50 cursor-not-allowed'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gold-500 hover:scale-105'
                        }`}
                      >
                        <img src={img} alt={`Preset ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                </div>

                {/* Custom URL */}
                <div className="flex gap-2">
                  <input
                    name="customImageUrl"
                    value={form.customImageUrl}
                    onChange={handleChange}
                    placeholder="Or paste a custom image URL..."
                    className="form-input flex-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={addCustomImage}
                    disabled={!form.customImageUrl.trim()}
                    className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Tags & Badges */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gold-500/15 text-gold-500 flex items-center justify-center text-xs font-bold">5</span>
                  Tags & Badges
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tags (comma separated)</label>
                    <input name="tags" value={form.tags} onChange={handleChange} placeholder="luxury, premium, bestselling" className="form-input" />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { name: 'featured', label: '⭐ Featured', color: 'amber' },
                      { name: 'bestSeller', label: '🔥 Best Seller', color: 'red' },
                      { name: 'newArrival', label: '🆕 New Arrival', color: 'blue' },
                      { name: 'luxuryCollection', label: '💎 Luxury', color: 'purple' },
                    ].map((badge) => (
                      <label
                        key={badge.name}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 border text-sm font-medium ${
                          form[badge.name]
                            ? 'bg-gold-500/10 border-gold-500/40 text-gold-600 dark:text-gold-400'
                            : 'bg-gray-50 dark:bg-navy-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gold-500/30'
                        }`}
                      >
                        <input
                          type="checkbox"
                          name={badge.name}
                          checked={form[badge.name]}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                          form[badge.name] ? 'bg-gold-500 border-gold-500' : 'border-gray-300 dark:border-gray-500'
                        }`}>
                          {form[badge.name] && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        {badge.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-8 py-3 text-base font-bold flex items-center gap-2 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Product
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setForm(INITIAL_FORM)}
                  className="px-6 py-3 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                  Reset Form
                </button>
              </div>
            </div>
          </form>

          {/* Live Preview */}
          {previewMode && (
            <div className="xl:col-span-2">
              <div className="sticky top-28">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">Live Preview</h3>
                <div className="bg-gray-50 dark:bg-navy-700 rounded-2xl p-5 border border-gray-200 dark:border-gray-600">
                  {/* Preview Card */}
                  <div className="bg-white dark:bg-navy-800 rounded-xl overflow-hidden shadow-card">
                    <div className="relative aspect-square bg-gray-100 dark:bg-navy-700">
                      {form.images.length > 0 ? (
                        <img src={form.images[0]} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-500">
                          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs">No image selected</span>
                        </div>
                      )}
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {discount > 0 && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">{discount}% OFF</span>
                        )}
                        {form.newArrival && <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">NEW</span>}
                        {form.bestSeller && <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">BESTSELLER</span>}
                        {form.luxuryCollection && <span className="px-2 py-0.5 bg-purple-500 text-white text-xs font-bold rounded-full">LUXURY</span>}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gold-500 font-medium uppercase tracking-wider mb-1">
                        {form.category === 'perfume' ? 'Perfume' : 'Bedsheet'}
                      </p>
                      <h4 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">
                        {form.title || 'Product Title'}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                        {form.description || 'Product description will appear here...'}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gold-500">
                          PKR {form.price ? Number(form.price).toLocaleString() : '0'}
                        </span>
                        {form.oldPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            PKR {Number(form.oldPrice).toLocaleString()}
                          </span>
                        )}
                      </div>
                      {form.sizes.length > 0 && (
                        <div className="flex gap-1.5 mt-3">
                          {form.sizes.map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-gray-100 dark:bg-navy-700 text-gray-500 dark:text-gray-400 text-xs rounded-md">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProductSection;
