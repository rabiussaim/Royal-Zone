import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/ui/HeroSection';
import GenderCollectionSection from '../components/ui/GenderCollectionSection';
import FragranceStorySection from '../components/ui/FragranceStorySection';
import SectionTitle from '../components/ui/SectionTitle';
import ProductGrid from '../components/product/ProductGrid';
import BlogCard from '../components/blog/BlogCard';
import SEO from '../components/common/SEO';
import DemoSectionNotice from '../components/common/DemoSectionNotice';
import { BLOG_POSTS } from '../data/blogData';
import useScrollReveal from '../hooks/useScrollReveal';

// ── Perfume-only image URLs ──────────────────────────────────────────────────
const P1 = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80';
const P2 = 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80';
const P3 = 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80';
const P4 = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80';
const P5 = 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80';
const P6 = 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80';

// ── Women's perfumes ─────────────────────────────────────────────────────────
const WOMENS_PERFUMES = [
  { _id: 'h-w-001', title: 'Rose Noire', category: { name: 'Perfume' }, price: 6800, oldPrice: 8500, discount: 20, rating: 4.7, reviewCount: 203, images: [P2], newArrival: true, stock: 22 },
  { _id: 'h-w-002', title: 'Persian Jasmine', category: { name: 'Perfume' }, price: 7500, oldPrice: 9000, discount: 17, rating: 4.5, reviewCount: 178, images: [P4], newArrival: true, stock: 18 },
  { _id: 'h-w-003', title: 'Golden Iris', category: { name: 'Perfume' }, price: 13500, oldPrice: 16000, discount: 16, rating: 4.7, reviewCount: 74, images: [P1], stock: 14 },
  { _id: 'h-w-004', title: 'Velvet Rose', category: { name: 'Perfume' }, price: 9800, rating: 4.8, reviewCount: 221, images: [P3], bestSeller: true, stock: 28 },
];

// ── Men's perfumes ───────────────────────────────────────────────────────────
const MENS_PERFUMES = [
  { _id: 'h-m-001', title: 'Oud Al Qamar', category: { name: 'Perfume' }, price: 8500, oldPrice: 10000, discount: 15, rating: 4.8, reviewCount: 124, images: [P1], featured: true, stock: 15 },
  { _id: 'h-m-002', title: 'Midnight Oud', category: { name: 'Perfume' }, price: 14500, rating: 4.9, reviewCount: 312, images: [P5], bestSeller: true, stock: 20 },
  { _id: 'h-m-003', title: 'Sandalwood Dreams', category: { name: 'Perfume' }, price: 9200, rating: 4.7, reviewCount: 189, images: [P6], bestSeller: true, stock: 17 },
  { _id: 'h-m-004', title: 'Cedar Royale', category: { name: 'Perfume' }, price: 6500, rating: 4.3, reviewCount: 98, images: [P3], stock: 33 },
];

// ── Featured fragrances (perfume-only) ──────────────────────────────────────
const FEATURED_PERFUMES = [
  { _id: 'h-f-001', title: 'Oud Al Qamar', category: { name: 'Perfume' }, price: 8500, oldPrice: 10000, discount: 15, rating: 4.8, reviewCount: 124, images: [P1], featured: true, stock: 15 },
  { _id: 'h-f-002', title: 'Rose Noire', category: { name: 'Perfume' }, price: 6800, oldPrice: 8500, discount: 20, rating: 4.7, reviewCount: 203, images: [P2], featured: true, newArrival: true, stock: 22 },
  { _id: 'h-f-003', title: 'Amber Mystique', category: { name: 'Perfume' }, price: 11200, oldPrice: 13500, discount: 17, rating: 4.6, reviewCount: 156, images: [P3], featured: true, stock: 30 },
  { _id: 'h-f-004', title: 'Persian Jasmine', category: { name: 'Perfume' }, price: 7500, oldPrice: 9000, discount: 17, rating: 4.5, reviewCount: 178, images: [P4], newArrival: true, stock: 18 },
];

// ── Bestsellers / Signature (perfume-only) ───────────────────────────────────
const BESTSELLERS = [
  { _id: 'h-b-001', title: 'Midnight Oud', category: { name: 'Perfume' }, price: 14500, rating: 4.9, reviewCount: 312, images: [P5], bestSeller: true, stock: 20 },
  { _id: 'h-b-002', title: 'Sandalwood Dreams', category: { name: 'Perfume' }, price: 9200, rating: 4.7, reviewCount: 189, images: [P6], bestSeller: true, stock: 17 },
  { _id: 'h-b-003', title: 'Black Orchid Parfum', category: { name: 'Perfume' }, price: 24500, oldPrice: 28000, discount: 12, rating: 5.0, reviewCount: 88, images: [P2], luxuryCollection: true, stock: 6 },
  { _id: 'h-b-004', title: 'Frankincense Gold', category: { name: 'Perfume' }, price: 18900, oldPrice: 22000, discount: 14, rating: 4.8, reviewCount: 97, images: [P1], luxuryCollection: true, stock: 11 },
];

// ── Testimonials ──────────────────────────────────────────────────────────────
const testimonials = [
  {
    id: 1,
    name: 'Ayesha Malik',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    text: 'The Oud Al Qamar fragrance is absolutely divine. I receive compliments everywhere I go. Royal Zone is my go-to for luxury scents.',
  },
  {
    id: 2,
    name: 'Hassan Ahmed',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    text: 'Midnight Oud is everything I wanted — deep, lasting, and absolutely masculine. The quality rivals brands three times the price.',
  },
  {
    id: 3,
    name: 'Fatima Khan',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    text: 'Rose Noire is simply unforgettable. It lasts the entire day and every time I wear it, someone asks what perfume I have on.',
  },
];

