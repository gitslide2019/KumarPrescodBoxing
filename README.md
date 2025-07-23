# Kumar Prescod Boxing Website

Official website for Kumar Prescod, an 18-year-old professional boxer from Oakland, CA.

## Overview

This website serves as a comprehensive platform for fans, sponsors, and the boxing community to engage with Kumar's career. It features user engagement metrics, ticket sales, merchandise shop, social media integration, podcast section, boxer's journey timeline, sponsor packages, and community engagement features.

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom configuration
- **Routing**: React Router v6
- **State Management**: React Context API + React Query
- **Animation**: Framer Motion
- **Authentication**: Firebase
- **Analytics**: Google Analytics 4, Facebook Pixel
- **Payments**: Stripe
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account (for authentication and data)
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kumar-prescod-boxing
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in the required environment variables:
- `REACT_APP_GA_MEASUREMENT_ID`: Google Analytics 4 ID
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`: Stripe public key
- `REACT_APP_FIREBASE_CONFIG`: Firebase configuration

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Project Structure

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

## Available Scripts

### Development
```bash
npm start          # Start development server
npm test           # Run tests
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run format     # Format code with Prettier
```

### Production
```bash
npm run build      # Build for production
npm run serve      # Serve production build locally
```

## Features

### Core Features
- **User Engagement Metrics**: Analytics tracking with Google Analytics 4
- **Ticket Sales**: Event management and ticket purchasing system
- **Merchandise Shop**: E-commerce functionality with product catalog
- **Social Media Integration**: Multi-platform social media feeds and sharing
- **Podcast Section**: Audio content management and playback
- **Boxer's Journey**: Interactive timeline and career progression
- **Sponsor Packages**: Partnership opportunities and sponsorship tiers
- **Community Engagement**: Youth programs, charity events, and mentorship
- **Training Progress Tracker**: Comprehensive training data visualization and tracking

### Target Audience
- Boxing fans and enthusiasts
- Potential sponsors and partners
- Media and press
- Community members and youth
- Event attendees and ticket purchasers

## Brand Identity

- **Colors**: Red (primary), Slate (secondary), Gold (accents)
- **Tone**: Professional, inspiring, community-focused
- **Values**: Excellence, authenticity, community, perseverance

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error boundaries
- Write comprehensive tests
- Follow accessibility guidelines (WCAG 2.1 AA)

### Component Structure
- Use compound component patterns for complex UI
- Implement proper TypeScript interfaces
- Add JSDoc comments for documentation
- Follow atomic design methodology

### State Management
- Use React Context for global state
- Implement React Query for server state
- Use local state for component-specific data
- Follow immutable update patterns

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Accessibility Tests
```bash
npm run test:a11y
```

## Deployment

The application is deployed using modern CI/CD practices:

1. **Staging**: Automatic deployment on pull requests
2. **Production**: Manual deployment after review
3. **Monitoring**: Real-time error tracking and performance monitoring

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Review Process
- All changes require peer review
- Automated tests must pass
- Code must meet accessibility standards
- Performance impact must be considered

## Browser Support

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- IE not supported

## Performance

- Target Core Web Vitals scores:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
- Image optimization with WebP/AVIF support
- Code splitting and lazy loading
- Service worker for caching

## Security

- Content Security Policy implemented
- XSS protection enabled
- Secure authentication with Firebase
- Regular dependency updates
- Security scanning in CI/CD

## License

This project is proprietary and confidential.

## Contact

For questions or support, please contact the development team.

---

Built with ❤️ for Kumar Prescod's boxing journey.