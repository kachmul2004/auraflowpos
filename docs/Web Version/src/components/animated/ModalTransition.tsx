import { motion, AnimatePresence } from 'motion/react';
import { ReactNode } from 'react';
import { modalBackdropVariants, modalContentVariants } from '../../lib/animations';

interface ModalTransitionProps {
  isOpen: boolean;
  children: ReactNode;
  onClose?: () => void;
}

export function ModalTransition({ isOpen, children, onClose }: ModalTransitionProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={modalBackdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Drawer transition (slide from side)
interface DrawerTransitionProps {
  isOpen: boolean;
  children: ReactNode;
  onClose?: () => void;
  side?: 'left' | 'right' | 'top' | 'bottom';
}

export function DrawerTransition({
  isOpen,
  children,
  onClose,
  side = 'right',
}: DrawerTransitionProps) {
  const slideVariants = {
    left: { x: '-100%' },
    right: { x: '100%' },
    top: { y: '-100%' },
    bottom: { y: '100%' },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={modalBackdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={slideVariants[side]}
            animate={{ x: 0, y: 0 }}
            exit={slideVariants[side]}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed z-50 bg-background border-border ${
              side === 'left'
                ? 'left-0 top-0 bottom-0 border-r'
                : side === 'right'
                ? 'right-0 top-0 bottom-0 border-l'
                : side === 'top'
                ? 'top-0 left-0 right-0 border-b'
                : 'bottom-0 left-0 right-0 border-t'
            }`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Popover transition (scale + fade)
interface PopoverTransitionProps {
  isOpen: boolean;
  children: ReactNode;
  anchorEl?: HTMLElement | null;
}

export function PopoverTransition({ isOpen, children, anchorEl }: PopoverTransitionProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="absolute z-50"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Dropdown transition
export function DropdownTransition({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Tooltip transition
export function TooltipTransition({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.1 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Collapse/Expand transition
export function CollapseTransition({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
