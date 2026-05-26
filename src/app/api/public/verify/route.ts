import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { buildings } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * POST /api/public/verify
 * Body: { id: number, pin: string }
 *
 * Verifies the PIN for the given building.
 * Returns the pdfUrl ONLY on success — it is never exposed before this point.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id  = Number(body?.id);
    const pin = String(body?.pin ?? '').trim();

    if (!id || !pin) {
      return NextResponse.json(
        { error: 'Missing id or pin.' },
        { status: 400 },
      );
    }

    const [building] = await db
      .select()
      .from(buildings)
      .where(eq(buildings.id, id));

    if (!building) {
      return NextResponse.json(
        { error: 'Building not found.' },
        { status: 404 },
      );
    }

    if (building.pin !== pin) {
      return NextResponse.json(
        { error: 'Incorrect PIN.' },
        { status: 401 },
      );
    }

    // PIN matched — now safe to return the actual PDF URL
    return NextResponse.json({
      success: true,
      building: {
        id:          building.id,
        name:        building.name,
        uid:         building.uid,
        description: building.description,
        imageUrl:    building.imageUrl,
        pdfUrl:      building.pdfUrl,
      },
    });
  } catch (err: unknown) {
    console.error('[POST /api/public/verify]', err);
    const message = err instanceof Error ? err.message : 'Verification failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
