import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import BlogCard from '../components/blog/BlogCard';
import { BLOG_POSTS } from '../data/blogData';
import { useToast } from '../components/common/Toast';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];
  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 2);

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`);
    else if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
    else if (platform === 'whatsapp') window.open(`https://api.whatsapp.com/send?text=${title}%20${url}`);
    else {
      navigator.clipboard.writeText(window.location.href);
      toast('Link copied to clipboard! 📋', 'success');
    }
  };

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.excerpt,
    'image': post.image,
    'author': {
      '@type': 'Person',
      'name': post.author,
      'jobTitle': post.authorRole,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Royal Zone',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://royalzone.pk/logo.png',
      },
    },
    'datePublished': post.date,
  };

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={post.tags?.join(', ')}
        ogImage={post.image}
        schemaData={blogSchema}
      />

      <div className="pt-28 min-h-screen bg-cream-50 dark:bg-navy-900">
        <article className="container-custom max-w-4xl py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <Link to="/" className="hover:text-gold-500">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-gold-500">Journal</Link>
            <span>/</span>
            <span className="text-gold-500 font-medium truncate">{post.title}</span>
          </nav>

          {/* Article Header */}
          <div className="mb-8">
            <span className="px-3.5 py-1.5 bg-gold-500 text-white text-xs font-bold rounded-full inline-block mb-4 shadow-md">
              {post.category}
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              {post.title}
            </h1>

            {/* Author info & Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <img src={post.authorAvatar} alt={post.author} className="w-11 h-11 rounded-full object-cover border-2 border-gold-500/30" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{post.author}</p>
                  <p className="text-xs text-gray-400">{post.authorRole} • {post.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 mr-2">{post.readTime}</span>
                <button onClick={() => handleShare('whatsapp')} className="p-2 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-colors" title="Share on WhatsApp">
                  💬
                </button>
                <button onClick={() => handleShare('twitter')} className="p-2 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors" title="Share on X/Twitter">
                  🐦
                </button>
                <button onClick={() => handleShare('copy')} className="p-2 rounded-full bg-gold-500/10 text-gold-500 hover:bg-gold-500 hover:text-white transition-colors" title="Copy Link">
                  🔗
                </button>
              </div>
            </div>
          </div>

          {/* Featured Banner Image */}
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-luxury mb-10 bg-navy-800">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Article Body */}
          <div className="bg-white dark:bg-navy-800 rounded-3xl p-6 sm:p-10 shadow-card border border-gray-100 dark:border-gray-700 prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 leading-relaxed space-y-6">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Tags */}
            {post.tags && (
              <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tags:</span>
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((p) => (
                  <BlogCard key={p.id} post={p} />
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </>
  );
};

export default BlogDetailPage;
