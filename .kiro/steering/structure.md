# Project Structure & Organization

## Directory Structure

```
src/
├── components/       # Reusable UI components
│   ├── auth/         # Authentication related components
│   ├── common/       # Shared utility components
│   ├── community/    # Community section components
│   ├── fights/       # Fight-related components
│   ├── funding/      # Sponsorship and funding components
│   ├── layout/       # Layout components (header, footer, etc.)
│   └── sections/     # Page section components
├── content/          # Static content and data
│   ├── blog/         # Blog posts and articles
│   ├── fights/       # Fight data (results, upcoming)
│   └── news/         # News articles and updates
├── contexts/         # React Context providers
├── hooks/            # Custom React hooks
├── pages/            # Page components
│   ├── admin/        # Admin dashboard pages
│   └── member/       # Member-only pages
├── utils/            # Utility functions
├── App.tsx           # Main application component
└── index.tsx         # Application entry point
```

## Media Organization

```
public/
├── audio/            # Audio files (podcasts, interviews)
├── documents/        # PDFs and other documents
├── fights/           # Fight-specific assets
├── images/           # Image assets by category
│   ├── community/    # Community event images
│   ├── exclusive/    # Member-only images
│   ├── fights/       # Fight photos
│   ├── gallery/      # General photo gallery
│   ├── portraits/    # Portrait photos
│   ├── sponsors/     # Sponsor logos and materials
│   └── training/     # Training photos
└── videos/           # Video content
```

## Naming Conventions

### Files & Components
- **Components**: PascalCase (e.g., `HeroSection.tsx`)
- **Utilities**: camelCase (e.g., `imageUtils.ts`)
- **Contexts**: PascalCase with Context suffix (e.g., `AnalyticsContext.tsx`)
- **Hooks**: camelCase with use prefix (e.g., `useScrollAnimation.ts`)

### CSS Classes
- Follow Tailwind CSS conventions
- Use descriptive class names for custom classes
- Prefer composition over inheritance

## Component Structure
- Functional components with TypeScript interfaces
- Props defined at the top of the file
- Context usage via custom hooks
- Event handlers defined before return statement
- JSX with semantic HTML elements

## State Management
- React Context API for global state
- Component state for local UI state
- Props for component communication
- Custom hooks for reusable stateful logic

## Code Organization Principles
1. Group by feature when possible
2. Keep components focused and single-purpose
3. Extract reusable logic to custom hooks
4. Maintain consistent file structure within directories
5. Keep related files close together