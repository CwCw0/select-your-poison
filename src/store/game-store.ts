import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameMode, IntensityLevel, GameStatus, AgentType, Player, Strat, GameSide } from '@/types';

interface GameSettings {
  modes: GameMode[];
  intensity: IntensityLevel;
  maxPlayers: number;
}

interface GameState {
  round: number;
  teamScore: number;
  enemyScore: number;
  side: GameSide;
  currentStrat: Strat | null;
  rerollsLeft: number;
  status: GameStatus;
}

interface ServerPlayer {
  id: string;
  name: string;
  agent: AgentType | null;
  color: string;
  isHost: boolean;
  isReady: boolean;
  deaths: number;
  drinks: number;
  connected: boolean;
}

interface LobbyState {
  lobbyCode: string | null;
  lobbyId: string | null;
  settings: GameSettings;
  game: GameState;
  players: Player[];
  currentPlayerId: string | null;
  lastError: string | null;
}

interface GameStore extends LobbyState {
  // Server-synced lobby actions
  createLobbyOnServer: (hostName: string, agent: AgentType | null, settings: GameSettings) => Promise<string | null>;
  joinLobbyOnServer: (code: string, playerName: string) => Promise<boolean>;
  leaveLobbyOnServer: () => Promise<void>;

  // Server-synced player actions
  updateAgentOnServer: (agent: AgentType) => Promise<void>;
  setReadyOnServer: (isReady: boolean) => Promise<void>;

  // Server-synced game actions
  startGameOnServer: () => Promise<void>;
  endGameOnServer: () => Promise<void>;
  roundWonOnServer: () => Promise<void>;
  roundLostOnServer: () => Promise<void>;
  switchSidesOnServer: () => Promise<void>;
  addDeathOnServer: (playerId: string) => Promise<void>;
  addDrinkOnServer: (playerId: string, amount?: number) => Promise<void>;
  resumeFromHalftimeOnServer: () => Promise<void>;

  // Server-synced strat actions
  rollStratOnServer: () => Promise<void>;
  rerollStratOnServer: () => Promise<void>;
  skipStratOnServer: () => Promise<void>;

  // Polling
  fetchLobby: () => Promise<void>;
  syncFromServer: (lobbyData: ServerLobbyData) => void;
  resetStore: () => void;

  // Settings (local before lobby creation)
  updateSettings: (settings: Partial<GameSettings>) => void;
  toggleMode: (mode: GameMode) => void;
  setIntensity: (intensity: IntensityLevel) => void;
}

interface ServerLobbyData {
  id: string;
  code: string;
  hostId: string;
  settings: GameSettings;
  players: ServerPlayer[];
  game: GameState;
}

const initialGameState: GameState = {
  round: 1,
  teamScore: 0,
  enemyScore: 0,
  side: 'attack',
  currentStrat: null,
  rerollsLeft: 3,
  status: 'waiting',
};

const initialSettings: GameSettings = {
  modes: ['classic'],
  intensity: 'ranked',
  maxPlayers: 5,
};

