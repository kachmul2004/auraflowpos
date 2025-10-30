import { motion } from 'motion/react';
import { Card, CardProps } from '../ui/card';
import { cardHoverVariants, cardTapVariants } from '../../lib/animations';
import { forwardRef, ReactNode } from 'react';

interface AnimatedCardProps extends CardProps {
  enableHover?: boolean;
  enableTap?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ enableHover = true, enableTap = false, onClick, children, ...props }, ref) => {
    return (
      <motion.div
        variants={enableHover ? cardHoverVariants : undefined}
        initial="initial"
        whileHover={enableHover ? 'hover' : undefined}
        whileTap={enableTap ? cardTapVariants.tap : undefined}
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <Card ref={ref} {...props}>
          {children}
        </Card>
      </motion.div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';
