'use client';

import { motion } from 'framer-motion';

/**
 * Subtle ambient atmosphere for the landing page.
 * - Noise grain overlay (adds texture, hides compression banding)
 * - Slow-drift radial red glow (breathing room for the eye)
 * - Faint scanlines (tactical / Valorant HUD feel)
 * All layers are pointer-events-none and pinned behind content.
 */
export default function AmbientEffects() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Scanlines — barely visible, gives the "HUD / broadcast" feel */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-screen"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
        }}
      />

      {/* Noise grain — SVG fractal noise, low opacity */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: '160px 160px',
        }}
      />

      {/* Top-left slow red pulse */}
      <motion.div
        className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,0,0,0.14) 0%, rgba(255,0,0,0.05) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          opacity: [0.5, 0.9, 0.5],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 9,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />

      {/* Bottom-right cooler accent (cyan-ish, very faint) */}
      <motion.div
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(125,211,252,0.06) 0%, rgba(125,211,252,0.02) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          opacity: [0.4, 0.75, 0.4],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 12,
          ease: 'easeInOut',
          repeat: Infinity,
          delay: 2,
        }}
      />

      {/* Vignette — focuses attention toward center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  );
}
