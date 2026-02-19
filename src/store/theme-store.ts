import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): 'dark' | 'light' => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark', // Default to dark
      resolvedTheme: 'dark',

      setTheme: (theme) => {
        const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
        set({ theme, resolvedTheme });

        // Apply to document
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(resolvedTheme);
          document.documentElement.setAttribute('data-theme', resolvedTheme);
        }
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },
    }),
    {
      name: 'syp-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme on hydration
        if (state && typeof document !== 'undefined') {
          const resolvedTheme = state.theme === 'system' ? getSystemTheme() : state.theme;
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(resolvedTheme);
          document.documentElement.setAttribute('data-theme', resolvedTheme);
        }
      },
    }
  )
);

// Hook to initialize theme on client
export function useInitializeTheme() {
  const { theme, setTheme } = useThemeStore();

  if (typeof window !== 'undefined') {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        setTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }
}
