'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import { EasterEggProvider } from './EasterEggs';
import { Onboarding } from './Onboarding';
import { useThemeStore } from '@/store/theme-store';

interface ProvidersProps {
  children: ReactNode;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, resolvedTheme, setTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme from system preference if set to 'system'
    if (theme === 'system') {
      setTheme('system');
    }
  }, [theme, setTheme]);

  useEffect(() => {
    // Apply theme class to document
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return <>{children}</>;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <EasterEggProvider>
          <Onboarding />
          {children}
        </EasterEggProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
