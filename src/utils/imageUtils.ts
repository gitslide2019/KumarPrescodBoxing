// Image utility functions for photo management and optimization

export interface PhotoMetadata {
  id: string;
  filename: string;
  title: string;
  description: string;
  category: 'training' | 'portrait' | 'fight' | 'community' | 'exclusive';
  subcategory?: string;
  date?: string;
  tags: string[];
  alt: string;
  photographer?: string;
  location?: string;
  equipment?: string;
  featured?: boolean;
  memberOnly?: boolean;
  vipOnly?: boolean;
}

// Training photos metadata
export const trainingPhotos: PhotoMetadata[] = [
  {
    id: 'training-001',
    filename: 'DSC00612.jpeg',
    title: 'Heavy Bag Training Session',
    description: 'Kumar working on power combinations during his daily heavy bag routine',
    category: 'training',
    subcategory: 'daily-routine',
    date: '2024-01-15',
    tags: ['heavy bag', 'power training', 'combinations', 'gym'],
    alt: 'Kumar Prescod training on heavy bag with intense focus',
    location: 'Oakland Training Facility',
    featured: true
  },
  {
    id: 'training-002',
    filename: 'DSC00624.jpeg',
    title: 'Footwork Drill Practice',
    description: 'Developing agility and movement patterns essential for ring performance',
    category: 'training',
    subcategory: 'daily-routine',
    date: '2024-01-15',
    tags: ['footwork', 'agility', 'movement', 'fundamentals'],
    alt: 'Kumar practicing footwork drills in the boxing gym',
    location: 'Oakland Training Facility'
  },
  {
    id: 'training-003',
    filename: 'DSC00628.jpeg',
    title: 'Speed and Accuracy Training',
    description: 'Fine-tuning hand speed and precision with focused pad work',
    category: 'training',
    subcategory: 'daily-routine',
    date: '2024-01-15',
    tags: ['speed', 'accuracy', 'pad work', 'technique'],
    alt: 'Kumar training speed and accuracy with boxing pads',
    location: 'Oakland Training Facility'
  },
  {
    id: 'training-004',
    filename: 'DSC00631.jpeg',
    title: 'Conditioning Workout',
    description: 'Building the endurance and strength needed for championship-level boxing',
    category: 'training',
    subcategory: 'daily-routine',
    date: '2024-01-15',
    tags: ['conditioning', 'strength', 'endurance', 'fitness'],
    alt: 'Kumar during intense conditioning training session',
    location: 'Oakland Training Facility'
  },
  {
    id: 'training-005',
    filename: 'DSC00641.jpeg',
    title: 'Technical Skill Development',
    description: 'Working on advanced boxing techniques with his coaching team',
    category: 'training',
    subcategory: 'daily-routine',
    date: '2024-01-16',
    tags: ['technique', 'skills', 'coaching', 'development'],
    alt: 'Kumar working on technical boxing skills with coach guidance',
    location: 'Oakland Training Facility',
    featured: true
  },
  {
    id: 'training-006',
    filename: 'DSC00650.jpeg',
    title: 'Ring Work Session',
    description: 'Practicing movement and positioning inside the boxing ring',
    category: 'training',
    subcategory: 'daily-routine',
    date: '2024-01-16',
    tags: ['ring work', 'positioning', 'movement', 'practice'],
    alt: 'Kumar training inside boxing ring working on positioning',
    location: 'Oakland Training Facility'
  },
  {
    id: 'training-007',
    filename: 'DSC00661.jpeg',
    title: 'Focus Mitt Training',
    description: 'Sharp combination work with focus mitts to improve timing and accuracy',
    category: 'training',
    subcategory: 'daily-routine',
    date: '2024-01-16',
    tags: ['focus mitts', 'combinations', 'timing', 'accuracy'],
    alt: 'Kumar throwing precise combinations on focus mitts',
    location: 'Oakland Training Facility'
  },
  {
    id: 'training-008',
    filename: 'DSC00664.jpeg',
    title: 'Defensive Training',
    description: 'Practicing defensive movements and counter-attacking techniques',
    category: 'training',
    subcategory: 'daily-routine',
    date: '2024-01-16',
    tags: ['defense', 'counter-attack', 'movement', 'technique'],
    alt: 'Kumar practicing defensive boxing techniques and movement',
    location: 'Oakland Training Facility'
  },
  {
    id: 'training-009',
    filename: 'DSC00668.jpeg',
    title: 'Power Development',
    description: 'Building knockout power through specialized training methods',
    category: 'training',
    subcategory: 'daily-routine',
    date: '2024-01-17',
    tags: ['power', 'knockout', 'strength', 'development'],
    alt: 'Kumar working on power development training',
    location: 'Oakland Training Facility'
  },
  {
    id: 'training-010',
    filename: 'DSC00678.jpeg',
    title: 'Sparring Preparation',
    description: 'Getting ready for sparring session with warm-up and technique review',
    category: 'training',
    subcategory: 'daily-routine',
    date: '2024-01-17',
    tags: ['sparring', 'preparation', 'warm-up', 'technique'],
    alt: 'Kumar preparing for sparring session with technique work',
    location: 'Oakland Training Facility',
    featured: true
  }
];

