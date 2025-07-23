/**
 * TypeScript interfaces for Boxing Website Components
 * Generated from Figma MCP Server integration
 */

// Fighter & Fight Related Types
export interface Fighter {
  id: string;
  name: string;
  nickname?: string;
  age: number;
  height: string;
  weight: string;
  reach: string;
  stance: 'Orthodox' | 'Southpaw' | 'Switch';
  hometown: string;
  record: FightRecord;
  weightClass: WeightClass;
  profileImage: string;
  achievements: Achievement[];
  social: SocialLinks;
}

export interface FightRecord {
  wins: number;
  losses: number;
  draws: number;
  knockouts: number;
  technicalKnockouts: number;
  submissions?: number;
}

export interface Fight {
  id: string;
  date: string;
  opponent: Fighter;
  result: FightResult;
  method: FightMethod;
  round?: number;
  time?: string;
  venue: Venue;
  title?: string;
  poster?: string;
  highlights?: string[];
  notes?: string;
}

export interface FightResult {
  outcome: 'Win' | 'Loss' | 'Draw' | 'No Contest';
  method: FightMethod;
  details?: string;
}

export type FightMethod = 
  | 'KO' 
  | 'TKO' 
  | 'Submission' 
  | 'Decision' 
  | 'Split Decision' 
  | 'Majority Decision' 
  | 'Unanimous Decision'
  | 'Disqualification'
  | 'No Contest';

export type WeightClass = 
  | 'Heavyweight'
  | 'Light Heavyweight' 
  | 'Middleweight'
  | 'Welterweight'
  | 'Lightweight'
  | 'Featherweight'
  | 'Bantamweight'
  | 'Flyweight';

export interface Venue {
  name: string;
  city: string;
  state: string;
  country: string;
  capacity?: number;
  image?: string;
}

export interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'Title' | 'Award' | 'Record' | 'Milestone';
  icon?: string;
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
}

// Training Related Types
export interface TrainingSession {
  id: string;
  date: string;
  type: TrainingType;
  duration: number; // minutes
  intensity: TrainingIntensity;
  exercises: Exercise[];
  notes?: string;
  media?: TrainingMedia[];
}

export type TrainingType = 
  | 'Boxing'
  | 'Conditioning'
  | 'Strength'
  | 'Cardio'
  | 'Sparring'
  | 'Technique'
  | 'Recovery';

export type TrainingIntensity = 'Low' | 'Medium' | 'High' | 'Extreme';

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  weight?: number;
  distance?: number;
  notes?: string;
}

export interface TrainingMedia {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
}

// Event & Promotion Types
export interface Event {
  id: string;
  title: string;
  date: string;
  venue: Venue;
  fights: Fight[];
  poster: string;
  description: string;
  ticketUrl?: string;
  streamingUrl?: string;
  status: EventStatus;
}

export type EventStatus = 'Upcoming' | 'Live' | 'Completed' | 'Cancelled' | 'Postponed';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  available: number;
  total: number;
  perks: string[];
}

// Component Props Types
export interface FighterCardProps {
  fighter: Fighter;
  size?: 'small' | 'medium' | 'large';
  showRecord?: boolean;
  showAchievements?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface FightCardProps {
  fight: Fight;
  showResult?: boolean;
  showVenue?: boolean;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export interface StatDisplayProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: 'red' | 'gold' | 'gray';
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
}

export interface CountdownTimerProps {
  targetDate: string;
  title?: string;
  onComplete?: () => void;
  className?: string;
}

export interface TrainingGridProps {
  sessions: TrainingSession[];
  period?: 'week' | 'month' | 'year';
  showFilters?: boolean;
  onSessionClick?: (session: TrainingSession) => void;
}

export interface EventBannerProps {
  event: Event;
  showTickets?: boolean;
  showCountdown?: boolean;
  variant?: 'hero' | 'card' | 'minimal';
}

// Media & Asset Types
export interface MediaAsset {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  alt: string;
  caption?: string;
  tags: string[];
  category: MediaCategory;
  metadata: MediaMetadata;
}

export type MediaCategory = 
  | 'training'
  | 'fights'
  | 'promotional'
  | 'behind-scenes'
  | 'lifestyle'
  | 'press';

export interface MediaMetadata {
  filename: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number; // for videos/audio
  format: string;
  uploadDate: string;
}

// E-commerce Types
export interface MerchandiseItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  category: MerchandiseCategory;
  inStock: boolean;
  stockCount?: number;
}

export type MerchandiseCategory = 
  | 'apparel'
  | 'accessories' 
  | 'equipment'
  | 'collectibles'
  | 'digital';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'general' | 'media' | 'booking' | 'sponsorship';
}

export interface NewsletterFormData {
  email: string;
  interests: string[];
}

// Utility Types
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ComponentStatus = 'loading' | 'success' | 'error' | 'idle';