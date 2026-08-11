import React, { useState } from 'react';
import BlogCard from '../components/blog/BlogCard';
import SEO from '../components/common/SEO';
import { BLOG_POSTS } from '../data/blogData';

const CATEGORIES = ['All', 'Fragrance Guides', 'Bedding & Home', 'Perfume Tips'];

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <SEO
        title="Royal Luxury Journal & Fragrance Blog"
        description="Explore luxury Oud perfume buying guides, Egyptian cotton bedsheet care tips, and fragrance layering secrets from Royal Zone experts."
        keywords="luxury perfume blog, oud perfume guide, egyptian cotton care, luxury lifestyle blog, royal zone journal"
      />

      <div className="pt-28 min-h-screen bg-cream-50 dark:bg-navy-900">
        {/* Hero */}
        <section className="bg-navy-900 text-white py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 opacity-90" />
          <div className="container-custom relative z-10 text-center max-w-3xl">
            <span className="px-4 py-1.5 bg-gold-500/20 text-gold-400 text-xs font-bold rounded-full border border-gold-500/30 uppercase tracking-widest inline-block mb-4">
              ✨ The Royal Journal
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Luxury Fragrance & Living Guides
            </h1>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-8">
              Expert advice on selecting long-lasting Oud perfumes, caring for 1000TC cotton sheets, and mastering scent sillage.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blog articles..."
                className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm backdrop-blur-md"
              />
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </section>

        {/* Category Filters & Posts Grid */}
        <section className="container-custom py-12">
          {/* Categories */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-gold-500 text-white shadow-md'
                    : 'bg-white dark:bg-navy-800 text-gray-700 dark:text-gray-300 hover:border-gold-500 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-navy-800 rounded-3xl p-8 max-w-md mx-auto shadow-card">
              <div className="text-5xl mb-4">📰</div>
              <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">No Articles Found</h3>
              <p className="text-gray-500 text-sm mb-4">Try adjusting your search query or selecting another category.</p>
              <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} className="btn-primary py-2 px-5 text-sm">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default BlogPage;
