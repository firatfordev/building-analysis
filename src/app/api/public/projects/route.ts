import { NextResponse } from 'next/server';
import { db } from '@/db';
import { buildings } from '@/db/schema';

/**
 * GET /api/public/projects
 * Public endpoint – returns all building records without PIN.
 * Used by the public Completed Projects page.
 */
export async function GET() {
  try {
    const rows = await db
      .select({
        id:          buildings.id,
        uid:         buildings.uid,
        name:        buildings.name,
        description: buildings.description,
        imageUrl:    buildings.imageUrl,
        pdfUrl:      buildings.pdfUrl,
        createdAt:   buildings.createdAt,
      })
      .from(buildings);

    return NextResponse.json({
      buildings: rows.map(b => ({
        id:          b.id,
        uid:         b.uid,
        name:        b.name,
        description: b.description,
        imageUrl:    b.imageUrl,
        hasPdf:      !!b.pdfUrl,
        createdAt:   b.createdAt,
      })),
    });
  } catch (err: unknown) {
    console.error('[GET /api/public/projects]', err);
    const message = err instanceof Error ? err.message : 'Failed to fetch projects';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
