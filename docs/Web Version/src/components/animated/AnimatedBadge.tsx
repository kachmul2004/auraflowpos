import { motion } from 'motion/react';
import { Badge, BadgeProps } from '../ui/badge';
import { badgePulseVariants, badgePopVariants } from '../../lib/animations';
import { forwardRef } from 'react';

interface AnimatedBadgeProps extends BadgeProps {
  pulse?: boolean;
  pop?: boolean;
  children: React.ReactNode;
}

export const AnimatedBadge = forwardRef<HTMLDivElement, AnimatedBadgeProps>(
  ({ pulse = false, pop = true, children, ...props }, ref) => {
    return (
      <motion.div
        variants={pulse ? badgePulseVariants : pop ? badgePopVariants : undefined}
        initial={pop ? 'initial' : undefined}
        animate={pulse ? 'pulse' : pop ? 'animate' : undefined}
        style={{ display: 'inline-block' }}
      >
        <Badge ref={ref} {...props}>
          {children}
        </Badge>
      </motion.div>
    );
  }
);

AnimatedBadge.displayName = 'AnimatedBadge';

// Notification badge with count
export function NotificationBadge({
  count,
  max = 99,
  className = '',
}: {
  count: number;
  max?: number;
  className?: string;
}) {
  if (count === 0) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      className={`absolute -top-1 -right-1 ${className}`}
    >
      <Badge variant="destructive" className="h-5 min-w-5 px-1 flex items-center justify-center text-xs">
        {displayCount}
      </Badge>
    </motion.div>
  );
}
