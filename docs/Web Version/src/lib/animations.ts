// Animation utilities and variants for AuraFlow POS
// Using Motion (Framer Motion) for all animations

import { Variants } from 'motion/react';

// ============================================================================
// BUTTON ANIMATIONS
// ============================================================================

export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1, ease: 'easeIn' }
  },
};

export const iconButtonVariants: Variants = {
  initial: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  tap: { 
    scale: 0.9,
    rotate: -5,
    transition: { duration: 0.1 }
  },
};

// ============================================================================
// SUCCESS ANIMATIONS
// ============================================================================

export const successCheckVariants: Variants = {
  initial: { 
    scale: 0,
    opacity: 0,
    rotate: -180
  },
  animate: { 
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      duration: 0.6
    }
  },
};

export const successBounceVariants: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
      times: [0, 0.5, 1]
    }
  },
};

// ============================================================================
// ERROR ANIMATIONS
// ============================================================================

export const shakeVariants: Variants = {
  initial: { x: 0 },
  shake: {
    x: [-10, 10, -10, 10, -5, 5, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  },
};

export const errorPulseVariants: Variants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.4,
      repeat: 2,
      ease: 'easeInOut'
    }
  },
};

// ============================================================================
// LOADING ANIMATIONS
// ============================================================================

export const spinnerVariants: Variants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  },
};

export const pulseVariants: Variants = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  },
};

export const dotsVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-5, 0, -5],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  },
};

// ============================================================================
// CARD ANIMATIONS
// ============================================================================

export const cardHoverVariants: Variants = {
  initial: { 
    y: 0,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
  },
  hover: {
    y: -4,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    transition: { duration: 0.3, ease: 'easeOut' }
  },
};

export const cardTapVariants: Variants = {
  initial: { scale: 1 },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  },
};

// ============================================================================
// SLIDE ANIMATIONS
// ============================================================================

export const slideInFromRight: Variants = {
  initial: { x: '100%', opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  },
};

export const slideInFromLeft: Variants = {
  initial: { x: '-100%', opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  },
};

export const slideInFromBottom: Variants = {
  initial: { y: '100%', opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  },
};

export const slideInFromTop: Variants = {
  initial: { y: '-100%', opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    y: '-100%',
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  },
};

// ============================================================================
// FADE ANIMATIONS
// ============================================================================

export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

export const fadeInUpVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: 'easeIn' }
  },
};

export const fadeInDownVariants: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
};

// ============================================================================
// SCALE ANIMATIONS
// ============================================================================

export const scaleInVariants: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

export const scaleInCenterVariants: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { 
      type: 'spring',
      stiffness: 200,
      damping: 20
    }
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

// ============================================================================
// MODAL/DIALOG ANIMATIONS
// ============================================================================

export const modalBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

export const modalContentVariants: Variants = {
  initial: { 
    scale: 0.95,
    opacity: 0,
    y: 20
  },
  animate: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 }
  },
};

// ============================================================================
// LIST ANIMATIONS (Stagger)
// ============================================================================

export const listContainerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
};

export const listItemVariants: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
};

// ============================================================================
// NUMBER COUNTER ANIMATION
// ============================================================================

export const counterVariants: Variants = {
  initial: { scale: 1 },
  change: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  },
};

// ============================================================================
// BADGE ANIMATIONS
// ============================================================================

export const badgePulseVariants: Variants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.15, 1],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 2
    }
  },
};

export const badgePopVariants: Variants = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 15
    }
  },
};

// ============================================================================
// RIPPLE EFFECT
// ============================================================================

export const rippleVariants: Variants = {
  initial: { scale: 0, opacity: 0.5 },
  animate: {
    scale: 2,
    opacity: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
};

// ============================================================================
// NOTIFICATION ANIMATIONS
// ============================================================================

export const notificationSlideVariants: Variants = {
  initial: { x: 400, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 25
    }
  },
  exit: {
    x: 400,
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

// ============================================================================
// PROGRESS BAR ANIMATIONS
// ============================================================================

export const progressBarVariants: Variants = {
  initial: { scaleX: 0, transformOrigin: 'left' },
  animate: {
    scaleX: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  },
};

// ============================================================================
// SKELETON ANIMATIONS
// ============================================================================

export const skeletonPulseVariants: Variants = {
  initial: { opacity: 0.3 },
  animate: {
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Create a staggered animation for children
export function createStaggerVariants(staggerDelay: number = 0.05): Variants {
  return {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    },
  };
}

// Create a delayed animation
export function createDelayedVariants(delay: number): Variants {
  return {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.4
      }
    },
  };
}

// Create a bounce animation
export function createBounceVariants(intensity: number = 1.2): Variants {
  return {
    initial: { scale: 1 },
    animate: {
      scale: [1, intensity, 1],
      transition: {
        duration: 0.5,
        ease: 'easeInOut'
      }
    },
  };
}

// ============================================================================
// SPRING PRESETS
// ============================================================================

export const springPresets = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  bouncy: { type: 'spring' as const, stiffness: 300, damping: 10 },
  snappy: { type: 'spring' as const, stiffness: 400, damping: 25 },
  smooth: { type: 'spring' as const, stiffness: 200, damping: 20 },
};

// ============================================================================
// EASING PRESETS
// ============================================================================

export const easingPresets = {
  easeOut: [0.4, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  smooth: [0.25, 0.1, 0.25, 1],
};
