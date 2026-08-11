import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StarRating from '../components/common/StarRating';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../components/common/Toast';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import ProductGrid from '../components/product/ProductGrid';

// Combined product data for lookup
const ALL_PRODUCTS = [
  { _id: '65b100000000000000000001', title: 'Oud Al Qamar', category: { name: 'Perfume' }, price: 8500, oldPrice: 10000, discount: 15, rating: 4.8, reviewCount: 124, images: ['https://picsum.photos/seed/perf1/600/700', 'https://picsum.photos/seed/perf1b/600/700', 'https://picsum.photos/seed/perf1c/600/700'], stock: 15, description: 'A deep, rich oud fragrance with notes of rose and amber. This masterpiece blends the finest oud wood from Cambodia with delicate Bulgarian rose and warm amber base notes.', longDescription: 'Oud Al Qamar is a journey into the heart of the orient. Crafted by master perfumers using rare materials, this fragrance opens with a burst of saffron and cardamom before revealing a heart of Damascus rose and oud wood. The base settles into warm amber, musk, and sandalwood — leaving a lasting impression for hours.', specifications: [{ key: 'Volume', value: '100ml' }, { key: 'Fragrance Family', value: 'Oriental Woody' }, { key: 'Top Notes', value: 'Saffron, Cardamom' }, { key: 'Heart Notes', value: 'Rose, Oud Wood' }, { key: 'Base Notes', value: 'Amber, Sandalwood, Musk' }, { key: 'Longevity', value: '12+ hours' }, { key: 'Sillage', value: 'Heavy' }, { key: 'Season', value: 'Fall/Winter' }], tags: ['oud', 'oriental'], featured: true },
  { _id: '65b100000000000000000002', title: 'Rose Noire', category: { name: 'Perfume' }, price: 6800, oldPrice: 8500, discount: 20, rating: 4.7, reviewCount: 203, images: ['https://picsum.photos/seed/perf2/600/700', 'https://picsum.photos/seed/perf2b/600/700'], stock: 22, newArrival: true, description: 'Dark rose with black pepper and patchouli.', specifications: [{ key: 'Volume', value: '50ml' }, { key: 'Top Notes', value: 'Black Pepper, Bergamot' }, { key: 'Heart Notes', value: 'Dark Rose, Iris' }, { key: 'Base Notes', value: 'Patchouli, Vetiver' }], tags: ['floral', 'dark'] },
  { _id: '65a100000000000000000001', title: 'Royal Cotton 1000TC', category: { name: 'Bedsheet' }, price: 12500, oldPrice: 15000, discount: 17, rating: 4.9, reviewCount: 89, images: ['https://picsum.photos/seed/bed1/600/700', 'https://picsum.photos/seed/bed1b/600/700', 'https://picsum.photos/seed/bed1c/600/700'], stock: 8, sizes: ['Single', 'Double', 'Queen', 'King'], description: '1000 thread count pure Egyptian cotton. Unmatched softness and durability.', specifications: [{ key: 'Thread Count', value: '1000 TC' }, { key: 'Material', value: '100% Egyptian Cotton' }, { key: 'Weave', value: 'Sateen' }, { key: 'Care', value: 'Machine washable 30°C' }, { key: 'Includes', value: 'Flat sheet, fitted sheet, 2 pillowcases' }], bestSeller: true },
  { _id: '65a100000000000000000002', title: 'Silk Touch Luxury Set', category: { name: 'Bedsheet' }, price: 18000, oldPrice: 22000, discount: 18, rating: 4.9, reviewCount: 67, images: ['https://picsum.photos/seed/bed2/600/700', 'https://picsum.photos/seed/bed2b/600/700'], stock: 5, sizes: ['Queen', 'King'], description: 'Silk-blend fabric for the ultimate luxurious sleep experience.', specifications: [{ key: 'Material', value: '60% Silk, 40% Cotton' }, { key: 'Weave', value: 'Jacquard' }, { key: 'Care', value: 'Dry clean recommended' }], luxuryCollection: true },
];

const RELATED_PRODUCTS = [
  { _id: 'r1', title: 'Amber Mystique', category: { name: 'Perfume' }, price: 11200, oldPrice: 13500, discount: 17, rating: 4.6, reviewCount: 156, images: ['https://picsum.photos/seed/perf3/600/700'], stock: 30 },
  { _id: 'r2', title: 'Persian Jasmine', category: { name: 'Perfume' }, price: 7500, oldPrice: 9000, discount: 17, rating: 4.5, reviewCount: 178, images: ['https://picsum.photos/seed/perf4/600/700'], stock: 18 },
  { _id: 'r3', title: 'Midnight Oud', category: { name: 'Perfume' }, price: 14500, rating: 4.9, reviewCount: 312, images: ['https://picsum.photos/seed/perf5/600/700'], stock: 20, bestSeller: true },
  { _id: 'r4', title: 'Royal Musk', category: { name: 'Perfume' }, price: 5800, rating: 4.4, reviewCount: 267, images: ['https://picsum.photos/seed/perf9/600/700'], stock: 40 },
];

