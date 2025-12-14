
import { getCurrentUser } from '@/lib/auth/server-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    // Not authenticated
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }

  // The `isAdmin` property is now securely added by `getCurrentUser`
  return NextResponse.json({ isAdmin: !!user.isAdmin });
}
