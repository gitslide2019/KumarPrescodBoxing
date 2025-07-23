# Component Template

This document provides templates and guidelines for creating consistent React components in the Kumar Prescod Boxing website.

## Component Structure

### File Organization
```
ComponentName/
├── index.ts              # Main export
├── ComponentName.tsx     # Component implementation
├── ComponentName.test.tsx # Component tests
├── ComponentName.types.ts # Component types
├── ComponentName.stories.tsx # Storybook stories (optional)
└── subcomponents/        # Related subcomponents
```

## Component Template

### Basic Component Template

```typescript
// ComponentName.tsx
import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

import type { ComponentNameProps } from './ComponentName.types';

/**
 * ComponentName - Brief description of what this component does
 * 
 * This component provides [detailed description of functionality].
 * It supports [list key features].
 * 
 * @param props - Component props
 * @returns JSX element
 * 
 * @example
 * ```tsx
 * <ComponentName variant="primary" onClick={handleClick}>
 *   Content goes here
 * </ComponentName>
 * ```
 */
const ComponentName: React.FC<ComponentNameProps> = ({
  children,
  className,
  variant = 'default',
  disabled = false,
  onClick,
  ...props
}) => {
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    onClick?.(event);
  };

  return (
    <motion.div
      className={clsx(
        // Base styles
        'relative inline-flex items-center justify-center',
        'font-medium transition-colors duration-200',
        
        // Variant styles
        {
          'bg-primary-600 text-white hover:bg-primary-700': variant === 'primary',
          'bg-secondary-600 text-white hover:bg-secondary-700': variant === 'secondary',
          'bg-transparent border border-gray-300 hover:bg-gray-50': variant === 'outline',
        },
        
        // State styles
        {
          'opacity-50 cursor-not-allowed': disabled,
          'cursor-pointer': !disabled,
        },
        
        className
      )}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ComponentName;
```

### Types Template

```typescript
// ComponentName.types.ts
import type { ReactNode, HTMLAttributes, MouseEvent } from 'react';

/**
 * Props for the ComponentName component
 */
export interface ComponentNameProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** Content to be rendered inside the component */
  children: ReactNode;
  
  /** Additional CSS classes to apply */
  className?: string;
  
  /** Visual variant of the component */
  variant?: 'default' | 'primary' | 'secondary' | 'outline';
  
  /** Whether the component is disabled */
  disabled?: boolean;
  
  /** Click handler function */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  
  /** Accessibility label for screen readers */
  'aria-label'?: string;
}

/**
 * Variant configuration for styling
 */
export type ComponentVariant = ComponentNameProps['variant'];

/**
 * Component state interface
 */
export interface ComponentState {
  isLoading: boolean;
  isActive: boolean;
  error?: string;
}
```

### Index File Template

```typescript
// index.ts
export { default } from './ComponentName';
export type { ComponentNameProps, ComponentVariant } from './ComponentName.types';
```

### Test Template

```typescript
// ComponentName.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import ComponentName from './ComponentName';
import type { ComponentNameProps } from './ComponentName.types';

// Test utilities
const defaultProps: ComponentNameProps = {
  children: 'Test Content',
};

const renderComponent = (props: Partial<ComponentNameProps> = {}) => {
  return render(<ComponentName {...defaultProps} {...props} />);
};

describe('ComponentName', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      renderComponent();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const customClass = 'custom-class';
      renderComponent({ className: customClass });
      
      const element = screen.getByText('Test Content');
      expect(element).toHaveClass(customClass);
    });

    it('renders with default variant', () => {
      renderComponent();
      const element = screen.getByText('Test Content');
      expect(element).toHaveClass('bg-transparent');
    });

    it('renders with primary variant', () => {
      renderComponent({ variant: 'primary' });
      const element = screen.getByText('Test Content');
      expect(element).toHaveClass('bg-primary-600');
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      renderComponent({ onClick: handleClick });
      
      fireEvent.click(screen.getByText('Test Content'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn();
      renderComponent({ onClick: handleClick, disabled: true });
      
      fireEvent.click(screen.getByText('Test Content'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies disabled styles when disabled', () => {
      renderComponent({ disabled: true });
      const element = screen.getByText('Test Content');
      expect(element).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      const ariaLabel = 'Test button';
      renderComponent({ 'aria-label': ariaLabel });
      
      const element = screen.getByLabelText(ariaLabel);
      expect(element).toBeInTheDocument();
    });

    it('is keyboard accessible', () => {
      const handleClick = vi.fn();
      renderComponent({ onClick: handleClick });
      
      const element = screen.getByText('Test Content');
      element.focus();
      fireEvent.keyDown(element, { key: 'Enter' });
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
```

