import { LobbySettings, AgentType } from '@/types';
import { generateLobbyCode } from '@/lib/utils';

// Lobby-specific player type (waiting room — no deaths/drinks/connected yet)
export interface LobbyPlayer {
  id: string;
  name: string;
  agent: AgentType | null;
  isHost: boolean;
  isReady: boolean;
  joinedAt: Date;
}

// Lobby state for waiting room phase (in-memory now, Prisma later)
export interface Lobby {
  id: string;
  code: string;
  hostId: string;
  settings: LobbySettings;
  players: LobbyPlayer[];
  status: 'waiting' | 'in_progress' | 'ended';
  createdAt: Date;
  updatedAt: Date;
}

// In-memory store (replace with database in production)
const lobbies: Map<string, Lobby> = new Map();
const codeToLobby: Map<string, string> = new Map(); // code -> lobbyId

const playerColors = ['#7DD3FC', '#A855F7', '#F97316', '#22C55E', '#F59E0B'];

function generateLobbyId(): string {
  return `lobby_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
}

function generatePlayerId(): string {
  return `player_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
}

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
    isHost: true,
    isReady: false,
    joinedAt: new Date(),
  };

  const lobby: Lobby = {
    id: lobbyId,
    code,
    hostId: playerId,
    settings,
    players: [hostPlayer],
    status: 'waiting',
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

  if (lobby.status !== 'waiting') {
    return { error: 'Game already in progress' };
  }

  if (lobby.players.length >= lobby.settings.maxPlayers) {
    return { error: 'Lobby is full' };
  }

  // Check if player name is already taken in this lobby
  const nameExists = lobby.players.some(
    (p) => p.name.toUpperCase() === playerName.toUpperCase()
  );

  if (nameExists) {
    return { error: 'Name already taken in this lobby' };
  }

  const playerId = userId || generatePlayerId();

  const newPlayer: LobbyPlayer = {
    id: playerId,
    name: playerName.toUpperCase(),
    agent: null,
    isHost: false,
    isReady: false,
    joinedAt: new Date(),
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

  // If host left, either assign new host or delete lobby
  if (isHost) {
    if (lobby.players.length > 0) {
      lobby.players[0].isHost = true;
      lobby.hostId = lobby.players[0].id;
    } else {
      // Delete empty lobby
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

  if (lobby.status !== 'waiting') {
    return { error: 'Game already started' };
  }

  lobby.status = 'in_progress';
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

  lobby.status = 'ended';
  lobby.updatedAt = new Date();

  return { lobby };
}

// Get all active lobbies (for debugging/admin)
export async function getAllLobbies(): Promise<Lobby[]> {
  return Array.from(lobbies.values());
}

// Cleanup old lobbies (call periodically)
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
