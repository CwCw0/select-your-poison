'use client';

import { motion } from 'framer-motion';
import { Beer, Check, Clock, Dices } from 'lucide-react';
import { stratCategoryColors, stratCategoryLabels } from '@/lib/strats';

interface StratRouletteModalProps {
  strat: {
    text: string;
    description: string;
    category: 'easy' | 'medium' | 'hard' | 'stupid';
    penalty: number;
    duration: string;
  };
  rerollsLeft: number;
  onAccept: () => void;
  onReroll: () => void;
  onSkip: () => void;
}

export default function StratRouletteModal({
  strat,
  rerollsLeft,
  onAccept,
  onReroll,
  onSkip,
}: StratRouletteModalProps) {
  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '32px',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        style={{
          maxWidth: '600px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
          textAlign: 'center',
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <span style={{
          fontSize: '12px', fontWeight: 600, letterSpacing: '4px', color: '#FF0000',
          fontFamily: 'var(--font-space-mono), monospace',
        }}>STRAT ROULETTE</span>

        <div style={{ padding: '12px 24px', backgroundColor: stratCategoryColors[strat.category] }}>
          <span style={{
            fontSize: '14px', fontWeight: 700, letterSpacing: '2px', color: '#0C0C0C',
            fontFamily: 'var(--font-space-mono), monospace',
          }}>{stratCategoryLabels[strat.category]}</span>
        </div>

        <h2 style={{
          fontSize: '36px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2,
          letterSpacing: '-2px', padding: '0 16px',
        }}>
          &quot;{strat.text}&quot;
        </h2>

        <p style={{
          fontSize: '16px', color: '#CCCCCC', maxWidth: '400px', padding: '0 16px', lineHeight: 1.6,
        }}>{strat.description}</p>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Beer style={{ width: '20px', height: '20px', color: '#FF0000' }} />
            <span style={{
              fontSize: '14px', color: '#CCCCCC', fontFamily: 'var(--font-space-mono), monospace',
            }}>+{strat.penalty} drinks if failed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock style={{ width: '20px', height: '20px', color: '#999999' }} />
            <span style={{
              fontSize: '14px', color: '#CCCCCC', fontFamily: 'var(--font-space-mono), monospace',
            }}>
              {strat.duration === 'round' ? 'This round' : strat.duration === 'half' ? 'This half' : 'Entire game'}
            </span>
          </div>
        </div>

        <div style={{
          display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          <button
            type="button"
            onClick={onAccept}
            style={{
              height: '60px', padding: '0 32px', backgroundColor: '#FF0000', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer',
            }}
          >
            <Check style={{ width: '22px', height: '22px', color: '#0C0C0C' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '2px', color: '#0C0C0C' }}>
              ACCEPT FATE
            </span>
          </button>
          <button
            type="button"
            onClick={onReroll}
            disabled={rerollsLeft <= 0}
            style={{
              height: '60px', padding: '0 32px', backgroundColor: '#2A2A2A',
              border: '2px solid #666666', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '12px',
              cursor: rerollsLeft > 0 ? 'pointer' : 'not-allowed',
              opacity: rerollsLeft > 0 ? 1 : 0.5,
            }}
          >
            <Dices style={{ width: '22px', height: '22px', color: '#FFFFFF' }} />
            <span style={{
              fontSize: '15px', fontWeight: 600, letterSpacing: '1px', color: '#FFFFFF',
              fontFamily: 'var(--font-space-mono), monospace',
            }}>REROLL ({rerollsLeft})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onSkip}
          style={{
            fontSize: '13px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace',
            background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px', marginTop: '8px',
          }}
        >Skip this round</button>
      </motion.div>
    </motion.div>
  );
}