// Equipment photos metadata
export const equipmentPhotos: PhotoMetadata[] = [
  {
    id: 'equipment-001',
    filename: 'DSC00983.jpeg',
    title: 'Professional Training Equipment',
    description: 'State-of-the-art boxing equipment used in Kumar\'s daily training',
    category: 'training',
    subcategory: 'equipment',
    date: '2024-01-20',
    tags: ['equipment', 'gear', 'training', 'professional'],
    alt: 'Professional boxing training equipment at Oakland gym',
    location: 'Oakland Training Facility'
  }
];

// Progression photos metadata
export const progressionPhotos: PhotoMetadata[] = [
  {
    id: 'progression-001',
    filename: 'DSC04081.jpeg',
    title: 'Early Career Development',
    description: 'Kumar\'s progression in boxing technique and physical development',
    category: 'training',
    subcategory: 'progression',
    date: '2024-02-01',
    tags: ['progression', 'development', 'career', 'growth'],
    alt: 'Kumar showing his boxing development and progression',
    location: 'Oakland Training Facility'
  },
  {
    id: 'progression-002',
    filename: 'DSC04088.jpeg',
    title: 'Skill Development Milestone',
    description: 'Demonstrating improved technique and ring presence',
    category: 'training',
    subcategory: 'progression',
    date: '2024-02-01',
    tags: ['skills', 'technique', 'improvement', 'milestone'],
    alt: 'Kumar demonstrating improved boxing skills and technique',
    location: 'Oakland Training Facility',
    featured: true
  },
  {
    id: 'progression-003',
    filename: 'DSC04091.jpeg',
    title: 'Physical Transformation',
    description: 'The physical development that comes with dedicated training',
    category: 'training',
    subcategory: 'progression',
    date: '2024-02-02',
    tags: ['physical', 'transformation', 'fitness', 'dedication'],
    alt: 'Kumar showing physical transformation from training',
    location: 'Oakland Training Facility'
  },
  {
    id: 'progression-004',
    filename: 'DSC05249.jpeg',
    title: 'Advanced Training Phase',
    description: 'Kumar in his most recent training phase showing championship-level preparation',
    category: 'training',
    subcategory: 'progression',
    date: '2024-03-01',
    tags: ['advanced', 'championship', 'preparation', 'elite'],
    alt: 'Kumar in advanced training phase showing championship preparation',
    location: 'Oakland Training Facility',
    featured: true
  }
];

// Portrait photos metadata
export const portraitPhotos: PhotoMetadata[] = [
  {
    id: 'portrait-001',
    filename: 'IMG_7202.jpeg',
    title: 'Kumar Prescod Professional Portrait',
    description: 'Professional action portrait showcasing Kumar\'s boxing stance and intensity',
    category: 'portrait',
    subcategory: 'action-portraits',
    date: '2024-01-10',
    tags: ['portrait', 'professional', 'action', 'stance'],
    alt: 'Professional action portrait of Kumar Prescod in boxing stance',
    location: 'Professional Studio',
    featured: true
  }
];

