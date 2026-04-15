'use client';

import { useThemeStore } from '@/store/theme-store';
import { Sun, Moon, Monitor } from 'lucide-react';
import { hapticButton } from '@/lib/haptics';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeToggle({ showLabel = false, size = 'md' }: ThemeToggleProps) {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  const sizes = {
    sm: { button: 32, icon: 14 },
    md: { button: 40, icon: 18 },
    lg: { button: 48, icon: 22 },
  };

  const handleToggle = () => {
    hapticButton();
    toggleTheme();
  };

  const isDark = theme === 'dark';

  return (
    <button
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: showLabel ? '8px 16px' : '0',
        width: showLabel ? 'auto' : sizes[size].button,
        height: sizes[size].button,
        backgroundColor: 'transparent',
        border: '1px solid var(--border-default)',
        borderRadius: '3px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Moon style={{ width: sizes[size].icon, height: sizes[size].icon, color: 'var(--text-secondary)' }} />
        ) : (
          <Sun style={{ width: sizes[size].icon, height: sizes[size].icon, color: 'var(--text-secondary)' }} />
        )}
      </motion.div>
      {showLabel && (
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '1px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-space-mono), monospace',
        }}>
          {isDark ? 'DARK' : 'LIGHT'}
        </span>
      )}
    </button>
  );
}

// Full theme selector with system option
export function ThemeSelector() {
  const { theme, setTheme } = useThemeStore();

  const options: { value: 'dark' | 'light' | 'system'; label: string; icon: typeof Sun }[] = [
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      padding: '4px',
      backgroundColor: 'var(--bg-tertiary)',
      border: '1px solid var(--border-default)',
      borderRadius: '4px',
    }}>
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => {
            hapticButton();
            setTheme(value);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: theme === value ? 'var(--accent-red)' : 'transparent',
            border: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <Icon style={{
            width: '14px',
            height: '14px',
            color: theme === value ? '#0C0C0C' : 'var(--text-secondary)'
          }} />
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.5px',
            color: theme === value ? '#0C0C0C' : 'var(--text-secondary)',
            fontFamily: 'var(--font-space-mono), monospace',
          }}>
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
