# Kumar Prescod Boxing - Website Hero Section Design Specifications

## Overview

The website hero section serves as the digital front door for Kumar "The Raw One" Prescod's professional boxing brand. These designs should immediately communicate his power, authenticity, and Oakland roots while driving user engagement.

## Hero Section Concepts

### Concept 1: "Dynamic Action Hero" (Recommended)

#### Layout Structure
```
Full-Width Container: 1920px max-width
Height: 100vh (minimum 600px)
Layout: Asymmetrical split with video background
```

#### Background Treatment
```
Primary Background: 
- Video loop of Kumar training (heavy bag work)
- 1920x1080px MP4, 15-30 seconds
- Subtle slow-motion effects
- Dark overlay: rgba(0,0,0,0.4)

Fallback Image:
- High-resolution action shot from training
- Same composition as video first frame
- WebP format for performance
```

#### Content Layout (Left Side - 55%)
```
Container: 
- Max-width: 800px
- Padding: 80px 60px
- Position: Center-left alignment

Text Hierarchy:
1. Pre-title: "OAKLAND'S RISING CHAMPION"
   - Font: Roboto Medium, 18px
   - Color: Championship Gold (#FFD700)
   - Letter-spacing: 2px, uppercase
   - Margin-bottom: 16px

2. Main Title: "KUMAR PRESCOD"
   - Font: Oswald ExtraBold, 96px
   - Color: White (#FFFFFF)
   - Line-height: 0.9
   - Text-shadow: 2px 2px 4px rgba(0,0,0,0.5)
   - Margin-bottom: 8px

3. Nickname: "THE RAW ONE"
   - Font: Oswald Bold, 48px
   - Color: Boxing Red (#DC143C)
   - Letter-spacing: 1px
   - Margin-bottom: 32px

4. Tagline: "Undefeated • 3 KOs • Ready for Gold"
   - Font: Roboto Regular, 24px
   - Color: rgba(255,255,255,0.9)
   - Margin-bottom: 48px
```

#### Call-to-Action Buttons
```
Primary CTA: "WATCH HIGHLIGHTS"
- Background: Boxing Red (#DC143C)
- Color: White
- Font: Roboto Bold, 18px
- Padding: 16px 32px
- Border-radius: 4px
- Hover: Darker red (#B22222)
- Margin-right: 24px

Secondary CTA: "NEXT FIGHT INFO"
- Background: Transparent
- Border: 2px solid Championship Gold
- Color: Championship Gold
- Font: Roboto Bold, 18px
- Padding: 14px 30px
- Border-radius: 4px
- Hover: Background gold, color black
```

#### Stats Component (Right Side - 45%)
```
Floating Card:
- Background: rgba(0,0,0,0.8)
- Backdrop-filter: blur(10px)
- Border: 1px solid rgba(255,215,0,0.2)
- Border-radius: 12px
- Padding: 40px
- Position: Absolute, right: 60px, top: 50%
- Transform: translateY(-50%)
- Max-width: 400px

Stats Layout:
Record: "3-0-0"
- Font: Oswald Bold, 64px
- Color: Championship Gold

KO Percentage: "100% KO RATE"
- Font: Roboto Bold, 24px
- Color: Boxing Red

Next Fight: "AUG 16 • OAKLAND"
- Font: Roboto Medium, 20px
- Color: White

Countdown Timer:
- Days, Hours, Minutes format
- Font: Roboto Mono, 18px
- Color: Championship Gold

Ticket Button:
- "GET TICKETS" 
- Full-width button
- Background: Championship Gold
- Color: Black
- Font: Roboto Bold, 16px
```

### Concept 2: "Split Screen Intensity"

#### Layout Structure
```
Container: Full-width split (50/50)
Height: 100vh minimum
No video background - high-impact photography
```

#### Left Side: Fighter Focus
```
Background: Large portrait of Kumar in fighting stance
Treatment: High contrast, dramatic lighting
Overlay: Subtle dark gradient from left

Image Requirements:
- 960x1080px minimum
- High contrast, professional boxing portrait
- Dramatic gym or ring lighting
- Focus on intensity and determination
```

