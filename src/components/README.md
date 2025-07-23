# Kumar Prescod Boxing Website Components

This directory contains production-ready React/TypeScript components designed specifically for the Kumar Prescod Boxing website. All components feature modern React patterns, accessibility compliance, responsive design, and boxing-themed styling.

## 🥊 Core Components

### FighterCard
**Location:** `./fighter/FighterCard.tsx`

Displays fighter profiles with comprehensive stats, records, and biographical information.

```typescript
import { FighterCard } from '../components';

<FighterCard
  fighter={kumarProfile}
  size="large"
  showRecord={true}
  showAchievements={true}
  onClick={() => router.push('/about')}
  variant="profile"
/>
```

**Features:**
- 3 size variants (small, medium, large)
- Interactive hover effects with corner accents
- Knockout percentage calculations
- Physical stats display (height, weight, reach, stance)
- Achievement highlights
- Responsive grid layouts
- ARIA accessibility labels

**Props:**
- `fighter`: Fighter object with stats and bio
- `size`: Display size variant
- `showRecord`: Toggle professional record display
- `showAchievements`: Toggle achievements section
- `onClick`: Navigation callback
- `variant`: Style variant (profile, opponent, minimal)

---

### FightRecord
**Location:** `./fights/FightRecord.tsx`

Comprehensive fight history display with opponent details and results visualization.

```typescript
import { FightRecord } from '../components';

<FightRecord
  fights={professionalFights}
  title="Professional Record"
  showOpponentDetails={true}
  showVenue={true}
  layout="timeline"
  onFightClick={(fight) => setSelectedFight(fight)}
/>
```

**Features:**
- Multiple layout options (list, grid, timeline)
- Opponent profile integration
- Result color coding (win/loss/draw)
- Fight method highlighting (KO, TKO, Decision)
- Venue and date information
- Highlight video integration
- Loading states with spinners
- Image error handling with fallbacks

**Props:**
- `fights`: Array of Fight objects
- `layout`: Display layout variant
- `showOpponentDetails`: Toggle opponent info
- `showVenue`: Toggle venue information
- `onFightClick`: Fight selection callback

---

### TrainingGrid
**Location:** `./training/TrainingGrid.tsx`

Interactive training session display with filtering and media integration.

```typescript
import { TrainingGrid } from '../components';

<TrainingGrid
  sessions={recentTrainingSessions}
  period="month"
  showFilters={true}
  onSessionClick={(session) => openTrainingModal(session)}
/>
```

**Features:**
- Advanced filtering by type and intensity
- Media gallery integration (images/videos)
- Exercise breakdown with sets/reps/weights
- Intensity color coding
- Training type icons
- Responsive card layouts
- Lazy loading for performance
- Session notes and highlights

**Props:**
- `sessions`: Array of TrainingSession objects
- `period`: Time period filter
- `showFilters`: Toggle filter controls
- `onSessionClick`: Session detail callback

---

### NewsArticle
**Location:** `./news/NewsArticle.tsx`

Rich blog post component with markdown support and boxing-themed styling.

```typescript
import { NewsArticle } from '../components';

<NewsArticle
  article={newsArticles[0]}
  variant="card"
  showAuthor={true}
  showTags={true}
  showReadTime={true}
  onTagClick={(tag) => filterByTag(tag)}
  onArticleClick={(article) => router.push(`/news/${article.slug}`)}
/>
```

**Features:**
- Multiple display variants (full, preview, card)
- Markdown content parsing
- Category color coding with icons
- Tag filtering integration
- Social sharing buttons
- Featured article highlighting
- Read time calculations
- Author attribution
- SEO-optimized markup

**Props:**
- `article`: NewsArticle object
- `variant`: Display variant
- `showAuthor`: Toggle author display
- `showTags`: Toggle tag display
- `onTagClick`: Tag filter callback
- `onArticleClick`: Article navigation callback

---

### StatsWidget
**Location:** `./stats/StatsWidget.tsx`

Animated performance metrics display with visual indicators and trend analysis.

```typescript
import { StatsWidget } from '../components';

const fighterStats = [
  { label: 'Power Rating', value: 95, icon: '💥', color: 'red', format: 'number' },
  { label: 'Speed Rating', value: 88, icon: '⚡', color: 'yellow', format: 'number' },
  { label: 'Accuracy', value: 71, icon: '🎯', color: 'blue', format: 'percentage' }
];

<StatsWidget
  title="Performance Metrics"
  stats={fighterStats}
  record={kumarProfile.record}
  layout="grid"
  size="medium"
  animated={true}
  variant="fighter"
/>
```

**Features:**
- Animated counter effects with Intersection Observer
- Multiple layout options (grid, horizontal, vertical)
- Color-coded statistics with visual indicators
- Trend analysis with change indicators
- Performance breakdown calculations
- Professional record integration
- Responsive sizing options
- Format options (number, percentage, time, currency)

