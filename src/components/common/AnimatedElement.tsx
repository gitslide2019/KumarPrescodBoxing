import React, { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface AnimatedElementProps {
  children: ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'bounceIn' | 'custom';
  duration?: number;
  delay?: number;
  threshold?: number;
  className?: string;
  triggerOnce?: boolean;
  variants?: Variants;
  stagger?: boolean;
  staggerDelay?: number;
}

const defaultAnimations: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },
  slideUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },
  slideDown: {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },
  slideRight: {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },
  bounceIn: {
    hidden: { opacity: 0, scale: 0.3 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: 'easeOut',
        type: 'spring',
        bounce: 0.5
      }
    }
  }
};

const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  animation = 'fadeIn',
  duration = 0.6,
  delay = 0,
  threshold = 0.1,
  className = '',
  triggerOnce = true,
  variants,
  stagger = false,
  staggerDelay = 0.1
}) => {
  const { ref, isVisible } = useScrollAnimation({
    threshold,
    triggerOnce,
    delay: delay * 1000
  });

  const animationVariants = variants || defaultAnimations[animation] || defaultAnimations.fadeIn;
  
  // Modify variants with custom duration if provided
  const customVariants = {
    ...animationVariants,
    visible: {
      ...animationVariants.visible,
      transition: {
        ...(animationVariants.visible as any).transition,
        duration,
        delay: stagger ? staggerDelay : 0
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={customVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedElement;

// Staggered children component
export const StaggeredContainer: React.FC<{
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
}> = ({
  children,
  className = '',
  staggerDelay = 0.1,
  threshold = 0.1
}) => {
  const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce: true });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Parallax wrapper component
export const ParallaxElement: React.FC<{
  children: ReactNode;
  speed?: number;
  className?: string;
}> = ({ children, speed = 0.5, className = '' }) => {
  const [offsetY, setOffsetY] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const element = ref.current;
        const rect = element.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * -speed;
        
        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
          setOffsetY(rate);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offsetY}px)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {children}
    </div>
  );
};