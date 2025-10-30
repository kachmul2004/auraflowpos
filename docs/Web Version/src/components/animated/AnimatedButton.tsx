import { motion } from 'motion/react';
import { Button, ButtonProps } from '../ui/button';
import { buttonVariants, iconButtonVariants } from '../../lib/animations';
import { forwardRef } from 'react';

interface AnimatedButtonProps extends ButtonProps {
  animationVariant?: 'default' | 'icon';
  disabled?: boolean;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ animationVariant = 'default', disabled, children, ...props }, ref) => {
    const variants = animationVariant === 'icon' ? iconButtonVariants : buttonVariants;

    return (
      <motion.div
        variants={variants}
        initial="initial"
        whileHover={disabled ? undefined : 'hover'}
        whileTap={disabled ? undefined : 'tap'}
      >
        <Button ref={ref} disabled={disabled} {...props}>
          {children}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
