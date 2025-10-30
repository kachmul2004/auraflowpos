import { motion } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';
import { shakeVariants, errorPulseVariants } from '../../lib/animations';
import { useState, useEffect } from 'react';

interface ErrorAnimationProps {
  size?: number;
  color?: string;
  trigger?: boolean;
  onAnimationComplete?: () => void;
}

export function ErrorAnimation({
  size = 64,
  color = '#ef4444',
  trigger = false,
  onAnimationComplete,
}: ErrorAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(trigger);

  useEffect(() => {
    if (trigger) {
      setIsAnimating(true);
    }
  }, [trigger]);

  return (
    <motion.div
      variants={errorPulseVariants}
      initial="initial"
      animate={isAnimating ? 'pulse' : 'initial'}
      onAnimationComplete={() => {
        setIsAnimating(false);
        onAnimationComplete?.();
      }}
      className="rounded-full flex items-center justify-center"
      style={{
        width: size,
        height: size,
        backgroundColor: `${color}20`,
        border: `3px solid ${color}`,
      }}
    >
      <AlertCircle size={size * 0.5} color={color} strokeWidth={3} />
    </motion.div>
  );
}

// Shake animation for form fields
export function ShakeContainer({
  children,
  trigger = false,
}: {
  children: React.ReactNode;
  trigger?: boolean;
}) {
  const [isShaking, setIsShaking] = useState(trigger);

  useEffect(() => {
    if (trigger) {
      setIsShaking(true);
    }
  }, [trigger]);

  return (
    <motion.div
      variants={shakeVariants}
      initial="initial"
      animate={isShaking ? 'shake' : 'initial'}
      onAnimationComplete={() => setIsShaking(false)}
    >
      {children}
    </motion.div>
  );
}

// Error X icon with animation
export function ErrorX({ size = 24, color = '#ef4444' }: { size?: number; color?: string }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="rounded-full flex items-center justify-center"
      style={{
        width: size,
        height: size,
        backgroundColor: `${color}20`,
      }}
    >
      <X size={size * 0.6} color={color} strokeWidth={3} />
    </motion.div>
  );
}
