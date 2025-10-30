import { motion, AnimatePresence } from 'motion/react';
import { notificationSlideVariants } from '../../lib/animations';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  onClose?: (id: string) => void;
}

export function AnimatedToast({
  id,
  title,
  description,
  variant = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(id), 200);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <X className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={notificationSlideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          layout
          className="bg-card border border-border rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px] pointer-events-auto"
        >
          <div className="flex items-start gap-3">
            <div className={`${colors[variant]} text-white rounded-full p-1 flex-shrink-0`}>
              {icons[variant]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{title}</p>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose?.(id), 200);
              }}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Toast container
export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {children}
    </div>
  );
}
