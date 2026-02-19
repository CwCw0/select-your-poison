'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useEasterEggStore,
  EASTER_EGGS,
  createKonamiDetector,
  createWordDetector,
  getRandomVoiceline,
  GG_CREDITS,
  TOTAL_EASTER_EGGS,
} from '@/lib/easter-eggs';
import { hapticSuccess } from '@/lib/haptics';

// Easter Egg Effects Component - Add this to your layout
export function EasterEggProvider({ children }: { children: React.ReactNode }) {
  const { discoverEgg, discovered } = useEasterEggStore();
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [effectData, setEffectData] = useState<unknown>(null);

  const triggerEffect = useCallback((effect: string, data?: unknown) => {
    setActiveEffect(effect);
    setEffectData(data);
    hapticSuccess();

    // Auto-hide effect after duration
    setTimeout(() => {
      setActiveEffect(null);
      setEffectData(null);
    }, 3000);
  }, []);

  // Konami Code
  useEffect(() => {
    const handler = createKonamiDetector(() => {
      discoverEgg(EASTER_EGGS.KONAMI);
      triggerEffect('konami');
    });
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [discoverEgg, triggerEffect]);

  // "gg" detector
  useEffect(() => {
    const handler = createWordDetector('gg', () => {
      discoverEgg(EASTER_EGGS.GG);
      triggerEffect('gg');
    });
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [discoverEgg, triggerEffect]);

  // "redpill" for matrix mode
  useEffect(() => {
    const handler = createWordDetector('redpill', () => {
      discoverEgg(EASTER_EGGS.MATRIX);
      triggerEffect('matrix');
    });
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [discoverEgg, triggerEffect]);

  // "omen" for Omen's secret
  useEffect(() => {
    const handler = createWordDetector('omen', () => {
      discoverEgg(EASTER_EGGS.OMEN);
      triggerEffect('omen');
    });
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [discoverEgg, triggerEffect]);

  return (
    <>
      {children}
      <EasterEggEffects effect={activeEffect} data={effectData} />
      <EasterEggDiscoveryToast discovered={discovered} />
    </>
  );
}

// Effects renderer
function EasterEggEffects({ effect, data }: { effect: string | null; data: unknown }) {
  return (
    <AnimatePresence>
      {effect === 'konami' && <KonamiEffect />}
      {effect === 'gg' && <GGCreditsEffect />}
      {effect === 'matrix' && <MatrixEffect />}
      {effect === 'omen' && <OmenEffect />}
      {effect === 'voiceline' && <VoicelineEffect data={data} />}
    </AnimatePresence>
  );
}

// Konami Code Effect
function KonamiEffect() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          textAlign: 'center',
        }}
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px #FF0000',
              '0 0 60px #FF0000',
              '0 0 20px #FF0000',
            ],
          }}
          transition={{ duration: 0.5, repeat: 3 }}
          style={{
            padding: '16px 32px',
            backgroundColor: '#FF0000',
          }}
        >
          <span style={{
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '4px',
            color: '#0C0C0C',
            fontFamily: 'var(--font-space-mono), monospace',
          }}>
            IMMORTAL MODE UNLOCKED
          </span>
        </motion.div>
        <span style={{
          fontSize: '12px',
          color: '#666666',
          fontFamily: 'var(--font-space-mono), monospace',
        }}>
          ↑↑↓↓←→←→BA
        </span>
      </motion.div>
    </motion.div>
  );
}

// GG Credits Effect
function GGCreditsEffect() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
      }}
    >
      <motion.pre
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        style={{
          color: '#22C55E',
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '12px',
          lineHeight: 1.5,
          textAlign: 'center',
          whiteSpace: 'pre',
        }}
      >
        {GG_CREDITS}
      </motion.pre>
    </motion.div>
  );
}

// Matrix Effect
function MatrixEffect() {
  const columns = 20;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
      }}
    >
      {Array.from({ length: columns }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: '-100%' }}
          animate={{ y: '100%' }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: 1,
            delay: Math.random() * 0.5,
          }}
          style={{
            position: 'absolute',
            left: `${(i / columns) * 100}%`,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {Array.from({ length: 30 }).map((_, j) => (
            <span
              key={j}
              style={{
                color: '#22C55E',
                fontFamily: 'var(--font-space-mono), monospace',
                fontSize: '14px',
                opacity: 1 - (j / 30) * 0.8,
              }}
            >
              {chars[Math.floor(Math.random() * chars.length)]}
            </span>
          ))}
        </motion.div>
      ))}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        <span style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#22C55E',
          fontFamily: 'var(--font-space-mono), monospace',
          textShadow: '0 0 20px #22C55E',
        }}>
          WAKE UP, AGENT...
        </span>
      </div>
    </motion.div>
  );
}

