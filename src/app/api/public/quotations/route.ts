import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { quotations } from '@/db/schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName, email, phone, company,
      propertyName, propertyType, propertySize, floors, buildingAge,
      addons, notes, totalPrice,
    } = body;

    if (!fullName || !email || !propertyName || !propertyType || !propertySize || !floors || !buildingAge || !totalPrice) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const [row] = await db.insert(quotations).values({
      fullName,
      email,
      phone:        phone        || null,
      company:      company      || null,
      propertyName,
      propertyType,
      propertySize,
      floors,
      buildingAge,
      addons:       addons       ? JSON.stringify(addons) : null,
      notes:        notes        || null,
      totalPrice:   Number(totalPrice),
    }).returning();

    return NextResponse.json({ quotation: row }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/public/quotations]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
