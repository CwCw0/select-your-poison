import 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      gamertag: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    gamertag?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    gamertag: string;
  }
}
