import React, { useEffect } from 'react';

const DEFAULT_TITLE = 'Royal Zone | Premium Luxury Oud & French Perfumes Pakistan';
const DEFAULT_DESCRIPTION = 'Shop Royal Zone for premium luxury Oud perfumes, French fragrances, and signature scents across Pakistan. Express Delivery & Cash on Delivery available.';
const DEFAULT_KEYWORDS = 'luxury perfumes pakistan, oud al qamar, french fragrances, royal zone online store, luxury scents, cash on delivery perfumes, mens perfumes, womens perfumes';
const SITE_URL = 'https://royalzone.pk';

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogImage = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80',
  schemaData = null,
}) => {
  const pageTitle = title ? `${title} | Royal Zone Luxury` : DEFAULT_TITLE;

  useEffect(() => {
    // 1. Update Title
    document.title = pageTitle;

    // 2. Helper to set/update meta tag
    const setMetaTag = (nameAttr, nameVal, contentVal) => {
      let element = document.querySelector(`meta[${nameAttr}="${nameVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, nameVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'author', 'Royal Zone Luxury Store');
    setMetaTag('name', 'robots', 'index, follow');

    // OpenGraph Tags
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', 'Royal Zone');

    // Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl || window.location.href);

    // 3. Schema.org JSON-LD Script
    let schemaScript = document.getElementById('json-ld-schema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'json-ld-schema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const defaultSchema = {
      '@context': 'https://schema.org',
      '@type': 'Store',
      'name': 'Royal Zone',
      'url': SITE_URL,
      'logo': `${SITE_URL}/logo.png`,
      'description': DEFAULT_DESCRIPTION,
      'telephone': '+923001234567',
      'priceRange': 'PKR 3500 - PKR 38000',
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': 'PK',
        'addressLocality': 'Lahore'
      }
    };

    schemaScript.text = JSON.stringify(schemaData || defaultSchema);

    // Scroll to top on page navigation for clean SEO experience
    window.scrollTo({ top: 0, behavior: 'instant' });

  }, [pageTitle, description, keywords, canonicalUrl, ogImage, schemaData]);

  return null;
};

export default SEO;