async function lobbyAction(code: string, action: string, extra: Record<string, unknown> = {}): Promise<ServerLobbyData | null> {
  try {
    const response = await fetch(`/api/lobby/${code}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...extra }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error(`Lobby action ${action} failed:`, data.error);
      return null;
    }
    return data.lobby;
  } catch (error) {
    console.error(`Lobby action ${action} error:`, error);
    return null;
  }
}

function serverPlayerToPlayer(sp: ServerPlayer): Player {
  return {
    id: sp.id,
    name: sp.name,
    agent: sp.agent,
    color: sp.color,
    deaths: sp.deaths,
    drinks: sp.drinks,
    isHost: sp.isHost,
    isReady: sp.isReady,
    connected: sp.connected,
  };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial State
      lobbyCode: null,
      lobbyId: null,
      settings: initialSettings,
      game: initialGameState,
      players: [],
      currentPlayerId: null,
      lastError: null,

      // Create lobby via server API
      createLobbyOnServer: async (hostName, agent, settings) => {
        try {
          const response = await fetch('/api/lobby/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hostName, settings }),
          });
          const data = await response.json();

          if (!response.ok) {
            set({ lastError: data.error });
            return null;
          }

          const lobby = data.lobby as ServerLobbyData;
          const playerId = data.playerId as string;

          // Update agent if selected
          if (agent) {
            const agentResp = await fetch(`/api/lobby/${lobby.code}/player`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ playerId, agent }),
            });
            const agentData = await agentResp.json();
            if (agentResp.ok && agentData.lobby) {
              const updatedLobby = agentData.lobby as ServerLobbyData;
              set({
                lobbyCode: updatedLobby.code,
                lobbyId: updatedLobby.id,
                currentPlayerId: playerId,
                settings: updatedLobby.settings,
                game: updatedLobby.game,
                players: updatedLobby.players.map(serverPlayerToPlayer),
                lastError: null,
              });
              return updatedLobby.code;
            }
          }

          set({
            lobbyCode: lobby.code,
            lobbyId: lobby.id,
            currentPlayerId: playerId,
            settings: lobby.settings,
            game: lobby.game,
            players: lobby.players.map(serverPlayerToPlayer),
            lastError: null,
          });

          return lobby.code;
        } catch {
          set({ lastError: 'Failed to create lobby' });
          return null;
        }
      },

      // Join lobby via server API
      joinLobbyOnServer: async (code, playerName) => {
        try {
          const response = await fetch('/api/lobby/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: code.toUpperCase(), playerName }),
          });
          const data = await response.json();

          if (!response.ok) {
            set({ lastError: data.error });
            return false;
          }

          const lobby = data.lobby as ServerLobbyData;
          const playerId = data.playerId as string;

          set({
            lobbyCode: lobby.code,
            lobbyId: lobby.id,
            currentPlayerId: playerId,
            settings: lobby.settings,
            game: lobby.game,
            players: lobby.players.map(serverPlayerToPlayer),
            lastError: null,
          });

          return true;
        } catch {
          set({ lastError: 'Failed to join lobby' });
          return false;
        }
      },

      leaveLobbyOnServer: async () => {
        const { lobbyCode, currentPlayerId } = get();
        if (lobbyCode && currentPlayerId) {
          try {
            await fetch(`/api/lobby/${lobbyCode}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ playerId: currentPlayerId }),
            });
          } catch { /* ignore */ }
        }
        get().resetStore();
      },

      updateAgentOnServer: async (agent) => {
        const { lobbyCode, currentPlayerId } = get();
        if (!lobbyCode || !currentPlayerId) return;

        try {
          const response = await fetch(`/api/lobby/${lobbyCode}/player`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerId: currentPlayerId, agent }),
          });
          const data = await response.json();
          if (response.ok && data.lobby) {
            get().syncFromServer(data.lobby);
          }
        } catch { /* ignore */ }
      },

      setReadyOnServer: async (isReady) => {
        const { lobbyCode, currentPlayerId } = get();
        if (!lobbyCode || !currentPlayerId) return;

        try {
          const response = await fetch(`/api/lobby/${lobbyCode}/player`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerId: currentPlayerId, isReady }),
          });
          const data = await response.json();
          if (response.ok && data.lobby) {
            get().syncFromServer(data.lobby);
          }
        } catch { /* ignore */ }
      },

      startGameOnServer: async () => {
        const { lobbyCode, currentPlayerId } = get();
        if (!lobbyCode || !currentPlayerId) return;
        const lobby = await lobbyAction(lobbyCode, 'start_game', { playerId: currentPlayerId });
        if (lobby) get().syncFromServer(lobby);
      },

      endGameOnServer: async () => {
        const { lobbyCode } = get();
        if (!lobbyCode) return;
        const lobby = await lobbyAction(lobbyCode, 'end_game');
        if (lobby) get().syncFromServer(lobby);
      },

      roundWonOnServer: async () => {
        const { lobbyCode } = get();
        if (!lobbyCode) return;
        const lobby = await lobbyAction(lobbyCode, 'round_won');
        if (lobby) get().syncFromServer(lobby);
      },

      roundLostOnServer: async () => {
        const { lobbyCode } = get();
        if (!lobbyCode) return;
        const lobby = await lobbyAction(lobbyCode, 'round_lost');
        if (lobby) get().syncFromServer(lobby);
      },

      switchSidesOnServer: async () => {
        const { lobbyCode } = get();
        if (!lobbyCode) return;
        const lobby = await lobbyAction(lobbyCode, 'switch_sides');
        if (lobby) get().syncFromServer(lobby);
      },

      addDeathOnServer: async (playerId) => {
        const { lobbyCode } = get();
        if (!lobbyCode) return;
        const lobby = await lobbyAction(lobbyCode, 'add_death', { playerId });
        if (lobby) get().syncFromServer(lobby);
      },

      addDrinkOnServer: async (playerId, amount = 1) => {
        const { lobbyCode } = get();
        if (!lobbyCode) return;
        const lobby = await lobbyAction(lobbyCode, 'add_drink', { playerId, amount });
        if (lobby) get().syncFromServer(lobby);
      },

      resumeFromHalftimeOnServer: async () => {
        const { lobbyCode } = get();
        if (!lobbyCode) return;
        const lobby = await lobbyAction(lobbyCode, 'resume_halftime');
        if (lobby) get().syncFromServer(lobby);
      },

      rollStratOnServer: async () => {
        const { lobbyCode } = get();
        if (!lobbyCode) return;
        const lobby = await lobbyAction(lobbyCode, 'roll_strat');
        if (lobby) get().syncFromServer(lobby);
      },

      rerollStratOnServer: async () => {
        const { lobbyCode } = get();
        if (!lobbyCode) return;
        const lobby = await lobbyAction(lobbyCode, 'reroll_strat');
        if (lobby) get().syncFromServer(lobby);
      },

      skipStratOnServer: async () => {
        const { lobbyCode } = get();
        if (!lobbyCode) return;
        const lobby = await lobbyAction(lobbyCode, 'skip_strat');
        if (lobby) get().syncFromServer(lobby);
      },

      // Fetch latest lobby state from server
      fetchLobby: async () => {
        const { lobbyCode } = get();
        if (!lobbyCode) return;

        try {
          const response = await fetch(`/api/lobby/${lobbyCode}`);
          const data = await response.json();
          if (response.ok && data.lobby) {
            get().syncFromServer(data.lobby);
          }
        } catch { /* ignore polling errors */ }
      },

      // Sync local state from server data
      syncFromServer: (lobbyData) => {
        set({
          lobbyCode: lobbyData.code,
          lobbyId: lobbyData.id,
          settings: lobbyData.settings,
          game: lobbyData.game,
          players: lobbyData.players.map(serverPlayerToPlayer),
        });
      },

      resetStore: () => {
        set({
          lobbyCode: null,
          lobbyId: null,
          settings: initialSettings,
          game: initialGameState,
          players: [],
          currentPlayerId: null,
          lastError: null,
        });
      },

      // Local settings (used before lobby creation)
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      toggleMode: (mode) => {
        set((state) => {
          const modes = state.settings.modes.includes(mode)
            ? state.settings.modes.filter((m) => m !== mode)
            : [...state.settings.modes, mode];

          if (modes.length === 0) {
            modes.push('classic');
          }

          return {
            settings: { ...state.settings, modes },
          };
        });
      },

      setIntensity: (intensity) => {
        set((state) => ({
          settings: { ...state.settings, intensity },
        }));
      },
    }),
    {
      name: 'syp-game-store',
      partialize: (state) => ({
        lobbyCode: state.lobbyCode,
        lobbyId: state.lobbyId,
        currentPlayerId: state.currentPlayerId,
      }),
    }
  )
);

// Selectors
export const useCurrentPlayer = () => {
  const { players, currentPlayerId } = useGameStore();
  return players.find((p) => p.id === currentPlayerId) || null;
};

export const useIsHost = () => {
  const currentPlayer = useCurrentPlayer();
  return currentPlayer?.isHost || false;
};

export const useGameModes = () => {
  return useGameStore((state) => state.settings.modes);
};

export const useHasMode = (mode: GameMode) => {
  const modes = useGameModes();
  return modes.includes(mode);
};

export const useIsOvertime = () => {
  return useGameStore((state) => state.game.status === 'overtime');
};

export const useCurrentMultiplier = () => {
  const { settings, game } = useGameStore();
  const intensityMultiplier = getIntensityMultiplier(settings.intensity);
  const overtimeMultiplier = game.status === 'overtime' ? 2 : 1;
  return intensityMultiplier * overtimeMultiplier;
};

function getIntensityMultiplier(intensity: IntensityLevel): number {
  switch (intensity) {
    case 'casual': return 0.5;
    case 'ranked': return 1;
    case 'immortal': return 1.5;
    case 'radiant': return 2;
    default: return 1;
  }
}
