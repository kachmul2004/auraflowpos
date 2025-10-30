import { motion, useSpring, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}

export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  duration = 0.5,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  
  const spring = useSpring(value, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000,
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [spring]);

  const formatted = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toString();

  return (
    <motion.span
      className={className}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.3 }}
      key={value}
    >
      {prefix}{formatted}{suffix}
    </motion.span>
  );
}

// Currency-specific version
export function AnimatedCurrency({
  value,
  className = '',
}: {
  value: number;
  className?: string;
}) {
  return (
    <AnimatedNumber
      value={value}
      decimals={2}
      prefix="$"
      className={className}
    />
  );
}

// Percentage version
export function AnimatedPercentage({
  value,
  className = '',
}: {
  value: number;
  className?: string;
}) {
  return (
    <AnimatedNumber
      value={value}
      decimals={1}
      suffix="%"
      className={className}
    />
  );
}

// Counter with increment/decrement highlighting
export function AnimatedCounter({
  value,
  className = '',
}: {
  value: number;
  className?: string;
}) {
  const [prevValue, setPrevValue] = useState(value);
  const [isIncreasing, setIsIncreasing] = useState<boolean | null>(null);

  useEffect(() => {
    if (value > prevValue) {
      setIsIncreasing(true);
    } else if (value < prevValue) {
      setIsIncreasing(false);
    }
    setPrevValue(value);
    
    const timer = setTimeout(() => setIsIncreasing(null), 1000);
    return () => clearTimeout(timer);
  }, [value, prevValue]);

  return (
    <motion.span
      className={className}
      initial={false}
      animate={{
        scale: isIncreasing !== null ? [1, 1.2, 1] : 1,
        color: isIncreasing === true
          ? '#10b981'
          : isIncreasing === false
          ? '#ef4444'
          : 'inherit',
      }}
      transition={{ duration: 0.3 }}
    >
      {value}
    </motion.span>
  );
}
