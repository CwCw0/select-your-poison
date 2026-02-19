import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

// Simple in-memory store for MVP (replace with database in production)
interface User {
  id: string;
  gamertag: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

interface Session {
  userId: string;
  token: string;
  expiresAt: Date;
}

// In-memory stores (replace with database)
const users: Map<string, User> = new Map();
const sessions: Map<string, Session> = new Map();
const emailIndex: Map<string, string> = new Map(); // email -> id

function generateId(): string {
  return randomBytes(16).toString('hex');
}

function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export async function createUser(gamertag: string, email: string, password: string): Promise<{ user: Omit<User, 'passwordHash'>; token: string } | { error: string }> {
  // Validate inputs
  if (!gamertag || gamertag.length < 3 || gamertag.length > 16) {
    return { error: 'Gamertag must be between 3 and 16 characters' };
  }

  if (!email || !email.includes('@')) {
    return { error: 'Invalid email address' };
  }

  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters' };
  }

  // Check if email already exists
  if (emailIndex.has(email.toLowerCase())) {
    return { error: 'Email already registered' };
  }

  const id = generateId();
  const passwordHash = await bcrypt.hash(password, 12);
  const user: User = {
    id,
    gamertag: gamertag.toUpperCase(),
    email: email.toLowerCase(),
    passwordHash,
    createdAt: new Date(),
  };

  users.set(id, user);
  emailIndex.set(email.toLowerCase(), id);

  // Create session
  const token = generateToken();
  const session: Session = {
    userId: id,
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };
  sessions.set(token, session);

  return {
    user: {
      id: user.id,
      gamertag: user.gamertag,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  };
}

export async function loginUser(email: string, password: string): Promise<{ user: Omit<User, 'passwordHash'>; token: string } | { error: string }> {
  const userId = emailIndex.get(email.toLowerCase());

  if (!userId) {
    return { error: 'Invalid email or password' };
  }

  const user = users.get(userId);

  if (!user) {
    return { error: 'Invalid email or password' };
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) {
    return { error: 'Invalid email or password' };
  }

  // Create session
  const token = generateToken();
  const session: Session = {
    userId: user.id,
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };
  sessions.set(token, session);

  return {
    user: {
      id: user.id,
      gamertag: user.gamertag,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  };
}

export async function getSession(token: string): Promise<{ user: Omit<User, 'passwordHash'> } | null> {
  const session = sessions.get(token);

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    sessions.delete(token);
    return null;
  }

  const user = users.get(session.userId);

  if (!user) {
    return null;
  }

  return {
    user: {
      id: user.id,
      gamertag: user.gamertag,
      email: user.email,
      createdAt: user.createdAt,
    },
  };
}

/**
 * Returns the userId associated with a valid, non-expired session token,
 * or null if the token is invalid or expired.
 */
export function getUserIdFromToken(token: string): string | null {
  const session = sessions.get(token);

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    sessions.delete(token);
    return null;
  }

  return session.userId;
}

export async function logout(token: string): Promise<void> {
  sessions.delete(token);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return null;
  }

  return getSession(token);
}

/**
 * Removes all expired sessions from the in-memory store.
 * Returns the number of sessions that were cleaned up.
 */
export function cleanupExpiredSessions(): number {
  const now = new Date();
  let removed = 0;

  for (const [token, session] of sessions) {
    if (session.expiresAt < now) {
      sessions.delete(token);
      removed++;
    }
  }

  return removed;
}
