/**
 * NewsArticle Component - Blog post component with rich content
 * Displays news articles with boxing-themed styling and accessibility features
 */

import React, { useState } from 'react';
import { NewsArticle as NewsArticleType } from '../../data/news-articles';
import { OptimizedImage } from '../common/OptimizedImage';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface NewsArticleProps {
  article: NewsArticleType;
  variant?: 'full' | 'preview' | 'card';
  showAuthor?: boolean;
  showTags?: boolean;
  showReadTime?: boolean;
  onTagClick?: (tag: string) => void;
  onArticleClick?: (article: NewsArticleType) => void;
  className?: string;
}

const NewsArticle: React.FC<NewsArticleProps> = ({
  article,
  variant = 'preview',
  showAuthor = true,
  showTags = true,
  showReadTime = true,
  onTagClick,
  onArticleClick,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(variant === 'full');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fight-recap':
        return 'bg-red-600 text-red-100';
      case 'training-update':
        return 'bg-blue-600 text-blue-100';
      case 'community':
        return 'bg-green-600 text-green-100';
      case 'announcement':
        return 'bg-purple-600 text-purple-100';
      case 'interview':
        return 'bg-yellow-600 text-yellow-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fight-recap':
        return '🥊';
      case 'training-update':
        return '💪';
      case 'community':
        return '🤝';
      case 'announcement':
        return '📢';
      case 'interview':
        return '🎤';
      default:
        return '📰';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatReadTime = (minutes: number) => {
    return `${minutes} min read`;
  };

  const handleArticleClick = () => {
    if (onArticleClick) {
      setIsLoading(true);
      onArticleClick(article);
      // Reset loading state after a delay
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleTagClick = (tag: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  const renderContent = () => {
    if (variant === 'full' || isExpanded) {
      // Parse markdown-like content for basic formatting
      const formatContent = (content: string) => {
        return content
          .split('\n')
          .map((line, index) => {
            if (line.startsWith('# ')) {
              return <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3">{line.slice(3)}</h2>;
            }
            if (line.startsWith('### ')) {
              return <h3 key={index} className="text-xl font-bold text-white mt-4 mb-2">{line.slice(4)}</h3>;
            }
            if (line.startsWith('**') && line.endsWith('**')) {
              return <p key={index} className="font-bold text-white mt-2">{line.slice(2, -2)}</p>;
            }
            if (line.trim() === '') {
              return <br key={index} />;
            }
            return <p key={index} className="text-gray-300 leading-relaxed mt-2">{line}</p>;
          });
      };

      return (
        <div className="prose prose-invert max-w-none">
          {formatContent(article.content)}
        </div>
      );
    }

    return (
      <p className="text-gray-300 leading-relaxed line-clamp-3">
        {article.excerpt}
      </p>
    );
  };

  if (variant === 'card') {
    return (
      <article
        className={`
          bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-lg
          hover:border-red-600 transition-all duration-300 transform hover:scale-[1.02]
          ${onArticleClick ? 'cursor-pointer' : ''}
          relative overflow-hidden group
          ${className}
        `}
        onClick={handleArticleClick}
        role={onArticleClick ? 'button' : undefined}
        tabIndex={onArticleClick ? 0 : undefined}
        aria-label={onArticleClick ? `Read article: ${article.title}` : undefined}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <LoadingSpinner size="sm" />
          </div>
        )}

        {/* Featured Badge */}
        {article.featured && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
            Featured
          </div>
        )}

        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {!imageError ? (
            <OptimizedImage
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-900 to-black flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">{getCategoryIcon(article.category)}</div>
                <p className="text-white text-sm">{article.category.replace('-', ' ').toUpperCase()}</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category */}
          <div className="flex items-center justify-between mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getCategoryColor(article.category)}`}>
              {getCategoryIcon(article.category)} {article.category.replace('-', ' ').toUpperCase()}
            </span>
            {showReadTime && (
              <span className="text-xs text-gray-400">{formatReadTime(article.readTime)}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-red-400 transition-colors">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
            {article.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              {showAuthor && <span>By {article.author}</span>}
              <span>{formatDate(article.publishDate)}</span>
            </div>
            {onArticleClick && (
              <span className="text-red-400 group-hover:text-red-300">Read More →</span>
            )}
          </div>

          {/* Tags */}
          {showTags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {article.tags.slice(0, 3).map(tag => (
                <button
                  key={tag}
                  onClick={(e) => handleTagClick(tag, e)}
                  className="text-xs bg-gray-800 hover:bg-red-800 text-gray-300 hover:text-white px-2 py-1 rounded transition-colors"
                >
                  #{tag}
                </button>
              ))}
              {article.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{article.tags.length - 3} more</span>
              )}
            </div>
          )}
        </div>

        {/* Corner Accent */}
        <div className="absolute top-0 right-0 w-12 h-12">
          <div className="absolute top-0 right-0 w-0 h-0 border-l-12 border-b-12 border-l-transparent border-b-red-600/20" />
        </div>
      </article>
    );
  }

  // Full article or preview variant
  return (
    <article className={`max-w-4xl mx-auto ${className}`}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Header Image */}
      <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
        {!imageError ? (
          <OptimizedImage
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            priority={variant === 'full'}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-900 to-black flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">{getCategoryIcon(article.category)}</div>
              <p className="text-white text-xl">{article.category.replace('-', ' ').toUpperCase()}</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Featured Badge */}
        {article.featured && (
          <div className="absolute top-6 left-6 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            Featured Article
          </div>
        )}
      </div>

      {/* Article Header */}
      <header className="mb-8">
        {/* Category */}
        <div className="flex items-center space-x-4 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getCategoryColor(article.category)}`}>
            {getCategoryIcon(article.category)} {article.category.replace('-', ' ').toUpperCase()}
          </span>
          {showReadTime && (
            <span className="text-sm text-gray-400">{formatReadTime(article.readTime)}</span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          {article.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center space-x-6 text-gray-400 mb-6">
          {showAuthor && (
            <div className="flex items-center space-x-2">
              <span>By</span>
              <span className="font-medium text-white">{article.author}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <span>Published</span>
            <time className="font-medium text-white">{formatDate(article.publishDate)}</time>
          </div>
        </div>

        {/* Tags */}
        {showTags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <button
                key={tag}
                onClick={(e) => handleTagClick(tag, e)}
                className="text-sm bg-gray-800 hover:bg-red-800 text-gray-300 hover:text-white px-3 py-1 rounded-full transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Article Content */}
      <div className="text-lg leading-relaxed">
        {renderContent()}
        
        {/* Read More Toggle for Preview */}
        {variant === 'preview' && !isExpanded && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsExpanded(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              Read Full Article
            </button>
          </div>
        )}
      </div>

      {/* Article Footer */}
      {(variant === 'full' || isExpanded) && (
        <footer className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Article ID: {article.id}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Share:</span>
              <button className="hover:text-white transition-colors">Twitter</button>
              <button className="hover:text-white transition-colors">Facebook</button>
              <button className="hover:text-white transition-colors">LinkedIn</button>
            </div>
          </div>
        </footer>
      )}
    </article>
  );
};

export default NewsArticle;