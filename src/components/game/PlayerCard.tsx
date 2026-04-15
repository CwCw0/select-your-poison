'use client';

import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Skull, Beer, Plus, Minus, Crown } from 'lucide-react';
import type { Player, AgentType } from '@/types';

interface PlayerCardProps {
  player: Player;
  isCurrentPlayer: boolean;
  isOvertime: boolean;
  onAddDeath: (playerId: string) => void;
  onAddDrink: (playerId: string, amount: number) => void;
  getAgentColor: (agent: AgentType | null) => string;
}

const PlayerCard = memo(function PlayerCard({
  player,
  isCurrentPlayer,
  isOvertime,
  onAddDeath,
  onAddDrink,
  getAgentColor,
}: PlayerCardProps) {
  const handleAddDeath = useCallback(() => {
    onAddDeath(player.id);
  }, [onAddDeath, player.id]);

  const handleAddDrink = useCallback(() => {
    onAddDrink(player.id, 1);
  }, [onAddDrink, player.id]);

  const handleRemoveDrink = useCallback(() => {
    if (player.drinks > 0) {
      onAddDrink(player.id, -1);
    }
  }, [onAddDrink, player.id, player.drinks]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: '#111111',
        border: isCurrentPlayer ? '2px solid #FF0000' : '1px solid #333333',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Player Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Agent Avatar */}
          <div
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: getAgentColor(player.agent),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#0C0C0C' }}>
              {player.name.substring(0, 2).toUpperCase()}
            </span>
            {player.isHost && (
              <div
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  width: '18px',
                  height: '18px',
                  backgroundColor: '#F59E0B',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Crown style={{ width: '10px', height: '10px', color: '#0C0C0C' }} />
              </div>
            )}
          </div>
          {/* Name & Agent */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '1px' }}>
              {player.name}
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: getAgentColor(player.agent),
                fontFamily: 'var(--font-space-mono), monospace',
                letterSpacing: '1px',
              }}
            >
              {player.agent?.toUpperCase() || 'NO AGENT'}
            </span>
          </div>
        </div>

        {/* Death Button */}
        <button
          onClick={handleAddDeath}
          style={{
            width: '44px',
            height: '44px',
            backgroundColor: '#1A1A1A',
            border: '1px solid #333333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#EF4444';
            e.currentTarget.style.borderColor = '#EF4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1A1A1A';
            e.currentTarget.style.borderColor = '#333333';
          }}
          title="Add Death"
        >
          <Skull style={{ width: '20px', height: '20px', color: '#FFFFFF' }} />
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {/* Deaths */}
        <div
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#0C0C0C',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Skull style={{ width: '14px', height: '14px', color: '#EF4444' }} />
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>
              DEATHS
            </span>
          </div>
          <span style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
            {player.deaths}
          </span>
        </div>

        {/* Drinks */}
        <div
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: isOvertime ? 'rgba(255, 0, 0, 0.1)' : '#0C0C0C',
            border: isOvertime ? '1px solid #FF0000' : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Beer style={{ width: '14px', height: '14px', color: '#FF0000' }} />
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>
              DRINKS
            </span>
            {isOvertime && (
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#FF0000', fontFamily: 'var(--font-space-mono), monospace' }}>
                2X
              </span>
            )}
          </div>
          <span style={{ fontSize: '24px', fontWeight: 800, color: isOvertime ? '#FF0000' : '#FFFFFF' }}>
            {player.drinks}
          </span>
        </div>
      </div>

      {/* Manual Drink Controls */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleRemoveDrink}
          disabled={player.drinks <= 0}
          style={{
            flex: 1,
            height: '36px',
            backgroundColor: '#1A1A1A',
            border: '1px solid #333333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: player.drinks <= 0 ? 'not-allowed' : 'pointer',
            opacity: player.drinks <= 0 ? 0.5 : 1,
          }}
        >
          <Minus style={{ width: '16px', height: '16px', color: '#999999' }} />
        </button>
        <button
          onClick={handleAddDrink}
          style={{
            flex: 1,
            height: '36px',
            backgroundColor: '#FF0000',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Plus style={{ width: '16px', height: '16px', color: '#0C0C0C' }} />
        </button>
      </div>
    </motion.div>
  );
});

export default PlayerCard;
