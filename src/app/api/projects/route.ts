/**
 * API routes for project management
 * Handles listing, creating, and deleting projects with authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAllProjects, deleteProject } from '@/lib/storage';
import log from '@/lib/logger';

// ============================================================================
// PROJECT CREATION
// ============================================================================

/**
 * POST handler for creating new projects
 * Currently commented out - functionality moved to /projects/new endpoint
 */
export async function POST(request: NextRequest) {
  // ... existing POST code
}

// ============================================================================
// PROJECT LISTING
// ============================================================================

/**
 * GET handler for retrieving all projects for authenticated user
 * @returns JSON response with projects array or error
 */
export async function GET() {
  try {
    // ============================================================================
    // AUTHENTICATION CHECK
    // ============================================================================

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ============================================================================
    // PROJECT RETRIEVAL
    // ============================================================================

    // Get all projects for user
    const projects = await getAllProjects(userId);

    return NextResponse.json({ projects });
  } catch (error) {
    // ============================================================================
    // ERROR HANDLING
    // ============================================================================

    log.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PROJECT DELETION
// ============================================================================

/**
 * DELETE handler for deleting a specific project by ID
 * @param request - Next.js request object containing project ID in body
 * @returns JSON response confirming deletion or error
 */
export async function DELETE(request: NextRequest) {
  try {
    // ============================================================================
    // AUTHENTICATION CHECK
    // ============================================================================

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ============================================================================
    // REQUEST BODY PARSING
    // ============================================================================

    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // ============================================================================
    // PROJECT DELETION
    // ============================================================================

    const success = await deleteProject(projectId, userId);

    if (!success) {
      return NextResponse.json(
        { error: 'Project not found or failed to delete' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    // ============================================================================
    // ERROR HANDLING
    // ============================================================================

    log.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
