import { NextRequest, NextResponse } from 'next/server';
import { getLobbyByCode, updatePlayerAgent, setPlayerReady } from '@/lib/lobby';
import { getUserIdFromToken } from '@/lib/auth';
import { updatePlayerSchema } from '@/lib/validations';
import { notifyLobbyChanged } from '@/lib/lobby-events';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    const parsed = updatePlayerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { playerId, agent, isReady } = parsed.data;

    const lobby = await getLobbyByCode(code);

    if (!lobby) {
      return NextResponse.json({ error: 'Lobby not found' }, { status: 404 });
    }

    // Verify the player exists in this lobby
    const playerInLobby = lobby.players.find((p) => p.id === playerId);
    if (!playerInLobby) {
      return NextResponse.json({ error: 'Player not found in lobby' }, { status: 403 });
    }

    // Authorization check for authenticated users
    const authToken = request.cookies.get('auth_token')?.value;
    if (authToken) {
      const userId = await getUserIdFromToken(authToken);
      if (!userId) {
        return NextResponse.json({ error: 'Invalid or expired session' }, { status: 403 });
      }

      // Authenticated users can only update their own player data
      if (playerInLobby.userId !== userId) {
        return NextResponse.json({ error: 'You can only update your own player data' }, { status: 403 });
      }
    }

    let result;

    if (agent !== undefined) {
      result = await updatePlayerAgent(lobby.id, playerId, agent);
    } else if (isReady !== undefined) {
      result = await setPlayerReady(lobby.id, playerId, isReady);
    } else {
      return NextResponse.json({ error: 'No update provided' }, { status: 400 });
    }

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    notifyLobbyChanged(code);
    return NextResponse.json({ success: true, lobby: result.lobby });
  } catch (error) {
    console.error('Update player error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