const DUMMY_REVIEWS = [
  { id: 1, name: 'Ayesha M.', rating: 5, date: '2025-06-15', comment: 'Absolutely stunning fragrance! Long lasting and gets so many compliments. Will buy again.' },
  { id: 2, name: 'Hassan A.', rating: 5, date: '2025-05-28', comment: 'Best purchase I\'ve made this year. The quality is premium and packaging is beautiful.' },
  { id: 3, name: 'Fatima K.', rating: 4, date: '2025-05-10', comment: 'Very good product. Slightly on the pricier side but worth every rupee. Fast delivery too.' },
  { id: 4, name: 'Usman R.', rating: 5, date: '2025-04-22', comment: 'Incredible! This is now my signature scent. Rich, complex and very long-lasting.' },
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const toast = useToast();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [adding, setAdding] = useState(false);

  // Find product by ID (in production this would be an API call)
  const product = ALL_PRODUCTS.find((p) => p._id === id) || ALL_PRODUCTS[0];
  const inWishlist = isInWishlist(product._id);
  const discount = product.discount || calculateDiscount(product.price, product.oldPrice);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product, quantity, selectedSize || null);
      toast(`${product.title} added to cart!`, 'success');
    } catch {
      toast('Failed to add to cart', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    await toggleWishlist(product);
    toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist ❤️', 'success');
  };

  return (
    <div className="pt-20 bg-cream-50 dark:bg-navy-900 min-h-screen">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/${product.category?.name?.toLowerCase()}s`} className="hover:text-gold-500 transition-colors">{product.category?.name}s</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white truncate">{product.title}</span>
        </nav>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-navy-800 shadow-luxury" style={{ paddingTop: '100%' }}>
              <img
                src={product.images?.[selectedImage] || product.images?.[0]}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 badge-sale text-sm">-{discount}%</div>
              )}
            </div>
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${selectedImage === idx ? 'border-gold-500' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-gold-500 text-sm font-medium uppercase tracking-widest mb-2">{product.category?.name}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">{product.title}</h1>
              <StarRating rating={product.rating} count={product.reviewCount} size="md" />
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 py-4 border-y border-gray-100 dark:border-gray-700">
              <span className="font-display text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
              )}
              {discount > 0 && (
                <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">Save {discount}%</span>
              )}
            </div>

            {/* Short description */}
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Select Size: {selectedSize && <span className="text-gold-500">{selectedSize}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${selectedSize === size ? 'border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gold-500'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-5">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quantity:</p>
              <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 py-2.5 text-lg font-medium hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors text-gray-700 dark:text-gray-300">−</button>
                <span className="px-6 py-2.5 text-base font-bold text-gray-900 dark:text-white border-x-2 border-gray-200 dark:border-gray-600 min-w-[60px] text-center">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))} className="px-4 py-2.5 text-lg font-medium hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors text-gray-700 dark:text-gray-300">+</button>
              </div>
              <span className={`text-sm font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                {product.stock > 10 ? `In Stock (${product.stock})` : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
                className="flex-1 min-w-[200px] btn-primary py-4 text-base disabled:opacity-50"
              >
                {adding ? 'Adding...' : '🛒 Add to Cart'}
              </button>
              <Link
                to="/checkout"
                className="flex-1 min-w-[200px] btn-secondary py-4 text-base text-center"
                onClick={() => addToCart(product, quantity, selectedSize || null)}
              >
                ⚡ Buy Now
              </Link>
              <button
                onClick={handleWishlist}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${inWishlist ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500' : 'border-gray-200 dark:border-gray-600 text-gray-500 hover:border-red-400 hover:text-red-500'}`}
                aria-label="Add to wishlist"
              >
                <svg className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              {[['🚚', 'Free Shipping over PKR 5000'], ['✅', 'Authentic Product'], ['↩️', '30-Day Returns'], ['🔒', 'Secure Payment']].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{icon}</span>{text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Description | Specifications | Reviews */}
        <div className="mb-16">
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
            {[['description', 'Description'], ['specifications', 'Specifications'], ['reviews', `Reviews (${product.reviewCount || 0})`]].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-200 -mb-[2px] ${activeTab === tab ? 'border-gold-500 text-gold-500' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gold-500'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">{product.longDescription || product.description}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(product.specifications || []).map((spec) => (
                <div key={spec.key} className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-navy-800 border border-gray-100 dark:border-gray-700">
                  <span className="text-gold-500 font-semibold text-sm w-36 shrink-0">{spec.key}</span>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {/* Rating Summary */}
              <div className="flex items-center gap-6 p-6 bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-gray-700 mb-6">
                <div className="text-center">
                  <div className="font-display text-5xl font-bold text-gray-900 dark:text-white">{product.rating?.toFixed(1)}</div>
                  <StarRating rating={product.rating} size="md" />
                  <p className="text-sm text-gray-500 mt-1">{product.reviewCount} reviews</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-3">{star}</span>
                        <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Review list */}
              <div className="space-y-4">
                {DUMMY_REVIEWS.map((r) => (
                  <div key={r.id} className="p-6 bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-600 font-bold">{r.name.charAt(0)}</div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{r.name}</p>
                          <p className="text-xs text-gray-400">{r.date}</p>
                        </div>
                      </div>
                      <StarRating rating={r.rating} size="sm" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div>
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">You May Also Like</h2>
          <div className="gold-line ml-0 mb-8" />
          <ProductGrid products={RELATED_PRODUCTS} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
