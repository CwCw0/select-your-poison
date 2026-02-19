'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initialState"
        animate="animateState"
        exit="exitState"
        transition={{
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        variants={{
          initialState: {
            opacity: 0,
            clipPath: 'inset(0 0 100% 0)',
          },
          animateState: {
            opacity: 1,
            clipPath: 'inset(0 0 0% 0)',
          },
          exitState: {
            opacity: 0,
            clipPath: 'inset(100% 0 0 0)',
          },
        }}
        style={{ minHeight: '100vh' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Alternative slide transition
export function SlideTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-100%', opacity: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        style={{ minHeight: '100vh' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Valorant-style wipe transition
export function WipeTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Red wipe overlay */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 1, 0] }}
          exit={{ scaleX: 0 }}
          transition={{
            duration: 0.8,
            times: [0, 0.4, 0.6, 1],
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#FF0000',
            transformOrigin: 'left',
            zIndex: 9998,
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Tactical grid transition
export function GridTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const gridSize = 6;
  const squares = Array.from({ length: gridSize * gridSize });

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Grid overlay */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            zIndex: 9998,
            pointerEvents: 'none',
          }}
        >
          {squares.map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 1 }}
              animate={{ scale: 0 }}
              exit={{ scale: 1 }}
              transition={{
                duration: 0.4,
                delay: (i % gridSize) * 0.05 + Math.floor(i / gridSize) * 0.05,
                ease: 'easeInOut',
              }}
              style={{
                backgroundColor: '#0C0C0C',
                border: '1px solid #FF0000',
              }}
            />
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
