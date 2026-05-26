import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { db } from '@/db';
import { buildings } from '@/db/schema';
import { desc } from 'drizzle-orm';

// ── GET: fetch all buildings ordered by newest first ────────────────────────
export async function GET() {
  try {
    const allBuildings = await db
      .select()
      .from(buildings)
      .orderBy(desc(buildings.createdAt));
    return NextResponse.json({ buildings: allBuildings });
  } catch (err: unknown) {
    console.error('[GET /api/buildings]', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const uid         = formData.get('uid')         as string | null;
    const name        = formData.get('name')        as string | null;
    const pin         = formData.get('pin')         as string | null;
    const description = formData.get('description') as string | null;
    const imageFile   = formData.get('image')       as File   | null;
    const pdfFile     = formData.get('pdf')         as File   | null;

    // ── Basic validation ────────────────────────────────────────────────────────
    if (!uid || !name || !pin || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: uid, name, pin, description.' },
        { status: 400 },
      );
    }

    // ── Upload image to Vercel Blob (optional) ──────────────────────────────────
    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      const imageBlob = await put(
        `buildings/${uid}/thumbnail-${Date.now()}.${imageFile.name.split('.').pop()}`,
        imageFile,
        { access: 'public' },
      );
      imageUrl = imageBlob.url;
    }

    // ── Upload PDF to Vercel Blob (optional) ────────────────────────────────────
    let pdfUrl: string | null = null;
    if (pdfFile && pdfFile.size > 0) {
      const pdfBlob = await put(
        `buildings/${uid}/report-${Date.now()}.pdf`,
        pdfFile,
        { access: 'public' },
      );
      pdfUrl = pdfBlob.url;
    }

    // ── Insert into Neon via Drizzle ────────────────────────────────────────────
    const [inserted] = await db
      .insert(buildings)
      .values({ uid, name, pin, description, imageUrl, pdfUrl })
      .returning();

    return NextResponse.json({ success: true, building: inserted }, { status: 201 });
  } catch (err: unknown) {
    console.error('[POST /api/buildings]', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
