'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const requestRef = useRef<number | null>(null);
  const targetPos = useRef({ x: -100, y: -100 });

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // More responsive spring config - feels direct but still smooth
  const springConfig = { damping: 50, stiffness: 800, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Use RAF for smoother cursor tracking
  const updateCursorPosition = useCallback(() => {
    cursorX.set(targetPos.current.x);
    cursorY.set(targetPos.current.y);
  }, [cursorX, cursorY]);

  const moveCursor = useCallback((e: MouseEvent) => {
    targetPos.current = { x: e.clientX, y: e.clientY };
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    requestRef.current = requestAnimationFrame(updateCursorPosition);
  }, [updateCursorPosition]);

  useEffect(() => {
    // Only show custom cursor on desktop
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return;
    }

    setIsVisible(true);

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Handle hover states for interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('button, a, [data-cursor="pointer"], input, select, textarea');
      const cursorTextEl = target.closest('[data-cursor-text]') as HTMLElement;

      if (interactive) {
        setIsHovering(true);
        if (cursorTextEl) {
          setCursorText(cursorTextEl.dataset.cursorText || '');
        } else {
          setCursorText('');
        }
      } else {
        setIsHovering(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousemove', handleElementHover);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousemove', handleElementHover);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [moveCursor]);

  if (!isVisible) return null;

  // Cursor dimensions
  const size = isHovering ? 40 : 28;
  const halfSize = size / 2;
  const lineLength = isHovering ? 10 : 6;
  const lineGap = isHovering ? 5 : 4;
  const lineThickness = 2;
  const dotSize = isClicking ? 6 : 4;

  return (
    <>
      {/* Main cursor container - properly centered */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          x: cursorXSpring,
          y: cursorYSpring,
          // Center the cursor by offsetting by half its size
          marginLeft: -halfSize,
          marginTop: -halfSize,
        }}
      >
        {/* Outer frame - Valorant style angular brackets */}
        <motion.svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            overflow: 'visible',
          }}
          animate={{
            scale: isClicking ? 0.85 : 1,
            rotate: isHovering ? 45 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
            rotate: { duration: 0.2 }
          }}
        >
          {/* Corner brackets */}
          {/* Top-left */}
          <motion.path
            d={`M ${halfSize - lineLength - lineGap} ${halfSize - lineGap} L ${halfSize - lineGap} ${halfSize - lineGap} L ${halfSize - lineGap} ${halfSize - lineLength - lineGap}`}
            stroke="#FF0000"
            strokeWidth={lineThickness}
            fill="none"
            strokeLinecap="square"
            animate={{ opacity: isHovering ? 1 : 0.8 }}
          />
          {/* Top-right */}
          <motion.path
            d={`M ${halfSize + lineGap} ${halfSize - lineLength - lineGap} L ${halfSize + lineGap} ${halfSize - lineGap} L ${halfSize + lineLength + lineGap} ${halfSize - lineGap}`}
            stroke="#FF0000"
            strokeWidth={lineThickness}
            fill="none"
            strokeLinecap="square"
            animate={{ opacity: isHovering ? 1 : 0.8 }}
          />
          {/* Bottom-right */}
          <motion.path
            d={`M ${halfSize + lineLength + lineGap} ${halfSize + lineGap} L ${halfSize + lineGap} ${halfSize + lineGap} L ${halfSize + lineGap} ${halfSize + lineLength + lineGap}`}
            stroke="#FF0000"
            strokeWidth={lineThickness}
            fill="none"
            strokeLinecap="square"
            animate={{ opacity: isHovering ? 1 : 0.8 }}
          />
          {/* Bottom-left */}
          <motion.path
            d={`M ${halfSize - lineGap} ${halfSize + lineLength + lineGap} L ${halfSize - lineGap} ${halfSize + lineGap} L ${halfSize - lineLength - lineGap} ${halfSize + lineGap}`}
            stroke="#FF0000"
            strokeWidth={lineThickness}
            fill="none"
            strokeLinecap="square"
            animate={{ opacity: isHovering ? 1 : 0.8 }}
          />

          {/* Center dot */}
          <motion.circle
            cx={halfSize}
            cy={halfSize}
            r={dotSize / 2}
            fill="#FF0000"
            animate={{
              r: isClicking ? 4 : isHovering ? 3 : 2,
              opacity: 1,
            }}
            transition={{ duration: 0.1 }}
          />
        </motion.svg>

        {/* Hover ring effect */}
        <AnimatePresence>
          {isHovering && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: size,
                height: size,
                border: '1px solid rgba(255, 0, 0, 0.4)',
                borderRadius: '50%',
              }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>

        {/* Click ripple effect */}
        <AnimatePresence>
          {isClicking && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: halfSize - 10,
                left: halfSize - 10,
                width: 20,
                height: 20,
                border: '2px solid #FF0000',
                borderRadius: '50%',
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        {/* Cursor text label */}
        <AnimatePresence>
          {cursorText && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.9 }}
              style={{
                position: 'absolute',
                top: size + 8,
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '4px 10px',
                backgroundColor: '#FF0000',
                color: '#0C0C0C',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '1px',
                fontFamily: 'var(--font-space-mono), monospace',
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
              }}
              transition={{ duration: 0.15 }}
            >
              {cursorText}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hide default cursor globally */}
      <style jsx global>{`
        @media (min-width: 1024px) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
