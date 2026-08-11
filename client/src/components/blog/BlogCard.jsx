import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ post }) => {
  if (!post) return null;

  return (
    <article className="group bg-white dark:bg-navy-800 rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-all duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700">
      {/* Cover Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-navy-700">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-gold-500 text-white text-xs font-bold rounded-full shadow-md">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>

        <Link to={`/blog/${post.slug}`}>
          <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-3 hover:text-gold-500 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 flex-1">
          {post.excerpt}
        </p>

        {/* Footer author */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
          <div className="flex items-center gap-2.5">
            <img src={post.authorAvatar} alt={post.author} className="w-8 h-8 rounded-full object-cover border border-gold-500/30" />
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">{post.author}</p>
              <p className="text-[10px] text-gray-400">{post.authorRole}</p>
            </div>
          </div>
          <Link
            to={`/blog/${post.slug}`}
            className="text-xs font-bold text-gold-500 hover:text-gold-400 flex items-center gap-1 transition-colors"
          >
            Read Article →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
