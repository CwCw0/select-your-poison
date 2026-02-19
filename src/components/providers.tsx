'use client';

import { ReactNode, useEffect } from 'react';
import { EasterEggProvider } from './EasterEggs';
import { Onboarding } from './Onboarding';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';

interface ProvidersProps {
  children: ReactNode;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, resolvedTheme, setTheme } = useThemeStore();

  useEffect(() => {
    if (theme === 'system') {
      setTheme('system');
    }
  }, [theme, setTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return <>{children}</>;
}

function AuthInitializer({ children }: { children: ReactNode }) {
  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return <>{children}</>;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthInitializer>
      <ThemeProvider>
        <EasterEggProvider>
          <Onboarding />
          {children}
        </EasterEggProvider>
      </ThemeProvider>
    </AuthInitializer>
  );
}
