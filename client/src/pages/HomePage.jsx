import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/ui/HeroSection';
import SectionTitle from '../components/ui/SectionTitle';
import ProductGrid from '../components/product/ProductGrid';
import BlogCard from '../components/blog/BlogCard';
import SEO from '../components/common/SEO';
import { BLOG_POSTS } from '../data/blogData';
import useScrollReveal from '../hooks/useScrollReveal';

// High-quality reliable luxury image URLs
const PERFUME_IMG_1 = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80';
const PERFUME_IMG_2 = 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80';
const PERFUME_IMG_3 = 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80';
const PERFUME_IMG_4 = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80';
const PERFUME_IMG_5 = 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80';
const PERFUME_IMG_6 = 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80';

const BED_IMG_1 = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80';
const BED_IMG_2 = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80';
const BED_IMG_3 = 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80';
const BED_IMG_4 = 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80';

const DUMMY_FEATURED = [
  { _id: '65c000000000000000000001', title: 'Oud Al Qamar', category: { name: 'Perfume' }, price: 8500, oldPrice: 10000, discount: 15, rating: 4.8, reviewCount: 124, images: [PERFUME_IMG_1], featured: true, stock: 15 },
  { _id: '65c000000000000000000002', title: 'Royal Cotton 1000TC', category: { name: 'Bedsheet' }, price: 12500, oldPrice: 15000, discount: 17, rating: 4.9, reviewCount: 89, images: [BED_IMG_1], featured: true, stock: 8 },
  { _id: '65c000000000000000000003', title: 'Rose Noire', category: { name: 'Perfume' }, price: 6800, oldPrice: 8500, discount: 20, rating: 4.7, reviewCount: 203, images: [PERFUME_IMG_2], featured: true, newArrival: true, stock: 22 },
  { _id: '65c000000000000000000004', title: 'Silk Touch Luxury Set', category: { name: 'Bedsheet' }, price: 18000, oldPrice: 22000, discount: 18, rating: 4.9, reviewCount: 67, images: [BED_IMG_2], featured: true, luxuryCollection: true, stock: 5 },
  { _id: '65c000000000000000000005', title: 'Amber Mystique', category: { name: 'Perfume' }, price: 11200, oldPrice: 13500, discount: 17, rating: 4.6, reviewCount: 156, images: [PERFUME_IMG_3], featured: true, stock: 30 },
  { _id: '65c000000000000000000006', title: 'Egyptian Cotton King', category: { name: 'Bedsheet' }, price: 22000, oldPrice: 27000, discount: 19, rating: 4.8, reviewCount: 44, images: [BED_IMG_3], luxuryCollection: true, stock: 10 },
  { _id: '65c000000000000000000007', title: 'Persian Jasmine', category: { name: 'Perfume' }, price: 7500, oldPrice: 9000, discount: 17, rating: 4.5, reviewCount: 178, images: [PERFUME_IMG_4], newArrival: true, stock: 18 },
  { _id: '65c000000000000000000008', title: 'Satin Bliss Queen', category: { name: 'Bedsheet' }, price: 16500, oldPrice: 19000, discount: 13, rating: 4.7, reviewCount: 55, images: [BED_IMG_4], bestSeller: true, stock: 12 },
];

const DUMMY_BESTSELLERS = [
  { _id: '65c000000000000000000009', title: 'Midnight Oud', category: { name: 'Perfume' }, price: 14500, rating: 4.9, reviewCount: 312, images: [PERFUME_IMG_5], bestSeller: true, stock: 20 },
  { _id: '65c000000000000000000010', title: 'Bamboo Cloud Set', category: { name: 'Bedsheet' }, price: 9800, rating: 4.8, reviewCount: 201, images: [BED_IMG_2], bestSeller: true, stock: 25 },
  { _id: '65c000000000000000000011', title: 'Sandalwood Dreams', category: { name: 'Perfume' }, price: 9200, rating: 4.7, reviewCount: 189, images: [PERFUME_IMG_6], bestSeller: true, stock: 17 },
  { _id: '65c000000000000000000012', title: 'Pearl White Premium', category: { name: 'Bedsheet' }, price: 13500, rating: 4.9, reviewCount: 145, images: [BED_IMG_1], bestSeller: true, stock: 9 },
];

