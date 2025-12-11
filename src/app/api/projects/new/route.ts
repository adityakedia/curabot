/**
 * API route for creating new projects
 * Handles project creation with validation and authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { addProject } from '@/lib/storage';
import log from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// PROJECT CREATION
// ============================================================================

/**
 * POST handler for creating a new project
 * Creates project without triggering automation (automation is triggered separately)
 * @param request - Next.js request object with project data
 * @returns JSON response with created project or error
 */
export async function POST(request: NextRequest) {
  try {
    // ============================================================================
    // AUTHENTICATION CHECK
    // ============================================================================

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ============================================================================
    // REQUEST VALIDATION
    // ============================================================================

    const body = await request.json();
    const { name, url, objective } = body;

    if (!name || !url || !objective) {
      return NextResponse.json(
        { error: 'Name, URL, and objective are required' },
        { status: 400 }
      );
    }

    // ============================================================================
    // PROJECT CREATION
    // ============================================================================

    const newProject = {
      id: uuidv4(),
      name: name.trim(),
      url: url.trim(),
      objective: objective.trim(),
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      userId: userId,
      latestAnalysisStatus: null,
      latestAnalysisSummary: null,
      analyses: [] // Always include analyses array
    };

    const createdProject = await addProject(newProject);

    // ============================================================================
    // SUCCESS RESPONSE
    // ============================================================================

    // ✅ Return immediately - NO automation triggering
    return NextResponse.json({
      success: true,
      project: createdProject,
      message: 'Project created successfully'
    });
  } catch (error) {
    // ============================================================================
    // ERROR HANDLING
    // ============================================================================

    log.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
