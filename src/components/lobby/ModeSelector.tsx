'use client';

import { motion } from 'framer-motion';
import { Skull, Target, Dices, Trophy, Flame } from 'lucide-react';
import { GameMode } from '@/types';

interface ModeSelectorProps {
  selectedModes: GameMode[];
  onToggleMode: (mode: GameMode) => void;
}

const modes: { id: GameMode; title: string; desc: string; icon: React.ReactNode; color: string }[] = [
  {
    id: 'classic',
    title: 'CLASSIC',
    desc: 'Death = Drink. Simple tracking.',
    icon: <Skull size={24} />,
    color: 'var(--accent-red)',
  },
  {
    id: 'agent_poison',
    title: 'AGENT POISON',
    desc: 'Agent-specific drinking rules.',
    icon: <Target size={24} />,
    color: 'var(--accent-purple)',
  },
  {
    id: 'strat_roulette',
    title: 'STRAT ROULETTE',
    desc: 'Random challenges each round.',
    icon: <Dices size={24} />,
    color: 'var(--accent-orange)',
  },
  {
    id: 'challenges',
    title: 'CHALLENGES',
    desc: 'Side objectives for bonus drinks.',
    icon: <Trophy size={24} />,
    color: 'var(--accent-amber)',
  },
  {
    id: 'punishment',
    title: 'PUNISHMENT',
    desc: 'End-game consequences.',
    icon: <Flame size={24} />,
    color: 'var(--accent-error)',
  },
];

export default function ModeSelector({ selectedModes, onToggleMode }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {modes.map((mode) => {
        const isSelected = selectedModes.includes(mode.id);
        return (
          <motion.button
            key={mode.id}
            onClick={() => onToggleMode(mode.id)}
            className="relative text-left p-5 rounded-lg border transition-colors"
            style={{
              backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
              borderColor: isSelected ? mode.color : 'var(--border-default)',
            }}
            whileTap={{ scale: 0.97 }}
          >
            {isSelected && (
              <motion.div
                className="absolute top-3 right-3 w-2 h-2 rounded-full"
                style={{ backgroundColor: mode.color }}
                layoutId={`dot-${mode.id}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}
            <div className="flex items-start gap-3">
              <div style={{ color: isSelected ? mode.color : 'var(--text-muted)' }}>
                {mode.icon}
              </div>
              <div>
                <div
                  className="font-mono text-xs font-bold tracking-wider mb-1"
                  style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                  {mode.title}
                </div>
                <div
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {mode.desc}
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
