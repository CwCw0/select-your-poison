// Game Types
export type GameMode = 'classic' | 'agent_poison' | 'strat_roulette' | 'challenges' | 'punishment';
export type IntensityLevel = 'casual' | 'ranked' | 'immortal' | 'radiant';
export type GameStatus = 'waiting' | 'in_progress' | 'halftime' | 'overtime' | 'ended';
export type GameSide = 'attack' | 'defense';

// Agent Types
export type AgentRole = 'duelist' | 'controller' | 'initiator' | 'sentinel';
export type AgentType =
  | 'jett' | 'reyna' | 'phoenix' | 'raze' | 'yoru' | 'neon' | 'iso'
  | 'brimstone' | 'viper' | 'omen' | 'astra' | 'harbor' | 'clove'
  | 'sova' | 'breach' | 'skye' | 'kayo' | 'fade' | 'gekko'
  | 'sage' | 'cypher' | 'killjoy' | 'chamber' | 'deadlock' | 'vyse';

// Strat Types
export type StratCategory = 'easy' | 'medium' | 'hard' | 'stupid';
export type StratDuration = 'round' | 'half' | 'game';

export interface Strat {
  id: string;
  text: string;
  description: string;
  category: StratCategory;
  penalty: number;
  duration: StratDuration;
}

// Player Types
export interface Player {
  id: string;
  name: string;
  agent: AgentType | null;
  color: string;
  deaths: number;
  drinks: number;
  isHost: boolean;
  isReady: boolean;
  connected: boolean;
}

// Agent Rules
export interface AgentRule {
  agent: AgentType;
  rule: string;
  drinks: number;
  icon: string;
}

// Lobby Types
export interface LobbySettings {
  modes: GameMode[];
  intensity: IntensityLevel;
  maxPlayers: number;
}

export interface GameState {
  round: number;
  teamScore: number;
  enemyScore: number;
  side: GameSide;
  currentStrat: Strat | null;
}

export interface RoundHistory {
  round: number;
  result: 'won' | 'lost';
  strat: Strat | null;
  events: GameEvent[];
}

export interface GameEvent {
  type: 'death' | 'drink' | 'strat_complete' | 'strat_failed';
  playerId: string;
  timestamp: number;
  value?: number;
}

export interface Lobby {
  id: string;
  hostId: string;
  status: GameStatus;
  settings: LobbySettings;
  game: GameState;
  players: Player[];
  history: RoundHistory[];
  createdAt: number;
  expiresAt: number;
}

// UI Types
export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface GameModeCard {
  id: GameMode;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface IntensityPreset {
  id: IntensityLevel;
  title: string;
  description: string;
  multiplier: number;
  isPopular?: boolean;
}
