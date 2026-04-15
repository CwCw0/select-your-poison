import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameMode, IntensityLevel, GameStatus, GameSide, AgentType, Player, Strat } from '@/types';
import { generateLobbyCode } from '@/lib/utils';
import { getRandomStrat } from '@/lib/strats';

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
}

interface LobbyState {
  id: string | null;
  status: GameStatus;
  settings: GameSettings;
  game: GameState;
  players: Player[];
  currentPlayerId: string | null;
}

interface GameStore extends LobbyState {
  // Lobby Actions
  createLobby: (settings: GameSettings) => string;
  joinLobby: (lobbyId: string, playerName: string) => void;
  leaveLobby: () => void;
  setPlayerReady: (playerId: string, isReady: boolean) => void;

  // Player Actions
  setCurrentPlayer: (playerId: string) => void;
  updatePlayerAgent: (playerId: string, agent: AgentType) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;

  // Game Actions
  startGame: () => void;
  endGame: () => void;
  switchSides: () => void;
  roundWon: () => void;
  roundLost: () => void;
  addDeath: (playerId: string) => void;
  addDrink: (playerId: string, amount?: number) => void;

  // Strat Actions
  rollStrat: () => void;
  acceptStrat: () => void;
  rerollStrat: () => void;
  skipStrat: () => void;

  // Settings Actions
  updateSettings: (settings: Partial<GameSettings>) => void;
  toggleMode: (mode: GameMode) => void;
  setIntensity: (intensity: IntensityLevel) => void;

  // Server Actions (stubs for multiplayer — Phase 3/4)
  leaveLobbyOnServer: () => void;
  resumeFromHalftimeOnServer: () => void;
}

const initialGameState: GameState = {
  round: 1,
  teamScore: 0,
  enemyScore: 0,
  side: 'attack',
  currentStrat: null,
  rerollsLeft: 3,
};

const initialSettings: GameSettings = {
  modes: ['classic'],
  intensity: 'ranked',
  maxPlayers: 5,
};

const generatePlayerId = () => `player_${Math.random().toString(36).substring(2, 9)}`;