#### Right Side: Content Panel
```
Background: Deep charcoal (#2D2D2D)
Texture: Subtle boxing ring canvas pattern
Accent: Vertical gold line separator (4px width)

Content Structure:
- Centered vertically and horizontally
- Max-width: 600px
- Text alignment: Left

Typography:
1. "THE" (Oswald Medium, 36px, Gold)
2. "RAW ONE" (Oswald ExtraBold, 120px, White)
3. "KUMAR PRESCOD" (Oswald Bold, 72px, Red)
4. Tagline (Roboto Regular, 24px, Light Gray)
5. CTAs (Same as Concept 1)
```

### Concept 3: "Oakland Skyline Composite"

#### Background Concept
```
Base Layer: Oakland skyline at golden hour
Fighter Layer: Kumar silhouette in foreground
Composite Effect: Fighter integrated into cityscape
Color Treatment: Enhanced gold/orange tones

Technical Requirements:
- 1920x1080px composite image
- Professional photo manipulation
- Consistent lighting between elements
- Oakland landmarks visible (Bay Bridge, downtown)
```

#### Text Overlay Treatment
```
Position: Lower third of image
Background: Dark gradient overlay
Text Treatment: Outlined text for readability

Headline: "STRAIGHT OUTTA OAKLAND"
- Font: Oswald ExtraBold, 72px
- Color: Championship Gold
- Text-stroke: 2px black outline

Subhead: "Kumar 'The Raw One' Prescod"
- Font: Oswald Bold, 48px  
- Color: White
- Text-shadow: Heavy black shadow
```

## Mobile Responsive Adaptations

### Mobile Hero (375px-768px)

#### Layout Adjustments
```
Height: 70vh (minimum 500px)
Background: Same video/image, optimized for mobile
Overlay: Increased opacity (rgba(0,0,0,0.6))

Content Changes:
- Single column layout
- Text sizes reduced by 25-30%
- Stats card repositioned below text
- CTAs stacked vertically
- Padding reduced to 24px sides

Typography Mobile:
- Main title: 64px → 48px
- Nickname: 48px → 32px
- Body text: 24px → 18px
```

### Tablet Hero (768px-1024px)

#### Layout Adjustments
```
Maintain desktop proportions
Reduce font sizes by 15%
Adjust stats card positioning
Optimize touch targets (48px minimum)
```

## Performance Optimization

### Image Optimization
```
Hero Images:
- WebP format with JPG fallback
- Multiple resolutions: 1920w, 1200w, 800w
- Lazy loading for non-critical images
- Compression: 80-85% quality

Background Video:
- H.264 encoding, high compression
- Multiple formats: MP4, WebM
- Preload metadata only
- Muted autoplay for compatibility
```

### Loading Strategy
```
Critical Path:
1. HTML structure
2. Critical CSS (above-fold styles)
3. Hero background image/video
4. Fonts (Oswald, Roboto)
5. Interactive elements

Performance Targets:
- Largest Contentful Paint: <2.5s
- First Input Delay: <100ms
- Cumulative Layout Shift: <0.1
```

## Animation & Interactions

### Entry Animations (CSS/JS)
```
Text Elements:
- Slide up with fade (0.8s ease-out)
- Staggered timing: 0.2s between elements
- Text reveals with typewriter effect for stats

Buttons:
- Scale and fade on hover (0.3s ease)
- Color transitions for state changes
- Ripple effect on click

Stats Card:
- Slide in from right (1s ease-out, 0.5s delay)
- Number counter animations for stats
- Subtle pulse effect for countdown timer
```

### Scroll Interactions
```
Parallax Effect:
- Background moves slower than content (0.5x speed)
- Text elements move at normal speed
- Subtle zoom effect on background

Scroll Indicators:
- Down arrow animation
- Progress bar for page scroll
- Fade out hero elements on scroll
```

## Accessibility Considerations