## Compound Component Template

For complex components that need multiple sub-components:

```typescript
// Gallery.tsx
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Context for sharing state between compound components
interface GalleryContextValue {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  images: string[];
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

const useGalleryContext = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('Gallery compound components must be used within Gallery');
  }
  return context;
};

// Main Gallery component
interface GalleryProps {
  children: ReactNode;
  images: string[];
  defaultIndex?: number;
}

const Gallery: React.FC<GalleryProps> & {
  Item: typeof GalleryItem;
  Controls: typeof GalleryControls;
  Lightbox: typeof GalleryLightbox;
} = ({ children, images, defaultIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(defaultIndex);

  return (
    <GalleryContext.Provider value={{ currentIndex, setCurrentIndex, images }}>
      <div className="gallery">
        {children}
      </div>
    </GalleryContext.Provider>
  );
};

// Sub-components
const GalleryItem: React.FC<{ src: string; alt: string; index: number }> = ({
  src,
  alt,
  index,
}) => {
  const { setCurrentIndex } = useGalleryContext();

  return (
    <img
      src={src}
      alt={alt}
      onClick={() => setCurrentIndex(index)}
      className="cursor-pointer hover:opacity-80 transition-opacity"
    />
  );
};

const GalleryControls: React.FC = () => {
  const { currentIndex, setCurrentIndex, images } = useGalleryContext();

  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
        disabled={currentIndex === 0}
      >
        Previous
      </button>
      <button
        onClick={() => setCurrentIndex(Math.min(images.length - 1, currentIndex + 1))}
        disabled={currentIndex === images.length - 1}
      >
        Next
      </button>
    </div>
  );
};

const GalleryLightbox: React.FC = () => {
  const { currentIndex, images } = useGalleryContext();

  return (
    <div className="lightbox">
      <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} />
    </div>
  );
};

// Attach sub-components
Gallery.Item = GalleryItem;
Gallery.Controls = GalleryControls;
Gallery.Lightbox = GalleryLightbox;

export default Gallery;
```

## Hook Template

```typescript
// useCustomHook.ts
import { useState, useEffect, useCallback } from 'react';

interface UseCustomHookOptions {
  initialValue?: string;
  onSuccess?: (data: string) => void;
  onError?: (error: Error) => void;
}

interface UseCustomHookReturn {
  data: string | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom hook for [description]
 * 
 * @param options - Hook configuration options
 * @returns Hook state and methods
 * 
 * @example
 * ```typescript
 * const { data, loading, error, refetch } = useCustomHook({
 *   initialValue: 'default',
 *   onSuccess: (data) => console.log('Success:', data),
 * });
 * ```
 */
export const useCustomHook = (options: UseCustomHookOptions = {}): UseCustomHookReturn => {
  const { initialValue = '', onSuccess, onError } = options;
  
  const [data, setData] = useState<string | null>(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      const response = await fetch('/api/data');
      const result = await response.text();
      
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
```

## Best Practices

### Component Design
1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition over Inheritance**: Use composition patterns for flexibility
3. **Props Interface**: Always define clear TypeScript interfaces
4. **Default Props**: Provide sensible defaults for optional props
5. **Error Boundaries**: Wrap components that might fail

### Performance
1. **Memoization**: Use React.memo for expensive components
2. **Lazy Loading**: Implement code splitting for large components
3. **Avoid Inline Objects**: Don't create objects in render methods
4. **Optimize Re-renders**: Use useCallback and useMemo appropriately

### Accessibility
1. **Semantic HTML**: Use appropriate HTML elements
2. **ARIA Labels**: Provide descriptive labels for screen readers
3. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
4. **Focus Management**: Handle focus states properly
5. **Color Contrast**: Ensure sufficient contrast ratios

### Testing
1. **Test Behavior**: Test what the component does, not how it does it
2. **User Interactions**: Test from the user's perspective
3. **Edge Cases**: Test error states and boundary conditions
4. **Accessibility**: Include accessibility tests in your test suite

This template provides a solid foundation for creating consistent, maintainable, and accessible React components.