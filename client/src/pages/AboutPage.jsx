import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/ui/SectionTitle';

const TEAM = [
  { name: 'Ahmad Raza', role: 'Founder & CEO', image: 'https://picsum.photos/seed/team1/200/200', bio: 'Passionate about bringing luxury within reach for every home.' },
  { name: 'Sara Khan', role: 'Head of Fragrance', image: 'https://picsum.photos/seed/team2/200/200', bio: 'Certified perfumer with 10+ years in the fragrance industry.' },
  { name: 'Bilal Hussain', role: 'Textile Expert', image: 'https://picsum.photos/seed/team3/200/200', bio: 'Expert in premium fabrics, sourcing from top mills worldwide.' },
];

const MILESTONES = [
  { year: '2020', event: 'Royal Zone founded in Lahore with a vision to democratize luxury.' },
  { year: '2021', event: 'Launched our first Oud collection. Sold out within 2 weeks.' },
  { year: '2022', event: 'Expanded our French & Oriental perfume lines. 500+ happy customers in Year 2.' },
  { year: '2023', event: 'Launched the Luxury Collection and expanded to 3 Pakistani cities.' },
  { year: '2024', event: 'Crossed 1000 orders. Started international shipping.' },
  { year: '2025', event: 'Launched our e-commerce platform. 5★ rated brand on Google.' },
];

const AboutPage = () => {
  return (
    <div className="pt-20 bg-cream-50 dark:bg-navy-900 min-h-screen">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #1A2238 50%, #0A0F1E 100%)' }}>
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
          alt="About Royal Zone"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-gold-400 text-sm font-medium uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4 animate-slide-up">About Royal Zone</h1>
          <p className="text-gray-200 text-lg max-w-2xl animate-fade-in">Elevating everyday living with premium luxury perfumes since 2020</p>
        </div>
      </div>

      <div className="container-custom py-16 space-y-24">
        {/* Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold-500 text-sm font-medium uppercase tracking-widest mb-3">Our Mission</p>
            <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">Luxury Should Be For Everyone</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-5">Royal Zone was born from a simple belief: that premium quality fragrances shouldn't be reserved for the elite. We source the finest perfumes from around the world and make them accessible to every fragrance lover.</p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">Every product in our collection passes through a rigorous quality check. We partner with certified manufacturers and fragrance houses to ensure every item meets our exacting standards.</p>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="font-display text-4xl font-bold text-gold-500">1000+</div>
                <div className="text-sm text-gray-500">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="font-display text-4xl font-bold text-gold-500">40+</div>
                <div className="text-sm text-gray-500">Products</div>
              </div>
              <div className="text-center">
                <div className="font-display text-4xl font-bold text-gold-500">5★</div>
                <div className="text-sm text-gray-500">Rated</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-luxury aspect-square">
              <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80" alt="Our products" className="w-full h-full object-cover" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-5 -left-5 bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-luxury">
              <p className="text-xs text-gray-500 mb-1">Authenticity</p>
              <p className="font-bold text-gray-900 dark:text-white text-sm">100% Guaranteed</p>
              <p className="text-2xl">✅</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div>
          <SectionTitle title="Our Values" subtitle="The principles that guide everything we do" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {[
              { icon: '💎', title: 'Quality First', desc: 'We never compromise. Every product is sourced, tested, and verified before reaching you.' },
              { icon: '🌿', title: 'Sustainability', desc: 'We work with eco-conscious suppliers and minimize our environmental footprint.' },
              { icon: '❤️', title: 'Customer Love', desc: 'Your satisfaction is our priority. We go above and beyond for every customer.' },
              { icon: '🌍', title: 'Global Sources', desc: 'We source from the best suppliers worldwide to bring you truly international luxury.' },
            ].map((v) => (
              <div key={v.title} className="glass-card p-8 text-center hover-lift">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-3">{v.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <SectionTitle title="Our Journey" subtitle="Five years of building something extraordinary" />
          <div className="relative mt-12">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold-500 to-transparent hidden md:block" />
            <div className="space-y-8">
              {MILESTONES.map((m, idx) => (
                <div key={m.year} className={`flex items-center gap-6 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="flex-1 md:text-right">
                    {idx % 2 === 0 && (
                      <div className="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-card hover-lift">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{m.event}</p>
                      </div>
                    )}
                    {idx % 2 !== 0 && <div />}
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center shrink-0 shadow-gold z-10">
                    <span className="font-display text-white font-bold text-xs">{m.year}</span>
                  </div>
                  <div className="flex-1">
                    {idx % 2 !== 0 && (
                      <div className="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-card hover-lift">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{m.event}</p>
                      </div>
                    )}
                    {idx % 2 === 0 && <div />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div>
          <SectionTitle title="Meet Our Team" subtitle="The people behind Royal Zone's excellence" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-10">
            {TEAM.map((member) => (
              <div key={member.name} className="glass-card p-8 text-center hover-lift">
                <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-gold-500/30" />
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-gold-500 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-16 bg-navy-900 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #C9A96E 0%, transparent 70%)' }} />
          <div className="relative z-10">
            <h2 className="font-display text-4xl font-bold text-white mb-5">Ready to Experience Luxury?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">Join over 1,000 satisfied customers who have made Royal Zone their go-to luxury brand.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/perfumes" className="btn-primary px-10 py-4 text-base">Shop Perfumes</Link>
              <Link to="/contact" className="btn-secondary px-10 py-4 text-base text-white border-white">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
