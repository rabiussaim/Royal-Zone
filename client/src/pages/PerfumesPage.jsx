import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import SectionTitle from '../components/ui/SectionTitle';
import SEO from '../components/common/SEO';
import { formatPrice } from '../utils/helpers';
import DemoSectionNotice from '../components/common/DemoSectionNotice';

// Dummy perfume products
const ALL_PERFUMES = [
  { _id: '65b100000000000000000001', title: 'Oud Al Qamar', category: { name: 'Perfume' }, price: 8500, oldPrice: 10000, discount: 15, rating: 4.8, reviewCount: 124, images: ['https://picsum.photos/seed/perf1/600/700'], stock: 15, description: 'A deep, rich oud fragrance with notes of rose and amber.', tags: ['oud', 'oriental'] },
  { _id: '65b100000000000000000002', title: 'Rose Noire', category: { name: 'Perfume' }, price: 6800, oldPrice: 8500, discount: 20, rating: 4.7, reviewCount: 203, images: ['https://picsum.photos/seed/perf2/600/700'], stock: 22, newArrival: true, description: 'Dark rose with black pepper and patchouli.', tags: ['floral', 'dark'] },
  { _id: '65b100000000000000000003', title: 'Amber Mystique', category: { name: 'Perfume' }, price: 11200, oldPrice: 13500, discount: 17, rating: 4.6, reviewCount: 156, images: ['https://picsum.photos/seed/perf3/600/700'], stock: 30, description: 'Warm amber with vanilla and sandalwood.', tags: ['amber', 'warm'] },
  { _id: '65b100000000000000000004', title: 'Persian Jasmine', category: { name: 'Perfume' }, price: 7500, oldPrice: 9000, discount: 17, rating: 4.5, reviewCount: 178, images: ['https://picsum.photos/seed/perf4/600/700'], stock: 18, newArrival: true, description: 'Fresh jasmine with a hint of musk.', tags: ['floral', 'fresh'] },
  { _id: '65b100000000000000000005', title: 'Midnight Oud', category: { name: 'Perfume' }, price: 14500, rating: 4.9, reviewCount: 312, images: ['https://picsum.photos/seed/perf5/600/700'], bestSeller: true, stock: 20, description: 'Intense oud with smoky leather and incense.', tags: ['oud', 'smoky'] },
  { _id: '65b100000000000000000006', title: 'Sandalwood Dreams', category: { name: 'Perfume' }, price: 9200, rating: 4.7, reviewCount: 189, images: ['https://picsum.photos/seed/perf6/600/700'], bestSeller: true, stock: 17, description: 'Smooth sandalwood with cedar and vetiver.', tags: ['woody', 'calm'] },
  { _id: '65b100000000000000000007', title: 'Black Orchid Parfum', category: { name: 'Perfume' }, price: 24500, oldPrice: 28000, discount: 12, rating: 5.0, reviewCount: 88, images: ['https://picsum.photos/seed/perf7/600/700'], luxuryCollection: true, stock: 6, description: 'Rare black orchid with dark chocolate and spice.', tags: ['luxury', 'floral'] },
  { _id: '65b100000000000000000008', title: 'Frankincense Gold', category: { name: 'Perfume' }, price: 18900, oldPrice: 22000, discount: 14, rating: 4.8, reviewCount: 97, images: ['https://picsum.photos/seed/perf8/600/700'], luxuryCollection: true, stock: 11, description: 'Sacred frankincense with golden amber and myrrh.', tags: ['luxury', 'oriental'] },
  { _id: '65b100000000000000000009', title: 'Royal Musk', category: { name: 'Perfume' }, price: 5800, rating: 4.4, reviewCount: 267, images: ['https://picsum.photos/seed/perf9/600/700'], stock: 40, description: 'Clean, soft white musk with powdery iris.', tags: ['musk', 'clean'] },
  { _id: '65b100000000000000000010', title: 'Desert Bloom', category: { name: 'Perfume' }, price: 7200, oldPrice: 8800, discount: 18, rating: 4.6, reviewCount: 133, images: ['https://picsum.photos/seed/perf10/600/700'], stock: 25, description: 'Desert flowers with tuberose and vetiver.', tags: ['floral', 'oriental'] },
  { _id: '65b100000000000000000011', title: 'Golden Iris', category: { name: 'Perfume' }, price: 13500, oldPrice: 16000, discount: 16, rating: 4.7, reviewCount: 74, images: ['https://picsum.photos/seed/perf11/600/700'], stock: 14, description: 'Powdery iris with violet and white musk.', tags: ['floral', 'elegant'] },
  { _id: '65b100000000000000000012', title: 'Velvet Rose', category: { name: 'Perfume' }, price: 9800, rating: 4.8, reviewCount: 221, images: ['https://picsum.photos/seed/perf12/600/700'], bestSeller: true, stock: 28, description: 'Lush Turkish rose with oud and musks.', tags: ['floral', 'rose'] },
  { _id: '65b100000000000000000013', title: 'Cedar Royale', category: { name: 'Perfume' }, price: 6500, rating: 4.3, reviewCount: 98, images: ['https://picsum.photos/seed/perf13/600/700'], stock: 33, description: 'Crisp cedarwood with bergamot and vetiver.', tags: ['woody', 'fresh'] },
  { _id: '65b100000000000000000014', title: 'Saffron Elixir', category: { name: 'Perfume' }, price: 16800, oldPrice: 20000, discount: 16, rating: 4.9, reviewCount: 56, images: ['https://picsum.photos/seed/perf14/600/700'], luxuryCollection: true, stock: 9, description: 'Rare saffron with rose oud and precious woods.', tags: ['luxury', 'oriental'] },
  { _id: '65b100000000000000000015', title: 'Lavender Luxe', category: { name: 'Perfume' }, price: 5200, rating: 4.4, reviewCount: 310, images: ['https://picsum.photos/seed/perf15/600/700'], stock: 45, description: 'Calming lavender with musk and cedarwood.', tags: ['fresh', 'calm'] },
  { _id: '65b100000000000000000016', title: 'Vanilla Noir', category: { name: 'Perfume' }, price: 7800, oldPrice: 9500, discount: 18, rating: 4.6, reviewCount: 144, images: ['https://picsum.photos/seed/perf16/600/700'], stock: 22, description: 'Rich Madagascar vanilla with tonka bean and dark woods.', tags: ['gourmand', 'warm'] },
  { _id: '65b100000000000000000017', title: 'Patchouli Prince', category: { name: 'Perfume' }, price: 10500, rating: 4.5, reviewCount: 87, images: ['https://picsum.photos/seed/perf17/600/700'], stock: 16, description: 'Earthy patchouli with bergamot and rose.', tags: ['earthy', 'oriental'] },
  { _id: '65b100000000000000000018', title: 'Bergamot Crown', category: { name: 'Perfume' }, price: 8200, oldPrice: 9800, discount: 16, rating: 4.7, reviewCount: 165, images: ['https://picsum.photos/seed/perf18/600/700'], newArrival: true, stock: 20, description: 'Zesty bergamot with neroli and white musks.', tags: ['fresh', 'citrus'] },
  { _id: '65b100000000000000000019', title: 'Tobacco Royale', category: { name: 'Perfume' }, price: 12000, rating: 4.6, reviewCount: 109, images: ['https://picsum.photos/seed/perf19/600/700'], stock: 13, description: 'Bold tobacco with honey, leather and spice.', tags: ['leather', 'bold'] },
  { _id: '65b100000000000000000020', title: 'White Amber', category: { name: 'Perfume' }, price: 8900, oldPrice: 10500, discount: 15, rating: 4.8, reviewCount: 192, images: ['https://picsum.photos/seed/perf20/600/700'], bestSeller: true, stock: 31, description: 'Soft white amber with musk and sandalwood.', tags: ['amber', 'soft'] },
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

const PerfumesPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const genderParam = params.get('gender') || '';

  const [sort, setSort] = useState('featured');
  const [filter, setFilter] = useState('all');
  const [gender, setGender] = useState(genderParam); // 'women' | 'men' | ''
  const [priceMax, setPriceMax] = useState(30000);
  const [search, setSearch] = useState('');
  const [hoveredSplit, setHoveredSplit] = useState(null); // 'women' | 'men' | null
  const [bannerHovered, setBannerHovered] = useState(false);

  // Sync gender state when URL param changes (e.g. nav link clicks)
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setGender(p.get('gender') || '');
  }, [location.search]);

  const pageTitle = gender === 'women' ? 'For Her' : gender === 'men' ? 'For Him' : 'Perfumes';
  const pageSubtitle = gender === 'women'
    ? 'Elegance and grace — bottled for her.'
    : gender === 'men'
    ? 'Bold, timeless fragrances — crafted for him.'
    : 'Discover scents that tell your story';

  const filtered = ALL_PERFUMES
    .filter((p) => {
      if (filter === 'new' && !p.newArrival) return false;
      if (filter === 'bestseller' && !p.bestSeller) return false;
      if (filter === 'luxury' && !p.luxuryCollection) return false;
      if (filter === 'sale' && !p.discount) return false;
      // Gender filter
      if (gender === 'women' && p.gender !== 'women' && !p.tags?.some(t => ['floral','rose','jasmine','iris','fresh','elegant'].includes(t))) return false;
      if (gender === 'men' && p.gender !== 'men' && !p.tags?.some(t => ['oud','woody','leather','smoky','bold','earthy','tobacco','cedar'].includes(t))) return false;
      if (p.price > priceMax) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.tags?.some(t => t.includes(search.toLowerCase()))) return false;
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
      <SEO
        title={`Royal Zone | ${pageTitle} — Premium Luxury Fragrances Pakistan`}
        description={pageSubtitle}
      />

      {/* ══════════════════════════════════════════════════
          DYNAMIC RESPONSIVE CINEMATIC BANNER WITH TRANSITIONS
      ══════════════════════════════════════════════════ */}
      {gender === 'women' ? (
        /* ── WOMEN ONLY BANNER (For Her Page) with Logo Watermark Visible on Phone, Tab & Desktop ── */
        <div
          className="relative h-72 sm:h-80 md:h-96 overflow-hidden flex items-center cursor-pointer group"
          style={{ background: 'linear-gradient(145deg, #1C0407 0%, #3D0B12 50%, #1A0306 100%)' }}
          onMouseEnter={() => setBannerHovered(true)}
          onMouseLeave={() => setBannerHovered(false)}
        >
          {/* Logo crest watermark — visible on mobile, tablet & desktop in left background */}
          <div className="absolute left-4 sm:left-10 md:left-16 lg:left-24 top-1/2 -translate-y-1/2 pointer-events-none z-0">
            <img
              src="/logo.png"
              alt=""
              className="w-36 sm:w-56 md:w-72 lg:w-80 h-36 sm:h-56 md:h-72 lg:h-80 object-contain opacity-20 sm:opacity-20 md:opacity-15 transition-all duration-700 group-hover:opacity-30 group-hover:scale-110 filter brightness-0 invert"
            />
          </div>

          {/* Women editorial image with smooth zoom transition */}
          <div className="absolute inset-0 flex justify-end">
            <div className="relative w-full md:w-1/2 h-full overflow-hidden">
              <img
                src="/hero-women.png"
                alt="Royal Zone — For Her"
                className="w-full h-full object-cover transition-all duration-700 ease-out"
                style={{
                  objectPosition: 'right 0%',
                  transform: `scaleX(-1) scale(${bannerHovered ? 1.08 : 1.0})`,
                  filter: `brightness(${bannerHovered ? 1.15 : 1.02}) saturate(${bannerHovered ? 1.15 : 1.05})`,
                }}
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, #1C0407 0%, rgba(28,4,7,0.5) 65%, transparent 100%)' }} />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, #1C0407 0%, transparent 60%)' }} />
            </div>
          </div>

          <div className="container-custom relative z-10 text-left px-4">
            <div className="max-w-md">
              <p className="text-gold-400 text-xs font-bold uppercase tracking-[0.35em] mb-3 transition-transform duration-500 group-hover:translate-x-1">
                Royal Zone Collection
              </p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 leading-none transition-transform duration-500 group-hover:-translate-y-1">
                For Her
              </h1>
              <div
                className="h-[2px] mb-4 transition-all duration-500"
                style={{
                  width: bannerHovered ? '96px' : '64px',
                  background: 'linear-gradient(90deg, #E6A8A8, #C9A96E, transparent)',
                }}
              />
              <p className="text-rose-100/90 text-sm sm:text-base md:text-lg font-light leading-relaxed">
                {pageSubtitle}
              </p>
            </div>
          </div>
        </div>

      ) : gender === 'men' ? (

        /* ── MEN ONLY BANNER (For Him Page) with Logo Watermark Visible on Phone, Tab & Desktop ── */
        <div
          className="relative h-72 sm:h-80 md:h-96 overflow-hidden flex items-center cursor-pointer group"
          style={{ background: 'linear-gradient(145deg, #06080C 0%, #121722 50%, #06080C 100%)' }}
          onMouseEnter={() => setBannerHovered(true)}
          onMouseLeave={() => setBannerHovered(false)}
        >
          {/* Logo crest watermark — visible on mobile, tablet & desktop in right background */}
          <div className="absolute right-4 sm:right-10 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 pointer-events-none z-0">
            <img
              src="/logo.png"
              alt=""
              className="w-36 sm:w-56 md:w-72 lg:w-80 h-36 sm:h-56 md:h-72 lg:h-80 object-contain opacity-20 sm:opacity-20 md:opacity-15 transition-all duration-700 group-hover:opacity-30 group-hover:scale-110 filter brightness-0 invert"
            />
          </div>

          {/* Men editorial image with smooth zoom transition */}
          <div className="absolute inset-0 flex justify-start">
            <div className="relative w-full md:w-1/2 h-full overflow-hidden">
              <img
                src="/hero-men.png"
                alt="Royal Zone — For Him"
                className="w-full h-full object-cover transition-all duration-700 ease-out"
                style={{
                  objectPosition: 'left 0%',
                  transform: `scaleX(-1) scale(${bannerHovered ? 1.08 : 1.0})`,
                  filter: `brightness(${bannerHovered ? 1.15 : 1.02}) saturate(${bannerHovered ? 1.15 : 1.05})`,
                }}
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to left, #06080C 0%, rgba(6,8,12,0.5) 65%, transparent 100%)' }} />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, #06080C 0%, transparent 60%)' }} />
            </div>
          </div>

          <div className="container-custom relative z-10 text-right px-4 flex justify-end">
            <div className="max-w-md">
              <p className="text-gold-400 text-xs font-bold uppercase tracking-[0.35em] mb-3 transition-transform duration-500 group-hover:-translate-x-1">
                Royal Zone Collection
              </p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 leading-none transition-transform duration-500 group-hover:-translate-y-1">
                For Him
              </h1>
              <div
                className="h-[2px] ml-auto mb-4 transition-all duration-500"
                style={{
                  width: bannerHovered ? '96px' : '64px',
                  background: 'linear-gradient(90deg, transparent, #C9A96E, #94A3B8)',
                }}
              />
              <p className="text-slate-200/90 text-sm sm:text-base md:text-lg font-light leading-relaxed">
                {pageSubtitle}
              </p>
            </div>
          </div>
        </div>

      ) : (

        /* ── ALL PERFUMES RESPONSIVE BANNER: 50/50 SPLIT WITH HOVER & TOUCH TRANSITION ── */
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden select-none bg-black">
          {/* 50/50 Split Panels */}
          <div className="absolute inset-0 flex flex-row w-full h-full">

            {/* Left — Women */}
            <div
              className="relative overflow-hidden cursor-pointer h-full"
              style={{
                flex: hoveredSplit === 'women' ? '0 0 60%' : hoveredSplit === 'men' ? '0 0 40%' : '0 0 50%',
                transition: 'flex 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={() => setHoveredSplit('women')}
              onMouseLeave={() => setHoveredSplit(null)}
              onTouchStart={() => setHoveredSplit('women')}
            >
              <img
                src="/hero-women.png"
                alt="Women's Fragrances"
                className="w-full h-full object-cover"
                style={{
                  objectPosition: 'right 0%',
                  transform: `scaleX(-1) scale(${hoveredSplit === 'women' ? 1.06 : 1.0})`,
                  filter: `brightness(${hoveredSplit === 'men' ? 0.45 : 1.05})`,
                  transition: 'transform 0.65s ease, filter 0.65s ease',
                }}
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(28,4,7,0.7) 0%, transparent 70%)' }} />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />
              
              {/* Bottom label */}
              <div className="absolute bottom-2.5 sm:bottom-6 left-3 sm:left-6 z-10 pointer-events-none">
                <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300/85 mb-0.5">Collection</p>
                <h3 className="font-display text-sm sm:text-2xl md:text-3xl font-bold text-white">For Her</h3>
              </div>
            </div>

            {/* Right — Men */}
            <div
              className="relative overflow-hidden cursor-pointer h-full"
              style={{
                flex: hoveredSplit === 'men' ? '0 0 60%' : hoveredSplit === 'women' ? '0 0 40%' : '0 0 50%',
                transition: 'flex 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={() => setHoveredSplit('men')}
              onMouseLeave={() => setHoveredSplit(null)}
              onTouchStart={() => setHoveredSplit('men')}
            >
              <img
                src="/hero-men.png"
                alt="Men's Fragrances"
                className="w-full h-full object-cover"
                style={{
                  objectPosition: 'left 0%',
                  transform: `scaleX(-1) scale(${hoveredSplit === 'men' ? 1.06 : 1.0})`,
                  filter: `brightness(${hoveredSplit === 'women' ? 0.45 : 1.05})`,
                  transition: 'transform 0.65s ease, filter 0.65s ease',
                }}
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(6,8,12,0.7) 0%, transparent 70%)' }} />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />
              
              {/* Bottom label */}
              <div className="absolute bottom-2.5 sm:bottom-6 right-3 sm:right-6 z-10 text-right pointer-events-none">
                <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300/85 mb-0.5">Collection</p>
                <h3 className="font-display text-sm sm:text-2xl md:text-3xl font-bold text-white">For Him</h3>
              </div>
            </div>

          </div>

          {/* Responsive Center Seam & Sleek Title Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 text-center px-3">
            <div className="w-auto max-w-[75%] sm:max-w-xs md:max-w-md px-3.5 py-2 sm:px-6 sm:py-3.5 bg-black/75 border border-gold-500/40 backdrop-blur-md shadow-2xl rounded-sm sm:rounded-md">
              <img
                src="/logo.png"
                alt="Royal Zone"
                className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 mx-auto mb-1 object-contain filter brightness-0 invert opacity-90"
              />
              <p className="text-gold-400 text-[7px] sm:text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-0.5 sm:mb-1">
                Royal Zone Collection
              </p>
              <h1 className="font-display text-lg sm:text-2xl md:text-4xl font-bold text-white mb-0.5 sm:mb-1">
                Perfumes
              </h1>
              <div className="h-[1px] w-8 sm:w-14 mx-auto mb-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
              <p className="text-gray-300 text-[8px] sm:text-xs font-light tracking-wide">
                Discover scents that tell your story
              </p>
            </div>
          </div>
        </div>

      )}

      {/* ══════════════════════════════════════════════════
          PRODUCTS GRID & FILTERS
      ══════════════════════════════════════════════════ */}
      <div className="container-custom py-12">
        {/* Filter & Sort Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 bg-white dark:bg-navy-800 p-4 rounded-2xl shadow-card">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search perfumes..."
              className="form-input pl-10"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 flex-wrap">
            {[['all', 'All'], ['new', 'New'], ['bestseller', 'Best Sellers'], ['luxury', 'Luxury'], ['sale', 'On Sale']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${filter === val ? 'bg-gold-500 text-white shadow-gold' : 'bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gold-500/20 hover:text-gold-600'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="form-input w-full lg:w-48 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="bg-white dark:bg-navy-800 p-4 rounded-2xl shadow-card mb-8 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Max Price: <span className="text-gold-500 font-bold">{formatPrice(priceMax)}</span></label>
          <input
            type="range"
            min={1000}
            max={30000}
            step={500}
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="flex-1 accent-yellow-500"
          />
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{filtered.length} perfume{filtered.length !== 1 ? 's' : ''} found</p>

        {/* Demo notice — remove via IS_DEMO_MODE toggle in storeConfig.js */}
        <DemoSectionNotice />

        {/* Products Grid */}
        <ProductGrid products={filtered} emptyMessage="No perfumes match your filters. Try adjusting the criteria." />
      </div>
    </div>
  );
};

export default PerfumesPage;
