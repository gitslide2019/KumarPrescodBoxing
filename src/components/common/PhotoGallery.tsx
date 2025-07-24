import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Share2, Heart, Eye, Grid, List, ZoomIn, ZoomOut, RotateCw, Maximize2 } from 'lucide-react';
import { PhotoMetadata } from '../../utils/imageUtils';
import OptimizedImage from './OptimizedImage';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface PhotoGalleryProps {
  photos: PhotoMetadata[];
  title?: string;
  columns?: 2 | 3 | 4;
  showMetadata?: boolean;
  enableLightbox?: boolean;
  enableDownload?: boolean;
  enableSharing?: boolean;
  className?: string;
  layout?: 'grid' | 'masonry' | 'list';
  enableGestures?: boolean;
  enableInfiniteScroll?: boolean;
  variant?: 'default' | 'glass' | 'neuro';
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  title,
  columns = 3,
  showMetadata = true,
  enableLightbox = true,
  enableDownload = false,
  enableSharing = true,
  className = '',
  layout = 'grid',
  enableGestures = true,
  enableInfiniteScroll = false,
  variant = 'default'
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMetadata | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());
  const [displayedPhotos, setDisplayedPhotos] = useState<PhotoMetadata[]>([]);
  const [loadedPhotos, setLoadedPhotos] = useState(12);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [lightboxRotation, setLightboxRotation] = useState(0);
  const [currentLayout, setCurrentLayout] = useState<'grid' | 'masonry' | 'list'>(layout);
  const { trackEvent } = useAnalytics();
  const { ref: galleryRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Initialize displayed photos with priority loading for first few images
  useEffect(() => {
    const initialPhotos = photos.slice(0, loadedPhotos);
    
    // Preload first few images for better perceived performance
    if (initialPhotos.length > 0) {
      const firstPhotos = initialPhotos.slice(0, 4);
      firstPhotos.forEach(photo => {
        const img = new Image();
        img.src = getPhotoUrl(photo);
      });
    }
    
    setDisplayedPhotos(initialPhotos);
  }, [photos, loadedPhotos]);

  // Infinite scroll effect
  useEffect(() => {
    if (!enableInfiniteScroll) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && loadedPhotos < photos.length) {
          setLoadedPhotos(prev => Math.min(prev + 12, photos.length));
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [enableInfiniteScroll, loadedPhotos, photos.length]);

  const getPhotoUrl = (photo: PhotoMetadata): string => {
    // Use the optimized image URL with WebP format and appropriate sizing
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const size = isMobile ? 'medium' : 'large';
    
    if (photo.subcategory) {
      return getOptimizedImageUrl(
        photo.filename, 
        photo.category,
        photo.subcategory,
        { 
          format: 'webp',
          size,
          quality: 85
        }
      );
    }
    
    return getOptimizedImageUrl(
      photo.filename,
      photo.category,
      undefined,
      {
        format: 'webp',
        size,
        quality: 85
      }
    );
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/10 backdrop-blur-md border border-white/20';
      case 'neuro':
        return 'bg-gray-100 shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] border-none';
      default:
        return 'bg-white shadow-md hover:shadow-xl border border-gray-200';
    }
  };

  const openLightbox = (photo: PhotoMetadata, index: number) => {
    if (!enableLightbox) return;
    
    setSelectedPhoto(photo);
    setCurrentIndex(index);
    setLightboxZoom(1);
    setLightboxRotation(0);
    trackEvent('Gallery', 'Photo View', photo.title);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    setLightboxZoom(1);
    setLightboxRotation(0);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + photos.length) % photos.length
      : (currentIndex + 1) % photos.length;
    
    setCurrentIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
    setLightboxZoom(1);
    setLightboxRotation(0);
    trackEvent('Gallery', 'Photo Navigate', direction);
  };

  const handleSwipe = (event: PointerEvent, info: PanInfo) => {
    if (!enableGestures) return;
    
    const swipeThreshold = 100;
    const swipeVelocity = 500;
    
    if (Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.velocity.x) > swipeVelocity) {
      if (info.offset.x > 0) {
        navigatePhoto('prev');
      } else {
        navigatePhoto('next');
      }
    }
  };

  const handleZoom = (delta: number) => {
    setLightboxZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleRotate = () => {
    setLightboxRotation(prev => prev + 90);
  };

  const resetLightboxTransform = () => {
    setLightboxZoom(1);
    setLightboxRotation(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigatePhoto('prev');
          break;
        case 'ArrowRight':
          navigatePhoto('next');
          break;
        case '+':
        case '=':
          handleZoom(0.2);
          break;
        case '-':
          handleZoom(-0.2);
          break;
        case 'r':
        case 'R':
          handleRotate();
          break;
        case '0':
          resetLightboxTransform();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, currentIndex]);

  // Pinch-to-zoom for mobile
  useEffect(() => {
    if (!enableGestures || !selectedPhoto) return;

    let initialDistance = 0;
    let initialZoom = 1;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialDistance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        initialZoom = lightboxZoom;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const distance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        const scale = distance / initialDistance;
        const newZoom = Math.max(0.5, Math.min(3, initialZoom * scale));
        setLightboxZoom(newZoom);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [enableGestures, selectedPhoto, lightboxZoom]);

  const handleLike = (photoId: string) => {
    const newLikedPhotos = new Set(likedPhotos);
    if (likedPhotos.has(photoId)) {
      newLikedPhotos.delete(photoId);
      trackEvent('Gallery', 'Photo Unlike', photoId);
    } else {
      newLikedPhotos.add(photoId);
      trackEvent('Gallery', 'Photo Like', photoId);
    }
    setLikedPhotos(newLikedPhotos);
  };

  const handleShare = async (photo: PhotoMetadata) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title,
          text: photo.description,
          url: window.location.href
        });
        trackEvent('Gallery', 'Photo Share', photo.title);
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      trackEvent('Gallery', 'Photo Share Fallback', photo.title);
    }
  };

  const handleDownload = (photo: PhotoMetadata) => {
    const link = document.createElement('a');
    link.href = getPhotoUrl(photo);
    link.download = photo.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    trackEvent('Gallery', 'Photo Download', photo.title);
  };

  const getGridClasses = () => {
    const baseClasses = {
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    };

    switch (currentLayout) {
      case 'masonry':
        return `columns-1 md:columns-${columns} gap-4 space-y-4`;
      case 'list':
        return 'flex flex-col gap-6';
      default:
        return `grid ${baseClasses[columns]} gap-4`;
    }
  };

  const getMasonryItemClasses = () => {
    return 'break-inside-avoid mb-4 w-full';
  };

  return (
    <div 
      ref={galleryRef} 
      className={className}
      role="region"
      aria-label={title ? `${title} photo gallery` : "Photo gallery"}
    >
      {title && (
        <div className="flex items-center justify-between mb-8">
          <h3 
            className="text-2xl font-bold text-gray-900"
            id="gallery-title"
          >
            {title}
          </h3>
          
          {/* Layout Toggle */}
          <div 
            className="flex items-center space-x-2 bg-white rounded-lg shadow-sm p-1"
            role="group"
            aria-label="Gallery layout options"
          >
            <button
              onClick={() => setCurrentLayout('grid')}
              className={`p-2 rounded transition-colors ${
                currentLayout === 'grid' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Grid Layout"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentLayout('masonry')}
              className={`p-2 rounded transition-colors ${
                currentLayout === 'masonry' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Masonry Layout"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentLayout('list')}
              className={`p-2 rounded transition-colors ${
                currentLayout === 'list' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="List Layout"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Photo Layout Container */}
      <motion.div 
        className={getGridClasses()}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        role="grid"
        aria-labelledby={title ? "gallery-title" : undefined}
        aria-label={!title ? "Photo gallery grid" : undefined}
      >
        {(enableInfiniteScroll ? displayedPhotos : photos).map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              group relative overflow-hidden transition-all duration-500 cursor-pointer
              ${getVariantClasses()}
              ${currentLayout === 'masonry' ? getMasonryItemClasses() : ''}
              ${currentLayout === 'list' ? 'flex gap-4 p-4' : 'rounded-xl'}
              interactive-element
            `}
            role="gridcell"
            tabIndex={0}
            aria-label={`Photo: ${photo.title}. ${photo.description}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(photo, index);
              }
            }}
          >
            <div className={`
              relative overflow-hidden
              ${currentLayout === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square'}
            `}>
              <OptimizedImage
                src={getPhotoUrl(photo)}
                alt={photo.alt || `Kumar Prescod ${photo.category} photo`}
                title={photo.title}
                width={currentLayout === 'list' ? 300 : 600}
                height={currentLayout === 'list' ? 300 : 600}
                className={`
                  w-full h-full object-cover transition-transform duration-500
                  ${currentLayout === 'list' ? 'rounded-lg' : 'aspect-square'}
                  group-hover:scale-105
                `}
                onClick={() => openLightbox(photo, index)}
                loading={index < 4 ? 'eager' : 'lazy'}
                sizes={currentLayout === 'list' 
                  ? '(max-width: 767px) 100vw, 300px' 
                  : `(max-width: 639px) 100vw, (max-width: 1023px) 50vw, ${100 / columns}%`
                }
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openLightbox(photo, index);
                    }}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(photo.id);
                    }}
                    className={`p-2 backdrop-blur-sm rounded-full transition-colors ${
                      likedPhotos.has(photo.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedPhotos.has(photo.id) ? 'fill-current' : ''}`} />
                  </button>
                  {enableSharing && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(photo);
                      }}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Featured badge */}
              {photo.featured && (
                <div className="absolute top-2 left-2 bg-gold-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  Featured
                </div>
              )}

              {/* Member/VIP badges */}
              {photo.memberOnly && (
                <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  Member
                </div>
              )}
              {photo.vipOnly && (
                <div className="absolute top-2 right-2 bg-gold-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  VIP
                </div>
              )}
            </div>

            {/* Photo metadata */}
            {showMetadata && (
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{photo.title}</h4>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{photo.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{photo.date}</span>
                  <div className="flex space-x-2">
                    {photo.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="bg-gray-100 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Lightbox */}
      <AnimatePresence>
        {selectedPhoto && enableLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Top Controls */}
            <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-6 z-10">
              <div className="flex items-center space-x-4">
                <h3 className="text-white text-lg font-semibold">{selectedPhoto.title}</h3>
                <span className="text-gray-300 text-sm">
                  {currentIndex + 1} of {photos.length}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Zoom Controls */}
                <button
                  onClick={() => handleZoom(-0.2)}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <span className="text-white text-sm min-w-[3rem] text-center">
                  {Math.round(lightboxZoom * 100)}%
                </span>
                <button
                  onClick={() => handleZoom(0.2)}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                
                {/* Rotate Control */}
                <button
                  onClick={handleRotate}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  title="Rotate"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
                
                {/* Reset Control */}
                <button
                  onClick={resetLightboxTransform}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  title="Reset (Press 0)"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                
                {/* Close button */}
                <button
                  onClick={closeLightbox}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  title="Close (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => navigatePhoto('prev')}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors z-10"
              title="Previous (←)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigatePhoto('next')}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors z-10"
              title="Next (→)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main image with gesture support */}
            <motion.div
              key={selectedPhoto.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-[90vw] max-h-[80vh] select-none"
              onClick={(e) => e.stopPropagation()}
              drag={enableGestures}
              dragElastic={0.1}
              onPanEnd={handleSwipe}
              whileDrag={{ scale: 0.95 }}
            >
              <motion.div
                animate={{
                  scale: lightboxZoom,
                  rotate: lightboxRotation
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative"
              >
                <OptimizedImage
                  src={getPhotoUrl(selectedPhoto)}
                  alt={selectedPhoto.alt}
                  title={selectedPhoto.title}
                  className="max-h-[80vh] w-auto rounded-lg shadow-2xl"
                  objectFit="contain"
                  priority
                />
                
                {/* Touch indicators for mobile */}
                {enableGestures && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-4 text-white/60 text-xs bg-black/40 px-2 py-1 rounded">
                      Swipe • Pinch • Drag
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Bottom Actions */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
              <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                <button
                  onClick={() => handleLike(selectedPhoto.id)}
                  className={`p-2 rounded-full transition-colors ${
                    likedPhotos.has(selectedPhoto.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${likedPhotos.has(selectedPhoto.id) ? 'fill-current' : ''}`} />
                </button>
                {enableSharing && (
                  <button
                    onClick={() => handleShare(selectedPhoto)}
                    className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                )}
                {enableDownload && (
                  <button
                    onClick={() => handleDownload(selectedPhoto)}
                    className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Photo metadata */}
            <div className="absolute bottom-20 left-6 right-6 text-center z-10">
              <p className="text-gray-300 text-sm">{selectedPhoto.description}</p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-400 mt-2">
                {selectedPhoto.date && <span>{selectedPhoto.date}</span>}
                {selectedPhoto.location && <span>📍 {selectedPhoto.location}</span>}
                {selectedPhoto.photographer && <span>📷 {selectedPhoto.photographer}</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Infinite Scroll Trigger */}
      {enableInfiniteScroll && loadedPhotos < photos.length && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;