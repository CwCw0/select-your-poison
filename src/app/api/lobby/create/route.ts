import { NextRequest, NextResponse } from 'next/server';
import { createLobby } from '@/lib/lobby';
import { auth } from '@/lib/auth-config';
import { z } from 'zod';
import type { GameMode, IntensityLevel } from '@/types';

const gameModes = ['classic', 'agent_poison', 'strat_roulette', 'challenges', 'punishment'] as const;
const intensities = ['casual', 'ranked', 'immortal', 'radiant'] as const;

const createSchema = z.object({
  hostName: z.string().min(2).max(16).transform(v => v.trim()),
  settings: z.object({
    modes: z.array(z.enum(gameModes)).min(1).default(['classic']),
    intensity: z.enum(intensities).default('ranked'),
    maxPlayers: z.number().int().min(2).max(10).default(5),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { hostName, settings } = parsed.data;

    // Check for authenticated user via NextAuth
    const session = await auth();
    const userId = session?.user?.id;

    const defaultSettings = {
      modes: (settings?.modes || ['classic']) as GameMode[],
      intensity: (settings?.intensity || 'ranked') as IntensityLevel,
      maxPlayers: settings?.maxPlayers || 5,
    };

    const result = await createLobby(hostName, defaultSettings, userId);

    return NextResponse.json({
      success: true,
      lobby: result.lobby,
      playerId: result.playerId,
    });
  } catch (error) {
    console.error('Create lobby error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
