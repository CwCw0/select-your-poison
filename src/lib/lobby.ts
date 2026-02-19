import { GameMode, IntensityLevel, AgentType, GameSide, Strat } from '@/types';
import { generateLobbyCode } from '@/lib/utils';
import { getRandomStrat } from '@/lib/strats';

// Lobby types
export interface LobbySettings {
  modes: GameMode[];
  intensity: IntensityLevel;
  maxPlayers: number;
}

export interface LobbyPlayer {
  id: string;
  name: string;
  agent: AgentType | null;
  color: string;
  isHost: boolean;
  isReady: boolean;
  deaths: number;
  drinks: number;
  joinedAt: Date;
  connected: boolean;
}

export interface GameState {
  round: number;
  teamScore: number;
  enemyScore: number;
  side: GameSide;
  currentStrat: Strat | null;
  rerollsLeft: number;
  status: 'waiting' | 'in_progress' | 'halftime' | 'overtime' | 'ended';
}

export interface Lobby {
  id: string;
  code: string;
  hostId: string;
  settings: LobbySettings;
  players: LobbyPlayer[];
  game: GameState;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory store
const lobbies: Map<string, Lobby> = new Map();
const codeToLobby: Map<string, string> = new Map();

const playerColors = ['#7DD3FC', '#A855F7', '#F97316', '#22C55E', '#F59E0B', '#EC4899', '#06B6D4', '#EF4444'];

function generateLobbyId(): string {
  return `lobby_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
}

function generatePlayerId(): string {
  return `player_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
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

export async function createLobby(
  hostName: string,
  settings: LobbySettings,
  userId?: string
): Promise<{ lobby: Lobby; playerId: string }> {
  const lobbyId = generateLobbyId();
  const code = generateLobbyCode();
  const playerId = userId || generatePlayerId();

  const hostPlayer: LobbyPlayer = {
    id: playerId,
    name: hostName.toUpperCase(),
    agent: null,
    color: playerColors[0],
    isHost: true,
    isReady: false,
    deaths: 0,
    drinks: 0,
    joinedAt: new Date(),
    connected: true,
  };

  const lobby: Lobby = {
    id: lobbyId,
    code,
    hostId: playerId,
    settings,
    players: [hostPlayer],
    game: { ...initialGameState },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  lobbies.set(lobbyId, lobby);
  codeToLobby.set(code, lobbyId);

  return { lobby, playerId };
}

export async function getLobby(lobbyId: string): Promise<Lobby | null> {
  return lobbies.get(lobbyId) || null;
}

export async function getLobbyByCode(code: string): Promise<Lobby | null> {
  const lobbyId = codeToLobby.get(code.toUpperCase());
  if (!lobbyId) return null;
  return lobbies.get(lobbyId) || null;
}

export async function joinLobby(
  code: string,
  playerName: string,
  userId?: string
): Promise<{ lobby: Lobby; playerId: string } | { error: string }> {
  const lobby = await getLobbyByCode(code);

  if (!lobby) {
    return { error: 'Lobby not found' };
  }

  if (lobby.game.status !== 'waiting') {
    return { error: 'Game already in progress' };
  }

  if (lobby.players.length >= lobby.settings.maxPlayers) {
    return { error: 'Lobby is full' };
  }

  const nameExists = lobby.players.some(
    (p) => p.name.toUpperCase() === playerName.toUpperCase()
  );

  if (nameExists) {
    return { error: 'Name already taken in this lobby' };
  }

  const playerId = userId || generatePlayerId();
  const colorIndex = lobby.players.length % playerColors.length;

  const newPlayer: LobbyPlayer = {
    id: playerId,
    name: playerName.toUpperCase(),
    agent: null,
    color: playerColors[colorIndex],
    isHost: false,
    isReady: false,
    deaths: 0,
    drinks: 0,
    joinedAt: new Date(),
    connected: true,
  };

  lobby.players.push(newPlayer);
  lobby.updatedAt = new Date();

  return { lobby, playerId };
}

export async function leaveLobby(
  lobbyId: string,
  playerId: string
): Promise<{ lobby: Lobby | null } | { error: string }> {
  const lobby = lobbies.get(lobbyId);

  if (!lobby) {
    return { error: 'Lobby not found' };
  }

  const playerIndex = lobby.players.findIndex((p) => p.id === playerId);

  if (playerIndex === -1) {
    return { error: 'Player not in lobby' };
  }

  const isHost = lobby.players[playerIndex].isHost;
  lobby.players.splice(playerIndex, 1);
  lobby.updatedAt = new Date();

  if (isHost) {
    if (lobby.players.length > 0) {
      lobby.players[0].isHost = true;
      lobby.hostId = lobby.players[0].id;
    } else {
      lobbies.delete(lobbyId);
      codeToLobby.delete(lobby.code);
      return { lobby: null };
    }
  }

  return { lobby };
}

export async function updatePlayerAgent(
  lobbyId: string,
  playerId: string,
  agent: AgentType
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobby = lobbies.get(lobbyId);

  if (!lobby) {
    return { error: 'Lobby not found' };
  }

  const player = lobby.players.find((p) => p.id === playerId);

  if (!player) {
    return { error: 'Player not in lobby' };
  }

  player.agent = agent;
  lobby.updatedAt = new Date();

  return { lobby };
}

export async function setPlayerReady(
  lobbyId: string,
  playerId: string,
  isReady: boolean
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobby = lobbies.get(lobbyId);

  if (!lobby) {
    return { error: 'Lobby not found' };
  }

  const player = lobby.players.find((p) => p.id === playerId);

  if (!player) {
    return { error: 'Player not in lobby' };
  }

  player.isReady = isReady;
  lobby.updatedAt = new Date();

  return { lobby };
}

export async function updateLobbySettings(
  lobbyId: string,
  playerId: string,
  settings: Partial<LobbySettings>
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobby = lobbies.get(lobbyId);

  if (!lobby) {
    return { error: 'Lobby not found' };
  }

  if (lobby.hostId !== playerId) {
    return { error: 'Only host can update settings' };
  }

  lobby.settings = { ...lobby.settings, ...settings };
  lobby.updatedAt = new Date();

  return { lobby };
}

export async function startGame(
  lobbyId: string,
  playerId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobby = lobbies.get(lobbyId);

  if (!lobby) {
    return { error: 'Lobby not found' };
  }

  if (lobby.hostId !== playerId) {
    return { error: 'Only host can start the game' };
  }

  if (lobby.game.status !== 'waiting') {
    return { error: 'Game already started' };
  }

  lobby.game.status = 'in_progress';
  lobby.game.currentStrat = lobby.settings.modes.includes('strat_roulette')
    ? getRandomStrat()
    : null;
  lobby.updatedAt = new Date();

  return { lobby };
}

export async function endGame(
  lobbyId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobby = lobbies.get(lobbyId);

  if (!lobby) {
    return { error: 'Lobby not found' };
  }

  lobby.game.status = 'ended';
  lobby.updatedAt = new Date();

  return { lobby };
}

// Game actions
function getIntensityMultiplier(intensity: IntensityLevel): number {
  switch (intensity) {
    case 'casual': return 0.5;
    case 'ranked': return 1;
    case 'immortal': return 1.5;
    case 'radiant': return 2;
    default: return 1;
  }
}

export async function addDeath(
  lobbyId: string,
  playerId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobby = lobbies.get(lobbyId);

  if (!lobby) {
    return { error: 'Lobby not found' };
  }

  const player = lobby.players.find((p) => p.id === playerId);
  if (!player) {
    return { error: 'Player not in lobby' };
  }

  const intensityMultiplier = getIntensityMultiplier(lobby.settings.intensity);
  const overtimeMultiplier = lobby.game.status === 'overtime' ? 2 : 1;
  const totalMultiplier = intensityMultiplier * overtimeMultiplier;
  const drinksToAdd = lobby.settings.modes.includes('classic') ? Math.ceil(1 * totalMultiplier) : 0;

  player.deaths += 1;
  player.drinks += drinksToAdd;
  lobby.updatedAt = new Date();

  return { lobby };
}

export async function addDrink(
  lobbyId: string,
  playerId: string,
  amount: number = 1
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobby = lobbies.get(lobbyId);

  if (!lobby) {
    return { error: 'Lobby not found' };
  }

  const player = lobby.players.find((p) => p.id === playerId);
  if (!player) {
    return { error: 'Player not in lobby' };
  }

  player.drinks += amount;
  lobby.updatedAt = new Date();

  return { lobby };
}

export async function roundWon(
  lobbyId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobby = lobbies.get(lobbyId);

  if (!lobby) {
    return { error: 'Lobby not found' };
  }

  const { game, settings } = lobby;
  const newTeamScore = game.teamScore + 1;
  const newRound = game.round + 1;

  const isHalftime = newRound === 13 && game.side === 'attack';
  const isOvertime = newTeamScore === 12 && game.enemyScore === 12;
  const isGameEnd = newTeamScore === 13 || (game.status === 'overtime' && newTeamScore === 14);

  let newStatus = game.status;
  let newSide: GameSide = game.side;

  if (isGameEnd) {
    newStatus = 'ended';
  } else if (isHalftime) {
    newStatus = 'halftime';
    newSide = 'defense';
  } else if (isOvertime) {
    newStatus = 'overtime';
  }

  lobby.game = {
    ...game,
    round: newRound,
    teamScore: newTeamScore,
    side: newSide,
    status: newStatus,
    currentStrat: settings.modes.includes('strat_roulette') && !isGameEnd
      ? getRandomStrat()
      : null,
  };
  lobby.updatedAt = new Date();

  return { lobby };
}

export async function roundLost(
  lobbyId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobby = lobbies.get(lobbyId);

  if (!lobby) {
    return { error: 'Lobby not found' };
  }

  const { game, settings } = lobby;
  const newEnemyScore = game.enemyScore + 1;
  const newRound = game.round + 1;

  const isHalftime = newRound === 13 && game.side === 'attack';
  const isOvertime = game.teamScore === 12 && newEnemyScore === 12;
  const isGameEnd = newEnemyScore === 13 || (game.status === 'overtime' && newEnemyScore === 14);

  let newStatus = game.status;
  let newSide: GameSide = game.side;

  if (isGameEnd) {
    newStatus = 'ended';
  } else if (isHalftime) {
    newStatus = 'halftime';
    newSide = 'defense';
  } else if (isOvertime) {
    newStatus = 'overtime';
  }

  lobby.game = {
    ...game,
    round: newRound,
    enemyScore: newEnemyScore,
    side: newSide,
    status: newStatus,
    currentStrat: settings.modes.includes('strat_roulette') && !isGameEnd
      ? getRandomStrat()
      : null,
  };
  lobby.updatedAt = new Date();

  return { lobby };
}

export async function switchSides(
  lobbyId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobby = lobbies.get(lobbyId);

  if (!lobby) {
    return { error: 'Lobby not found' };
  }

  lobby.game.side = lobby.game.side === 'attack' ? 'defense' : 'attack';
  lobby.updatedAt = new Date();

  return { lobby };
}

export async function rollStrat(
  lobbyId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobby = lobbies.get(lobbyId);

  if (!lobby) {
    return { error: 'Lobby not found' };
  }

  lobby.game.currentStrat = getRandomStrat();
  lobby.updatedAt = new Date();

  return { lobby };
}

export async function rerollStrat(
  lobbyId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobby = lobbies.get(lobbyId);

  if (!lobby) {
    return { error: 'Lobby not found' };
  }

  if (lobby.game.rerollsLeft <= 0) {
    return { error: 'No rerolls left' };
  }

  lobby.game.currentStrat = getRandomStrat();
  lobby.game.rerollsLeft -= 1;
  lobby.updatedAt = new Date();

  return { lobby };
}

export async function skipStrat(
  lobbyId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobby = lobbies.get(lobbyId);

  if (!lobby) {
    return { error: 'Lobby not found' };
  }

  lobby.game.currentStrat = null;
  lobby.updatedAt = new Date();

  return { lobby };
}

export async function resumeFromHalftime(
  lobbyId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobby = lobbies.get(lobbyId);

  if (!lobby) {
    return { error: 'Lobby not found' };
  }

  lobby.game.status = 'in_progress';
  lobby.updatedAt = new Date();

  return { lobby };
}

// Get all active lobbies
export async function getAllLobbies(): Promise<Lobby[]> {
  return Array.from(lobbies.values());
}

// Cleanup old lobbies
export async function cleanupOldLobbies(maxAgeMs: number = 24 * 60 * 60 * 1000): Promise<number> {
  const now = Date.now();
  let deleted = 0;

  for (const [id, lobby] of lobbies.entries()) {
    if (now - lobby.updatedAt.getTime() > maxAgeMs) {
      lobbies.delete(id);
      codeToLobby.delete(lobby.code);
      deleted++;
    }
  }

  return deleted;
}
