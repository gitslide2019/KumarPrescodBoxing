# Advanced Boxing-Themed React Components

This collection provides advanced, production-ready React TypeScript components specifically designed for the Kumar Prescod Boxing website. Each component leverages the boxing design tokens and integrates seamlessly with the existing codebase.

## Components Overview

### 1. FightPosterCard Component

**Path**: `/src/components/ui/FightPosterCard.tsx`

A comprehensive fight promotion card component featuring fighter vs fighter layouts, countdown timers, and ticket purchase integration.

#### Features
- **Dynamic Fighter Display**: Shows main fighter vs opponent with profile images, records, and weight classes
- **Real-time Countdown**: Automatic countdown timer to fight event with days, hours, minutes, seconds
- **Event Information**: Displays venue, date, time, and capacity information
- **Ticket Integration**: Built-in ticket purchase CTA with external link support
- **Responsive Design**: Adapts to small, medium, and large sizes
- **Boxing Color Scheme**: Uses championship gold, boxing red, and knockout black
- **Status Indicators**: Shows live, upcoming, or completed fight status
- **Accessibility**: Full WCAG 2.1 AA compliance with proper ARIA labels

#### Props Interface
```typescript
interface FightPosterCardProps {
  event: Event;                    // Fight event details
  mainFighter: Fighter;           // Main fighter information
  opponent: Fighter;              // Opponent fighter information
  size?: 'small' | 'medium' | 'large';  // Card size variant
  showCountdown?: boolean;        // Show/hide countdown timer
  showTickets?: boolean;          // Show/hide ticket CTA
  onTicketClick?: () => void;     // Ticket click handler
  className?: string;             // Additional CSS classes
}
```

#### Usage Example
```jsx
import { FightPosterCard } from '@/components/ui';

<FightPosterCard
  event={upcomingEvent}
  mainFighter={kumarPrescod}
  opponent={opponent}
  size="large"
  showCountdown={true}
  showTickets={true}
  onTicketClick={() => window.open(event.ticketUrl)}
  className="mx-auto"
/>
```

### 2. TrainingStatsWidget Component

**Path**: `/src/components/ui/TrainingStatsWidget.tsx`

An advanced performance metrics display widget showing training intensity, progress visualization, and boxing-specific analytics.

#### Features
- **Training Metrics Dashboard**: Displays total sessions, duration, streak, and progress
- **Intensity Visualization**: Color-coded intensity distribution with boxing-themed colors
- **Period Toggle**: Switch between weekly and monthly views
- **Animated Statistics**: Counter animations and progress bars
- **Training Types**: Supports all training categories (Boxing, Conditioning, Strength, etc.)
- **Progress Tracking**: Week-over-week progress comparison
- **Responsive Layout**: Compact and full size variants
- **Real-time Updates**: Automatically recalculates metrics based on session data

#### Props Interface
```typescript
interface TrainingStatsWidgetProps {
  sessions: TrainingSession[];     // Array of training sessions
  period?: 'week' | 'month';      // Display period
  className?: string;             // Additional CSS classes
  size?: 'compact' | 'full';      // Widget size variant
}
```

#### Training Intensity Colors
- **Low**: `#10B981` (Green) - Recovery sessions
- **Medium**: `#F59E0B` (Gold) - Moderate training
- **High**: `#EF4444` (Red) - Intense workouts
- **Extreme**: `#DC2626` (Boxing Red) - Maximum effort sessions

#### Usage Example
```jsx
import { TrainingStatsWidget } from '@/components/ui';

<TrainingStatsWidget
  sessions={trainingData}
  period="week"
  size="full"
  className="max-w-4xl mx-auto"
/>
```

### 3. EnhancedHeroSection Component

**Path**: `/src/components/sections/EnhancedHeroSection.tsx`

An upgraded hero section with dynamic fighter spotlight, animated fight stats, and championship achievement highlights.

#### New Features Added
- **Dynamic Fighter Spotlight**: Rotating stats display with power rating, speed index, defense rating, and conditioning
- **Animated Statistics**: Counter animations for wins, knockouts, and follower count
- **Championship Achievements**: Carousel of highlighted achievements with icons and descriptions
- **Enhanced Interactions**: Hover effects, scale animations, and micro-interactions
- **Improved CTAs**: Enhanced button styling with motion effects and boxing-themed gradients
- **Performance Optimizations**: Optimized animations and reduced motion support

#### Key Enhancements
```typescript
// New animated statistics with counters
const [animatedStats, setAnimatedStats] = useState<Record<string, number>>({});

// Dynamic fighter spotlight rotation
const [currentSpotlight, setCurrentSpotlight] = useState(0);

// Boxing-themed fighter stats
const fighterSpotlights: FighterSpotlight[] = [
  {
    statName: 'Power Rating',
    statValue: '98/100',
    description: 'Devastating knockout power in both hands',
    trend: 'up',
    color: designTokens.colors.primary.boxing_red
  }
  // ... more stats
];
```

