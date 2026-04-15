'use client';

import { motion } from 'framer-motion';
import { IntensityLevel } from '@/types';

interface IntensitySelectorProps {
  selected: IntensityLevel;
  onSelect: (level: IntensityLevel) => void;
  maxPlayers: number;
  onMaxPlayersChange: (count: number) => void;
}

const levels: { id: IntensityLevel; title: string; desc: string; multiplier: string; color: string }[] = [
  { id: 'casual', title: 'CASUAL', desc: 'Light rules, fewer drinks', multiplier: '0.5x', color: '#78716C' },
  { id: 'ranked', title: 'RANKED', desc: 'Balanced gameplay', multiplier: '1x', color: '#EAB308' },
  { id: 'immortal', title: 'IMMORTAL', desc: 'Challenging rules', multiplier: '1.5x', color: '#A855F7' },
  { id: 'radiant', title: 'RADIANT', desc: 'Maximum chaos', multiplier: '2x', color: '#FF0000' },
];

export default function IntensitySelector({
  selected,
  onSelect,
  maxPlayers,
  onMaxPlayersChange,
}: IntensitySelectorProps) {
  return (
    <div className="space-y-6">
      {/* Intensity */}
      <div>
        <label className="block font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
          Intensity
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {levels.map((level) => {
            const isSelected = selected === level.id;
            return (
              <motion.button
                key={level.id}
                onClick={() => onSelect(level.id)}
                className="p-3 rounded-lg border text-center transition-colors"
                style={{
                  backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                  borderColor: isSelected ? level.color : 'var(--border-default)',
                }}
                whileTap={{ scale: 0.97 }}
              >
                <div
                  className="font-mono text-xs font-bold tracking-wider"
                  style={{ color: isSelected ? level.color : 'var(--text-secondary)' }}
                >
                  {level.title}
                </div>
                <div className="font-mono text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  {level.multiplier}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Max Players */}
      <div>
        <label className="block font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
          Max Players
        </label>
        <div className="flex gap-2">
          {[2, 3, 4, 5].map((count) => (
            <motion.button
              key={count}
              onClick={() => onMaxPlayersChange(count)}
              className="flex-1 p-3 rounded-lg border text-center transition-colors"
              style={{
                backgroundColor: maxPlayers === count ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                borderColor: maxPlayers === count ? 'var(--accent-red)' : 'var(--border-default)',
                color: maxPlayers === count ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="font-mono text-sm font-bold">{count}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