### Screen Reader Support
```
Hero Headings:
- Proper H1 hierarchy
- Alt text for background images
- ARIA labels for interactive elements

Navigation:
- Skip links to main content
- Focus management for video controls
- Keyboard navigation support
```

### Color Contrast
```
Text Contrast Ratios:
- White on dark: 21:1 (AAA)
- Gold on dark: 12:1 (AAA) 
- Red on dark: 5.7:1 (AA)

Interactive Elements:
- Focus indicators with 3:1 contrast
- Button states clearly differentiated
- Error states accessible
```

## Technical Implementation

### HTML Structure
```html
<section class="hero-section">
  <div class="hero-background">
    <video autoplay muted loop playsinline>
      <source src="hero-video.mp4" type="video/mp4">
      <source src="hero-video.webm" type="video/webm">
    </video>
    <img src="hero-fallback.webp" alt="Kumar Prescod training" class="hero-fallback">
  </div>
  
  <div class="hero-overlay"></div>
  
  <div class="hero-content">
    <div class="hero-text">
      <span class="hero-pretitle">Oakland's Rising Champion</span>
      <h1 class="hero-title">Kumar Prescod</h1>
      <h2 class="hero-nickname">The Raw One</h2>
      <p class="hero-tagline">Undefeated • 3 KOs • Ready for Gold</p>
      <div class="hero-actions">
        <button class="btn-primary">Watch Highlights</button>
        <button class="btn-secondary">Next Fight Info</button>
      </div>
    </div>
    
    <div class="hero-stats">
      <div class="stats-card">
        <div class="record">3-0-0</div>
        <div class="ko-rate">100% KO Rate</div>
        <div class="next-fight">Aug 16 • Oakland</div>
        <div class="countdown" id="fight-countdown"></div>
        <button class="btn-tickets">Get Tickets</button>
      </div>
    </div>
  </div>
</section>
```

### CSS Framework Integration
```scss
// Using Tailwind CSS classes with custom components
.hero-section {
  @apply relative w-full h-screen min-h-[600px] overflow-hidden;
}

.hero-background {
  @apply absolute inset-0 w-full h-full object-cover;
}

.hero-overlay {
  @apply absolute inset-0 bg-black bg-opacity-40;
}

// Custom responsive typography
.hero-title {
  font-family: 'Oswald', sans-serif;
  font-weight: 800;
  font-size: clamp(3rem, 6vw, 6rem);
  line-height: 0.9;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.hero-nickname {
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: clamp(1.5rem, 3vw, 3rem);
  color: #DC143C;
  letter-spacing: 1px;
}
```

## Content Management Integration

### Dynamic Content Fields
```javascript
// Hero content structure for CMS
const heroContent = {
  pretitle: "Oakland's Rising Champion",
  title: "Kumar Prescod", 
  nickname: "The Raw One",
  tagline: "Undefeated • 3 KOs • Ready for Gold",
  backgroundVideo: "/videos/kumar-training-hero.mp4",
  backgroundImage: "/images/kumar-hero-fallback.webp",
  stats: {
    record: "3-0-0",
    koRate: "100%",
    nextFight: {
      date: "2025-08-16",
      location: "Oakland",
      venue: "Oakland Arena"
    }
  },
  ctas: {
    primary: {
      text: "Watch Highlights",
      link: "/highlights"
    },
    secondary: {
      text: "Next Fight Info", 
      link: "/fights/upcoming"
    }
  }
};
```

### A/B Testing Considerations
```javascript
// Hero variant testing
const heroVariants = {
  control: "dynamic-action-hero",
  variant1: "split-screen-intensity", 
  variant2: "oakland-skyline-composite"
};

// Metrics to track
const heroMetrics = [
  "hero_cta_clicks",
  "video_play_rate", 
  "scroll_depth",
  "time_on_hero",
  "mobile_vs_desktop_engagement"
];
```

This comprehensive specification provides everything needed to create compelling, high-performance hero sections that effectively represent Kumar Prescod's brand while driving user engagement and conversions.