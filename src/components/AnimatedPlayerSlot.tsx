'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, UserPlus, Crown } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Player {
  id: string;
  name: string;
  agent?: string | null;
  color: string;
  isHost: boolean;
  isReady: boolean;
}

interface AnimatedPlayerSlotProps {
  player?: Player;
  index: number;
  isNew?: boolean;
  agentColor?: string;
}

export default function AnimatedPlayerSlot({ player, index, isNew = false, agentColor }: AnimatedPlayerSlotProps) {
  const [showJoinAnimation, setShowJoinAnimation] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      setShowJoinAnimation(true);
      const timer = setTimeout(() => setShowJoinAnimation(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  // Empty slot
  if (!player) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          backgroundColor: '#0C0C0C',
          border: '1px dashed #333333',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Scanning line animation */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #FF0000, transparent)',
          }}
          animate={{
            y: [0, 60, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <div
          style={{
            width: '44px',
            height: '44px',
            border: '1px solid #333333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <UserPlus style={{ width: '20px', height: '20px', color: '#444444' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#666666',
              fontFamily: 'var(--font-space-mono), monospace',
            }}
          >
            SLOT {index + 1}
          </span>
          <span
            style={{
              fontSize: '11px',
              color: '#444444',
              fontFamily: 'var(--font-space-mono), monospace',
            }}
          >
            Waiting for player...
          </span>
        </div>
      </motion.div>
    );
  }

  const color = agentColor || player.color || '#7DD3FC';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={player.id}
        initial={{ opacity: 0, x: -50, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          backgroundColor: '#1A1A1A',
          borderLeft: `4px solid ${color}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Join flash effect */}
        <AnimatePresence>
          {showJoinAnimation && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: color,
                opacity: 0.3,
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>

        {/* Glowing border effect on join */}
        <AnimatePresence>
          {showJoinAnimation && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 2 }}
              style={{
                position: 'absolute',
                inset: -2,
                border: `2px solid ${color}`,
                boxShadow: `0 0 20px ${color}`,
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>

        {/* Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, delay: 0.1 }}
          style={{
            width: '44px',
            height: '44px',
            backgroundColor: `${color}30`,
            border: `2px solid ${color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <User style={{ width: '22px', height: '22px', color }} />

          {/* Host crown */}
          {player.isHost && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              style={{
                position: 'absolute',
                top: -12,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <Crown style={{ width: '16px', height: '16px', color: '#F59E0B' }} />
            </motion.div>
          )}
        </motion.div>

        {/* Player info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#FFFFFF',
              }}
            >
              {player.name}
            </span>
            {player.isHost && (
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  padding: '2px 6px',
                  backgroundColor: '#F59E0B',
                  color: '#0C0C0C',
                }}
              >
                HOST
              </span>
            )}
          </motion.div>
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: '11px',
              color: color,
              fontFamily: 'var(--font-space-mono), monospace',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {player.agent || 'No agent selected'}
          </motion.span>
        </div>

        {/* Ready status */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <motion.div
            animate={player.isReady ? {
              scale: [1, 1.2, 1],
              boxShadow: ['0 0 0 rgba(34, 197, 94, 0)', '0 0 15px rgba(34, 197, 94, 0.5)', '0 0 0 rgba(34, 197, 94, 0)'],
            } : {}}
            transition={{ repeat: player.isReady ? Infinity : 0, duration: 2 }}
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: player.isReady ? '#22C55E' : '#666666',
              borderRadius: '50%',
            }}
          />
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '1px',
              color: player.isReady ? '#22C55E' : '#666666',
              fontFamily: 'var(--font-space-mono), monospace',
            }}
          >
            {player.isReady ? 'READY' : 'NOT READY'}
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Animated player grid for lobby
interface AnimatedPlayerGridProps {
  players: Player[];
  maxPlayers: number;
  newPlayerId?: string;
}

export function AnimatedPlayerGrid({ players, maxPlayers, newPlayerId }: AnimatedPlayerGridProps) {
  const slots = Array.from({ length: maxPlayers }, (_, i) => players[i] || null);

  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {slots.map((player, index) => (
        <AnimatedPlayerSlot
          key={player?.id || `empty-${index}`}
          player={player || undefined}
          index={index}
          isNew={player?.id === newPlayerId}
        />
      ))}
    </motion.div>
  );
}
