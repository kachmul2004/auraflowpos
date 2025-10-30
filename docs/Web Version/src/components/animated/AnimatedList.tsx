import { motion, AnimatePresence } from 'motion/react';
import { listContainerVariants, listItemVariants } from '../../lib/animations';
import { ReactNode } from 'react';

interface AnimatedListProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedList({ children, className = '' }: AnimatedListProps) {
  return (
    <motion.div
      variants={listContainerVariants}
      initial="initial"
      animate="animate"
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedListItemProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedListItem({ children, className = '' }: AnimatedListItemProps) {
  return (
    <motion.div variants={listItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

// Grid version with staggered animation
export function AnimatedGrid({
  children,
  className = '',
  columns = 3,
}: {
  children: ReactNode;
  className?: string;
  columns?: number;
}) {
  return (
    <motion.div
      variants={listContainerVariants}
      initial="initial"
      animate="animate"
      className={`grid gap-4 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </motion.div>
  );
}

// Animated presence wrapper for lists
export function AnimatedPresenceList({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