const DUMMY_LUXURY = [
  { _id: '65c000000000000000000013', title: 'Black Orchid Parfum', category: { name: 'Perfume' }, price: 24500, oldPrice: 28000, discount: 12, rating: 5.0, reviewCount: 88, images: [PERFUME_IMG_2], luxuryCollection: true, stock: 6 },
  { _id: '65c000000000000000000014', title: 'Golden Threads King', category: { name: 'Bedsheet' }, price: 32000, oldPrice: 38000, discount: 16, rating: 4.9, reviewCount: 34, images: [BED_IMG_3], luxuryCollection: true, stock: 4 },
  { _id: '65c000000000000000000015', title: 'Frankincense Gold', category: { name: 'Perfume' }, price: 18900, oldPrice: 22000, discount: 14, rating: 4.8, reviewCount: 97, images: [PERFUME_IMG_1], luxuryCollection: true, stock: 11 },
  { _id: '65c000000000000000000016', title: 'Crimson Velvet Set', category: { name: 'Bedsheet' }, price: 28500, oldPrice: 33000, discount: 14, rating: 4.9, reviewCount: 41, images: [BED_IMG_4], luxuryCollection: true, stock: 7 },
];

const testimonials = [
  { id: 1, name: 'Ayesha Malik', role: 'Verified Buyer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', rating: 5, text: 'The Oud Al Qamar fragrance is absolutely divine! I receive compliments everywhere I go. Royal Zone is my go-to for luxury scents.' },
  { id: 2, name: 'Hassan Ahmed', role: 'Verified Buyer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', rating: 5, text: 'The Egyptian Cotton bedsheets are incredibly soft. Best investment I made for my bedroom. The quality is unmatched at this price point.' },
  { id: 3, name: 'Fatima Khan', role: 'Verified Buyer', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', rating: 5, text: 'Excellent service and fast delivery. The Silk Touch set exceeded my expectations. Will definitely order again!' },
];

const faqs = [
  { q: 'What is your delivery time?', a: 'We deliver within 3-5 business days across Pakistan. Express delivery available in 1-2 days for major cities.' },
  { q: 'Do you offer Cash on Delivery?', a: 'Yes! We offer Cash on Delivery (COD) across all major cities in Pakistan, with no minimum order requirement.' },
  { q: 'Are your perfumes authentic?', a: 'Absolutely. All our perfumes are 100% authentic, imported from top fragrance houses and crafted with premium ingredients.' },
  { q: 'What sizes are available for bedsheets?', a: 'We offer Single, Double, Queen, and King sizes for all our bedsheet collections. Size guides are available on each product page.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day return policy for unopened items in original packaging. Customer satisfaction is our top priority.' },
];

const RevealSection = ({ children, className = '' }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
};

const HomePage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterDone(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="overflow-x-hidden">
      <SEO
        title="Royal Zone | Luxury Oud Perfumes & 1000TC Cotton Bedsheets Pakistan"
        description="Shop Royal Zone for premium luxury Oud perfumes, French fragrances, and 1000TC Egyptian Cotton bedsheet sets across Pakistan. Express Delivery & Cash on Delivery available."
      />
      {/* HERO */}
      <HeroSection />

      {/* FEATURED PRODUCTS */}
      <section className="section-padding bg-cream-50 dark:bg-navy-900">
        <div className="container-custom">
          <RevealSection>
            <SectionTitle title="Featured Products" subtitle="Handpicked luxury pieces curated just for you" />
          </RevealSection>
          <RevealSection>
            <ProductGrid products={DUMMY_FEATURED} />
          </RevealSection>
          <div className="text-center mt-10">
            <Link to="/perfumes" className="btn-secondary inline-flex">View All Products</Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES BANNER */}
      <section className="section-padding bg-cream-100 dark:bg-navy-800">
        <div className="container-custom">
          <RevealSection>
            <SectionTitle title="Our Collections" subtitle="Two worlds of luxury under one roof" />
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Perfumes Category Card */}
            <RevealSection>
              <Link
                to="/perfumes"
                className="group relative rounded-3xl overflow-hidden block h-80 hover-lift shadow-luxury"
                style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #1A2238 50%, #0A0F1E 100%)' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80"
                  alt="Perfumes Collection"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="absolute inset-0 overlay-gradient" />
                <div className="absolute bottom-0 left-0 p-8">
                  <p className="text-gold-400 text-sm font-medium uppercase tracking-widest mb-2">Explore</p>
                  <h3 className="font-display text-4xl font-bold text-white mb-3">Perfumes</h3>
                  <span className="inline-flex items-center gap-2 text-white text-sm font-medium">
                    Shop Now <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </span>
                </div>
              </Link>
            </RevealSection>

            {/* Bedsheets Category Card */}
            <RevealSection>
              <Link
                to="/bedsheets"
                className="group relative rounded-3xl overflow-hidden block h-80 hover-lift shadow-luxury"
                style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #1A2238 50%, #0A0F1E 100%)' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80"
                  alt="Bedsheets Collection"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="absolute inset-0 overlay-gradient" />
                <div className="absolute bottom-0 left-0 p-8">
                  <p className="text-gold-400 text-sm font-medium uppercase tracking-widest mb-2">Explore</p>
                  <h3 className="font-display text-4xl font-bold text-white mb-3">Bedsheet Designs</h3>
                  <span className="inline-flex items-center gap-2 text-white text-sm font-medium">
                    Shop Now <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </span>
                </div>
              </Link>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="section-padding bg-cream-50 dark:bg-navy-900">
        <div className="container-custom">
          <RevealSection>
            <SectionTitle title="Best Sellers" subtitle="Our most loved products — trusted by thousands" />
          </RevealSection>
          <RevealSection>
            <ProductGrid products={DUMMY_BESTSELLERS} />
          </RevealSection>
        </div>
      </section>

      {/* LUXURY COLLECTION */}
      <section className="section-padding bg-navy-900 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <RevealSection>
            <SectionTitle title="Luxury Collection" subtitle="Reserved for those who appreciate the finest things in life" light />
          </RevealSection>
          <RevealSection>
            <ProductGrid products={DUMMY_LUXURY} />
          </RevealSection>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section-padding bg-cream-100 dark:bg-navy-800">
        <div className="container-custom">
          <RevealSection>
            <SectionTitle title="Why Royal Zone?" subtitle="We don't just sell products — we deliver experiences" />
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
            {[
              { icon: '💎', title: 'Premium Quality', desc: 'Every product is sourced from world-class suppliers and passes strict quality checks.' },
              { icon: '🚚', title: 'Free Shipping', desc: 'Enjoy free delivery on all orders above PKR 5,000. Express options available.' },
              { icon: '↩️', title: '30-Day Returns', desc: 'Not satisfied? Return any unopened item within 30 days for a full refund.' },
              { icon: '✅', title: 'Authenticity Guaranteed', desc: 'Every product comes with a certificate of authenticity. 100% genuine.' },
            ].map((f) => (
              <RevealSection key={f.title}>
                <div className="glass-card p-8 text-center hover-lift h-full">
                  <div className="text-5xl mb-5">{f.icon}</div>
                  <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-3">{f.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-padding bg-cream-50 dark:bg-navy-900">
        <div className="container-custom">
          <RevealSection>
            <SectionTitle title="What Our Customers Say" subtitle="Real reviews from real luxury lovers" />
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {testimonials.map((t) => (
              <RevealSection key={t.id}>
                <div className="glass-card p-8 hover-lift h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed italic flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                      <p className="text-xs text-gold-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #1A1F35 50%, #0A0F1E 100%)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(201,169,110,0.12) 0%, transparent 70%)' }} />
        <div className="container-custom relative z-10 text-center">
          <RevealSection>
            <div className="max-w-xl mx-auto">
              <p className="text-gold-500 text-sm font-medium uppercase tracking-widest mb-3">Stay Updated</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">Join Our Royal Circle</h2>
              <p className="text-gray-400 mb-10">Subscribe for exclusive offers, new arrivals, and luxury living tips delivered to your inbox.</p>
              {newsletterDone ? (
                <div className="py-4 px-6 bg-green-500/20 border border-green-500/40 rounded-2xl">
                  <p className="text-green-400 font-semibold">✓ You're in! Welcome to the Royal Circle.</p>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 backdrop-blur-sm transition-colors"
                  />
                  <button type="submit" className="btn-primary px-8 py-4 whitespace-nowrap">Subscribe</button>
                </form>
              )}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* LUXURY JOURNAL / BLOG SECTION */}
      <section className="section-padding bg-white dark:bg-navy-800">
        <div className="container-custom">
          <RevealSection>
            <SectionTitle
              title="The Royal Journal"
              subtitle="Expert guides on luxury Oud perfumes, fragrance layering, and 1000TC bedding care"
            />
          </RevealSection>
          <RevealSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              {BLOG_POSTS.slice(0, 3).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/blog" className="btn-secondary inline-flex items-center gap-2">
                Explore All Journal Articles →
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-cream-50 dark:bg-navy-900">
        <div className="container-custom max-w-3xl">
          <RevealSection>
            <SectionTitle title="Frequently Asked Questions" subtitle="Everything you need to know about Royal Zone" />
          </RevealSection>
          <div className="space-y-4 mt-10">
            {faqs.map((faq, idx) => (
              <RevealSection key={idx}>
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover-lift">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left bg-white dark:bg-navy-800 hover:bg-cream-100 dark:hover:bg-navy-700 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.q}</span>
                    <svg
                      className={`w-5 h-5 text-gold-500 shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-6 pt-3 bg-white dark:bg-navy-800 border-t border-gray-100 dark:border-gray-700 animate-slide-down">
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
