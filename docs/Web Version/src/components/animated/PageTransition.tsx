import { motion, AnimatePresence } from 'motion/react';
import { ReactNode } from 'react';
import {
  fadeInVariants,
  fadeInUpVariants,
  slideInFromRight,
  slideInFromLeft,
  scaleInVariants,
} from '../../lib/animations';

export type TransitionType = 'fade' | 'fadeUp' | 'slideRight' | 'slideLeft' | 'scale';

interface PageTransitionProps {
  children: ReactNode;
  transitionKey: string;
  type?: TransitionType;
  className?: string;
}

const transitionVariants = {
  fade: fadeInVariants,
  fadeUp: fadeInUpVariants,
  slideRight: slideInFromRight,
  slideLeft: slideInFromLeft,
  scale: scaleInVariants,
};

export function PageTransition({
  children,
  transitionKey,
  type = 'fade',
  className = '',
}: PageTransitionProps) {
  const variants = transitionVariants[type];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Layout wrapper with transition
export function TransitionLayout({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
