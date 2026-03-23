import { NextRequest, NextResponse } from 'next/server';
import { joinLobby } from '@/lib/lobby';
import { getSession } from '@/lib/auth';
import { joinLobbySchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = joinLobbySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { code, playerName } = parsed.data;

    // Check for authenticated user
    const token = request.cookies.get('auth_token')?.value;
    let userId: string | undefined;

    if (token) {
      const session = await getSession(token);
      if (session) {
        userId = session.user.id;
      }
    }

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
