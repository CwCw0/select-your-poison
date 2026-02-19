import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  gamertag: string;
  email: string;
  image?: string | null;
  createdAt?: Date;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  signup: (gamertag: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithProvider: (provider: 'discord' | 'google') => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      signup: async (gamertag, email, password) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gamertag, email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            set({ error: data.error || 'Signup failed', isLoading: false });
            return false;
          }

          // Auto-login after signup
          const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const loginData = await loginResponse.json();

          if (!loginResponse.ok) {
            set({ error: 'Account created. Please log in.', isLoading: false });
            return true;
          }

          set({
            user: {
              id: loginData.user.id,
              gamertag: loginData.user.gamertag,
              email: loginData.user.email,
            },
            isLoading: false,
          });
          return true;
        } catch {
          set({ error: 'Network error. Please try again.', isLoading: false });
          return false;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            set({ error: data.error || 'Invalid email or password', isLoading: false });
            return false;
          }

          set({
            user: {
              id: data.user.id,
              gamertag: data.user.gamertag,
              email: data.user.email,
            },
            isLoading: false,
          });
          return true;
        } catch {
          set({ error: 'Network error. Please try again.', isLoading: false });
          return false;
        }
      },

      loginWithProvider: async () => {
        set({ error: 'OAuth login requires database setup. Use email/password for now.', isLoading: false });
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
          set({ user: null, isLoading: false });
        } catch {
          set({ user: null, isLoading: false });
        }
      },

      setUser: (user) => set({ user }),

      clearError: () => set({ error: null }),

      checkSession: async () => {
        try {
          const response = await fetch('/api/auth/me');
          const data = await response.json();

          if (response.ok && data.user) {
            set({
              user: {
                id: data.user.id,
                gamertag: data.user.gamertag,
                email: data.user.email,
              },
            });
          } else {
            set({ user: null });
          }
        } catch {
          // Session check failed silently
        }
      },
    }),
    {
      name: 'syp-auth-store',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
