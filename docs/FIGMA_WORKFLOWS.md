# Figma MCP Design-to-Code Workflows

## Overview
This document outlines optimized workflows for converting Figma designs to React TypeScript components for the Kumar Prescod Boxing website using the Figma MCP server.

## Prerequisites ✅
- Figma Desktop app running
- Dev Mode MCP server enabled (`http://127.0.0.1:3845/sse`)
- Claude Code with MCP server access
- Boxing website design files accessible in Figma

## Boxing-Specific Component Workflows

### 1. Fighter Profile Components

#### From Figma to React
```bash
# Extract fighter card component
"Extract the FighterCard component from Figma with all variants (small, medium, large) and generate TypeScript React component with proper props interface"

# Generate with boxing design tokens
"Create FighterCard component using boxing design tokens for colors, typography, and spacing. Include win/loss status indicators and achievement badges."
```

**Expected Output:**
- `src/components/boxing/FighterCard.tsx`
- TypeScript interface matching `FighterCardProps`
- Tailwind classes using boxing design tokens
- Responsive design with mobile-first approach

#### Figma Component Requirements
- Named variants: `Size=Small/Medium/Large`
- Auto-layout with proper spacing
- Component instances for: profile image, name, record, achievements
- Status indicators using semantic colors

### 2. Fight Promotion Components

#### Fight Poster Generation
```bash
# Extract fight poster design
"Convert the fight poster design from Figma to a FightPoster React component. Include countdown timer, fighter images, venue info, and ticket purchase CTA."

# Generate responsive variants
"Create responsive FightPoster component with mobile (390px), tablet (768px), and desktop (1024px) breakpoints using Tailwind responsive classes."
```

**Component Structure:**
```tsx
interface FightPosterProps {
  fight: Fight;
  showCountdown?: boolean;
  showTickets?: boolean;
  variant?: 'hero' | 'card' | 'minimal';
}
```

#### Fight Card Layout
```bash
# Extract fight card component
"Generate FightCard component from Figma design with horizontal and vertical layout variants. Include fighter photos, records, and event details."
```

### 3. Training Content Components

#### Training Grid
```bash
# Generate training session grid
"Create TrainingGrid component from Figma design. Include filter options, session cards, and progress indicators. Use boxing-specific colors for training intensity levels."
```

#### Progress Visualization
```bash
# Extract progress charts
"Convert progress chart designs to React components using Chart.js or similar library. Include training metrics, weight tracking, and performance indicators."
```

### 4. E-commerce Components

#### Ticket Purchase Flow
```bash
# Generate ticket components
"Create ticket purchase components from Figma designs. Include pricing tiers, seat selection, and checkout flow. Integrate with Stripe payment processing."
```

#### Merchandise Grid
```bash
# Extract merchandise layouts
"Generate MerchandiseGrid component with product cards, filtering, and shopping cart integration. Use boxing brand colors and spacing."
```

## Design System Integration

### Extracting Design Tokens
```bash
# Update design tokens from Figma
"Analyze the Figma design system and update the design-tokens.ts file with any new colors, typography, or spacing values. Ensure consistency with Tailwind configuration."

# Sync component library
"Review all Figma components and update the TypeScript interfaces in boxing.ts to match the current design system structure."
```

### Color Palette Extraction
```bash
# Extract brand colors
"Get all color tokens from the Figma design system and map them to the boxing color palette in design-tokens.ts. Include semantic colors for win/loss status."

# Generate Tailwind classes
"Create Tailwind utility classes for all boxing-specific colors: boxing-red, championship-gold, knockout-black, and semantic status colors."
```

## Component Generation Best Practices

### 1. Naming Conventions
- **Components**: PascalCase (`FighterCard`, `FightPoster`)
- **Props**: camelCase (`showCountdown`, `variant`)
- **Files**: kebab-case (`fighter-card.tsx`)
- **CSS Classes**: Tailwind utilities with boxing prefixes

### 2. TypeScript Integration
```bash
# Generate with proper types
"Create component with full TypeScript support including props interface, event handlers, and proper type imports from boxing.ts"

# Add JSDoc comments
"Include comprehensive JSDoc comments for all props and component functionality"
```

