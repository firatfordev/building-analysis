import { NextResponse } from 'next/server';
import { db } from '@/db';
import { contactMessages } from '@/db/schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name, email and message are required.' },
        { status: 400 },
      );
    }

    await db.insert(contactMessages).values({
      name:    name.trim(),
      email:   email.trim(),
      phone:   phone?.trim()   || null,
      subject: subject?.trim() || null,
      message: message.trim(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: unknown) {
    console.error('[POST /api/public/messages]', err);
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
