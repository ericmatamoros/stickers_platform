import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const walletAddress = searchParams.get('wallet');

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        wallet_address: walletAddress.toLowerCase(),
      },
      include: {
        sticker: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Extract just the sticker data
    const stickers = favorites.map(fav => fav.sticker);

    return NextResponse.json(stickers);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet_address, sticker_id } = body;

    if (!wallet_address || !sticker_id) {
      return NextResponse.json(
        { error: 'Wallet address and sticker ID are required' },
        { status: 400 }
      );
    }

    // Check if the favorite already exists
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        wallet_address_sticker_id: {
          wallet_address: wallet_address.toLowerCase(),
          sticker_id,
        },
      },
    });

    if (existingFavorite) {
      return NextResponse.json({ error: 'Favorite already exists' }, { status: 409 });
    }

    const favorite = await prisma.favorite.create({
      data: {
        wallet_address: wallet_address.toLowerCase(),
        sticker_id,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error('Error creating favorite:', error);
    return NextResponse.json({ error: 'Failed to create favorite' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const walletAddress = searchParams.get('wallet');
  const stickerId = searchParams.get('stickerId');

  if (!walletAddress || !stickerId) {
    return NextResponse.json(
      { error: 'Wallet address and sticker ID are required' },
      { status: 400 }
    );
  }

  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        wallet_address_sticker_id: {
          wallet_address: walletAddress.toLowerCase(),
          sticker_id: stickerId,
        },
      },
    });

    if (!favorite) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    await prisma.favorite.delete({
      where: {
        wallet_address_sticker_id: {
          wallet_address: walletAddress.toLowerCase(),
          sticker_id: stickerId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    return NextResponse.json({ error: 'Failed to delete favorite' }, { status: 500 });
  }
}
