import { NextRequest } from 'next/server';
import { getLobbyByCode } from '@/lib/lobby';
import { subscribe } from '@/lib/lobby-events';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // Verify lobby exists
  const lobby = await getLobbyByCode(code);
  if (!lobby) {
    return new Response('Lobby not found', { status: 404 });
  }

  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | null = null;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      controller.enqueue(encoder.encode('event: connected\ndata: {}\n\n'));

      // Send heartbeat every 30s to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch {
          clearInterval(heartbeat);
        }
      }, 30000);

      // Subscribe to lobby changes
      unsubscribe = subscribe(code, async () => {
        try {
          const updatedLobby = await getLobbyByCode(code);
          if (updatedLobby) {
            const data = JSON.stringify({ lobby: updatedLobby });
            controller.enqueue(encoder.encode(`event: update\ndata: ${data}\n\n`));
          }
        } catch {
          // Ignore errors during notification
        }
      });

      // Clean up when client disconnects
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        if (unsubscribe) unsubscribe();
        try { controller.close(); } catch { /* already closed */ }
      });
    },
    cancel() {
      if (unsubscribe) unsubscribe();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
