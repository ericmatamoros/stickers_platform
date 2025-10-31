import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sticker = await prisma.sticker.findUnique({
      where: { id: params.id },
    });

    if (!sticker) {
      return NextResponse.json({ error: 'Sticker not found' }, { status: 404 });
    }

    return NextResponse.json(sticker);
  } catch (error) {
    console.error('Error fetching sticker:', error);
    return NextResponse.json({ error: 'Failed to fetch sticker' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.sticker.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sticker:', error);
    return NextResponse.json({ error: 'Failed to delete sticker' }, { status: 500 });
  }
}