// Combined photo database
export const allPhotos: PhotoMetadata[] = [
  ...trainingPhotos,
  ...equipmentPhotos,
  ...progressionPhotos,
  ...portraitPhotos
];

// Utility functions
export const getPhotoUrl = (filename: string, category: string, subcategory?: string): string => {
  const basePath = '/images';
  if (subcategory) {
    return `${basePath}/${category}/${subcategory}/${filename}`;
  }
  return `${basePath}/${category}/${filename}`;
};

export const getFeaturedPhotos = (): PhotoMetadata[] => {
  return allPhotos.filter(photo => photo.featured);
};

export const getPhotosByCategory = (category: string, subcategory?: string): PhotoMetadata[] => {
  return allPhotos.filter(photo => {
    if (subcategory) {
      return photo.category === category && photo.subcategory === subcategory;
    }
    return photo.category === category;
  });
};

export const getPhotoById = (id: string): PhotoMetadata | undefined => {
  return allPhotos.find(photo => photo.id === id);
};

export const getPublicPhotos = (): PhotoMetadata[] => {
  return allPhotos.filter(photo => !photo.memberOnly && !photo.vipOnly);
};

export const getMemberPhotos = (): PhotoMetadata[] => {
  return allPhotos.filter(photo => photo.memberOnly && !photo.vipOnly);
};

export const getVipPhotos = (): PhotoMetadata[] => {
  return allPhotos.filter(photo => photo.vipOnly);
};

// Modern image format support detection
export const detectImageFormatSupport = (): Promise<{ webp: boolean; avif: boolean }> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve({ webp: false, avif: false });
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    // Test WebP support
    const webpSupport = canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
    
    // Test AVIF support (more comprehensive check)
    const avifImage = new Image();
    avifImage.onload = () => {
      resolve({ webp: webpSupport, avif: true });
    };
    avifImage.onerror = () => {
      resolve({ webp: webpSupport, avif: false });
    };
    
    // Test with a minimal AVIF data URL
    avifImage.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=';
    
    // Fallback timeout
    setTimeout(() => {
      resolve({ webp: webpSupport, avif: false });
    }, 100);
  });
};

// Generate optimized image URL with format conversion
export const getOptimizedImageUrl = (
  filename: string, 
  category: string, 
  subcategory?: string, 
  options: {
    size?: 'thumbnail' | 'medium' | 'large' | 'original';
    format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
    quality?: number;
  } = {}
): string => {
  const { size = 'original', format = 'auto', quality = 85 } = options;
  const baseUrl = getPhotoUrl(filename, category, subcategory);
  
  // Apply format conversion
  let optimizedUrl = baseUrl;
  const extension = filename.split('.').pop()?.toLowerCase();
  
  if (format === 'webp' && (extension === 'jpg' || extension === 'jpeg' || extension === 'png')) {
    optimizedUrl = baseUrl.replace(new RegExp(`\.${extension}$`), '.webp');
  } else if (format === 'avif' && (extension === 'jpg' || extension === 'jpeg' || extension === 'png')) {
    optimizedUrl = baseUrl.replace(new RegExp(`\.${extension}$`), '.avif');
  }
  
  // Apply size optimization (in production, this would generate different sized versions)
  switch (size) {
    case 'thumbnail':
      return optimizedUrl; // Would be 400px version with quality optimization
    case 'medium':
      return optimizedUrl; // Would be 800px version with quality optimization
    case 'large':
      return optimizedUrl; // Would be 1200px version with quality optimization
    default:
      return optimizedUrl;
  }
};

// Generate srcSet for responsive images with modern formats
export const generateSrcSet = (
  filename: string, 
  category: string, 
  subcategory?: string,
  options: {
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
    quality?: number;
    sizes?: number[];
  } = {}
): string => {
  const { format = 'webp', quality = 85, sizes = [400, 800, 1200, 1600] } = options;
  
  const srcSetEntries = sizes.map(size => {
    const optimizedUrl = getOptimizedImageUrl(filename, category, subcategory, {
      size: size <= 400 ? 'thumbnail' : size <= 800 ? 'medium' : 'large',
      format,
      quality
    });
    return `${optimizedUrl} ${size}w`;
  });
  
  return srcSetEntries.join(', ');
};

