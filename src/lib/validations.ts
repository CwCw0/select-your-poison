import { z } from 'zod';

// ============================================
// AUTH VALIDATION SCHEMAS
// ============================================

export const signupSchema = z.object({
  gamertag: z
    .string()
    .min(3, 'Gamertag must be at least 3 characters')
    .max(16, 'Gamertag must be at most 16 characters')
    .regex(/^[A-Za-z0-9_]+$/, 'Gamertag can only contain letters, numbers, and underscores')
    .transform((val) => val.toUpperCase()),
  email: z
    .string()
    .email('Invalid email address')
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .min(1, 'Password is required'),
});

// ============================================
// LOBBY VALIDATION SCHEMAS
// ============================================

export const gameModeEnum = z.enum([
  'classic',
  'agent_poison',
  'strat_roulette',
  'challenges',
  'punishment',
]);

export const intensityEnum = z.enum([
  'casual',
  'ranked',
  'immortal',
  'radiant',
]);

export const createLobbySchema = z.object({
  hostName: z
    .string()
    .min(1, 'Host name is required')
    .max(16, 'Name must be at most 16 characters')
    .trim(),
  settings: z.object({
    maxPlayers: z
      .number()
      .int()
      .min(2, 'Minimum 2 players')
      .max(10, 'Maximum 10 players')
      .default(5),
    modes: z
      .array(gameModeEnum)
      .min(1, 'Select at least one game mode')
      .default(['classic']),
    intensity: intensityEnum.default('ranked'),
  }).default({ maxPlayers: 5, modes: ['classic'], intensity: 'ranked' }),
});

export const joinLobbySchema = z.object({
  code: z
    .string()
    .min(1, 'Lobby code is required')
    .max(12, 'Invalid lobby code')
    .trim(),
  playerName: z
    .string()
    .min(1, 'Player name is required')
    .max(16, 'Name must be at most 16 characters')
    .trim(),
});

// ============================================
// PLAYER VALIDATION SCHEMAS
// ============================================

export const agentNames = [
  'jett', 'phoenix', 'reyna', 'raze', 'yoru', 'neon', 'iso', 'vyse',
  'brimstone', 'viper', 'omen', 'astra', 'harbor', 'clove',
  'sova', 'breach', 'skye', 'kayo', 'fade', 'gekko',
  'killjoy', 'cypher', 'sage', 'chamber', 'deadlock',
] as const;

export const updatePlayerSchema = z.object({
  playerId: z.string().min(1, 'Player ID required'),
  agent: z.enum(agentNames).optional(),
  isReady: z.boolean().optional(),
});

export const lobbyActionSchema = z.object({
  action: z.enum([
    'update_settings', 'start_game', 'end_game',
    'round_won', 'round_lost', 'switch_sides',
    'roll_strat', 'reroll_strat', 'skip_strat',
    'add_death', 'add_drink', 'resume_halftime',
  ]),
  playerId: z.string().optional(),
  settings: z.object({
    modes: z.array(gameModeEnum).optional(),
    intensity: intensityEnum.optional(),
    maxPlayers: z.number().int().min(2).max(10).optional(),
  }).optional(),
  amount: z.number().int().min(1).max(10).optional(),
});

export const leaveLobbySchema = z.object({
  playerId: z.string().min(1, 'Player ID required'),
});

// ============================================
// GAME VALIDATION SCHEMAS
// ============================================

export const gameSideEnum = z.enum(['ATTACK', 'DEFENSE']);

export const gameActionSchema = z.object({
  action: z.enum(['death', 'drink', 'round_won', 'round_lost', 'roll_strat', 'switch_sides']),
  playerId: z.string().optional(),
  value: z.number().int().min(1).max(10).optional(),
});

export const updateGameSchema = z.object({
  round: z.number().int().min(1).max(30).optional(),
  teamScore: z.number().int().min(0).max(13).optional(),
  enemyScore: z.number().int().min(0).max(13).optional(),
  side: gameSideEnum.optional(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateLobbyInput = z.infer<typeof createLobbySchema>;
export type JoinLobbyInput = z.infer<typeof joinLobbySchema>;
export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>;
export type LobbyActionInput = z.infer<typeof lobbyActionSchema>;
export type LeaveLobbyInput = z.infer<typeof leaveLobbySchema>;
export type GameActionInput = z.infer<typeof gameActionSchema>;
export type UpdateGameInput = z.infer<typeof updateGameSchema>;
