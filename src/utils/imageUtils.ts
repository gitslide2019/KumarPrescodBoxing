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

// Image optimization utilities
export const getOptimizedImageUrl = (
  filename: string, 
  category: string, 
  subcategory?: string, 
  size: 'thumbnail' | 'medium' | 'large' | 'original' = 'original'
): string => {
  const baseUrl = getPhotoUrl(filename, category, subcategory);
  
  // In a real implementation, you'd have different sizes
  // For now, return the original but this can be extended
  switch (size) {
    case 'thumbnail':
      return baseUrl; // Could be optimized 400px version
    case 'medium':
      return baseUrl; // Could be optimized 800px version
    case 'large':
      return baseUrl; // Could be optimized 1200px version
    default:
      return baseUrl;
  }
};

// Generate srcSet for responsive images
export const generateSrcSet = (filename: string, category: string, subcategory?: string): string => {
  const baseUrl = getPhotoUrl(filename, category, subcategory);
  
  // In a real implementation, you'd have multiple sizes
  return `${baseUrl} 1x, ${baseUrl} 2x`;
};

export default {
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
  getOptimizedImageUrl,
  generateSrcSet
};