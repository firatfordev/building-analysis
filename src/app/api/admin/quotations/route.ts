import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { quotations } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { AUTH_COOKIE, verifyToken } from '@/lib/auth';

async function checkAuth(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return false;
  return verifyToken(token);
}

// GET /api/admin/quotations – list all quotations (newest first)
export async function GET(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const rows = await db
      .select()
      .from(quotations)
      .orderBy(desc(quotations.createdAt));
    return NextResponse.json({ quotations: rows });
  } catch (err: unknown) {
    console.error('[GET /api/admin/quotations]', err);
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH /api/admin/quotations – update isRead / status
export async function PATCH(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id, isRead, status } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const updates: Partial<{ isRead: boolean; status: string }> = {};
    if (typeof isRead  === 'boolean') updates.isRead = isRead;
    if (typeof status  === 'string')  updates.status = status;

    await db
      .update(quotations)
      .set(updates)
      .where(eq(quotations.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('[PATCH /api/admin/quotations]', err);
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
