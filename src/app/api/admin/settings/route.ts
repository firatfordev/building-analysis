import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { db } from '@/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { AUTH_COOKIE, verifyToken } from '@/lib/auth';

async function checkAuth(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return false;
  return verifyToken(token);
}

// GET /api/admin/settings – return all settings as { key: value }
export async function GET(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const rows = await db.select().from(settings);
    const map: Record<string, string | null> = {};
    for (const r of rows) map[r.key] = r.value ?? null;
    return NextResponse.json({ settings: map });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH /api/admin/settings – upsert a text setting OR upload a PDF file
// • JSON body:   { key: string, value: string }
// • FormData:    key field + pdf file field named "pdf"
export async function PATCH(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const contentType = req.headers.get('content-type') ?? '';

    if (contentType.includes('multipart/form-data')) {
      // ── File upload path ────────────────────────────────────────────────────
      const form = await req.formData();
      const key  = form.get('key') as string | null;
      const file = form.get('pdf') as File | null;

      if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });

      let value: string | null = null;
      if (file && file.size > 0) {
        const blob = await put(`settings/${key}-${Date.now()}.pdf`, file, { access: 'public' });
        value = blob.url;
      }

      await db
        .insert(settings)
        .values({ key, value, updatedAt: new Date() })
        .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } });

      return NextResponse.json({ ok: true, value });
    }

    // ── JSON path ──────────────────────────────────────────────────────────────
    const { key, value } = await req.json() as { key: string; value: string | null };
    if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });

    await db
      .insert(settings)
      .values({ key, value: value ?? null, updatedAt: new Date() })
      .onConflictDoUpdate({ target: settings.key, set: { value: value ?? null, updatedAt: new Date() } });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/admin/settings – clear a setting value
export async function DELETE(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { key } = await req.json() as { key: string };
    await db.update(settings).set({ value: null }).where(eq(settings.key, key));
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
