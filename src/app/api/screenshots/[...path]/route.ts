/**
 * API route for serving screenshot files
 * Handles dynamic file path routing for screenshot images
 *
 * Improvements:
 * - Corrected handler typing for Next.js App Router params
 * - Uses async fs APIs (no blocking existsSync)
 * - Protects against directory traversal
 * - Better content-type mapping
 * - Minimal logging (dev-only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join, extname, resolve } from 'path';
import log from '@/lib/logger';

/**
 * GET handler for serving screenshot files
 * Reconstructs file path from dynamic route parameters and serves the image
 * @param request - Next.js request object
 * @param params - Route parameters containing file path segments
 * @returns NextResponse with image file or error
 */
export async function GET(request: NextRequest, context: any) {
  try {
    const pathSegments = context?.params?.path ?? [];

    // Base directory where screenshots are stored
    const baseDir = resolve(
      process.cwd(),
      'src/services/webautomation/utils/screenshots'
    );

    // Basic validation: no empty segments, no absolute segments, no '..'
    for (const seg of pathSegments) {
      if (
        !seg ||
        seg.includes('\0') ||
        seg.includes('..') ||
        seg.startsWith('/')
      ) {
        return new NextResponse('Invalid path', { status: 400 });
      }
    }

    const filePath = join(baseDir, ...pathSegments);

    // Ensure the resolved path is inside the base directory (prevents traversal)
    if (!filePath.startsWith(baseDir)) {
      return new NextResponse('Invalid path', { status: 400 });
    }

    // Check file exists and is a file
    let st;
    try {
      st = await stat(filePath);
    } catch {
      return new NextResponse('Screenshot not found', { status: 404 });
    }
    if (!st.isFile()) {
      return new NextResponse('Not a file', { status: 404 });
    }

    // Read the file
    const fileBuffer = await readFile(filePath);

    // Determine content type based on extension
    const ext = extname(filePath).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.avif': 'image/avif',
      '.bmp': 'image/bmp'
    };
    const contentType = mimeMap[ext] ?? 'application/octet-stream';

    // Dev-only log
    log.debug('Serving screenshot', { filePath });

    // NextResponse expects a BodyInit (string | Blob | BufferSource | ReadableStream | FormData | URLSearchParams).
    // Convert Node Buffer to a Uint8Array (BufferSource) to satisfy TypeScript.
    const body = new Uint8Array(fileBuffer);

    return new NextResponse(body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    log.error('Error serving screenshot:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
