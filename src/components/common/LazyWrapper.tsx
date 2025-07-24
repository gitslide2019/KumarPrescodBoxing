import React, { Suspense } from 'react';
import { motion } from 'framer-motion';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  showSpinner?: boolean;
  minLoadTime?: number;
}

// Boxing-themed loading spinner
const BoxingLoadingSpinner: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Boxing glove animation */}
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ 
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.1, 1, 1.1, 1]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 rounded-full shadow-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">🥊</span>
        </div>
      </motion.div>
      
      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <div className="text-white/90 text-sm font-semibold mb-1">Loading...</div>
        <div className="text-white/60 text-xs">The Raw One's content</div>
      </motion.div>
      
      {/* Progress bar */}
      <motion.div 
        className="w-32 h-1 bg-slate-700 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-primary-600 to-gold-500 rounded-full"
          animate={{ 
            x: [-128, 128],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ width: '50%' }}
        />
      </motion.div>
    </div>
  );
};

// Skeleton loader for different content types
const SkeletonLoader: React.FC<{ type: 'page' | 'card' | 'list' | 'image' }> = ({ type }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'page':
        return (
          <div className="animate-pulse space-y-6 p-6">
            {/* Header skeleton */}
            <div className="space-y-3">
              <div className="h-8 bg-slate-700 rounded-lg w-3/4"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            </div>
            
            {/* Content skeleton */}
            <div className="space-y-4">
              <div className="h-4 bg-slate-700 rounded w-full"></div>
              <div className="h-4 bg-slate-700 rounded w-5/6"></div>
              <div className="h-4 bg-slate-700 rounded w-4/5"></div>
            </div>
            
            {/* Image placeholder */}
            <div className="h-48 bg-slate-700 rounded-lg"></div>
            
            {/* More content */}
            <div className="space-y-4">
              <div className="h-4 bg-slate-700 rounded w-full"></div>
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            </div>
          </div>
        );
        
      case 'card':
        return (
          <div className="animate-pulse p-4 border border-slate-700 rounded-lg space-y-4">
            <div className="h-32 bg-slate-700 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        );
        
      case 'list':
        return (
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 border border-slate-700 rounded">
                <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'image':
        return (
          <div className="animate-pulse">
            <div className="h-64 bg-slate-700 rounded-lg"></div>
          </div>
        );
        
      default:
        return (
          <div className="animate-pulse">
            <div className="h-32 bg-slate-700 rounded"></div>
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg">
      {renderSkeleton()}
    </div>
  );
};

// Main lazy wrapper component
const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback,
  className = '',
  showSpinner = true,
  minLoadTime = 300
}) => {
  const [isMinTimeElapsed, setIsMinTimeElapsed] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinTimeElapsed(true);
    }, minLoadTime);

    return () => clearTimeout(timer);
  }, [minLoadTime]);

  const defaultFallback = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`min-h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${className}`}
    >
      {showSpinner ? <BoxingLoadingSpinner /> : <div>Loading...</div>}
    </motion.div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isMinTimeElapsed ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {children}
      </motion.div>
    </Suspense>
  );
};

export default LazyWrapper;

// Pre-configured lazy wrappers for different boxing content types
export const BoxingLazy = {
  Page: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <LazyWrapper
      className={className}
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-red-900 flex items-center justify-center">
          <BoxingLoadingSpinner size="large" />
        </div>
      }
      minLoadTime={500}
    >
      {children}
    </LazyWrapper>
  ),

  Section: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <LazyWrapper
      className={className}
      fallback={<SkeletonLoader type="page" />}
      minLoadTime={200}
    >
      {children}
    </LazyWrapper>
  ),

  Gallery: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <LazyWrapper
      className={className}
      fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonLoader key={i} type="image" />
          ))}
        </div>
      }
      minLoadTime={100}
    >
      {children}
    </LazyWrapper>
  ),

  CardList: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <LazyWrapper
      className={className}
      fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonLoader key={i} type="card" />
          ))}
        </div>
      }
      minLoadTime={150}
    >
      {children}
    </LazyWrapper>
  )
};

// Error boundary for lazy-loaded components
export class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[400px] flex items-center justify-center bg-slate-800/50 rounded-lg">
          <div className="text-center text-white/60">
            <div className="text-4xl mb-4">🥊</div>
            <div className="text-lg font-semibold mb-2">Component failed to load</div>
            <div className="text-sm">Please refresh the page or try again later</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}