import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signIn, signOut } from 'next-auth/react';

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
          // First create the account
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

          // Then sign in with credentials
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
          });

          if (result?.error) {
            set({ error: 'Account created. Please sign in.', isLoading: false });
            return true; // Account was created, just sign-in failed
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
        } catch (error) {
          set({ error: 'Network error. Please try again.', isLoading: false });
          return false;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
          });

          if (result?.error) {
            set({ error: 'Invalid email or password', isLoading: false });
            return false;
          }

          set({ isLoading: false });
          return true;
        } catch (error) {
          set({ error: 'Network error. Please try again.', isLoading: false });
          return false;
        }
      },

      loginWithProvider: async (provider) => {
        set({ isLoading: true, error: null });
        try {
          await signIn(provider, { callbackUrl: '/lobby/create' });
        } catch (error) {
          set({ error: 'Failed to connect. Please try again.', isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await signOut({ callbackUrl: '/' });
          set({ user: null, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
        }
      },

      setUser: (user) => set({ user }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'syp-auth-store',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
