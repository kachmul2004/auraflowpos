import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { spinnerVariants, dotsVariants, pulseVariants } from '../../lib/animations';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
}

export function LoadingSpinner({
  size = 24,
  color = 'currentColor',
  variant = 'spinner',
}: LoadingSpinnerProps) {
  if (variant === 'dots') {
    return <LoadingDots color={color} />;
  }

  if (variant === 'pulse') {
    return <LoadingPulse size={size} color={color} />;
  }

  return (
    <motion.div
      variants={spinnerVariants}
      initial="initial"
      animate="animate"
      style={{ display: 'inline-block' }}
    >
      <Loader2 size={size} color={color} />
    </motion.div>
  );
}

// Loading dots animation
function LoadingDots({ color = 'currentColor' }: { color?: string }) {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          variants={dotsVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: index * 0.2 }}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

// Pulsing circle
function LoadingPulse({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <motion.div
      variants={pulseVariants}
      initial="initial"
      animate="animate"
      className="rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
    />
  );
}

// Skeleton loading animation
export function SkeletonLoader({
  width = '100%',
  height = '20px',
  className = '',
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
}) {
  return (
    <motion.div
      className={`bg-muted rounded ${className}`}
      style={{ width, height }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// Full page loader
export function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="text-center space-y-4">
        <LoadingSpinner size={48} />
        <motion.p
          className="text-muted-foreground"
          variants={pulseVariants}
          initial="initial"
          animate="animate"
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
}