### 3. Accessibility Standards
```bash
# WCAG compliance
"Ensure component meets WCAG 2.1 AA standards with proper ARIA labels, keyboard navigation, and semantic HTML structure"

# Screen reader support
"Add appropriate alt text for images, ARIA descriptions for interactive elements, and proper heading hierarchy"
```

### 4. Performance Optimization
```bash
# Optimize images
"Generate optimized image components with lazy loading, responsive sizes, and WebP format support for boxing media assets"

# Code splitting
"Create components with dynamic imports for large components like video players or complex interactive elements"
```

## Responsive Design Workflows

### Mobile-First Approach
```bash
# Generate responsive component
"Create component with mobile-first responsive design using Tailwind breakpoints: mobile (390px), tablet (768px), desktop (1024px), wide (1440px)"

# Test responsiveness
"Generate component with proper responsive behavior for images, typography, and layout spacing across all boxing website breakpoints"
```

### Breakpoint-Specific Variants
```bash
# Desktop hero sections
"Generate large hero components for desktop with full-width backgrounds, prominent fighter images, and dramatic typography"

# Mobile cards
"Create compact card variants for mobile with stacked layouts, smaller images, and touch-friendly interactive elements"
```

## Animation Integration

### Boxing-Themed Animations
```bash
# Add entrance animations
"Generate component with boxing-entrance animation using the design token timing values for dramatic reveals"

# Impact effects
"Create interactive elements with punch-impact animation for buttons, cards, and call-to-action elements"

# Championship effects
"Add championship-pulse animation for achievement badges, title displays, and victory announcements"
```

## Advanced Workflows

### Multi-Component Systems
```bash
# Generate component system
"Create related component family from Figma: FighterCard, FighterGrid, FighterProfile, and FighterComparison with consistent design language"

# Design system validation
"Ensure all generated components use consistent spacing, typography, and color values from the boxing design token system"
```

### State Management Integration
```bash
# Add state handling
"Generate component with proper state management for interactive elements like favorites, sharing, and user preferences"

# Context integration
"Create components that integrate with AuthContext, FundingContext, and CommunityContext for user-specific features"
```

## Quality Assurance Checklist

### Pre-Generation Checklist
- [ ] Figma component has proper naming and variants
- [ ] Auto-layout is configured correctly
- [ ] Design tokens are consistent across components
- [ ] All text styles use defined typography system
- [ ] Images have proper constraints and aspect ratios

### Post-Generation Validation
- [ ] TypeScript compiles without errors
- [ ] Component props match expected interface
- [ ] Responsive behavior works across breakpoints
- [ ] Accessibility standards are met
- [ ] Performance is optimized (lazy loading, etc.)
- [ ] Boxing design tokens are used consistently

## Troubleshooting

### Common Issues

#### Component Not Extracting
1. Ensure Figma component is properly named
2. Check that component uses auto-layout
3. Verify MCP server connection (`http://127.0.0.1:3845/sse`)
4. Try refreshing Figma desktop app

#### Type Errors in Generated Code
1. Check that interfaces exist in `boxing.ts`
2. Verify import paths are correct
3. Ensure design tokens are properly typed

#### Styling Issues
1. Confirm Tailwind config includes design tokens
2. Check that CSS classes are valid
3. Verify responsive breakpoints match design

### Debug Commands
```bash
# Test MCP connection
"Can you access my Figma files through the MCP server?"

# Validate design tokens
"Show me the current color palette from my Figma design system"

# Component verification
"List all available components in my boxing website Figma file"
```

## Example Commands

### Complete Component Generation
```bash
# Full fighter card workflow
"Extract the FighterCard component from Figma, generate TypeScript React component with props interface, add boxing design tokens for styling, include responsive variants, and add accessibility attributes for WCAG compliance"

# Fight poster with animation
"Create FightPoster component from Figma with countdown timer, add boxing-entrance animation, include responsive design for mobile/tablet/desktop, and integrate with ticket purchase system"
```

### Design System Updates
```bash
# Sync entire design system
"Review my Figma design system, update design-tokens.ts with any new values, sync Tailwind configuration, and update TypeScript interfaces to match current component structure"
```

This workflow system ensures consistent, high-quality component generation from Figma designs to production-ready React TypeScript code for the Kumar Prescod Boxing website.