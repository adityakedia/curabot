import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Dev-only route to exercise the shared Prisma client.
// Usage: GET /api/debug/prisma
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  try {
    // Simple sanity check: count projects
    const projects = await prisma.project.count();
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
