import { NextResponse } from 'next/server';
import { db } from '@/db';
import { settings } from '@/db/schema';
import { inArray } from 'drizzle-orm';

const KEYS = ['sample_pdf_url', 'sample_title', 'sample_description'];

// GET /api/public/sample – returns sample report metadata (no auth required)
export async function GET() {
  try {
    const rows = await db
      .select()
      .from(settings)
      .where(inArray(settings.key, KEYS));

    const map: Record<string, string | null> = {};
    for (const r of rows) map[r.key] = r.value ?? null;

    return NextResponse.json({
      sample: {
        available:   !!map['sample_pdf_url'],
        pdfUrl:      map['sample_pdf_url']      ?? null,
        title:       map['sample_title']         ?? 'Sample Structural Analysis Report',
        description: map['sample_description']   ?? 'A demonstration report showing the full scope of an AURA structural analysis — including core sampling results, seismic resonance data, and Eurocode 8 compliance certification.',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
