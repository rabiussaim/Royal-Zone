import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';

const ALL_PRODUCTS_FLAT = [
  { _id: '65b100000000000000000001', title: 'Oud Al Qamar', category: { name: 'Perfume' }, price: 8500, oldPrice: 10000, discount: 15, rating: 4.8, reviewCount: 124, images: ['https://picsum.photos/seed/perf1/600/700'], stock: 15 },
  { _id: '65b100000000000000000002', title: 'Rose Noire', category: { name: 'Perfume' }, price: 6800, oldPrice: 8500, discount: 20, rating: 4.7, reviewCount: 203, images: ['https://picsum.photos/seed/perf2/600/700'], stock: 22, newArrival: true },
  { _id: '65b100000000000000000003', title: 'Amber Mystique', category: { name: 'Perfume' }, price: 11200, rating: 4.6, reviewCount: 156, images: ['https://picsum.photos/seed/perf3/600/700'], stock: 30 },
  { _id: '65b100000000000000000004', title: 'Persian Jasmine', category: { name: 'Perfume' }, price: 7500, rating: 4.5, reviewCount: 178, images: ['https://picsum.photos/seed/perf4/600/700'], stock: 18 },
  { _id: '65b100000000000000000005', title: 'Midnight Oud', category: { name: 'Perfume' }, price: 14500, rating: 4.9, reviewCount: 312, images: ['https://picsum.photos/seed/perf5/600/700'], stock: 20, bestSeller: true },
  { _id: '65a100000000000000000001', title: 'Royal Cotton 1000TC', category: { name: 'Bedsheet' }, price: 12500, oldPrice: 15000, discount: 17, rating: 4.9, reviewCount: 89, images: ['https://picsum.photos/seed/bed1/600/700'], stock: 8 },
  { _id: '65a100000000000000000002', title: 'Silk Touch Luxury Set', category: { name: 'Bedsheet' }, price: 18000, oldPrice: 22000, discount: 18, rating: 4.9, reviewCount: 67, images: ['https://picsum.photos/seed/bed2/600/700'], stock: 5, luxuryCollection: true },
  { _id: '65a100000000000000000003', title: 'Bamboo Cloud Set', category: { name: 'Bedsheet' }, price: 9800, rating: 4.8, reviewCount: 201, images: ['https://picsum.photos/seed/bed3/600/700'], stock: 25 },
  { _id: '65a100000000000000000004', title: 'Pearl White Premium', category: { name: 'Bedsheet' }, price: 13500, rating: 4.9, reviewCount: 145, images: ['https://picsum.photos/seed/bed4/600/700'], stock: 9 },
  { _id: '65b100000000000000000006', title: 'Sandalwood Dreams', category: { name: 'Perfume' }, price: 9200, rating: 4.7, reviewCount: 189, images: ['https://picsum.photos/seed/perf6/600/700'], stock: 17 },
  { _id: '65b100000000000000000007', title: 'Black Orchid Parfum', category: { name: 'Perfume' }, price: 24500, oldPrice: 28000, discount: 12, rating: 5.0, reviewCount: 88, images: ['https://picsum.photos/seed/perf7/600/700'], stock: 6, luxuryCollection: true },
  { _id: '65a100000000000000000005', title: 'Navy Elegance Set', category: { name: 'Bedsheet' }, price: 10500, oldPrice: 12500, discount: 16, rating: 4.6, reviewCount: 78, images: ['https://picsum.photos/seed/bed5/600/700'], stock: 18 },
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    setTimeout(() => {
      const filtered = ALL_PRODUCTS_FLAT.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    }, 400);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-cream-50 dark:bg-navy-900">
      <div className="container-custom py-8">
        <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-2">Search</h1>
        <div className="gold-line ml-0 mb-8" />

        {/* Search box */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-xl">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search perfumes, bedsheets..."
              className="form-input pl-10 pr-4 py-4 text-base"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button type="submit" className="btn-primary px-6 py-4">Search</button>
        </form>

        {/* Quick categories */}
        {!query && (
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Popular Categories</p>
            <div className="flex gap-3 flex-wrap mb-10">
              {['Oud', 'Rose', 'Luxury', 'Bedsheet', 'King Size', 'Cotton', 'Perfume', 'Amber'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setInputValue(tag); setSearchParams({ q: tag }); }}
                  className="px-4 py-2 rounded-full text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gold-500 hover:text-gold-500 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {query && (
          <div>
            {!loading && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {results.length > 0
                  ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
                  : `No results for "${query}"`}
              </p>
            )}
            <ProductGrid
              products={results}
              loading={loading}
              emptyMessage={`No products found for "${query}". Try a different search term.`}
            />
            {!loading && results.length === 0 && (
              <div className="text-center mt-8">
                <p className="text-gray-500 mb-4">Try browsing our collections instead:</p>
                <div className="flex gap-3 justify-center">
                  <Link to="/perfumes" className="btn-primary px-6 py-2 text-sm">Perfumes</Link>
                  <Link to="/bedsheets" className="btn-secondary px-6 py-2 text-sm">Bedsheets</Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
