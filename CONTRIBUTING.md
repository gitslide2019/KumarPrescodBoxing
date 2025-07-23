# Contributing Guidelines

Thank you for your interest in contributing to the Kumar Prescod Boxing website! This document provides guidelines and information for contributors.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and professional in all interactions.

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Getting Started
1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`
5. Start development server: `npm start`

## Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces for all data structures
- Avoid `any` type - use proper typing
- Use type guards for runtime type checking
- Document complex types with JSDoc comments

### React Components
- Use functional components with hooks
- Implement proper prop interfaces
- Use compound component patterns for complex UI
- Follow atomic design methodology (atoms, molecules, organisms)
- Add proper error boundaries

### Code Style
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Write self-documenting code
- Add JSDoc comments for public APIs
- Keep functions small and focused

### File Organization
```
ComponentName/
├── index.ts              # Main export
├── ComponentName.tsx     # Component implementation
├── ComponentName.test.tsx # Component tests
├── ComponentName.types.ts # Component types
└── subcomponents/        # Related subcomponents
```

### Import Organization
```typescript
// External libraries
import React from 'react';
import { motion } from 'framer-motion';

// Internal utilities
import { formatDate } from '@/utils/formatters';

// Components
import Button from '@/components/common/Button';

// Types
import type { ComponentProps } from './ComponentName.types';
```

## Testing

### Unit Tests
- Write tests for all components
- Test component behavior, not implementation
- Use React Testing Library
- Aim for >80% code coverage

### Integration Tests
- Test user workflows
- Test API integrations
- Use MSW for API mocking

### Accessibility Tests
- Test keyboard navigation
- Test screen reader compatibility
- Verify color contrast
- Test with accessibility tools

## Git Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages
Follow conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add social login functionality
fix(gallery): resolve image loading issue
docs(readme): update installation instructions
```

### Pull Request Process

1. **Before Creating PR**
   - Ensure all tests pass: `npm test`
   - Run linting: `npm run lint`
   - Format code: `npm run format`
   - Update documentation if needed

2. **PR Description**
   - Describe what changes were made
   - Explain why the changes were necessary
   - Include screenshots for UI changes
   - Reference related issues

3. **Review Process**
   - All PRs require at least one review
   - Address all review comments
   - Ensure CI checks pass
   - Squash commits before merging

## Component Development

### Component Template
```typescript
import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

import type { ComponentNameProps } from './ComponentName.types';

/**
 * ComponentName - Brief description of what this component does
 * 
 * @param props - Component props
 * @returns JSX element
 */
const ComponentName: React.FC<ComponentNameProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  return (
    <motion.div
      className={clsx(
        'base-styles',
        {
          'variant-styles': variant === 'special',
        },
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ComponentName;
```

### Props Interface Template
```typescript
import type { ReactNode, HTMLAttributes } from 'react';

export interface ComponentNameProps extends HTMLAttributes<HTMLDivElement> {
  /** Content to be rendered inside the component */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Component variant */
  variant?: 'default' | 'special';
  /** Whether the component is disabled */
  disabled?: boolean;
}
```

## Accessibility Guidelines

### Requirements
- All interactive elements must be keyboard accessible
- Proper ARIA labels and roles
- Sufficient color contrast (4.5:1 for normal text)
- Semantic HTML structure
- Screen reader compatibility

### Testing
- Test with keyboard navigation only
- Use screen reader (NVDA, JAWS, VoiceOver)
- Run automated accessibility tests
- Verify with accessibility browser extensions

## Performance Guidelines

### Image Optimization
- Use WebP/AVIF formats when possible
- Implement lazy loading
- Provide appropriate alt text
- Use responsive images with srcSet

### Code Splitting
- Implement route-based code splitting
- Use React.lazy for heavy components
- Optimize bundle size

### State Management
- Use React Query for server state
- Minimize context re-renders
- Implement proper memoization

## Documentation

### JSDoc Comments
```typescript
/**
 * Formats a date string for display
 * 
 * @param date - The date to format
 * @param format - The desired format
 * @returns Formatted date string
 * 
 * @example
 * ```typescript
 * const formatted = formatDate('2023-12-25', 'MMM dd, yyyy');
 * // Returns: "Dec 25, 2023"
 * ```
 */
export function formatDate(date: string, format: string): string {
  // Implementation
}
```

### Component Documentation
- Document all props with descriptions
- Provide usage examples
- Include accessibility notes
- Document any special behaviors

## Release Process

### Version Numbering
We follow semantic versioning (semver):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Performance impact assessed
- [ ] Accessibility verified
- [ ] Security review completed
- [ ] Changelog updated

## Getting Help

### Resources
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Testing Library Documentation](https://testing-library.com/docs)

### Communication
- Create GitHub issues for bugs or feature requests
- Use discussions for questions
- Tag maintainers for urgent issues

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Kumar Prescod's boxing website! 🥊