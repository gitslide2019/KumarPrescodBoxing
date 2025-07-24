import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLazyLoad } from '../../hooks/usePerformance';

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

  format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
  fallbackFormat?: 'jpeg' | 'png';
  enableBlur?: boolean;
  onClick?: () => void;
  aspectRatio?: string;

  lazyLoadOffset?: number;
  enableModernFormats?: boolean;
}

// Modern image format support detection
const detectFormatSupport = (): { webp: boolean; avif: boolean } => {
  if (typeof window === 'undefined') {
    return { webp: false, avif: false };
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  const webpSupport = canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
  
  // AVIF support detection
  const avifSupport = typeof window !== 'undefined' && 
    'createImageBitmap' in window &&
    CSS.supports('(content-visibility: auto)');

  return { webp: webpSupport, avif: avifSupport };
};

// Generate optimized image URL
const generateOptimizedUrl = (
  originalSrc: string,
  targetFormat: 'webp' | 'avif' | 'jpeg' | 'png'
): string => {
  // In production, this would integrate with image optimization service
  const extension = originalSrc.split('.').pop()?.toLowerCase();
  
  if (targetFormat === 'webp' && (extension === 'jpg' || extension === 'jpeg' || extension === 'png')) {
    return originalSrc.replace(new RegExp(`\.${extension}$`), '.webp');
  }
  
  if (targetFormat === 'avif' && (extension === 'jpg' || extension === 'jpeg' || extension === 'png')) {
    return originalSrc.replace(new RegExp(`\.${extension}$`), '.avif');
  }
  
  return originalSrc;
};

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  title,
  className = '',
  width,
  height,
  priority = false,
  sizes = '100vw',
  objectFit = 'cover',
  loading = 'lazy',
  onLoad,
  onError,
  placeholder,
  fallback = '/images/placeholder-training.jpg',

  format = 'auto',
  fallbackFormat = 'jpeg',
  enableBlur = true,
  onClick,
  aspectRatio,

  lazyLoadOffset = 50,
  enableModernFormats = true
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder || '');
  const [formatSupport] = useState(() => enableModernFormats ? detectFormatSupport() : { webp: false, avif: false });
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Use lazy loading hook for non-priority images
  const shouldLazyLoad = !priority && loading === 'lazy';
  const { ref: lazyRef, isLoaded: shouldLoad } = useLazyLoad({
    threshold: 0.1,
    rootMargin: `${lazyLoadOffset}px`
  });

  // Determine optimal format
  const getOptimalFormat = useCallback((): 'webp' | 'avif' | 'jpeg' | 'png' => {
    if (format !== 'auto') {
      return format === 'jpeg' || format === 'png' ? format : 'webp';
    }

    if (enableModernFormats) {
      if (formatSupport.avif) return 'avif';
      if (formatSupport.webp) return 'webp';
    }
    
    return fallbackFormat;
  }, [format, formatSupport, enableModernFormats, fallbackFormat]);

  // Load optimized image
  useEffect(() => {
    if (!priority && shouldLazyLoad && !shouldLoad) return;

    const img = new Image();
    const optimalFormat = getOptimalFormat();
    const optimizedSrc = generateOptimizedUrl(src, optimalFormat);
    
    img.onload = () => {
      setCurrentSrc(optimizedSrc);
      setImageLoaded(true);
    };
    
    img.onerror = () => {
      // Try fallback format
      if (optimalFormat !== fallbackFormat) {
        const fallbackSrc = generateOptimizedUrl(src, fallbackFormat);
        const fallbackImg = new Image();
        
        fallbackImg.onload = () => {
          setCurrentSrc(fallbackSrc);
          setImageLoaded(true);
        };
        
        fallbackImg.onerror = () => {
          setCurrentSrc(src);
          setImageError(true);
        };
        
        fallbackImg.src = fallbackSrc;
      } else {
        setCurrentSrc(src);
        setImageError(true);
      }
    };

    img.src = optimizedSrc;
  }, [src, priority, shouldLazyLoad, shouldLoad, getOptimalFormat, fallbackFormat]);

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setImageError(true);
    setCurrentSrc(fallback);
    onError?.();
  }, [fallback, onError]);



  const containerStyle: React.CSSProperties = {
    aspectRatio,
    width: width || '100%',
    height: height || 'auto',
  };

  const renderPicture = () => {
    const optimalFormat = getOptimalFormat();
    
    return (
      <picture>
        {enableModernFormats && formatSupport.avif && optimalFormat !== 'avif' && (
          <source
            srcSet={generateOptimizedUrl(src, 'avif')}
            type="image/avif"
            sizes={sizes}
          />
        )}
        
        {enableModernFormats && formatSupport.webp && optimalFormat !== 'webp' && (
          <source
            srcSet={generateOptimizedUrl(src, 'webp')}
            type="image/webp"
            sizes={sizes}
          />
        )}
        
        <img
          ref={imgRef}
          src={currentSrc || placeholder}
          alt={alt}
          title={title}
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full transition-all duration-300 ${
            objectFit === 'cover' ? 'object-cover' :
            objectFit === 'contain' ? 'object-contain' :
            objectFit === 'fill' ? 'object-fill' :
            objectFit === 'none' ? 'object-none' :
            'object-scale-down'
          }`}
          style={{
            opacity: imageLoaded ? 1 : 0.8,
            filter: imageLoaded ? 'none' : 'blur(1px)',
            transition: 'opacity 0.3s ease-in-out, filter 0.3s ease-in-out'
          }}
        />
      </picture>
    );
  };

  return (
    <div 
      ref={shouldLazyLoad ? lazyRef : undefined}
      className={`relative overflow-hidden bg-slate-800 ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      style={containerStyle}
    >
      {/* Simplified loading - no full page spinner */}

      {/* Blur placeholder background */}
      {enableBlur && placeholder && !imageLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
          style={{ backgroundImage: `url(${placeholder})` }}
        />
      )}

      {/* Main optimized image */}
      {(!shouldLazyLoad || shouldLoad || priority) && (
        <motion.div
          initial={{ opacity: 0, scale: enableBlur ? 1.02 : 1 }}
          animate={{ 
            opacity: imageLoaded ? 1 : 0,
            scale: imageLoaded ? 1 : (enableBlur ? 1.02 : 1)
          }}
          transition={{ 
            duration: 0.4,
            ease: 'easeOut'
          }}
          className="absolute inset-0"
        >
          {renderPicture()}
        </motion.div>
      )}

      {/* Error state */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white/60">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 opacity-50">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
            <p className="text-sm">Image failed to load</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default OptimizedImage;

// Pre-configured boxing-themed variants
export const BoxingImage = {
  Hero: (props: Omit<OptimizedImageProps, 'priority' | 'format'>) => (
    <OptimizedImage
      {...props}
      priority={true}
      format="avif"
      aspectRatio="16/9"
      enableBlur={true}
      enableModernFormats={true}
    />
  ),
  
  FightPromo: (props: Omit<OptimizedImageProps, 'format' | 'aspectRatio'>) => (
    <OptimizedImage
      {...props}
      format="webp"
      aspectRatio="4/5"
      objectFit="cover"
      enableBlur={true}
      enableModernFormats={true}
    />
  ),
  
  Training: (props: Omit<OptimizedImageProps, 'format' | 'loading'>) => (
    <OptimizedImage
      {...props}
      format="webp"
      loading="lazy"
      lazyLoadOffset={100}
      enableModernFormats={true}
    />
  ),
  
  Gallery: (props: Omit<OptimizedImageProps, 'format' | 'sizes' | 'loading'>) => (
    <OptimizedImage
      {...props}
      format="webp"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      loading="lazy"
      aspectRatio="1/1"
      objectFit="cover"
      enableModernFormats={true}
    />
  )
};