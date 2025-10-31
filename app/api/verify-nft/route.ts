import { NextRequest, NextResponse } from 'next/server';
import { checkNFTOwnership } from '@/lib/nft-verification';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address required' }, { status: 400 });
  }

  try {
    const hasNFT = await checkNFTOwnership(address);
    return NextResponse.json({ hasNFT });
  } catch (error) {
    console.error('Error verifying NFT:', error);
    return NextResponse.json({ error: 'Failed to verify NFT' }, { status: 500 });
  }
}

