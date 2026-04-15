'use client';

import { motion } from 'framer-motion';
import { Play, Trophy } from 'lucide-react';
import { useIsHost } from '@/store/game-store';

interface OvertimeScreenProps {
  onDismiss: () => void;
}

export default function OvertimeScreen({ onDismiss }: OvertimeScreenProps) {
  const isHost = useIsHost();

  return (
    <main style={{
      minHeight: '100vh', backgroundColor: '#0C0C0C',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px',
    }}>
      <motion.div
        style={{
          maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '32px', textAlign: 'center',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div style={{
          width: '128px', height: '128px', borderRadius: '50%',
          backgroundColor: 'rgba(255, 0, 0, 0.2)', border: '2px solid #FF0000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Trophy style={{ width: '64px', height: '64px', color: '#FF0000' }} />
        </div>

        <div style={{ padding: '8px 24px', backgroundColor: '#FF0000' }}>
          <span style={{
            fontSize: '14px', fontWeight: 700, letterSpacing: '4px', color: '#0C0C0C',
            fontFamily: 'var(--font-space-mono), monospace',
          }}>OVERTIME</span>
        </div>

        <h1 style={{ fontSize: '56px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-2px' }}>
          SUDDEN DEATH
        </h1>

        <p style={{
          fontSize: '18px', color: '#CCCCCC', fontFamily: 'var(--font-space-mono), monospace',
        }}>Score tied 12-12. First to win 2 rounds takes the match.</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '16px' }}>
          <span style={{ fontSize: '64px', fontWeight: 800, color: '#22C55E' }}>12</span>
          <span style={{ fontSize: '48px', fontWeight: 300, color: '#666666' }}>-</span>
          <span style={{ fontSize: '64px', fontWeight: 800, color: '#EF4444' }}>12</span>
        </div>

        <div style={{
          padding: '24px', backgroundColor: '#1A1A1A', border: '1px solid #444444',
          width: '100%', marginTop: '16px',
        }}>
          <span style={{
            fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#999999',
            fontFamily: 'var(--font-space-mono), monospace',
          }}>OVERTIME RULES</span>
          <ul style={{
            display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px',
            textAlign: 'left', listStyle: 'none', padding: 0, margin: '16px 0 0 0',
          }}>
            {['2X DRINK MULTIPLIER on all deaths', 'First team to 14 wins', 'No mercy. Full send only.'].map((rule) => (
              <li key={rule} style={{
                fontSize: '14px', color: '#CCCCCC', display: 'flex', alignItems: 'center', gap: '8px',
                fontFamily: 'var(--font-space-mono), monospace',
              }}>
                <span style={{ color: '#FF0000' }}>&bull;</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {isHost && (
          <button
            type="button"
            onClick={onDismiss}
            style={{
              height: '60px', padding: '0 40px', backgroundColor: '#FF0000', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              cursor: 'pointer', marginTop: '16px',
            }}
          >
            <Play style={{ width: '22px', height: '22px', color: '#0C0C0C' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '2px', color: '#0C0C0C' }}>
              CONTINUE TO OVERTIME
            </span>
          </button>
        )}
      </motion.div>
    </main>
  );
}
