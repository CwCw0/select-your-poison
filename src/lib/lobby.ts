import { prisma } from '@/lib/db';
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
  userId?: string | null;
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

const playerColors = ['#7DD3FC', '#A855F7', '#F97316', '#22C55E', '#F59E0B', '#EC4899', '#06B6D4', '#EF4444'];

const initialGameState: GameState = {
  round: 1,
  teamScore: 0,
  enemyScore: 0,
  side: 'attack',
  currentStrat: null,
  rerollsLeft: 3,
  status: 'waiting',
};

const PLAYERS_INCLUDE = { orderBy: { joinedAt: 'asc' as const } };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPlayer(p: any): LobbyPlayer {
  return {
    id: p.id,
    userId: p.userId,
    name: p.name,
    agent: p.agent as AgentType | null,
    color: p.color,
    isHost: p.isHost,
    isReady: p.isReady,
    deaths: p.deaths,
    drinks: p.drinks,
    joinedAt: p.joinedAt,
    connected: p.connected,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toLobby(row: any): Lobby {
  return {
    id: row.id,
    code: row.code,
    hostId: row.hostId,
    settings: row.settings as LobbySettings,
    game: row.game as GameState,
    players: (row.players ?? []).map(toPlayer),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchLobby(lobbyId: string): Promise<any> {
  return prisma.lobby.findUnique({
    where: { id: lobbyId },
    include: { players: PLAYERS_INCLUDE },
  });
}

export async function createLobby(
  hostName: string,
  settings: LobbySettings,
  userId?: string
): Promise<{ lobby: Lobby; playerId: string }> {
  // Retry loop to handle rare code collisions
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateLobbyCode();
    try {
      const color = playerColors[0];
      const lobby = await prisma.lobby.create({
        data: {
          code,
          hostId: '', // Filled below after player creation
          settings: settings as object,
          game: { ...initialGameState } as object,
          players: {
            create: {
              name: hostName.toUpperCase(),
              color,
              isHost: true,
              userId: userId ?? null,
            },
          },
        },
        include: { players: PLAYERS_INCLUDE },
      });

      const hostPlayer = lobby.players[0];

      // Update hostId to the new LobbyPlayer's id
      await prisma.lobby.update({
        where: { id: lobby.id },
        data: { hostId: hostPlayer.id },
      });
      lobby.hostId = hostPlayer.id;

      return { lobby: toLobby(lobby), playerId: hostPlayer.id };
    } catch (err: unknown) {
      // Retry only on unique constraint violation (duplicate code)
      const isUniqueError =
        err instanceof Error && err.message.includes('Unique constraint');
      if (!isUniqueError) throw err;
    }
  }
  throw new Error('Failed to generate unique lobby code');
}

export async function getLobby(lobbyId: string): Promise<Lobby | null> {
  const lobby = await fetchLobby(lobbyId);
  return lobby ? toLobby(lobby) : null;
}

export async function getLobbyByCode(code: string): Promise<Lobby | null> {
  const lobby = await prisma.lobby.findUnique({
    where: { code: code.toUpperCase() },
    include: { players: PLAYERS_INCLUDE },
  });
  return lobby ? toLobby(lobby) : null;
}

export async function joinLobby(
  code: string,
  playerName: string,
  userId?: string
): Promise<{ lobby: Lobby; playerId: string } | { error: string }> {
  const lobbyRow = await prisma.lobby.findUnique({
    where: { code: code.toUpperCase() },
    include: { players: PLAYERS_INCLUDE },
  });

  if (!lobbyRow) return { error: 'Lobby not found' };

  const game = lobbyRow.game as unknown as GameState;
  if (game.status !== 'waiting') return { error: 'Game already in progress' };

  const settings = lobbyRow.settings as unknown as LobbySettings;
  if (lobbyRow.players.length >= settings.maxPlayers) return { error: 'Lobby is full' };

  const nameExists = lobbyRow.players.some(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p: any) => p.name.toUpperCase() === playerName.toUpperCase()
  );
  if (nameExists) return { error: 'Name already taken in this lobby' };

  const colorIndex = lobbyRow.players.length % playerColors.length;

  const newPlayer = await prisma.lobbyPlayer.create({
    data: {
      lobbyId: lobbyRow.id,
      name: playerName.toUpperCase(),
      color: playerColors[colorIndex],
      isHost: false,
      userId: userId ?? null,
    },
  });

  await prisma.lobby.update({
    where: { id: lobbyRow.id },
    data: { updatedAt: new Date() },
  });

  const updated = await fetchLobby(lobbyRow.id);
  return { lobby: toLobby(updated!), playerId: newPlayer.id };
}

export async function leaveLobby(
  lobbyId: string,
  playerId: string
): Promise<{ lobby: Lobby | null } | { error: string }> {
  const lobbyRow = await fetchLobby(lobbyId);
  if (!lobbyRow) return { error: 'Lobby not found' };

  const player = lobbyRow.players.find((p: LobbyPlayer) => p.id === playerId);
  if (!player) return { error: 'Player not in lobby' };

  await prisma.lobbyPlayer.delete({ where: { id: playerId } });

  if (!player.isHost) {
    await prisma.lobby.update({ where: { id: lobbyId }, data: { updatedAt: new Date() } });
    const updated = await fetchLobby(lobbyId);
    return { lobby: toLobby(updated!) };
  }

  // Host left — find the next player
  const remaining = lobbyRow.players.filter((p: LobbyPlayer) => p.id !== playerId);

  if (remaining.length === 0) {
    await prisma.lobby.delete({ where: { id: lobbyId } });
    return { lobby: null };
  }

  const newHost = remaining[0];
  await prisma.lobbyPlayer.update({
    where: { id: newHost.id },
    data: { isHost: true },
  });
  await prisma.lobby.update({
    where: { id: lobbyId },
    data: { hostId: newHost.id, updatedAt: new Date() },
  });

  const updated = await fetchLobby(lobbyId);
  return { lobby: toLobby(updated!) };
}

export async function updatePlayerAgent(
  lobbyId: string,
  playerId: string,
  agent: AgentType
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobbyRow = await fetchLobby(lobbyId);
  if (!lobbyRow) return { error: 'Lobby not found' };

  const player = lobbyRow.players.find((p: LobbyPlayer) => p.id === playerId);
  if (!player) return { error: 'Player not in lobby' };

  await prisma.lobbyPlayer.update({ where: { id: playerId }, data: { agent } });
  await prisma.lobby.update({ where: { id: lobbyId }, data: { updatedAt: new Date() } });

  const updated = await fetchLobby(lobbyId);
  return { lobby: toLobby(updated!) };
}

export async function setPlayerReady(
  lobbyId: string,
  playerId: string,
  isReady: boolean
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobbyRow = await fetchLobby(lobbyId);
  if (!lobbyRow) return { error: 'Lobby not found' };

  const player = lobbyRow.players.find((p: LobbyPlayer) => p.id === playerId);
  if (!player) return { error: 'Player not in lobby' };

  await prisma.lobbyPlayer.update({ where: { id: playerId }, data: { isReady } });
  await prisma.lobby.update({ where: { id: lobbyId }, data: { updatedAt: new Date() } });

  const updated = await fetchLobby(lobbyId);
  return { lobby: toLobby(updated!) };
}

export async function updateLobbySettings(
  lobbyId: string,
  playerId: string,
  settings: Partial<LobbySettings>
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobbyRow = await fetchLobby(lobbyId);
  if (!lobbyRow) return { error: 'Lobby not found' };

  if (lobbyRow.hostId !== playerId) return { error: 'Only host can update settings' };

  const currentSettings = lobbyRow.settings as LobbySettings;
  const newSettings = { ...currentSettings, ...settings };

  await prisma.lobby.update({
    where: { id: lobbyId },
    data: { settings: newSettings as object, updatedAt: new Date() },
  });

  const updated = await fetchLobby(lobbyId);
  return { lobby: toLobby(updated!) };
}

export async function startGame(
  lobbyId: string,
  playerId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobbyRow = await fetchLobby(lobbyId);
  if (!lobbyRow) return { error: 'Lobby not found' };

  if (lobbyRow.hostId !== playerId) return { error: 'Only host can start the game' };

  const game = lobbyRow.game as GameState;
  if (game.status !== 'waiting') return { error: 'Game already started' };

  const settings = lobbyRow.settings as LobbySettings;
  const newGame: GameState = {
    ...game,
    status: 'in_progress',
    currentStrat: settings.modes.includes('strat_roulette') ? getRandomStrat() : null,
  };

  await prisma.lobby.update({
    where: { id: lobbyId },
    data: { game: newGame as object, updatedAt: new Date() },
  });

  const updated = await fetchLobby(lobbyId);
  return { lobby: toLobby(updated!) };
}

export async function endGame(
  lobbyId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobbyRow = await fetchLobby(lobbyId);
  if (!lobbyRow) return { error: 'Lobby not found' };

  const game = lobbyRow.game as GameState;
  await prisma.lobby.update({
    where: { id: lobbyId },
    data: { game: { ...game, status: 'ended' } as object, updatedAt: new Date() },
  });

  const updated = await fetchLobby(lobbyId);
  return { lobby: toLobby(updated!) };
}

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
  const lobbyRow = await fetchLobby(lobbyId);
  if (!lobbyRow) return { error: 'Lobby not found' };

  const player = lobbyRow.players.find((p: LobbyPlayer) => p.id === playerId);
  if (!player) return { error: 'Player not in lobby' };

  const settings = lobbyRow.settings as LobbySettings;
  const game = lobbyRow.game as GameState;

  const intensityMultiplier = getIntensityMultiplier(settings.intensity);
  const overtimeMultiplier = game.status === 'overtime' ? 2 : 1;
  const totalMultiplier = intensityMultiplier * overtimeMultiplier;
  const drinksToAdd = settings.modes.includes('classic') ? Math.ceil(1 * totalMultiplier) : 0;

  await prisma.lobbyPlayer.update({
    where: { id: playerId },
    data: {
      deaths: { increment: 1 },
      drinks: { increment: drinksToAdd },
    },
  });
  await prisma.lobby.update({ where: { id: lobbyId }, data: { updatedAt: new Date() } });

  const updated = await fetchLobby(lobbyId);
  return { lobby: toLobby(updated!) };
}

export async function addDrink(
  lobbyId: string,
  playerId: string,
  amount: number = 1
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobbyRow = await fetchLobby(lobbyId);
  if (!lobbyRow) return { error: 'Lobby not found' };

  const player = lobbyRow.players.find((p: LobbyPlayer) => p.id === playerId);
  if (!player) return { error: 'Player not in lobby' };

  const newDrinks = Math.max(0, player.drinks + amount);
  await prisma.lobbyPlayer.update({ where: { id: playerId }, data: { drinks: newDrinks } });
  await prisma.lobby.update({ where: { id: lobbyId }, data: { updatedAt: new Date() } });

  const updated = await fetchLobby(lobbyId);
  return { lobby: toLobby(updated!) };
}

export async function roundWon(
  lobbyId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobbyRow = await fetchLobby(lobbyId);
  if (!lobbyRow) return { error: 'Lobby not found' };

  const game = lobbyRow.game as GameState;
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

  const newGame: GameState = {
    ...game,
    round: newRound,
    teamScore: newTeamScore,
    side: newSide,
    status: newStatus,
    currentStrat: isGameEnd ? null : game.currentStrat,
  };

  await prisma.lobby.update({
    where: { id: lobbyId },
    data: { game: newGame as object, updatedAt: new Date() },
  });

  const updated = await fetchLobby(lobbyId);
  return { lobby: toLobby(updated!) };
}

export async function roundLost(
  lobbyId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobbyRow = await fetchLobby(lobbyId);
  if (!lobbyRow) return { error: 'Lobby not found' };

  const game = lobbyRow.game as GameState;
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

  const newGame: GameState = {
    ...game,
    round: newRound,
    enemyScore: newEnemyScore,
    side: newSide,
    status: newStatus,
    currentStrat: isGameEnd ? null : game.currentStrat,
  };

  await prisma.lobby.update({
    where: { id: lobbyId },
    data: { game: newGame as object, updatedAt: new Date() },
  });

  const updated = await fetchLobby(lobbyId);
  return { lobby: toLobby(updated!) };
}

export async function switchSides(
  lobbyId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobbyRow = await fetchLobby(lobbyId);
  if (!lobbyRow) return { error: 'Lobby not found' };

  const game = lobbyRow.game as GameState;
  const newGame: GameState = {
    ...game,
    side: game.side === 'attack' ? 'defense' : 'attack',
  };

  await prisma.lobby.update({
    where: { id: lobbyId },
    data: { game: newGame as object, updatedAt: new Date() },
  });

  const updated = await fetchLobby(lobbyId);
  return { lobby: toLobby(updated!) };
}

export async function rollStrat(
  lobbyId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobbyRow = await fetchLobby(lobbyId);
  if (!lobbyRow) return { error: 'Lobby not found' };

  const game = lobbyRow.game as GameState;

  let newStrat = getRandomStrat();
  for (let i = 0; i < 10 && game.currentStrat && newStrat.id === game.currentStrat.id; i++) {
    newStrat = getRandomStrat();
  }

  const newGame: GameState = { ...game, currentStrat: newStrat };

  await prisma.lobby.update({
    where: { id: lobbyId },
    data: { game: newGame as object, updatedAt: new Date() },
  });

  const updated = await fetchLobby(lobbyId);
  return { lobby: toLobby(updated!) };
}

export async function rerollStrat(
  lobbyId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobbyRow = await fetchLobby(lobbyId);
  if (!lobbyRow) return { error: 'Lobby not found' };

  const game = lobbyRow.game as GameState;
  if (game.rerollsLeft <= 0) return { error: 'No rerolls left' };

  let newStrat = getRandomStrat();
  for (let i = 0; i < 10 && game.currentStrat && newStrat.id === game.currentStrat.id; i++) {
    newStrat = getRandomStrat();
  }

  const newGame: GameState = {
    ...game,
    currentStrat: newStrat,
    rerollsLeft: game.rerollsLeft - 1,
  };

  await prisma.lobby.update({
    where: { id: lobbyId },
    data: { game: newGame as object, updatedAt: new Date() },
  });

  const updated = await fetchLobby(lobbyId);
  return { lobby: toLobby(updated!) };
}

export async function skipStrat(
  lobbyId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobbyRow = await fetchLobby(lobbyId);
  if (!lobbyRow) return { error: 'Lobby not found' };

  const game = lobbyRow.game as GameState;
  const newGame: GameState = { ...game, currentStrat: null };

  await prisma.lobby.update({
    where: { id: lobbyId },
    data: { game: newGame as object, updatedAt: new Date() },
  });

  const updated = await fetchLobby(lobbyId);
  return { lobby: toLobby(updated!) };
}

export async function resumeFromHalftime(
  lobbyId: string
): Promise<{ lobby: Lobby } | { error: string }> {
  const lobbyRow = await fetchLobby(lobbyId);
  if (!lobbyRow) return { error: 'Lobby not found' };

  const game = lobbyRow.game as GameState;
  const newGame: GameState = { ...game, status: 'in_progress' };

  await prisma.lobby.update({
    where: { id: lobbyId },
    data: { game: newGame as object, updatedAt: new Date() },
  });

  const updated = await fetchLobby(lobbyId);
  return { lobby: toLobby(updated!) };
}

export async function getAllLobbies(): Promise<Lobby[]> {
  const rows = await prisma.lobby.findMany({ include: { players: PLAYERS_INCLUDE } });
  return rows.map(toLobby);
}

export async function cleanupOldLobbies(maxAgeMs: number = 24 * 60 * 60 * 1000): Promise<number> {
  const cutoff = new Date(Date.now() - maxAgeMs);
  const result = await prisma.lobby.deleteMany({
    where: { updatedAt: { lt: cutoff } },
  });
  return result.count;
}
