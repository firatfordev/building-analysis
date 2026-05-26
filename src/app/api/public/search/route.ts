import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { buildings } from '@/db/schema';
import { or, ilike } from 'drizzle-orm';

/**
 * GET /api/public/search?q=<term>
 * Public endpoint – returns partial building data (no PIN, no pdfUrl).
 * Used by the landing page search console.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';

  if (q.length < 2) {
    return NextResponse.json({ buildings: [] });
  }

  try {
    const rows = await db
      .select({
        id:          buildings.id,
        name:        buildings.name,
        uid:         buildings.uid,
        description: buildings.description,
        imageUrl:    buildings.imageUrl,
        // Return a boolean so we never expose the raw pdfUrl to unauthenticated users
        pdfUrl:      buildings.pdfUrl,
      })
      .from(buildings)
      .where(
        or(
          ilike(buildings.name, `%${q}%`),
          ilike(buildings.uid,  `%${q}%`),
        ),
      );

    return NextResponse.json({
      buildings: rows.map(b => ({
        id:          b.id,
        name:        b.name,
        uid:         b.uid,
        description: b.description,
        imageUrl:    b.imageUrl,
        hasPdf:      !!b.pdfUrl,   // boolean only – URL is withheld until PIN verified
      })),
    });
  } catch (err: unknown) {
    console.error('[GET /api/public/search]', err);
    const message = err instanceof Error ? err.message : 'Search failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
