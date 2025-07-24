/**
 * Core type definitions for the Kumar Prescod Boxing website
 */

// Base utility types
export type ID = string;
export type Timestamp = string; // ISO 8601 format
export type URL = string;
export type Email = string;

// User and Authentication Types
export type UserRole = 'admin' | 'coach' | 'member' | 'volunteer' | 'guest';
export type MembershipTier = 'basic' | 'premium' | 'vip';

export interface User {
  id: ID;
  email: Email;
  name: string;
  role: UserRole;
  avatar?: URL;
  joinDate: Timestamp;
  lastLogin?: Timestamp;
  preferences: UserPreferences;
  membershipTier?: MembershipTier;
  volunteerSkills?: string[];
  donationHistory?: Donation[];
  isActive: boolean;
}

export interface UserPreferences {
  notifications: boolean;
  newsletter: boolean;
  eventUpdates: boolean;
  darkMode?: boolean;
  language?: string;
}

// Fight and Event Types
export type FightResult = 'win' | 'loss' | 'draw' | 'no_contest';
export type FightStatus = 'upcoming' | 'completed' | 'cancelled' | 'postponed';

export interface Fight {
  id: ID;
  title: string;
  date: Timestamp;
  time: string;
  location: string;
  venue: string;
  opponent: Opponent;
  ticketInfo: TicketInfo;
  result?: FightResultDetails;
  media?: Media[];
  highlights?: string[];
  status: FightStatus;
  description?: string;
  weightClass?: string;
  rounds?: number;
}

export interface Opponent {
  id: ID;
  name: string;
  record: string;
  nickname?: string;
  image?: URL;
  age?: number;
  height?: string;
  weight?: string;
  reach?: string;
  stance?: 'orthodox' | 'southpaw';
  country?: string;
}

export interface FightResultDetails {
  outcome: FightResult;
  method: string;
  round?: number;
  time?: string;
  highlights?: string[];
  notes?: string;
}

export interface TicketInfo {
  onSaleDate: Timestamp;
  priceRange: {
    min: number;
    max: number;
  };
  purchaseUrl: URL;
  vipPackages: boolean;
  soldOut?: boolean;
  ticketTypes: TicketType[];
}

export interface TicketType {
  id: ID;
  name: string;
  price: number;
  description: string;
  available: number;
  perks?: string[];
}

// Media Types
export type MediaType = 'image' | 'video' | 'audio';
export type MediaCategory = 
  | 'training' 
  | 'fight' 
  | 'portrait' 
  | 'community' 
  | 'podcast' 
  | 'interview'
  | 'behind-scenes'
  | 'promotional';

export interface Media {
  id: ID;
  type: MediaType;
  url: URL;
  title: string;
  description?: string;
  date: Timestamp;
  tags: string[];
  category: MediaCategory;
  featured?: boolean;
  memberOnly?: boolean;
  thumbnailUrl?: URL;
  duration?: number; // For video/audio in seconds
  fileSize?: number; // In bytes
  dimensions?: {
    width: number;
    height: number;
  };
  altText?: string; // For accessibility
}

// Product and E-commerce Types
export type ProductCategory = 'apparel' | 'accessories' | 'equipment' | 'digital';
export type ProductStatus = 'active' | 'inactive' | 'out_of_stock';

