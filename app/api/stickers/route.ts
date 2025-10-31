import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search');
  const tags = searchParams.get('tags')?.split(',').filter(Boolean);

  try {
    const stickers = await prisma.sticker.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          tags && tags.length > 0
            ? {
                tags: {
                  hasSome: tags,
                },
              }
            : {},
        ],
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(stickers);
  } catch (error) {
    console.error('Error fetching stickers:', error);
    return NextResponse.json({ error: 'Failed to fetch stickers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      file_url,
      file_type,
      tags,
      telegram_pack_url,
      discord_pack_url,
      uploader_wallet,
    } = body;

    if (!title || !file_url || !file_type || !uploader_wallet) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sticker = await prisma.sticker.create({
      data: {
        title,
        description,
        file_url,
        file_type,
        tags: tags || [],
        telegram_pack_url,
        discord_pack_url,
        uploader_wallet: uploader_wallet.toLowerCase(),
      },
    });

    return NextResponse.json(sticker, { status: 201 });
  } catch (error) {
    console.error('Error creating sticker:', error);
    return NextResponse.json({ error: 'Failed to create sticker' }, { status: 500 });
  }
}

