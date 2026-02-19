/**
 * Easter Eggs System
 * Hidden features and fun surprises throughout the app
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { hapticSuccess, hapticWin } from './haptics';

// Easter egg discovery state
interface EasterEggState {
  discovered: string[];
  totalFound: number;
  discoverEgg: (id: string) => void;
  hasDiscovered: (id: string) => boolean;
  resetDiscoveries: () => void;
}

export const useEasterEggStore = create<EasterEggState>()(
  persist(
    (set, get) => ({
      discovered: [],
      totalFound: 0,

      discoverEgg: (id) => {
        const { discovered } = get();
        if (!discovered.includes(id)) {
          hapticWin();
          set({
            discovered: [...discovered, id],
            totalFound: discovered.length + 1,
          });
          // Could trigger notification here
          console.log(`🥚 Easter egg discovered: ${id}`);
        }
      },

      hasDiscovered: (id) => {
        return get().discovered.includes(id);
      },

      resetDiscoveries: () => {
        set({ discovered: [], totalFound: 0 });
      },
    }),
    {
      name: 'syp-easter-eggs',
    }
  )
);

// All available easter eggs
export const EASTER_EGGS = {
  KONAMI: 'konami_code',
  AGENT_VOICES: 'agent_voices',
  MATRIX: 'matrix_mode',
  RADIANITE: 'radianite_overload',
  OMEN: 'omen_secret',
  PHOENIX: 'phoenix_flame',
  GG: 'gg_credits',
  SPIKE: 'spike_plant',
  LOGO_SPIN: 'logo_spin',
  SECRET_AGENT: 'secret_agent',
} as const;

export const TOTAL_EASTER_EGGS = Object.keys(EASTER_EGGS).length;

// Konami Code detector
export function createKonamiDetector(onSuccess: () => void) {
  const konamiCode = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];
  let currentIndex = 0;

  return (event: KeyboardEvent) => {
    if (event.code === konamiCode[currentIndex]) {
      currentIndex++;
      if (currentIndex === konamiCode.length) {
        currentIndex = 0;
        onSuccess();
      }
    } else {
      currentIndex = 0;
    }
  };
}

// Secret word detector (for typing "redpill", "gg", etc.)
export function createWordDetector(word: string, onSuccess: () => void) {
  let buffer = '';
  const timeout = 2000; // Reset after 2 seconds of no input
  let timer: ReturnType<typeof setTimeout>;

  return (event: KeyboardEvent) => {
    clearTimeout(timer);
    buffer += event.key.toLowerCase();

    // Keep only last N characters where N is word length
    if (buffer.length > word.length) {
      buffer = buffer.slice(-word.length);
    }

    if (buffer === word.toLowerCase()) {
      buffer = '';
      onSuccess();
    }

    timer = setTimeout(() => {
      buffer = '';
    }, timeout);
  };
}

// Click counter for logo/element clicks
export function createClickCounter(targetClicks: number, timeWindow: number, onSuccess: () => void) {
  let clicks = 0;
  let timer: ReturnType<typeof setTimeout>;

  return () => {
    clicks++;
    clearTimeout(timer);

    if (clicks >= targetClicks) {
      clicks = 0;
      onSuccess();
    }

    timer = setTimeout(() => {
      clicks = 0;
    }, timeWindow);
  };
}

// Device shake detector (for mobile)
export function createShakeDetector(threshold: number, onSuccess: () => void) {
  let lastX = 0;
  let lastY = 0;
  let lastZ = 0;
  let shakeCount = 0;
  let lastShakeTime = 0;

  return (event: DeviceMotionEvent) => {
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    const { x, y, z } = acceleration;
    if (x === null || y === null || z === null) return;

    const deltaX = Math.abs(x - lastX);
    const deltaY = Math.abs(y - lastY);
    const deltaZ = Math.abs(z - lastZ);

    if (deltaX + deltaY + deltaZ > threshold) {
      const now = Date.now();
      if (now - lastShakeTime > 300) { // Debounce
        shakeCount++;
        lastShakeTime = now;

        if (shakeCount >= 5) {
          shakeCount = 0;
          onSuccess();
        }
      }
    }

    lastX = x;
    lastY = y;
    lastZ = z;
  };
}

// Agent voicelines (text-based since we can't use audio)
export const AGENT_VOICELINES = [
  { agent: 'Jett', quote: '"Watch this!"', color: '#7DD3FC' },
  { agent: 'Reyna', quote: '"They are so dead."', color: '#A855F7' },
  { agent: 'Phoenix', quote: '"Just take a break!"', color: '#F97316' },
  { agent: 'Sage', quote: '"I am both shield and sword."', color: '#22C55E' },
  { agent: 'Omen', quote: '"I am everywhere..."', color: '#6366F1' },
  { agent: 'Cypher', quote: '"I know EXACTLY where you are."', color: '#FBBF24' },
  { agent: 'Viper', quote: '"Welcome to my world."', color: '#22C55E' },
  { agent: 'Raze', quote: '"HERE COMES THE PARTY!"', color: '#F97316' },
  { agent: 'Brimstone', quote: '"Prepare for hellfire!"', color: '#F59E0B' },
  { agent: 'Killjoy', quote: '"Relax, I\'ve got this."', color: '#FBBF24' },
  { agent: 'Sova', quote: '"I am the hunter."', color: '#3B82F6' },
  { agent: 'Breach', quote: '"Let\'s GO!"', color: '#F59E0B' },
  { agent: 'Chamber', quote: '"They are so dead."', color: '#D4AF37' },
  { agent: 'Yoru', quote: '"You should run."', color: '#8B5CF6' },
  { agent: 'Neon', quote: '"Too slow!"', color: '#22D3EE' },
  { agent: 'Fade', quote: '"Nightmare..."', color: '#78716C' },
  { agent: 'Gekko', quote: '"Let\'s do this, buddy!"', color: '#84CC16' },
  { agent: 'Clove', quote: '"Not done yet!"', color: '#EC4899' },
  { agent: 'Iso', quote: '"Focus."', color: '#A855F7' },
];

export function getRandomVoiceline() {
  return AGENT_VOICELINES[Math.floor(Math.random() * AGENT_VOICELINES.length)];
}

// Secret agent unlock (finding all easter eggs)
export function hasFoundAllEggs(discovered: string[]): boolean {
  return discovered.length >= TOTAL_EASTER_EGGS;
}

// GG Credits text
export const GG_CREDITS = `
╔════════════════════════════════════╗
║     SELECT YOUR POISON v1.0        ║
║                                    ║
║  Created with 🩸 by a Valorant     ║
║  player who's died too many times  ║
║                                    ║
║  Special thanks to:                ║
║  - Everyone who drinks responsibly ║
║  - Riot Games for the chaos        ║
║  - Coffee ☕                        ║
║                                    ║
║  "Cold rules. Chaotic outcomes."   ║
║                                    ║
║         GG WP 🎮                   ║
╚════════════════════════════════════╝
`;