// Omen Effect
function OmenEffect() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(0,0,0,0.95) 70%)',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
        exit={{ scale: 1.2, opacity: 0 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 40px rgba(99,102,241,0.5)',
              '0 0 80px rgba(99,102,241,0.8)',
              '0 0 40px rgba(99,102,241,0.5)',
            ],
          }}
          transition={{ duration: 1, repeat: 2 }}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#6366F1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '48px' }}>👁</span>
        </motion.div>
        <span style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#6366F1',
          fontFamily: 'var(--font-space-mono), monospace',
          fontStyle: 'italic',
          textShadow: '0 0 30px rgba(99,102,241,0.8)',
        }}>
          &quot;I am everywhere...&quot;
        </span>
        <span style={{
          fontSize: '14px',
          color: '#999999',
          fontFamily: 'var(--font-space-mono), monospace',
        }}>
          — OMEN
        </span>
      </motion.div>
    </motion.div>
  );
}

// Voiceline Effect
export function VoicelineEffect({ data }: { data: unknown }) {
  const voiceline = data as { agent: string; quote: string; color: string } || getRandomVoiceline();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      style={{
        position: 'fixed',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        pointerEvents: 'none',
        padding: '20px 32px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: `2px solid ${voiceline.color}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span style={{
        fontSize: '20px',
        fontWeight: 700,
        color: voiceline.color,
        fontFamily: 'var(--font-space-mono), monospace',
        fontStyle: 'italic',
      }}>
        {voiceline.quote}
      </span>
      <span style={{
        fontSize: '12px',
        color: '#666666',
        fontFamily: 'var(--font-space-mono), monospace',
      }}>
        — {voiceline.agent.toUpperCase()}
      </span>
    </motion.div>
  );
}

// Discovery Toast
function EasterEggDiscoveryToast({ discovered }: { discovered: string[] }) {
  const [showToast, setShowToast] = useState(false);
  const [lastCount, setLastCount] = useState(discovered.length);

  useEffect(() => {
    if (discovered.length > lastCount) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
    setLastCount(discovered.length);
  }, [discovered.length, lastCount]);

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          style={{
            position: 'fixed',
            top: '100px',
            right: '24px',
            zIndex: 99998,
            padding: '16px 24px',
            backgroundColor: '#0C0C0C',
            border: '1px solid #F59E0B',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '24px' }}>🥚</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#F59E0B',
              fontFamily: 'var(--font-space-mono), monospace',
              letterSpacing: '1px',
            }}>
              EASTER EGG FOUND!
            </span>
            <span style={{
              fontSize: '11px',
              color: '#999999',
              fontFamily: 'var(--font-space-mono), monospace',
            }}>
              {discovered.length} / {TOTAL_EASTER_EGGS} discovered
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Logo click handler for voiceline easter egg
export function useLogoEasterEgg() {
  const { discoverEgg } = useEasterEggStore();
  const [clickCount, setClickCount] = useState(0);
  const [showVoiceline, setShowVoiceline] = useState(false);
  const [voiceline, setVoiceline] = useState(getRandomVoiceline());

  const handleClick = useCallback(() => {
    setClickCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (clickCount >= 5) {
      discoverEgg(EASTER_EGGS.AGENT_VOICES);
      setVoiceline(getRandomVoiceline());
      setShowVoiceline(true);
      setTimeout(() => setShowVoiceline(false), 2500);
      setClickCount(0);
    }

    const timer = setTimeout(() => setClickCount(0), 1500);
    return () => clearTimeout(timer);
  }, [clickCount, discoverEgg]);

  return { handleClick, showVoiceline, voiceline };
}

// Easter Eggs stats display (for settings or profile)
export function EasterEggStats() {
  const { discovered } = useEasterEggStore();

  return (
    <div style={{
      padding: '20px 24px',
      backgroundColor: 'var(--bg-tertiary)',
      border: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>🥚</span>
        <div>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-space-mono), monospace',
          }}>
            EASTER EGGS
          </span>
          <p style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-space-mono), monospace',
          }}>
            Hidden secrets found
          </p>
        </div>
      </div>
      <span style={{
        fontSize: '18px',
        fontWeight: 700,
        color: discovered.length === TOTAL_EASTER_EGGS ? '#22C55E' : '#F59E0B',
        fontFamily: 'var(--font-space-mono), monospace',
      }}>
        {discovered.length} / {TOTAL_EASTER_EGGS}
      </span>
    </div>
  );
}
