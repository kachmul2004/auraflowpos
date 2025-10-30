import { motion, AnimatePresence } from 'motion/react';
import { ReactNode } from 'react';

interface TabTransitionProps {
  activeTab: string;
  children: ReactNode;
  direction?: 'horizontal' | 'vertical';
}

export function TabTransition({ activeTab, children, direction = 'horizontal' }: TabTransitionProps) {
  const variants = {
    enter: (direction: 'horizontal' | 'vertical') => ({
      x: direction === 'horizontal' ? 20 : 0,
      y: direction === 'vertical' ? 20 : 0,
      opacity: 0,
    }),
    center: {
      x: 0,
      y: 0,
      opacity: 1,
    },
    exit: (direction: 'horizontal' | 'vertical') => ({
      x: direction === 'horizontal' ? -20 : 0,
      y: direction === 'vertical' ? -20 : 0,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={activeTab}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: 'spring', stiffness: 300, damping: 30 },
          y: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Accordion transition
interface AccordionTransitionProps {
  isOpen: boolean;
  children: ReactNode;
}

export function AccordionTransition({ isOpen, children }: AccordionTransitionProps) {
  return (
    <motion.div
      initial={false}
      animate={{
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{
        height: { duration: 0.3, ease: 'easeInOut' },
        opacity: { duration: 0.2, delay: isOpen ? 0.1 : 0 },
      }}
      style={{ overflow: 'hidden' }}
    >
      {children}
    </motion.div>
  );
}

// Card flip transition
interface FlipCardProps {
  isFlipped: boolean;
  frontContent: ReactNode;
  backContent: ReactNode;
}

export function FlipCard({ isFlipped, frontContent, backContent }: FlipCardProps) {
  return (
    <motion.div
      style={{ perspective: 1000 }}
      className="relative w-full h-full"
    >
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div
            key="front"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: 90 }}
            transition={{ duration: 0.3 }}
            style={{ backfaceVisibility: 'hidden' }}
            className="absolute inset-0"
          >
            {frontContent}
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: -90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ duration: 0.3 }}
            style={{ backfaceVisibility: 'hidden' }}
            className="absolute inset-0"
          >
            {backContent}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
