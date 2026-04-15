import { NextRequest, NextResponse } from 'next/server';
import { getLobbyByCode, updatePlayerAgent, setPlayerReady } from '@/lib/lobby';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    const { playerId, agent, isReady } = body;

    const lobby = await getLobbyByCode(code);

    if (!lobby) {
      return NextResponse.json({ error: 'Lobby not found' }, { status: 404 });
    }

    if (!playerId) {
      return NextResponse.json({ error: 'Player ID required' }, { status: 400 });
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

    return NextResponse.json({ success: true, lobby: result.lobby });
  } catch (error) {
    console.error('Update player error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
