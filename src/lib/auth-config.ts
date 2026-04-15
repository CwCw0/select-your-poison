import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
    newUser: '/lobby/create',
  },
  providers: [
    // Discord OAuth
    DiscordProvider({
      clientId: process.env.AUTH_DISCORD_ID!,
      clientSecret: process.env.AUTH_DISCORD_SECRET!,
      authorization: {
        params: {
          scope: 'identify email',
        },
      },
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    // Email/Password (Credentials)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.gamertag,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && user.id) {
        token.id = user.id;
        // Fetch gamertag from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { gamertag: true },
        });
        token.gamertag = dbUser?.gamertag || user.name || 'Agent';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.gamertag = token.gamertag as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // For OAuth users, create/update gamertag from their profile
      if (account?.provider !== 'credentials') {
        const email = user.email;
        if (!email) return false;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!existingUser) {
          // Generate gamertag from Discord/Google username
          let gamertag = user.name || 'Agent';

          // For Discord, use their username
          if (account?.provider === 'discord' && profile) {
            gamertag = (profile as { username?: string }).username || gamertag;
          }

          // Make gamertag uppercase and remove spaces
          gamertag = gamertag.toUpperCase().replace(/\s+/g, '');

          // Check if gamertag is taken, append random numbers if so
          const existingGamertag = await prisma.user.findUnique({
            where: { gamertag },
          });

          if (existingGamertag) {
            gamertag = `${gamertag}${Math.floor(Math.random() * 9999)}`;
          }

          // Update the user with gamertag (the adapter creates the user)
          await prisma.user.update({
            where: { email: email.toLowerCase() },
            data: { gamertag },
          });
        }
      }
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      // Initialize game stats for new users
      if (user.id) {
        await prisma.gameStats.create({
          data: { userId: user.id },
        });
      }
    },
  },
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
});

// Helper to hash passwords for registration
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Helper to verify passwords
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
