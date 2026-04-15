'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Trophy, X, Dices, RotateCcw, Swords } from 'lucide-react';

interface MobileControlsProps {
  round: number;
  teamScore: number;
  enemyScore: number;
  isHost: boolean;
  hasStratRoulette: boolean;
  rerollsLeft: number;
  isOvertime: boolean;
  currentMultiplier: number;
  onRoundWon: () => void;
  onRoundLost: () => void;
  onRollStrat: () => void;
  onSwitchSides: () => void;
  onEndGame: () => void;
}

export default function MobileControls({
  round,
  teamScore,
  enemyScore,
  isHost,
  hasStratRoulette,
  rerollsLeft,
  isOvertime,
  currentMultiplier,
  onRoundWon,
  onRoundLost,
  onRollStrat,
  onSwitchSides,
  onEndGame,
}: MobileControlsProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Expandable panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="p-4 space-y-3">
              {/* Quick actions */}
              {hasStratRoulette && (
                <button
                  onClick={onRollStrat}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border font-mono text-xs uppercase tracking-widest active:scale-[0.97] transition-transform"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--accent-orange)',
                  }}
                >
                  <Dices size={14} />
                  Roll Strat ({rerollsLeft} left)
                </button>
              )}
              <button
                onClick={onSwitchSides}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border font-mono text-xs uppercase tracking-widest active:scale-[0.97] transition-transform"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-secondary)',
                }}
              >
                <RotateCcw size={14} />
                Switch Sides
              </button>
              <button
                onClick={onEndGame}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border font-mono text-xs uppercase tracking-widest active:scale-[0.97] transition-transform"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  borderColor: 'var(--accent-error)',
                  color: 'var(--accent-error)',
                }}
              >
                <X size={14} />
                End Game
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main bar */}
      <div
        className="flex items-center border-t"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-default)',
        }}
      >
        {/* Score display */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-3 px-4 py-3"
          style={{ color: 'var(--text-primary)' }}
        >
          <div className="text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              R{round}
            </div>
            <div className="font-mono text-sm font-bold">
              <span style={{ color: 'var(--accent-green)' }}>{teamScore}</span>
              <span style={{ color: 'var(--text-muted)' }}> - </span>
              <span style={{ color: 'var(--accent-error)' }}>{enemyScore}</span>
            </div>
          </div>
          {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          {isOvertime && (
            <span className="font-mono text-[10px] font-bold" style={{ color: 'var(--accent-red)' }}>
              OT {currentMultiplier}x
            </span>
          )}
        </button>

        {/* Round controls — always visible */}
        {isHost && (
          <div className="flex-1 flex gap-2 p-2 justify-end">
            <motion.button
              onClick={onRoundLost}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-mono text-xs uppercase tracking-widest font-bold"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--accent-error)',
                border: '1px solid var(--accent-error)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={12} />
              Lost
            </motion.button>
            <motion.button
              onClick={onRoundWon}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-mono text-xs uppercase tracking-widest font-bold"
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: 'var(--accent-green)',
                border: '1px solid var(--accent-green)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Trophy size={12} />
              Won
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
