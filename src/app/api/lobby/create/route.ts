import { NextRequest, NextResponse } from 'next/server';
import { createLobby } from '@/lib/lobby';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hostName, settings } = body;

    if (!hostName) {
      return NextResponse.json(
        { error: 'Host name is required' },
        { status: 400 }
      );
    }

    // Check for authenticated user
    const token = request.cookies.get('auth_token')?.value;
    let userId: string | undefined;

    if (token) {
      const session = await getSession(token);
      if (session) {
        userId = session.user.id;
      }
    }

    const defaultSettings = {
      modes: settings?.modes || ['classic'],
      intensity: settings?.intensity || 'ranked',
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
