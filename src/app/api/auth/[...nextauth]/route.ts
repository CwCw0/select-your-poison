import { NextResponse } from 'next/server';

// NextAuth is not used in this project. Auth is handled by custom routes under /api/auth/(signup|login|logout|me).
export function GET() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export function POST() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
