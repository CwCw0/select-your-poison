'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useGameStore, useIsHost } from '@/store/game-store';

export default function HalftimeScreen() {
  const { game, players, resumeFromHalftimeOnServer } = useGameStore();
  const isHost = useIsHost();

  return (
    <main style={{
      minHeight: '100vh', backgroundColor: '#0C0C0C',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px',
    }}>
      <motion.div
        style={{
          maxWidth: '700px', width: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '32px', textAlign: 'center',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ padding: '12px 32px', backgroundColor: '#F59E0B' }}>
          <span style={{
            fontSize: '14px', fontWeight: 700, letterSpacing: '2px', color: '#0C0C0C',
            fontFamily: 'var(--font-space-mono), monospace',
          }}>HALF TIME</span>
        </div>

        <h1 style={{ fontSize: '56px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-2px' }}>
          SIDE SWAP
        </h1>

        <p style={{
          fontSize: '18px', color: '#CCCCCC', fontFamily: 'var(--font-space-mono), monospace',
        }}>Take a break. Grab a drink. Regroup.</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginTop: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-space-mono), monospace', color: '#999999' }}>TEAM</span>
            <div style={{ fontSize: '64px', fontWeight: 800, color: '#22C55E' }}>{game.teamScore}</div>
          </div>
          <span style={{ fontSize: '40px', fontWeight: 300, color: '#666666' }}>-</span>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-space-mono), monospace', color: '#999999' }}>ENEMY</span>
            <div style={{ fontSize: '64px', fontWeight: 800, color: '#EF4444' }}>{game.enemyScore}</div>
          </div>
        </div>

        <div style={{
          fontSize: '14px', fontWeight: 600, letterSpacing: '2px', color: '#F59E0B',
          fontFamily: 'var(--font-space-mono), monospace',
        }}>
          SWITCHING TO {game.side === 'attack' ? 'DEFENSE' : 'ATTACK'}
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px', marginTop: '16px', width: '100%',
        }}>
          {players.map((player) => (
            <div key={player.id} style={{
              padding: '16px', backgroundColor: '#1A1A1A', border: '1px solid #444444',
            }}>
              <span style={{
                fontSize: '12px', fontFamily: 'var(--font-space-mono), monospace', color: '#CCCCCC',
              }}>{player.name}</span>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '16px', marginTop: '8px',
              }}>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF' }}>{player.deaths}</span>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#FF0000' }}>{player.drinks}</span>
              </div>
            </div>
          ))}
        </div>

        {isHost && (
          <button
            type="button"
            onClick={() => resumeFromHalftimeOnServer()}
            style={{
              height: '60px', padding: '0 40px', backgroundColor: '#FF0000', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              cursor: 'pointer', marginTop: '16px',
            }}
          >
            <Play style={{ width: '22px', height: '22px', color: '#0C0C0C' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '2px', color: '#0C0C0C' }}>
              CONTINUE TO SECOND HALF
            </span>
          </button>
        )}
      </motion.div>
    </main>
  );
}