// Generate picture element sources for multiple formats
export const generatePictureSources = (
  filename: string,
  category: string,
  subcategory?: string,
  options: {
    quality?: number;
    sizes?: string;
    includeAvif?: boolean;
    includeWebp?: boolean;
  } = {}
): Array<{ srcSet: string; type: string; sizes?: string }> => {
  const { quality = 85, sizes = '100vw', includeAvif = true, includeWebp = true } = options;
  const sources: Array<{ srcSet: string; type: string; sizes?: string }> = [];
  
  // AVIF source (best compression)
  if (includeAvif) {
    sources.push({
      srcSet: generateSrcSet(filename, category, subcategory, { format: 'avif', quality }),
      type: 'image/avif',
      sizes
    });
  }
  
  // WebP source (good compression, wide support)
  if (includeWebp) {
    sources.push({
      srcSet: generateSrcSet(filename, category, subcategory, { format: 'webp', quality }),
      type: 'image/webp',
      sizes
    });
  }
  
  return sources;
};

// Preload critical images with modern formats
export const preloadImage = (
  filename: string,
  category: string,
  subcategory?: string,
  options: {
    format?: 'auto' | 'webp' | 'avif' | 'jpeg';
    priority?: 'high' | 'low';
    as?: 'image';
  } = {}
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    const { format = 'auto', priority = 'high' } = options;
    let targetFormat = format;
    
    // Auto-detect best format
    if (format === 'auto') {
      detectImageFormatSupport().then(support => {
        targetFormat = support.avif ? 'avif' : support.webp ? 'webp' : 'jpeg';
        performPreload();
      });
    } else {
      performPreload();
    }
    
    function performPreload() {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = getOptimizedImageUrl(filename, category, subcategory, { format: targetFormat as any });
      
      if (priority === 'high') {
        link.setAttribute('fetchpriority', 'high');
      }
      
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to preload image: ${link.href}`));
      
      document.head.appendChild(link);
    }
  });
};

// Batch image optimization utilities
export const optimizeImageBatch = async (
  photos: PhotoMetadata[],
  targetFormat: 'webp' | 'avif' = 'webp'
): Promise<PhotoMetadata[]> => {
  const formatSupport = await detectImageFormatSupport();
  
  // Only optimize if format is supported
  if ((targetFormat === 'webp' && !formatSupport.webp) || 
      (targetFormat === 'avif' && !formatSupport.avif)) {
    return photos;
  }
  
  return photos.map(photo => ({
    ...photo,
    filename: photo.filename.replace(/\.(jpg|jpeg|png)$/i, `.${targetFormat}`)
  }));
};

// Generate blur placeholder data URL
export const generateBlurPlaceholder = (
  width: number = 40,
  height: number = 40,
  colors: string[] = ['#1f2937', '#dc2626']
): string => {
  if (typeof window === 'undefined') return '';
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  canvas.width = width;
  canvas.height = height;
  
  // Create gradient with boxing theme colors
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL('image/jpeg', 0.1);
};

// Image loading performance utilities
export const createImageLoadObserver = (callback: (entries: IntersectionObserverEntry[]) => void) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });
};

export default {
  // Original exports
  allPhotos,
  trainingPhotos,
  equipmentPhotos,
  progressionPhotos,
  portraitPhotos,
  getPhotoUrl,
  getFeaturedPhotos,
  getPhotosByCategory,
  getPhotoById,
  getPublicPhotos,
  getMemberPhotos,
  getVipPhotos,
  
  // Enhanced image optimization exports
  detectImageFormatSupport,
  getOptimizedImageUrl,
  generateSrcSet,
  generatePictureSources,
  preloadImage,
  optimizeImageBatch,
  generateBlurPlaceholder,
  createImageLoadObserver
};