# Technical Stack & Build System

## Core Technologies
- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom configuration
- **Routing**: React Router v6
- **State Management**: React Context API
- **Animation**: Framer Motion
- **Data Fetching**: React Query
- **Icons**: Lucide React, Heroicons

## Key Dependencies
- **UI Components**: @headlessui/react
- **Analytics**: react-ga4, react-facebook-pixel
- **Media**: react-player, react-youtube
- **Payments**: stripe, @stripe/stripe-js, @stripe/react-stripe-js
- **Authentication**: firebase, react-firebase-hooks
- **Utilities**: date-fns, clsx, class-variance-authority
- **Social Media**: react-share, react-twitter-embed

## Build System
- **Package Manager**: npm
- **Build Tool**: Create React App (react-scripts)
- **CSS Processing**: PostCSS with Autoprefixer
- **TypeScript**: Version 4.9+

## Common Commands

### Development
```bash
# Start development server
npm start

# Run tests
npm test
```

### Production
```bash
# Build for production
npm run build

# Serve production build locally
npx serve -s build
```

### Code Quality
```bash
# Lint code
npx eslint src

# Format code
npx prettier --write "src/**/*.{ts,tsx}"
```

## Environment Variables
- `REACT_APP_GA_MEASUREMENT_ID`: Google Analytics 4 ID
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`: Stripe public key
- `REACT_APP_FIREBASE_CONFIG`: Firebase configuration

## Browser Support
- Modern evergreen browsers
- Mobile browsers
- IE not supported