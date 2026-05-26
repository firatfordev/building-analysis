import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { contactMessages } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { AUTH_COOKIE, verifyToken } from '@/lib/auth';

async function checkAuth(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return false;
  return verifyToken(token);
}

// GET /api/admin/messages – list all contact messages (newest first)
export async function GET(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const msgs = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
    return NextResponse.json({ messages: msgs });
  } catch (err: unknown) {
    console.error('[GET /api/admin/messages]', err);
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH /api/admin/messages – toggle isRead for a message
export async function PATCH(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id, isRead } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await db
      .update(contactMessages)
      .set({ isRead: Boolean(isRead) })
      .where(eq(contactMessages.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('[PATCH /api/admin/messages]', err);
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
