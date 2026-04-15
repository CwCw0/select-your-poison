import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth-config';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        gamertag: session.user.gamertag,
        email: session.user.email,
        image: session.user.image,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
