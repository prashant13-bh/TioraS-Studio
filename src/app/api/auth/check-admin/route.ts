
import { getCurrentUser } from '@/lib/auth/mock-auth'; // Using mock auth
import { NextResponse } from 'next/server';

export async function GET() {
  // This route is less critical now that we do client-side checks,
  // but we can keep it for any server-side needs if we implement session cookies later.
  // For now, we'll just return false since we can't easily check auth server-side without cookies.
  return NextResponse.json({ isAdmin: false });
}
