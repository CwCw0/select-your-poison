'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  velocity: { x: number; y: number };
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
}

const defaultColors = [
  '#FF0000', // Red
  '#22C55E', // Green
  '#F59E0B', // Amber
  '#A855F7', // Purple
  '#7DD3FC', // Cyan
  '#FFFFFF', // White
];

export function Confetti({
  isActive,
  duration = 3000,
  particleCount = 50,
  colors = defaultColors,
  onComplete,
}: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: 2 + Math.random() * 3,
        },
      });
    }
    return newParticles;
  }, [particleCount, colors]);

  useEffect(() => {
    if (isActive) {
      setParticles(createParticles());

      const timeout = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timeout);
    } else {
      setParticles([]);
    }
  }, [isActive, createParticles, duration, onComplete]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                x: `${particle.x}vw`,
                y: `${particle.y}vh`,
                rotate: particle.rotation,
                scale: particle.scale,
                opacity: 1,
              }}
              animate={{
                y: '110vh',
                rotate: particle.rotation + 720,
                x: `${particle.x + particle.velocity.x * 20}vw`,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: duration / 1000,
                ease: 'linear',
              }}
              style={{
                position: 'absolute',
                width: '12px',
                height: '12px',
                backgroundColor: particle.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// Victory explosion effect
export function VictoryExplosion({ isActive }: { isActive: boolean }) {
  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Center burst */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,0,0,0.4) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 9998,
            }}
          />

          {/* Ring burst */}
          <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              border: '4px solid #FF0000',
              pointerEvents: 'none',
              zIndex: 9998,
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

// Drink splash effect
export function DrinkSplash({ isActive, color = '#F59E0B' }: { isActive: boolean; color?: string }) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ scale: 0.8, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      )}
    </AnimatePresence>
  );
}
