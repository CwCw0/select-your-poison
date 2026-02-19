import { NextRequest, NextResponse } from 'next/server';
import {
  getLobbyByCode,
  updateLobbySettings,
  startGame,
  endGame,
  leaveLobby,
  roundWon,
  roundLost,
  switchSides,
  rollStrat,
  rerollStrat,
  skipStrat,
  addDeath,
  addDrink,
  resumeFromHalftime,
} from '@/lib/lobby';
import { getUserIdFromToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const lobby = await getLobbyByCode(code);

    if (!lobby) {
      return NextResponse.json({ error: 'Lobby not found' }, { status: 404 });
    }

    return NextResponse.json({ lobby });
  } catch (error) {
    console.error('Get lobby error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    const { action, playerId, settings, amount } = body;

    const lobby = await getLobbyByCode(code);

    if (!lobby) {
      return NextResponse.json({ error: 'Lobby not found' }, { status: 404 });
    }

    // Authorization check for authenticated users
    const authToken = request.cookies.get('auth_token')?.value;
    if (authToken) {
      const userId = getUserIdFromToken(authToken);
      if (!userId) {
        return NextResponse.json({ error: 'Invalid or expired session' }, { status: 403 });
      }

      // Actions that target a specific player: verify the authenticated user matches the playerId
      const playerTargetedActions = ['add_death', 'add_drink', 'start_game', 'end_game', 'update_settings'];
      if (playerTargetedActions.includes(action)) {
        const isInLobby = lobby.players.some((p) => p.id === userId);
        if (!isInLobby) {
          return NextResponse.json({ error: 'You are not in this lobby' }, { status: 403 });
        }
      }

      // Host-only actions: verify the authenticated user is the host
      const hostOnlyActions = ['start_game', 'update_settings', 'end_game'];
      if (hostOnlyActions.includes(action)) {
        if (lobby.hostId !== userId) {
          return NextResponse.json({ error: 'Only the host can perform this action' }, { status: 403 });
        }
      }

      // For add_death and add_drink, verify the user is modifying their own data
      if (action === 'add_death' || action === 'add_drink') {
        if (playerId && playerId !== userId) {
          return NextResponse.json({ error: 'You can only modify your own player data' }, { status: 403 });
        }
      }
    }

    let result;

    switch (action) {
      case 'update_settings':
        if (!playerId) return NextResponse.json({ error: 'Player ID required' }, { status: 400 });
        result = await updateLobbySettings(lobby.id, playerId, settings);
        break;
      case 'start_game':
        if (!playerId) return NextResponse.json({ error: 'Player ID required' }, { status: 400 });
        result = await startGame(lobby.id, playerId);
        break;
      case 'end_game':
        result = await endGame(lobby.id);
        break;
      case 'round_won':
        result = await roundWon(lobby.id);
        break;
      case 'round_lost':
        result = await roundLost(lobby.id);
        break;
      case 'switch_sides':
        result = await switchSides(lobby.id);
        break;
      case 'roll_strat':
        result = await rollStrat(lobby.id);
        break;
      case 'reroll_strat':
        result = await rerollStrat(lobby.id);
        break;
      case 'skip_strat':
        result = await skipStrat(lobby.id);
        break;
      case 'add_death':
        if (!playerId) return NextResponse.json({ error: 'Player ID required' }, { status: 400 });
        result = await addDeath(lobby.id, playerId);
        break;
      case 'add_drink':
        if (!playerId) return NextResponse.json({ error: 'Player ID required' }, { status: 400 });
        result = await addDrink(lobby.id, playerId, amount || 1);
        break;
      case 'resume_halftime':
        result = await resumeFromHalftime(lobby.id);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, lobby: result.lobby });
  } catch (error) {
    console.error('Update lobby error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    const { playerId } = body;

    const lobby = await getLobbyByCode(code);

    if (!lobby) {
      return NextResponse.json({ error: 'Lobby not found' }, { status: 404 });
    }

    if (!playerId) {
      return NextResponse.json({ error: 'Player ID required' }, { status: 400 });
    }

    // Authorization check for authenticated users
    const authToken = request.cookies.get('auth_token')?.value;
    if (authToken) {
      const userId = getUserIdFromToken(authToken);
      if (!userId) {
        return NextResponse.json({ error: 'Invalid or expired session' }, { status: 403 });
      }

      // User can only remove themselves, unless they are the host (host can remove anyone)
      const isHost = lobby.hostId === userId;
      if (!isHost && playerId !== userId) {
        return NextResponse.json({ error: 'You can only remove yourself from the lobby' }, { status: 403 });
      }
    }

    const result = await leaveLobby(lobby.id, playerId);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, lobby: result.lobby });
  } catch (error) {
    console.error('Leave lobby error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
