import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedUploadUrl } from '@/lib/s3';
import { ADMIN_WALLETS } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, fileType, walletAddress } = body;

    if (!fileName || !fileType || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if wallet is admin
    if (!ADMIN_WALLETS.includes(walletAddress.toLowerCase())) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin wallet required' },
        { status: 403 }
      );
    }

    const { uploadUrl, fileUrl } = await generatePresignedUploadUrl(
      fileName,
      fileType
    );

    return NextResponse.json({ uploadUrl, fileUrl });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}