**Props:**
- `stats`: Array of StatItem objects
- `record`: Optional FightRecord for additional stats
- `layout`: Display layout
- `animated`: Enable counter animations
- `variant`: Visual theme (fighter, performance, training, financial)

## 🎨 Styling and Theming

All components use a consistent boxing-themed design system:

### Color Palette
- **Primary Red:** `#DC2626` (Tailwind red-600)
- **Secondary Black:** `#000000`
- **Accent Gold:** `#FCD34D` (Tailwind yellow-400)
- **Text Light:** `#F9FAFB` (Tailwind gray-50)
- **Text Dark:** `#374151` (Tailwind gray-700)

### Typography
- **Headings:** Bold, high contrast
- **Body:** Clean, readable with proper line-height
- **Stats:** Prominent, color-coded numerics

### Visual Effects
- **Gradients:** Subtle dark-to-black backgrounds
- **Borders:** Red accent borders with hover effects
- **Shadows:** Elevated card appearances
- **Animations:** Smooth transitions and hover states

## 📱 Responsive Design

All components are fully responsive with mobile-first design:

### Breakpoints
- **Mobile:** 320px - 768px
- **Tablet:** 768px - 1024px  
- **Desktop:** 1024px+

### Grid Systems
- **Mobile:** Single column layouts
- **Tablet:** 2-column grids
- **Desktop:** 3-4 column grids

## ♿ Accessibility Features

### ARIA Support
- Proper semantic HTML structure
- ARIA labels and descriptions
- Role attributes for interactive elements
- Screen reader compatibility

### Keyboard Navigation
- Tab order management
- Enter/Space key handlers
- Focus indicators
- Skip links where appropriate

### Visual Accessibility
- High contrast color ratios (WCAG AA compliant)
- Alternative text for images
- Scalable font sizes
- Color-blind friendly indicators

## 🚀 Performance Optimizations

### Image Handling
- **OptimizedImage component:** Lazy loading, WebP support, fallbacks
- **Responsive images:** Multiple sizes for different breakpoints
- **Error handling:** Graceful fallbacks for missing images

### Code Splitting
- **Lazy imports:** Components loaded on demand
- **Bundle optimization:** Minimal initial load size
- **Tree shaking:** Unused code elimination

### Memory Management
- **Cleanup functions:** Event listeners and timers
- **Ref management:** Proper DOM reference handling
- **State optimization:** Minimal re-renders

## 🧪 Usage Examples

### Homepage Hero Section
```typescript
import { FighterCard, StatsWidget, CountdownTimer } from '../components';

function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <FighterCard
        fighter={kumarProfile}
        size="large"
        variant="profile"
        className="mb-8"
      />
      
      <StatsWidget
        title="Career Highlights"
        stats={careerStats}
        record={kumarProfile.record}
        animated={true}
        className="mb-8"
      />
      
      <CountdownTimer
        targetDate="2025-08-16"
        title="Homecoming Fight"
        className="text-center"
      />
    </div>
  );
}
```

### Fight History Page
```typescript
import { FightRecord, NewsArticle } from '../components';

function FightsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <FightRecord
        fights={professionalFights}
        layout="timeline"
        showOpponentDetails={true}
        onFightClick={handleFightClick}
        className="mb-12"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fightRecaps.map(article => (
          <NewsArticle
            key={article.id}
            article={article}
            variant="card"
            onArticleClick={handleArticleClick}
          />
        ))}
      </div>
    </div>
  );
}
```

### Training Dashboard
```typescript
import { TrainingGrid, StatsWidget } from '../components';

function TrainingPage() {
  return (
    <div className="space-y-8">
      <StatsWidget
        title="Training Metrics"
        stats={trainingStats}
        variant="training"
        layout="horizontal"
        animated={true}
      />
      
      <TrainingGrid
        sessions={recentTrainingSessions}
        showFilters={true}
        onSessionClick={handleSessionClick}
      />
    </div>
  );
}
```

## 🔧 Development Notes

### TypeScript Integration
All components are fully typed with comprehensive interfaces and proper error handling.

### Testing Support
Components are designed for easy testing with proper data attributes and stable selectors.

### Customization
Easy theme customization through CSS custom properties and component props.

### State Management
Compatible with Redux, Zustand, or React Context for global state needs.

## 📚 Related Documentation

- [Data Structures](../data/README.md) - Fighter profiles and fight records
- [Types](../types/boxing.ts) - TypeScript interfaces
- [Hooks](../hooks/README.md) - Custom React hooks
- [Styles](../styles/README.md) - Design system and tokens

For additional support or feature requests, please refer to the main project documentation.