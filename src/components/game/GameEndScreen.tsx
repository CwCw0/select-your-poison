'use client';

import { motion } from 'framer-motion';
import { Play, Home, Skull, Beer, Crown, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/game-store';
import { getAgentColor, getAgentHeaderTextColor } from '@/lib/constants';
import { hapticGameEnd } from '@/lib/haptics';
import { useEffect } from 'react';

export default function GameEndScreen() {
  const { game, players, leaveLobbyOnServer } = useGameStore();
  const router = useRouter();

  const isVictory = game.teamScore > game.enemyScore;

  const sortedByDrinks = [...players].sort((a, b) => b.drinks - a.drinks);
  const maxDrinks = sortedByDrinks[0]?.drinks || 1;

  const totalDeaths = players.reduce((sum, p) => sum + p.deaths, 0);
  const totalDrinks = players.reduce((sum, p) => sum + p.drinks, 0);

  useEffect(() => { hapticGameEnd(); }, []);

  const handleNewGame = () => {
    leaveLobbyOnServer();
    router.push('/lobby/create');
  };

  const handleHome = () => {
    leaveLobbyOnServer();
    router.push('/');
  };

  return (
    <main style={{
      minHeight: '100vh', backgroundColor: '#0C0C0C',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px',
      overflowY: 'auto',
    }}>
      <motion.div
        style={{
          maxWidth: '700px', width: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '32px', textAlign: 'center', padding: '40px 0',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Result Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          style={{ padding: '12px 32px', backgroundColor: isVictory ? '#22C55E' : '#EF4444' }}
        >
          <span style={{
            fontSize: '14px', fontWeight: 700, letterSpacing: '3px', color: '#0C0C0C',
            fontFamily: 'var(--font-space-mono), monospace',
          }}>{isVictory ? 'VICTORY' : 'DEFEAT'}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: '56px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-2px', margin: 0 }}
        >
          GAME OVER
        </motion.h1>

        {/* Final Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: '32px' }}
        >
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-space-mono), monospace', color: '#999999' }}>TEAM</span>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ fontSize: '72px', fontWeight: 800, color: isVictory ? '#22C55E' : '#FFFFFF' }}
            >
              {game.teamScore}
            </motion.div>
          </div>
          <span style={{ fontSize: '40px', fontWeight: 300, color: '#666666' }}>-</span>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-space-mono), monospace', color: '#999999' }}>ENEMY</span>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ fontSize: '72px', fontWeight: 800, color: !isVictory ? '#EF4444' : '#FFFFFF' }}
            >
              {game.enemyScore}
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', width: '100%',
          }}
        >
          <div style={{ padding: '20px', backgroundColor: '#1A1A1A', border: '1px solid #333333', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Skull style={{ width: '16px', height: '16px', color: '#999999' }} />
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '2px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>TOTAL DEATHS</span>
            </div>
            <span style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF' }}>{totalDeaths}</span>
          </div>
          <div style={{ padding: '20px', backgroundColor: 'rgba(255, 0, 0, 0.08)', border: '1px solid rgba(255, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Beer style={{ width: '16px', height: '16px', color: '#FF0000' }} />
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '2px', color: '#FF0000', fontFamily: 'var(--font-space-mono), monospace' }}>TOTAL DRINKS</span>
            </div>
            <span style={{ fontSize: '32px', fontWeight: 800, color: '#FF0000' }}>{totalDrinks}</span>
          </div>
        </motion.div>

        {/* Hall of Shame */}
        {players.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            style={{ width: '100%' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Crown style={{ width: '16px', height: '16px', color: '#F59E0B' }} />
              <span style={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '3px', color: '#F59E0B',
                fontFamily: 'var(--font-space-mono), monospace',
              }}>HALL OF SHAME</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sortedByDrinks.map((player, index) => {
                const agentColor = getAgentColor(player.agent);
                const textColor = getAgentHeaderTextColor(agentColor);
                const barWidth = maxDrinks > 0 ? (player.drinks / maxDrinks) * 100 : 0;

                return (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      padding: '16px', backgroundColor: '#1A1A1A',
                      borderLeft: `4px solid ${agentColor}`,
                      position: 'relative', overflow: 'hidden',
                    }}
                  >
                    {/* Drink bar visualization */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ delay: 1.4 + index * 0.1, duration: 0.6, ease: 'easeOut' }}
                      style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0,
                        backgroundColor: `${agentColor}10`,
                        borderRight: barWidth > 5 ? `2px solid ${agentColor}30` : 'none',
                      }}
                    />

                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      {/* Rank */}
                      <div style={{
                        width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: index === 0 ? agentColor : 'transparent',
                        border: index === 0 ? 'none' : '1px solid #444444',
                      }}>
                        {index === 0 ? (
                          <Trophy style={{ width: '16px', height: '16px', color: textColor }} />
                        ) : (
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#666666' }}>{index + 1}</span>
                        )}
                      </div>

                      {/* Player Info */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                        <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '15px' }}>{player.name}</span>
                        <span style={{
                          fontSize: '10px', color: agentColor, fontFamily: 'var(--font-space-mono), monospace',
                          letterSpacing: '1px',
                        }}>{player.agent?.toUpperCase() || 'AGENT'}</span>
                      </div>

                      {/* Stats */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            fontSize: '9px', color: '#888888', letterSpacing: '1px',
                            fontFamily: 'var(--font-space-mono), monospace', display: 'block',
                          }}>DEATHS</span>
                          <span style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>{player.deaths}</span>
                        </div>
                        <div style={{ width: '1px', height: '28px', backgroundColor: '#333333' }} />
                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            fontSize: '9px', color: '#FF0000', letterSpacing: '1px',
                            fontFamily: 'var(--font-space-mono), monospace', display: 'block',
                          }}>DRINKS</span>
                          <span style={{ fontSize: '20px', fontWeight: 800, color: '#FF0000' }}>{player.drinks}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          style={{
            display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center',
          }}
        >
          <button
            type="button"
            onClick={handleNewGame}
            style={{
              height: '60px', padding: '0 32px', backgroundColor: '#FF0000', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer',
            }}
          >
            <Play style={{ width: '22px', height: '22px', color: '#0C0C0C' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '2px', color: '#0C0C0C' }}>
              NEW GAME
            </span>
          </button>
          <button
            type="button"
            onClick={handleHome}
            style={{
              height: '60px', padding: '0 32px', backgroundColor: '#2A2A2A',
              border: '2px solid #666666', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '12px', cursor: 'pointer',
            }}
          >
            <Home style={{ width: '22px', height: '22px', color: '#FFFFFF' }} />
            <span style={{
              fontSize: '15px', fontWeight: 600, letterSpacing: '1px', color: '#FFFFFF',
              fontFamily: 'var(--font-space-mono), monospace',
            }}>HOME</span>
          </button>
        </motion.div>
      </motion.div>
    </main>
  );
}
