/**
 * Component Exports - Kumar Prescod Boxing Website
 * Centralized exports for all boxing-themed React components
 */

// Fighter Components
export { default as FighterCard } from './fighter/FighterCard';

// Fight Components  
export { default as FightRecord } from './fights/FightRecord';

// Training Components
export { default as TrainingGrid } from './training/TrainingGrid';

// News Components
export { default as NewsArticle } from './news/NewsArticle';

// Stats Components
export { default as StatsWidget } from './stats/StatsWidget';

// Common Components (Re-exports for convenience)
export { default as OptimizedImage } from './common/OptimizedImage';
export { default as LoadingSpinner } from './common/LoadingSpinner';
export { default as CountdownTimer } from './common/CountdownTimer';
export { default as AnimatedElement } from './common/AnimatedElement';
export { default as PhotoGallery } from './common/PhotoGallery';

// Layout Components
export { default as Header } from './layout/Header';
export { default as Footer } from './layout/Footer';

// Section Components
export { default as HeroSection } from './sections/HeroSection';
export { default as StatsSection } from './sections/StatsSection';
export { default as LatestNews } from './sections/LatestNews';
export { default as UpcomingFights } from './sections/UpcomingFights';
export { default as SocialFeed } from './sections/SocialFeed';

// Community Components
export { default as CommunityImpact } from './community/CommunityImpact';
export { default as CommunityService } from './community/CommunityService';

// Funding Components
export { default as FundingDashboard } from './funding/FundingDashboard';
export { default as FundingMeter } from './funding/FundingMeter';
export { default as SponsorshipTiers } from './funding/SponsorshipTiers';

// Auth Components
export { default as LoginModal } from './auth/LoginModal';
export { default as ProtectedRoute } from './auth/ProtectedRoute';
export { default as UserProfile } from './auth/UserProfile';

// Error Boundary Components
export { default as ErrorBoundary } from './common/ErrorBoundary/ErrorBoundary';
export { default as ErrorFallback } from './common/ErrorBoundary/ErrorFallback';
export { withErrorBoundary } from './common/ErrorBoundary/withErrorBoundary';

// Type Exports
export type { FighterCardProps } from '../types/boxing';
export type { FightCardProps } from '../types/boxing';
export type { TrainingGridProps } from '../types/boxing';
export type { StatDisplayProps } from '../types/boxing';
export type { ComponentSize, ComponentVariant, ComponentStatus } from '../types/boxing';