const playerColors = ['#7DD3FC', '#A855F7', '#F97316', '#22C55E', '#F59E0B'];

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial State
      id: null,
      status: 'waiting',
      settings: initialSettings,
      game: initialGameState,
      players: [],
      currentPlayerId: null,

      // Lobby Actions
      createLobby: (settings) => {
        const lobbyId = generateLobbyCode();
        const playerId = generatePlayerId();

        const hostPlayer: Player = {
          id: playerId,
          name: 'Host',
          agent: null,
          color: playerColors[0],
          deaths: 0,
          drinks: 0,
          isHost: true,
          isReady: false,
          connected: true,
        };

        set({
          id: lobbyId,
          status: 'waiting',
          settings,
          game: initialGameState,
          players: [hostPlayer],
          currentPlayerId: playerId,
        });

        return lobbyId;
      },

      joinLobby: (lobbyId, playerName) => {
        const { players, settings } = get();

        if (players.length >= settings.maxPlayers) {
          throw new Error('Lobby is full');
        }

        const playerId = generatePlayerId();
        const colorIndex = players.length % playerColors.length;

        const newPlayer: Player = {
          id: playerId,
          name: playerName,
          agent: null,
          color: playerColors[colorIndex],
          deaths: 0,
          drinks: 0,
          isHost: false,
          isReady: false,
          connected: true,
        };

        set({
          id: lobbyId,
          players: [...players, newPlayer],
          currentPlayerId: playerId,
        });
      },

      leaveLobby: () => {
        set({
          id: null,
          status: 'waiting',
          settings: initialSettings,
          game: initialGameState,
          players: [],
          currentPlayerId: null,
        });
      },

      setPlayerReady: (playerId, isReady) => {
        set((state) => ({
          players: state.players.map((p) =>
            p.id === playerId ? { ...p, isReady } : p
          ),
        }));
      },

      // Player Actions
      setCurrentPlayer: (playerId) => {
        set({ currentPlayerId: playerId });
      },

      updatePlayerAgent: (playerId, agent) => {
        set((state) => ({
          players: state.players.map((p) =>
            p.id === playerId ? { ...p, agent } : p
          ),
        }));
      },

      addPlayer: (player) => {
        set((state) => ({
          players: [...state.players, player],
        }));
      },

      removePlayer: (playerId) => {
        set((state) => ({
          players: state.players.filter((p) => p.id !== playerId),
        }));
      },

      // Game Actions
      startGame: () => {
        const { settings } = get();

        set({
          status: 'in_progress',
          game: {
            ...initialGameState,
            currentStrat: settings.modes.includes('strat_roulette')
              ? getRandomStrat()
              : null,
          },
        });
      },

      endGame: () => {
        const { players, game } = get();

        // Calculate game stats
        const totalDeaths = players.reduce((sum, p) => sum + p.deaths, 0);
        const totalDrinks = players.reduce((sum, p) => sum + p.drinks, 0);
        const winner = game.teamScore > game.enemyScore ? 'team' : 'enemy';

        set({ status: 'ended' });
      },

      switchSides: () => {
        set((state) => ({
          game: {
            ...state.game,
            side: state.game.side === 'attack' ? 'defense' : 'attack',
          },
        }));
      },

      roundWon: () => {
        const { game, settings, status } = get();
        const newTeamScore = game.teamScore + 1;
        const newRound = game.round + 1;

        // Check for halftime (round 12 complete)
        const isHalftime = newRound === 13 && game.side === 'attack';

        // Check for overtime (12-12)
        const isOvertime = newTeamScore === 12 && game.enemyScore === 12;

        // Check for game end (13 wins)
        const isGameEnd = newTeamScore === 13 || (status === 'overtime' && newTeamScore === 14);

        let newStatus: GameStatus = 'in_progress';
        let newSide: GameSide = game.side;

        if (isHalftime) {
          newStatus = 'halftime';
          newSide = 'defense';
        } else if (isOvertime) {
          newStatus = 'overtime';
        } else if (isGameEnd) {
          newStatus = 'ended';
        }

        set({
          status: newStatus,
          game: {
            ...game,
            round: newRound,
            teamScore: newTeamScore,
            side: newSide,
            currentStrat: settings.modes.includes('strat_roulette') && !isGameEnd
              ? getRandomStrat()
              : null,
          },
        });
      },

      roundLost: () => {
        const { game, settings, status } = get();
        const newEnemyScore = game.enemyScore + 1;
        const newRound = game.round + 1;

        // Check for halftime
        const isHalftime = newRound === 13 && game.side === 'attack';

        // Check for overtime
        const isOvertime = game.teamScore === 12 && newEnemyScore === 12;

        // Check for game end
        const isGameEnd = newEnemyScore === 13 || (status === 'overtime' && newEnemyScore === 14);

        let newStatus: GameStatus = 'in_progress';
        let newSide: GameSide = game.side;

        if (isHalftime) {
          newStatus = 'halftime';
          newSide = 'defense';
        } else if (isOvertime) {
          newStatus = 'overtime';
        } else if (isGameEnd) {
          newStatus = 'ended';
        }

        set({
          status: newStatus,
          game: {
            ...game,
            round: newRound,
            enemyScore: newEnemyScore,
            side: newSide,
            currentStrat: settings.modes.includes('strat_roulette') && !isGameEnd
              ? getRandomStrat()
              : null,
          },
        });
      },

      addDeath: (playerId) => {
        const { settings, status } = get();
        const intensityMultiplier = getIntensityMultiplier(settings.intensity);
        // Apply 2X multiplier during overtime
        const overtimeMultiplier = status === 'overtime' ? 2 : 1;
        const totalMultiplier = intensityMultiplier * overtimeMultiplier;
        const drinksToAdd = settings.modes.includes('classic') ? Math.ceil(1 * totalMultiplier) : 0;

        set((state) => ({
          players: state.players.map((p) =>
            p.id === playerId
              ? { ...p, deaths: p.deaths + 1, drinks: p.drinks + drinksToAdd }
              : p
          ),
        }));
      },

      addDrink: (playerId, amount = 1) => {
        set((state) => ({
          players: state.players.map((p) =>
            p.id === playerId ? { ...p, drinks: p.drinks + amount } : p
          ),
        }));
      },

      // Strat Actions
      rollStrat: () => {
        set((state) => ({
          game: {
            ...state.game,
            currentStrat: getRandomStrat(),
          },
        }));
      },

      acceptStrat: () => {
        set((state) => ({
          game: {
            ...state.game,
            // Mark strat as accepted by keeping it visible (no-op on strat itself)
            // but lock in the reroll count so it can't be changed
          },
        }));
      },

      rerollStrat: () => {
        const { game } = get();

        if (game.rerollsLeft <= 0) {
          throw new Error('No rerolls left');
        }

        set((state) => ({
          game: {
            ...state.game,
            currentStrat: getRandomStrat(),
            rerollsLeft: state.game.rerollsLeft - 1,
          },
        }));
      },

      skipStrat: () => {
        set((state) => ({
          game: {
            ...state.game,
            currentStrat: null,
          },
        }));
      },

      // Settings Actions
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

          // Ensure at least one mode is selected
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

      // Server action stubs (Phase 3/4 multiplayer)
      leaveLobbyOnServer: () => {
        get().leaveLobby();
      },
      resumeFromHalftimeOnServer: () => {
        set({ status: 'in_progress' });
      },
    }),
    {
      name: 'syp-game-store',
      partialize: (state) => ({
        id: state.id,
        currentPlayerId: state.currentPlayerId,
      }),
    }
  )
);

function getIntensityMultiplier(intensity: IntensityLevel): number {
  switch (intensity) {
    case 'casual':
      return 0.5;
    case 'ranked':
      return 1;
    case 'immortal':
      return 1.5;
    case 'radiant':
      return 2;
    default:
      return 1;
  }
}

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
  return useGameStore((state) => state.status === 'overtime');
};

export const useCurrentMultiplier = () => {
  const { settings, status } = useGameStore();
  const intensityMultiplier = getIntensityMultiplier(settings.intensity);
  const overtimeMultiplier = status === 'overtime' ? 2 : 1;
  return intensityMultiplier * overtimeMultiplier;
};
