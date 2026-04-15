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
  'CLASSIC',
  'AGENT_POISON',
  'STRAT_ROULETTE',
  'CHALLENGES',
  'PUNISHMENT',
]);

export const intensityEnum = z.enum([
  'CASUAL',
  'RANKED',
  'IMMORTAL',
  'RADIANT',
]);

export const createLobbySchema = z.object({
  maxPlayers: z
    .number()
    .int()
    .min(2, 'Minimum 2 players')
    .max(10, 'Maximum 10 players')
    .default(5),
  modes: z
    .array(gameModeEnum)
    .min(1, 'Select at least one game mode'),
  intensity: intensityEnum.default('CASUAL'),
});

export const joinLobbySchema = z.object({
  code: z
    .string()
    .min(5, 'Invalid lobby code')
    .max(12, 'Invalid lobby code')
    .transform((val) => val.toUpperCase().trim()),
  playerName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(16, 'Name must be at most 16 characters')
    .transform((val) => val.toUpperCase().trim()),
});

// ============================================
// PLAYER VALIDATION SCHEMAS
// ============================================

export const agentNames = [
  'JETT', 'PHOENIX', 'REYNA', 'RAZE', 'YORU', 'NEON', 'ISO', 'VYSE',
  'BRIMSTONE', 'VIPER', 'OMEN', 'ASTRA', 'HARBOR', 'CLOVE',
  'SOVA', 'BREACH', 'SKYE', 'KAYO', 'FADE', 'GEKKO',
  'KILLJOY', 'CYPHER', 'SAGE', 'CHAMBER', 'DEADLOCK',
] as const;

export const updatePlayerSchema = z.object({
  agent: z.enum(agentNames).optional(),
  isReady: z.boolean().optional(),
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
export type GameActionInput = z.infer<typeof gameActionSchema>;
export type UpdateGameInput = z.infer<typeof updateGameSchema>;
