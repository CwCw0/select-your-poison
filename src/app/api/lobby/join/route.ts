import { NextRequest, NextResponse } from 'next/server';
import { joinLobby } from '@/lib/lobby';
import { auth } from '@/lib/auth-config';
import { z } from 'zod';

const joinSchema = z.object({
  code: z.string().min(3).max(12).transform(v => v.trim().toUpperCase()),
  playerName: z.string().min(2).max(16).transform(v => v.trim()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = joinSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { code, playerName } = parsed.data;

    // Check for authenticated user via NextAuth
    const session = await auth();
    const userId = session?.user?.id;

    const result = await joinLobby(code, playerName, userId);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      lobby: result.lobby,
      playerId: result.playerId,
    });
  } catch (error) {
    console.error('Join lobby error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
