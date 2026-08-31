import React, { useState } from 'react';
import ProductGrid from '../components/product/ProductGrid';
import SectionTitle from '../components/ui/SectionTitle';
import { formatPrice } from '../utils/helpers';
import DemoSectionNotice from '../components/common/DemoSectionNotice';

const ALL_BEDSHEETS = [
  { _id: '65a100000000000000000001', title: 'Royal Cotton 1000TC', category: { name: 'Bedsheet' }, price: 12500, oldPrice: 15000, discount: 17, rating: 4.9, reviewCount: 89, images: ['https://picsum.photos/seed/bed1/600/700'], stock: 8, sizes: ['Single', 'Double', 'Queen', 'King'], description: '1000 thread count pure Egyptian cotton. Unmatched softness and durability.', bestSeller: true },
  { _id: '65a100000000000000000002', title: 'Silk Touch Luxury Set', category: { name: 'Bedsheet' }, price: 18000, oldPrice: 22000, discount: 18, rating: 4.9, reviewCount: 67, images: ['https://picsum.photos/seed/bed2/600/700'], stock: 5, sizes: ['Queen', 'King'], description: 'Silk-blend fabric for the ultimate luxurious sleep experience.', luxuryCollection: true },
  { _id: '65a100000000000000000003', title: 'Egyptian Cotton King', category: { name: 'Bedsheet' }, price: 22000, oldPrice: 27000, discount: 19, rating: 4.8, reviewCount: 44, images: ['https://picsum.photos/seed/bed3/600/700'], stock: 10, sizes: ['King'], description: 'Authentic Egyptian cotton, king size, 800 thread count.', luxuryCollection: true },
  { _id: '65a100000000000000000004', title: 'Satin Bliss Queen', category: { name: 'Bedsheet' }, price: 16500, oldPrice: 19000, discount: 13, rating: 4.7, reviewCount: 55, images: ['https://picsum.photos/seed/bed4/600/700'], stock: 12, sizes: ['Queen', 'King'], description: 'Premium satin weave with a smooth, cool-to-touch finish.', bestSeller: true },
  { _id: '65a100000000000000000005', title: 'Bamboo Cloud Set', category: { name: 'Bedsheet' }, price: 9800, rating: 4.8, reviewCount: 201, images: ['https://picsum.photos/seed/bed5/600/700'], stock: 25, sizes: ['Single', 'Double', 'Queen', 'King'], description: 'Eco-friendly bamboo fabric. Temperature-regulating and hypoallergenic.', bestSeller: true },
  { _id: '65a100000000000000000006', title: 'Pearl White Premium', category: { name: 'Bedsheet' }, price: 13500, rating: 4.9, reviewCount: 145, images: ['https://picsum.photos/seed/bed6/600/700'], stock: 9, sizes: ['Double', 'Queen', 'King'], description: 'Crisp pearl white cotton with hotel-quality finish.', bestSeller: true },
  { _id: '65a100000000000000000007', title: 'Navy Elegance Set', category: { name: 'Bedsheet' }, price: 10500, oldPrice: 12500, discount: 16, rating: 4.6, reviewCount: 78, images: ['https://picsum.photos/seed/bed7/600/700'], stock: 18, sizes: ['Single', 'Double', 'Queen', 'King'], description: 'Deep navy cotton percale with a crisp, cool feel.' },
  { _id: '65a100000000000000000008', title: 'Golden Threads King', category: { name: 'Bedsheet' }, price: 32000, oldPrice: 38000, discount: 16, rating: 4.9, reviewCount: 34, images: ['https://picsum.photos/seed/bed8/600/700'], stock: 4, sizes: ['King'], description: 'Ultra-premium with gold-toned threading. Statement luxury piece.', luxuryCollection: true },
  { _id: '65a100000000000000000009', title: 'Crimson Velvet Set', category: { name: 'Bedsheet' }, price: 28500, oldPrice: 33000, discount: 14, rating: 4.9, reviewCount: 41, images: ['https://picsum.photos/seed/bed9/600/700'], stock: 7, sizes: ['Double', 'Queen', 'King'], description: 'Rich crimson velvet-blend for a dramatic, opulent bedroom.', luxuryCollection: true },
  { _id: '65a100000000000000000010', title: 'Ivory Dream Set', category: { name: 'Bedsheet' }, price: 8900, oldPrice: 10500, discount: 15, rating: 4.7, reviewCount: 119, images: ['https://picsum.photos/seed/bed10/600/700'], stock: 30, sizes: ['Single', 'Double', 'Queen', 'King'], description: 'Soft ivory microfiber set. Easy care, wrinkle-resistant.' },
  { _id: '65a100000000000000000011', title: 'Midnight Blue Luxury', category: { name: 'Bedsheet' }, price: 15800, oldPrice: 18500, discount: 15, rating: 4.8, reviewCount: 62, images: ['https://picsum.photos/seed/bed11/600/700'], stock: 14, sizes: ['Queen', 'King'], description: 'Deep midnight blue, 600TC cotton sateen.', newArrival: true },
  { _id: '65a100000000000000000012', title: 'Sage Garden Set', category: { name: 'Bedsheet' }, price: 7500, rating: 4.5, reviewCount: 143, images: ['https://picsum.photos/seed/bed12/600/700'], stock: 22, sizes: ['Single', 'Double', 'Queen', 'King'], description: 'Calming sage green, 100% organic cotton.', newArrival: true },
  { _id: '65a100000000000000000013', title: 'Blush Romance Set', category: { name: 'Bedsheet' }, price: 9200, oldPrice: 11000, discount: 16, rating: 4.6, reviewCount: 88, images: ['https://picsum.photos/seed/bed13/600/700'], stock: 19, sizes: ['Single', 'Double', 'Queen', 'King'], description: 'Soft blush pink cotton blend. Perfect for a romantic bedroom.' },
  { _id: '65a100000000000000000014', title: 'Grey Marble Premium', category: { name: 'Bedsheet' }, price: 11000, rating: 4.7, reviewCount: 96, images: ['https://picsum.photos/seed/bed14/600/700'], stock: 16, sizes: ['Double', 'Queen', 'King'], description: 'Elegant grey marble print with premium cotton weave.', bestSeller: true },
  { _id: '65a100000000000000000015', title: 'Charcoal Classic Set', category: { name: 'Bedsheet' }, price: 8500, rating: 4.4, reviewCount: 132, images: ['https://picsum.photos/seed/bed15/600/700'], stock: 27, sizes: ['Single', 'Double', 'Queen', 'King'], description: 'Bold charcoal, 100% cotton percale. Timeless and masculine.' },
  { _id: '65a100000000000000000016', title: 'Teal Ocean Luxury', category: { name: 'Bedsheet' }, price: 14200, oldPrice: 17000, discount: 16, rating: 4.8, reviewCount: 51, images: ['https://picsum.photos/seed/bed16/600/700'], stock: 11, sizes: ['Queen', 'King'], description: 'Ocean teal, Egyptian cotton sateen. Resort-quality comfort.' },
  { _id: '65a100000000000000000017', title: 'Rose Gold Satin', category: { name: 'Bedsheet' }, price: 19500, oldPrice: 23000, discount: 15, rating: 4.8, reviewCount: 37, images: ['https://picsum.photos/seed/bed17/600/700'], stock: 6, sizes: ['Queen', 'King'], description: 'Shimmering rose gold satin for ultimate glamour.', luxuryCollection: true },
  { _id: '65a100000000000000000018', title: 'Forest Green Premium', category: { name: 'Bedsheet' }, price: 10800, rating: 4.5, reviewCount: 74, images: ['https://picsum.photos/seed/bed18/600/700'], stock: 20, sizes: ['Single', 'Double', 'Queen', 'King'], description: 'Deep forest green organic cotton. Nature-inspired luxury.', newArrival: true },
  { _id: '65a100000000000000000019', title: 'Lavender Lush Set', category: { name: 'Bedsheet' }, price: 8200, oldPrice: 9800, discount: 16, rating: 4.6, reviewCount: 108, images: ['https://picsum.photos/seed/bed19/600/700'], stock: 24, sizes: ['Single', 'Double', 'Queen', 'King'], description: 'Soothing lavender, microfiber blend. Soft as a cloud.' },
  { _id: '65a100000000000000000020', title: 'Cream Linen Luxury', category: { name: 'Bedsheet' }, price: 17500, oldPrice: 21000, discount: 17, rating: 4.9, reviewCount: 49, images: ['https://picsum.photos/seed/bed20/600/700'], stock: 8, sizes: ['Queen', 'King'], description: 'Pure linen in warm cream. Breathable, eco-friendly, forever stylish.', luxuryCollection: true },
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

const BedsheetsPage = () => {
  const [sort, setSort] = useState('featured');
  const [filter, setFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [priceMax, setPriceMax] = useState(40000);
  const [search, setSearch] = useState('');

  const filtered = ALL_BEDSHEETS
    .filter((p) => {
      if (filter === 'new' && !p.newArrival) return false;
      if (filter === 'bestseller' && !p.bestSeller) return false;
      if (filter === 'luxury' && !p.luxuryCollection) return false;
      if (filter === 'sale' && !p.discount) return false;
      if (sizeFilter !== 'all' && !p.sizes?.includes(sizeFilter)) return false;
      if (p.price > priceMax) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <div className="pt-20 bg-cream-50 dark:bg-navy-900 min-h-screen">
      {/* Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #1A2238 50%, #0A0F1E 100%)' }}>
        <img
          src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1920&q=80"
          alt="Bedsheets"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-gold-400 text-sm font-medium uppercase tracking-widest mb-3 animate-fade-in">Royal Zone Collection</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4 animate-slide-up">Bedsheet Designs</h1>
          <p className="text-gray-300 text-base max-w-md animate-fade-in delay-200">Sleep in luxury every single night</p>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6 bg-white dark:bg-navy-800 p-4 rounded-2xl shadow-card">
          <div className="relative flex-1">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bedsheets..." className="form-input pl-10" />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[['all', 'All'], ['new', 'New'], ['bestseller', 'Best Sellers'], ['luxury', 'Luxury'], ['sale', 'On Sale']].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${filter === val ? 'bg-gold-500 text-white shadow-gold' : 'bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gold-500/20'}`}>{label}</button>
            ))}
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="form-input w-full lg:w-48 cursor-pointer">
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Size & Price Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="bg-white dark:bg-navy-800 p-4 rounded-2xl shadow-card flex items-center gap-3 flex-wrap flex-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Size:</span>
            {['all', 'Single', 'Double', 'Queen', 'King'].map((s) => (
              <button key={s} onClick={() => setSizeFilter(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 ${sizeFilter === s ? 'border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gold-500'}`}>{s === 'all' ? 'All Sizes' : s}</button>
            ))}
          </div>
          <div className="bg-white dark:bg-navy-800 p-4 rounded-2xl shadow-card flex items-center gap-4 flex-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Max: <span className="text-gold-500 font-bold">{formatPrice(priceMax)}</span></label>
            <input type="range" min={5000} max={40000} step={1000} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="flex-1 accent-yellow-500" />
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{filtered.length} bedsheet set{filtered.length !== 1 ? 's' : ''} found</p>
        {/* Demo notice — remove via IS_DEMO_MODE toggle in storeConfig.js */}
        <DemoSectionNotice />
        <ProductGrid products={filtered} emptyMessage="No bedsheets match your filters. Try adjusting the criteria." />
      </div>
    </div>
  );
};

export default BedsheetsPage;
