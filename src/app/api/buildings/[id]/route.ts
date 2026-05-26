import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { db } from '@/db';
import { buildings } from '@/db/schema';
import { eq } from 'drizzle-orm';

type RouteContext = { params: Promise<{ id: string }> };

// ── GET single building ──────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const [building] = await db
      .select()
      .from(buildings)
      .where(eq(buildings.id, parseInt(id, 10)));

    if (!building) {
      return NextResponse.json({ error: 'Building not found' }, { status: 404 });
    }
    return NextResponse.json({ building });
  } catch (err: unknown) {
    console.error('[GET /api/buildings/:id]', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ── PATCH / update building ──────────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const formData = await req.formData();

    const uid         = formData.get('uid')         as string | null;
    const name        = formData.get('name')        as string | null;
    const pin         = formData.get('pin')         as string | null;
    const description = formData.get('description') as string | null;
    const imageFile   = formData.get('image')       as File   | null;
    const pdfFile     = formData.get('pdf')         as File   | null;
    const removeImage = formData.get('removeImage') === 'true';
    const removePdf   = formData.get('removePdf')   === 'true';

    if (!uid || !name || !pin || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: uid, name, pin, description.' },
        { status: 400 },
      );
    }

    // Fetch existing record to preserve existing blob URLs
    const [existing] = await db
      .select()
      .from(buildings)
      .where(eq(buildings.id, parseInt(id, 10)));

    if (!existing) {
      return NextResponse.json({ error: 'Building not found' }, { status: 404 });
    }

    // ── Image handling ──────────────────────────────────────────────────────
    let imageUrl: string | null = existing.imageUrl;
    if (removeImage) {
      imageUrl = null;
    } else if (imageFile && imageFile.size > 0) {
      const blob = await put(
        `buildings/${uid}/thumbnail-${Date.now()}.${imageFile.name.split('.').pop()}`,
        imageFile,
        { access: 'public' },
      );
      imageUrl = blob.url;
    }

    // ── PDF handling ────────────────────────────────────────────────────────
    let pdfUrl: string | null = existing.pdfUrl;
    if (removePdf) {
      pdfUrl = null;
    } else if (pdfFile && pdfFile.size > 0) {
      const blob = await put(
        `buildings/${uid}/report-${Date.now()}.pdf`,
        pdfFile,
        { access: 'public' },
      );
      pdfUrl = blob.url;
    }

    const [updated] = await db
      .update(buildings)
      .set({ uid, name, pin, description, imageUrl, pdfUrl })
      .where(eq(buildings.id, parseInt(id, 10)))
      .returning();

    return NextResponse.json({ success: true, building: updated });
  } catch (err: unknown) {
    console.error('[PATCH /api/buildings/:id]', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ── DELETE building ──────────────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const [deleted] = await db
      .delete(buildings)
      .where(eq(buildings.id, parseInt(id, 10)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Building not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('[DELETE /api/buildings/:id]', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