## Design System Integration

### Color Tokens Used
```css
:root {
  --boxing-red: #DC2626;
  --championship-gold: #F59E0B;
  --knockout-black: #1F2937;
  --victory-white: #FFFFFF;
}
```

### Typography
- **Display Font**: Bebas Neue for headings and titles
- **Body Font**: Inter for body text and descriptions
- **Monospace**: JetBrains Mono for statistics and counters

### Spacing & Layout
- Follows 8px grid system from design tokens
- Responsive breakpoints: mobile (390px), tablet (768px), desktop (1024px)
- Consistent padding and margin patterns

## Animation & Motion

### Motion Principles
- **Purposeful**: Every animation serves a functional purpose
- **Boxing-Themed**: Ring movements, punch impacts, championship celebrations
- **Performance**: Optimized for 60fps with GPU acceleration
- **Accessibility**: Respects `prefers-reduced-motion` settings

### Key Animations
- **Knockout Effect**: Scale and rotation for dramatic emphasis
- **Championship Glow**: Pulsing gold glow for achievements
- **Ring Pulse**: Circular pulse animations mimicking boxing rings
- **Counter Animations**: Smooth number increments for statistics
- **Parallax Scrolling**: Background movement for depth

## Accessibility Features

### WCAG 2.1 AA Compliance
- **Color Contrast**: All text meets 4.5:1 contrast ratio minimum
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order
- **Motion Sensitivity**: Respects user motion preferences

### Semantic HTML
```jsx
// Proper heading hierarchy
<h1>Kumar "The Raw One" Prescod</h1>
<h2>Professional Record: 3-0</h2>
<h3>Championship Achievements</h3>

// Descriptive button labels
<button aria-label="Purchase tickets for upcoming fight on August 16">
  Get Tickets
</button>

// Alternative text for images
<img alt="Kumar Prescod in the boxing ring during homecoming fight promotion" />
```

## Performance Optimizations

### Bundle Size
- **Tree Shaking**: Only imports used functions from libraries
- **Code Splitting**: Lazy loading for non-critical animations
- **Asset Optimization**: Optimized images with WebP fallbacks

### Runtime Performance
- **Memoization**: React.memo for expensive components
- **Animation Optimization**: CSS transforms and opacity for GPU acceleration
- **Event Debouncing**: Throttled scroll and resize handlers

## Testing & Quality Assurance

### Component Testing
```bash
# Run component tests
npm test -- --testPathPattern=ui/

# Run accessibility tests
npm run test:a11y

# Run visual regression tests
npm run test:visual
```

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Fallbacks**: Graceful degradation for older browsers
- **Progressive Enhancement**: Core functionality works without JavaScript

## Installation & Setup

### 1. Install Dependencies
```bash
npm install framer-motion lucide-react
```

### 2. Import Styles
```jsx
// Add to your main CSS file or component
import '@/styles/boxing-components.css';
```

### 3. Import Components
```jsx
import { 
  FightPosterCard, 
  TrainingStatsWidget, 
  EnhancedHeroSection 
} from '@/components/ui';
```

### 4. Use Design Tokens
```jsx
import { designTokens } from '@/styles/design-tokens';

// Use boxing colors
const style = {
  color: designTokens.colors.primary.championship_gold,
  background: designTokens.colors.primary.boxing_red
};
```

## Development Guidelines

### Code Style
- **TypeScript**: Strict mode enabled with comprehensive type coverage
- **ESLint**: Airbnb configuration with React and accessibility rules
- **Prettier**: Consistent code formatting
- **Naming**: Descriptive component and prop names

### Component Structure
```typescript
// 1. Imports (React, libraries, local)
// 2. TypeScript interfaces
// 3. Component definition
// 4. Hooks and state
// 5. Event handlers
// 6. Render logic
// 7. Export statement
```

### Best Practices
- **Single Responsibility**: Each component has one clear purpose
- **Composition**: Build complex UIs from simple, reusable components
- **Props Interface**: Comprehensive TypeScript interfaces for all props
- **Error Boundaries**: Graceful error handling for production
- **Documentation**: JSDoc comments for all public APIs

## Contributing

### Adding New Components
1. Create component file in `/src/components/ui/`
2. Add TypeScript interfaces in `/src/types/boxing.ts`
3. Add styles to `/src/styles/boxing-components.css`
4. Export from `/src/components/ui/index.ts`
5. Add tests in `/__tests__/components/ui/`
6. Update this documentation

### Design Tokens
When adding new design elements, use existing tokens from `/src/styles/design-tokens.ts` or add new ones following the established pattern.

## Support & Maintenance

### Performance Monitoring
- Bundle size tracking with webpack-bundle-analyzer
- Runtime performance monitoring with React DevTools Profiler
- Accessibility auditing with axe-core

### Browser Testing
- Cross-browser testing with BrowserStack
- Mobile device testing on real devices
- Automated testing with Playwright

For questions, issues, or contributions, please refer to the project's main documentation or create an issue in the repository.