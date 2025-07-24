/**
 * UI Components Export Index
 * Boxing-themed React TypeScript components for Kumar Prescod Boxing website
 */

export { default as FightPosterCard } from './FightPosterCard';
export { default as TrainingStatsWidget } from './TrainingStatsWidget';

// Re-export enhanced hero section
export { default as EnhancedHeroSection } from '../sections/EnhancedHeroSection';

// Component prop types for external usage
export type { 
  Fighter, 
  Event, 
  TrainingSession,
  TrainingIntensity,
  TrainingType 
} from '../../types/boxing';