// ── FAQ ──────────────────────────────────────────────────────────────────────
const faqs = [
  { q: 'What is your delivery time?', a: 'We deliver within 3–5 business days across Pakistan. Express delivery available in 1–2 days for major cities.' },
  { q: 'Do you offer Cash on Delivery?', a: 'Yes! We offer Cash on Delivery (COD) across all major cities in Pakistan, with no minimum order requirement.' },
  { q: 'Are your perfumes authentic?', a: 'Absolutely. All our perfumes are 100% authentic, imported from top fragrance houses and crafted with premium ingredients.' },
  { q: 'How long do the fragrances last?', a: 'Our Eau de Parfum concentrations last 8–14 hours on skin. Oud-based fragrances often project for 12+ hours with excellent sillage.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day return policy for unopened, sealed items in original packaging. Customer satisfaction is our priority.' },
];

// ── Scroll reveal wrapper ─────────────────────────────────────────────────────
const Reveal = ({ children, className = '', delay = 0 }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
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
        title="Royal Zone | Premium Luxury Perfumes for Him & Her — Pakistan"
        description="Shop Royal Zone for premium luxury Oud perfumes and French fragrances for men and women across Pakistan. Express Delivery & Cash on Delivery available."
      />

      {/* 1. SPLIT-SCREEN HERO */}
      <HeroSection />

      {/* 2. FOR HER */}
      <GenderCollectionSection gender="women" products={WOMENS_PERFUMES} />

      {/* 3. FOR HIM */}
      <GenderCollectionSection gender="men" products={MENS_PERFUMES} />

      {/* 4. FEATURED FRAGRANCES */}
      <section className="section-padding bg-cream-50 dark:bg-navy-900">
        <div className="container-custom">
          <Reveal>
            <SectionTitle title="Featured Fragrances" subtitle="Handpicked by our master perfumers — curated just for you" />
          </Reveal>
          <Reveal>
            <DemoSectionNotice />
            <ProductGrid products={FEATURED_PERFUMES} />
          </Reveal>
          <div className="text-center mt-10">
            <Link to="/perfumes" className="btn-secondary inline-flex">View All Fragrances</Link>
          </div>
        </div>
      </section>

      {/* 5. SIGNATURE / BESTSELLING */}
      <section className="section-padding bg-navy-900 relative overflow-hidden">
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 65%)' }}
        />
        <div className="container-custom relative z-10">
          <Reveal>
            <SectionTitle title="Signature Fragrances" subtitle="Our most beloved scents — trusted by connoisseurs" light />
          </Reveal>
          <Reveal>
            <DemoSectionNotice />
            <ProductGrid products={BESTSELLERS} />
          </Reveal>
        </div>
      </section>

      {/* 6. FRAGRANCE STORY / EDITORIAL */}
      <FragranceStorySection />

      {/* 7. TESTIMONIALS */}
      <section className="section-padding bg-cream-50 dark:bg-navy-900">
        <div className="container-custom">
          <Reveal>
            <SectionTitle title="What Our Customers Say" subtitle="Real reviews from real fragrance lovers" />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 100}>
                <div className="glass-card p-8 hover-lift h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9. ROYAL JOURNAL / BLOG */}
      <section className="section-padding bg-white dark:bg-navy-800">
        <div className="container-custom">
          <Reveal>
            <SectionTitle
              title="The Royal Journal"
              subtitle="Expert guides on luxury Oud perfumes, fragrance layering, and scent mastery"
            />
          </Reveal>
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              {BLOG_POSTS.filter(p => p.category !== 'Bedding & Home').slice(0, 3).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/blog" className="btn-secondary inline-flex items-center gap-2">
                Explore All Journal Articles →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 10. NEWSLETTER */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #1A1F35 50%, #0A0F1E 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(201,169,110,0.10) 0%, transparent 70%)' }} />
        <div className="container-custom relative z-10 text-center">
          <Reveal>
            <div className="max-w-xl mx-auto">
              <p className="text-gold-500 text-xs font-bold uppercase tracking-[0.3em] mb-4">Royal Circle</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">Join Our Royal Circle</h2>
              <div className="h-[1px] w-12 mx-auto mb-6" style={{ background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }} />
              <p className="text-gray-400 mb-10 font-light">Subscribe for exclusive fragrance launches, early access, and curated scent guides delivered to your inbox.</p>
              {newsletterDone ? (
                <div className="py-4 px-6 border" style={{ background: 'rgba(201,169,110,0.08)', borderColor: 'rgba(201,169,110,0.3)' }}>
                  <p className="text-gold-400 font-semibold text-sm tracking-wide">You're in — welcome to the Royal Circle.</p>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 px-6 py-4 bg-white/8 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 0 }}
                  />
                  <button type="submit" className="btn-primary px-8 py-4 whitespace-nowrap" style={{ borderRadius: 0 }}>
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 11. FAQ */}
      <section className="section-padding bg-cream-50 dark:bg-navy-900">
        <div className="container-custom max-w-3xl">
          <Reveal>
            <SectionTitle title="Frequently Asked Questions" subtitle="Everything you need to know about Royal Zone fragrances" />
          </Reveal>
          <div className="space-y-3 mt-10">
            {faqs.map((faq, idx) => (
              <Reveal key={idx}>
                <div className="border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left bg-white dark:bg-navy-800 hover:bg-cream-100 dark:hover:bg-navy-700 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white pr-4 text-sm">{faq.q}</span>
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
