'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useRef, useState, useEffect } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      setIsFirstLoad(false);
      prevPath.current = pathname;
    }
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={pathname} style={{ minHeight: '100vh', position: 'relative' }}>
        {/* Red wipe overlay — only on route change, not first load */}
        {!isFirstLoad && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: [0, 1, 1, 0],
              transformOrigin: ['left', 'left', 'right', 'right'],
            }}
            transition={{
              duration: 0.7,
              times: [0, 0.35, 0.55, 1],
              ease: [0.76, 0, 0.24, 1],
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#FF0000',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Page content */}
        <motion.div
          initial={isFirstLoad ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: isFirstLoad ? 0 : 0.4,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
