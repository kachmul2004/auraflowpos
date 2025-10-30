import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { successCheckVariants, successBounceVariants } from '../../lib/animations';

interface SuccessAnimationProps {
  size?: number;
  color?: string;
  onAnimationComplete?: () => void;
}

export function SuccessAnimation({
  size = 64,
  color = '#10b981',
  onAnimationComplete,
}: SuccessAnimationProps) {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        variants={successBounceVariants}
        initial="initial"
        animate="animate"
        className="relative"
      >
        <motion.div
          variants={successCheckVariants}
          initial="initial"
          animate="animate"
          onAnimationComplete={onAnimationComplete}
          className="rounded-full flex items-center justify-center"
          style={{
            width: size,
            height: size,
            backgroundColor: `${color}20`,
            border: `3px solid ${color}`,
          }}
        >
          <Check size={size * 0.5} color={color} strokeWidth={3} />
        </motion.div>
      </motion.div>
    </div>
  );
}

// Compact version for inline use
export function SuccessCheckmark({ size = 24, color = '#10b981' }: SuccessAnimationProps) {
  return (
    <motion.div
      variants={successCheckVariants}
      initial="initial"
      animate="animate"
    >
      <Check size={size} color={color} strokeWidth={3} />
    </motion.div>
  );
}
