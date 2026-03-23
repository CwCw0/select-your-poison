import { NextRequest, NextResponse } from 'next/server';
import { createLobby } from '@/lib/lobby';
import { getSession } from '@/lib/auth';
import { createLobbySchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createLobbySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { hostName, settings } = parsed.data;

    // Check for authenticated user
    const token = request.cookies.get('auth_token')?.value;
    let userId: string | undefined;

    if (token) {
      const session = await getSession(token);
      if (session) {
        userId = session.user.id;
      }
    }

    const result = await createLobby(hostName, settings, userId);

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