export interface Product {
  id: ID;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  status: ProductStatus;
  images: URL[];
  variants?: ProductVariant[];
  inventory: number;
  sku: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[];
  featured?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProductVariant {
  id: ID;
  name: string;
  price?: number; // Override base price if different
  sku: string;
  inventory: number;
  attributes: Record<string, string>; // e.g., { size: 'L', color: 'red' }
}

// Sponsorship and Funding Types
export type SponsorshipTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'title';
export type SponsorshipStatus = 'active' | 'pending' | 'expired' | 'cancelled';

export interface Sponsor {
  id: ID;
  name: string;
  logo: URL;
  website?: URL;
  tier: SponsorshipTier;
  status: SponsorshipStatus;
  startDate: Timestamp;
  endDate?: Timestamp;
  description?: string;
  benefits: string[];
  contactInfo: ContactInfo;
}

export interface ContactInfo {
  email: Email;
  phone?: string;
  address?: Address;
  contactPerson?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Donation {
  id: ID;
  amount: number;
  date: Timestamp;
  goalId?: ID;
  anonymous: boolean;
  donorName?: string;
  donorEmail?: Email;
  message?: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
}

export interface FundingGoal {
  id: ID;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: Timestamp;
  endDate: Timestamp;
  category: string;
  status: 'active' | 'completed' | 'cancelled';
  updates: FundingUpdate[];
}

export interface FundingUpdate {
  id: ID;
  title: string;
  content: string;
  date: Timestamp;
  media?: Media[];
}

// Community and Social Types
export interface CommunityEvent {
  id: ID;
  title: string;
  description: string;
  date: Timestamp;
  location: string;
  capacity?: number;
  registered: number;
  price?: number;
  category: 'training' | 'community' | 'charity' | 'meet-and-greet';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  organizer: string;
  requirements?: string[];
  media?: Media[];
}

export interface BlogPost {
  id: ID;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: Timestamp;
  lastModified: Timestamp;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  category: string;
  featuredImage?: URL;
  readTime?: number; // Estimated reading time in minutes
  views?: number;
  likes?: number;
}

// Training Progress Types (for the Training Progress Tracker feature)
export type TrainingCategory = 'strength' | 'speed' | 'endurance' | 'technique' | 'nutrition' | 'recovery';

export interface TrainingPhase {
  id: ID;
  title: string;
  startDate: Timestamp;
  endDate: Timestamp;
  description: string;
  focus: TrainingCategory[];
  coach: string;
  location: string;
  isActive: boolean;
  achievements: Achievement[];
  metrics: Record<string, MetricData[]>;
  media: Media[];
  sponsorships: TrainingSponsorshipData[];
}

export interface MetricData {
  id: ID;
  name: string;
  value: number;
  unit: string;
  date: Timestamp;
  category: TrainingCategory;
  notes?: string;
  baseline?: number; // For comparison
  target?: number; // Goal value
}

export interface Achievement {
  id: ID;
  title: string;
  description: string;
  date: Timestamp;
  category: TrainingCategory;
  significance: string;
  mediaIds: ID[];
  isHighlighted: boolean;
  metrics?: MetricData[];
}

export interface TrainingSponsorshipData {
  id: ID;
  sponsorId: ID;
  sponsorName: string;
  category: 'equipment' | 'nutrition' | 'training' | 'recovery' | 'general';
  contribution: string;
  startDate: Timestamp;
  endDate?: Timestamp;
  relatedMetricIds: ID[];
  isActive: boolean;
  roiMetrics?: Record<string, number>;
}

// Analytics and Tracking Types
export interface AnalyticsEvent {
  eventName: string;
  parameters: Record<string, string | number | boolean>;
  timestamp: Timestamp;
  userId?: ID;
  sessionId: string;
}

export interface PageView {
  page: string;
  title: string;
  timestamp: Timestamp;
  userId?: ID;
  sessionId: string;
  referrer?: string;
  userAgent: string;
}

// Form and Validation Types
export interface FormField<T = any> {
  value: T;
  error?: string;
  touched: boolean;
  required?: boolean;
}

export interface ContactForm {
  name: FormField<string>;
  email: FormField<string>;
  subject: FormField<string>;
  message: FormField<string>;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  meta: {
    status: number;
    message: string;
    timestamp: Timestamp;
    pagination?: PaginationMeta;
  };
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Timestamp;
}

// Utility Types for Type Guards
export const isUser = (obj: any): obj is User => {
  return obj && typeof obj.id === 'string' && typeof obj.email === 'string';
};

export const isFight = (obj: any): obj is Fight => {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string';
};

export const isMedia = (obj: any): obj is Media => {
  return obj && typeof obj.id === 'string' && typeof obj.type === 'string';
};

// Enum-like objects for consistent values
export const USER_ROLES = {
  ADMIN: 'admin' as const,
  COACH: 'coach' as const,
  MEMBER: 'member' as const,
  VOLUNTEER: 'volunteer' as const,
  GUEST: 'guest' as const,
} as const;

export const MEMBERSHIP_TIERS = {
  BASIC: 'basic' as const,
  PREMIUM: 'premium' as const,
  VIP: 'vip' as const,
} as const;

export const FIGHT_RESULTS = {
  WIN: 'win' as const,
  LOSS: 'loss' as const,
  DRAW: 'draw' as const,
  NO_CONTEST: 'no_contest' as const,
} as const;

export const MEDIA_TYPES = {
  IMAGE: 'image' as const,
  VIDEO: 'video' as const,
  AUDIO: 'audio' as const,
} as const;

export const TRAINING_CATEGORIES = {
  STRENGTH: 'strength' as const,
  SPEED: 'speed' as const,
  ENDURANCE: 'endurance' as const,
  TECHNIQUE: 'technique' as const,
  NUTRITION: 'nutrition' as const,
  RECOVERY: 'recovery' as const,
} as const;

// Re-export contact types
export type {
  ContactMessage,
  ContactFormData,
  ContactFormErrors,
  ContactFormState,
  InquiryType,
  ContactStatus,
  ContactInfo as ContactInformation,
  ContactAnalytics,
  ContactFormProps
} from './contact';