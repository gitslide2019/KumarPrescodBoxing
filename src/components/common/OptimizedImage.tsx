import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLazyLoad, useOptimizedImage } from '../../hooks/usePerformance';

interface OptimizedImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: string;
  fallback?: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  enableBlur?: boolean;
  onClick?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  title,
  className = '',
  width,
  height,
  priority = false,
  sizes,
  objectFit = 'cover',
  loading = 'lazy',
  onLoad,
  onError,
  placeholder,
  fallback = '/images/placeholder-training.jpg',
  quality = 85,
  format = 'webp',
  enableBlur = true,
  onClick
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Use lazy loading hook for non-priority images
  const { ref: lazyRef, isLoaded: shouldLoad } = useLazyLoad({
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Use optimized image hook
  const { currentSrc, isLoading, hasError } = useOptimizedImage(src, {
    placeholder,
    quality,
    format
  });

  const [imageSrc, setImageSrc] = useState(priority ? src : placeholder || '');

  useEffect(() => {
    if (priority || shouldLoad) {
      setImageSrc(currentSrc || src);
    }
  }, [priority, shouldLoad, currentSrc, src]);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    setImageSrc(fallback);
    onError?.();
  };

  const imageId = `img-${src.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div 
      ref={!priority ? lazyRef : undefined}
      className={`relative overflow-hidden ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Loading placeholder with blur effect */}
      {(!imageLoaded && !imageError) && (
        <div className="absolute inset-0 flex items-center justify-center">
          {placeholder ? (
            <motion.img
              src={placeholder}
              alt=""
              className={`w-full h-full object-cover ${enableBlur ? 'blur-sm' : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
          )}
          
          {/* Loading spinner overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <motion.div
              className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>
      )}

      {/* Main image with enhanced animations */}
      <motion.img
        id={imageId}
        src={imageSrc || src}
        alt={alt}
        title={title}
        width={width}
        height={height}
        sizes={sizes}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        initial={{ opacity: 0, scale: enableBlur ? 1.05 : 1 }}
        animate={{ 
          opacity: imageLoaded ? 1 : 0,
          scale: imageLoaded ? 1 : (enableBlur ? 1.05 : 1)
        }}
        transition={{ 
          duration: 0.5,
          ease: 'easeOut'
        }}
        className={`w-full h-full transition-transform duration-300 ${
          objectFit === 'cover' ? 'object-cover' :
          objectFit === 'contain' ? 'object-contain' :
          objectFit === 'fill' ? 'object-fill' :
          objectFit === 'none' ? 'object-none' :
          'object-scale-down'
        }`}
        style={{
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : '100%'
        }}
      />

      {/* Enhanced error state */}
      {(imageError || hasError) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
        >
          <div className="text-center text-gray-500">
            <motion.div
              className="text-4xl mb-2"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📷
            </motion.div>
            <div className="text-sm font-medium">Image unavailable</div>
            <div className="text-xs text-gray-400 mt-1">Tap to retry</div>
          </div>
        </motion.div>
      )}

      {/* Progressive blur reveal */}
      {enableBlur && placeholder && imageLoaded && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <img
            src={placeholder}
            alt=""
            className="w-full h-full object-cover blur-sm"
          />
        </motion.div>
      )}
    </div>
  );
};

export default OptimizedImage;