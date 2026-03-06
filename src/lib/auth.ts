import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/db';

type PublicUser = { id: string; gamertag: string; email: string; createdAt: Date };

function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export async function createUser(
  gamertag: string,
  email: string,
  password: string
): Promise<{ user: PublicUser; token: string } | { error: string }> {
  if (!gamertag || gamertag.length < 3 || gamertag.length > 16) {
    return { error: 'Gamertag must be between 3 and 16 characters' };
  }
  if (!email || !email.includes('@')) {
    return { error: 'Invalid email address' };
  }
  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters' };
  }

  const normalizedEmail = email.toLowerCase();
  const normalizedGamertag = gamertag.toUpperCase();

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: normalizedEmail }, { gamertag: normalizedGamertag }] },
    select: { email: true, gamertag: true },
  });

  if (existing) {
    if (existing.email === normalizedEmail) return { error: 'Email already registered' };
    return { error: 'Gamertag already taken' };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { gamertag: normalizedGamertag, email: normalizedEmail, passwordHash },
  });

  const token = generateToken();
  await prisma.userSession.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    user: { id: user.id, gamertag: user.gamertag, email: user.email, createdAt: user.createdAt },
    token,
  };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: PublicUser; token: string } | { error: string }> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) return { error: 'Invalid email or password' };

  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) return { error: 'Invalid email or password' };

  const token = generateToken();
  await prisma.userSession.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    user: { id: user.id, gamertag: user.gamertag, email: user.email, createdAt: user.createdAt },
    token,
  };
}

export async function getSession(
  token: string
): Promise<{ user: PublicUser } | null> {
  const session = await prisma.userSession.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.userSession.delete({ where: { token } }).catch(() => {});
    return null;
  }

  return {
    user: {
      id: session.user.id,
      gamertag: session.user.gamertag,
      email: session.user.email,
      createdAt: session.user.createdAt,
    },
  };
}

export async function getUserIdFromToken(token: string): Promise<string | null> {
  const session = await prisma.userSession.findUnique({
    where: { token },
    select: { userId: true, expiresAt: true },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.userSession.delete({ where: { token } }).catch(() => {});
    return null;
  }

  return session.userId;
}

export async function logout(token: string): Promise<void> {
  await prisma.userSession.deleteMany({ where: { token } });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  return getSession(token);
}

export async function cleanupExpiredSessions(): Promise<number> {
  const result = await prisma.userSession.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return result.count;
}
