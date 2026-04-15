import { NextRequest, NextResponse } from 'next/server';
import { joinLobby } from '@/lib/lobby';
import { auth } from '@/lib/auth-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, playerName } = body;

    if (!code || !playerName) {
      return NextResponse.json(
        { error: 'Lobby code and player name are required' },
        { status: 400 }
      );
    }

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
