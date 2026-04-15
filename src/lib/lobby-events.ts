/**
 * Simple in-memory pub/sub for lobby state changes.
 * SSE connections subscribe to a lobby code and get notified when state changes.
 */

type Listener = (lobbyCode: string) => void;

const listeners = new Map<string, Set<Listener>>();

export function subscribe(lobbyCode: string, listener: Listener): () => void {
  if (!listeners.has(lobbyCode)) {
    listeners.set(lobbyCode, new Set());
  }
  listeners.get(lobbyCode)!.add(listener);

  return () => {
    const set = listeners.get(lobbyCode);
    if (set) {
      set.delete(listener);
      if (set.size === 0) listeners.delete(lobbyCode);
    }
  };
}

export function notifyLobbyChanged(lobbyCode: string): void {
  const set = listeners.get(lobbyCode);
  if (set) {
    for (const listener of set) {
      listener(lobbyCode);
    }
  }
}
