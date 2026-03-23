'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, Beer, ChevronDown, ChevronUp } from 'lucide-react';
import { AGENT_DRINKING_RULES, getAgentHeaderTextColor } from '@/lib/constants';
import { hapticDeath, hapticDrink } from '@/lib/haptics';
import { Player } from '@/types';

interface PlayerCardProps {
  player: Player;
  isCurrentPlayer: boolean;
  onAddDeath: () => void;
  onAddDrink: () => void;
  agentColor: string;
  hasAgentPoison: boolean;
}

export default function PlayerCard({
  player,
  isCurrentPlayer,
  onAddDeath,
  onAddDrink,
  agentColor,
  hasAgentPoison,
}: PlayerCardProps) {
  const [deathFlash, setDeathFlash] = useState(false);
  const [drinkFlash, setDrinkFlash] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const handleDeath = () => {
    onAddDeath();
    hapticDeath();
    setDeathFlash(true);
    setTimeout(() => setDeathFlash(false), 300);
  };

  const handleDrink = () => {
    onAddDrink();
    hapticDrink();
    setDrinkFlash(true);
    setTimeout(() => setDrinkFlash(false), 300);
  };

  const headerTextColor = getAgentHeaderTextColor(agentColor);
  const playerRules = AGENT_DRINKING_RULES[player.agent?.toLowerCase() || ''] || [];

  return (
    <motion.div
      layout
      style={{
        flex: 1,
        minWidth: '280px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: deathFlash ? 'rgba(239, 68, 68, 0.15)' : drinkFlash ? 'rgba(245, 158, 11, 0.15)' : '#0C0C0C',
        border: `2px solid ${agentColor}`,
        boxShadow: isCurrentPlayer ? `0 0 20px ${agentColor}40, inset 0 0 30px ${agentColor}10` : 'none',
        transition: 'background-color 0.2s ease, box-shadow 0.3s ease',
      }}
    >
      {/* Header with gradient */}
      <div
        style={{
          height: '60px',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${agentColor} 0%, ${agentColor}CC 100%)`,
          borderBottom: `3px solid ${agentColor}`,
          position: 'relative',
        }}
      >
        {isCurrentPlayer && (
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            padding: '2px 8px',
            backgroundColor: headerTextColor,
            opacity: 0.9,
            zIndex: 1,
          }}>
            <span style={{
              fontSize: '8px',
              fontWeight: 700,
              letterSpacing: '1px',
              color: agentColor,
              fontFamily: 'var(--font-space-mono), monospace',
            }}>
              YOU
            </span>
          </div>
        )}
        <span
          style={{
            fontSize: '15px',
            fontWeight: 800,
            letterSpacing: '2px',
            color: headerTextColor,
            paddingTop: isCurrentPlayer ? '16px' : '0',
          }}
        >
          {player.name || 'PLAYER'}
        </span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1px',
            color: headerTextColor,
            opacity: 0.8,
            fontFamily: 'var(--font-space-mono), monospace',
          }}
        >
          {player.agent?.toUpperCase() || 'AGENT'}
        </span>
      </div>

      {/* Body */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        gap: '20px',
      }}>
        {/* Stats */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{
            flex: 1,
            padding: '16px',
            backgroundColor: '#1A1A1A',
            border: '1px solid #333333',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
              backgroundColor: '#FFFFFF', opacity: 0.3,
            }} />
            <span style={{
              fontSize: '10px', fontWeight: 600, letterSpacing: '2px', color: '#888888',
              fontFamily: 'var(--font-space-mono), monospace',
            }}>DEATHS</span>
            <motion.span
              key={`deaths-${player.deaths}`}
              initial={{ scale: 1.4, color: '#EF4444' }}
              animate={{ scale: 1, color: '#FFFFFF' }}
              transition={{ duration: 0.3 }}
              style={{
                fontSize: '44px', fontWeight: 800, lineHeight: 1, letterSpacing: '-2px', display: 'block',
              }}
            >{player.deaths}</motion.span>
          </div>
          <div style={{
            flex: 1,
            padding: '16px',
            backgroundColor: 'rgba(255, 0, 0, 0.08)',
            border: '1px solid rgba(255, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
              backgroundColor: '#FF0000',
            }} />
            <span style={{
              fontSize: '10px', fontWeight: 600, letterSpacing: '2px', color: '#FF0000',
              fontFamily: 'var(--font-space-mono), monospace',
            }}>DRINKS</span>
            <motion.span
              key={`drinks-${player.drinks}`}
              initial={{ scale: 1.4, color: '#FFFFFF' }}
              animate={{ scale: 1, color: '#FF0000' }}
              transition={{ duration: 0.3 }}
              style={{
                fontSize: '44px', fontWeight: 800, lineHeight: 1, letterSpacing: '-2px', display: 'block',
              }}
            >{player.drinks}</motion.span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <motion.button
            type="button"
            onClick={handleDeath}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              height: '56px',
              backgroundColor: '#1A1A1A',
              border: '2px solid #555555',
              borderLeft: '4px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#252525';
              e.currentTarget.style.borderColor = '#888888';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1A1A1A';
              e.currentTarget.style.borderColor = '#555555';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Skull style={{ width: '22px', height: '22px', color: '#FFFFFF' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '1px', color: '#FFFFFF', fontFamily: 'var(--font-space-mono), monospace' }}>
              + DEATH
            </span>
          </motion.button>
          <motion.button
            type="button"
            onClick={handleDrink}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              height: '56px',
              backgroundColor: '#FF0000',
              borderTop: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              borderLeft: '4px solid #CC0000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#DC2626';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FF0000';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Beer style={{ width: '22px', height: '22px', color: '#0C0C0C' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '1px', color: '#0C0C0C', fontFamily: 'var(--font-space-mono), monospace' }}>
              + DRINK
            </span>
          </motion.button>
        </div>

        {/* Agent Rules Toggle */}
        {hasAgentPoison && playerRules.length > 0 && (
          <div style={{ borderTop: '1px solid #333333', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={() => setShowRules(!showRules)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: agentColor }} />
                <span style={{
                  fontSize: '10px', fontWeight: 600, letterSpacing: '2px', color: '#888888',
                  fontFamily: 'var(--font-space-mono), monospace',
                }}>AGENT RULES</span>
              </div>
              {showRules ? (
                <ChevronUp style={{ width: '16px', height: '16px', color: '#666666' }} />
              ) : (
                <ChevronDown style={{ width: '16px', height: '16px', color: '#666666' }} />
              )}
            </button>
            <AnimatePresence>
              {showRules && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    marginTop: '12px',
                    overflow: 'hidden',
                    paddingLeft: '16px',
                  }}
                >
                  {playerRules.slice(0, 3).map((rule, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{
                        width: '4px', height: '4px', marginTop: '6px', flexShrink: 0,
                        backgroundColor: agentColor,
                      }} />
                      <span style={{
                        fontSize: '11px', color: '#BBBBBB',
                        fontFamily: 'var(--font-space-mono), monospace', lineHeight: 1.5,
                      }}>{rule}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
