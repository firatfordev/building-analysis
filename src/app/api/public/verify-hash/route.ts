import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { buildings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

/**
 * POST /api/public/verify-hash
 * Body: { id: number, hash: string }
 *
 * Verifies that hash === SHA-256(`${id}:${pin}`) for the given building.
 * Returns building data (including pdfUrl) only on success.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { id?: unknown; hash?: unknown };
    const id   = Number(body?.id);
    const hash = String(body?.hash ?? '').trim().toLowerCase();

    if (!id || !hash || hash.length !== 64) {
      return NextResponse.json(
        { error: 'Missing or invalid id / hash.' },
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

    // Compute expected SHA-256(buildingId:pin)
    const expected = crypto
      .createHash('sha256')
      .update(`${id}:${building.pin}`)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    const aBuf = Buffer.from(expected);
    const bBuf = Buffer.from(hash.padEnd(expected.length, '\0'));
    const match =
      aBuf.length === bBuf.length &&
      crypto.timingSafeEqual(aBuf, bBuf) &&
      expected === hash;

    if (!match) {
      return NextResponse.json(
        { error: 'Invalid access token.' },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      building: {
        id:          building.id,
        name:        building.name,
        uid:         building.uid,
        description: building.description,
        imageUrl:    building.imageUrl,
        pdfUrl:      building.pdfUrl,
        createdAt:   building.createdAt,
      },
    });
  } catch (err: unknown) {
    console.error('[POST /api/public/verify-hash]', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
