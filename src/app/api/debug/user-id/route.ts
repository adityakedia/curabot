import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/debug/user-id
 * Returns the current authenticated user's Clerk ID
 * Use this to update seed data with your actual user ID
 */
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      userId,
      message: 'Copy this userId and run the following SQL in Supabase:',
      sql: `UPDATE patients SET user_id = '${userId}' WHERE user_id = 'demo_user';`
    });
  } catch (error) {
    console.error('Error getting user ID:', error);
    return NextResponse.json(
      { error: 'Failed to get user ID' },
      { status: 500 }
    );
  }
}
