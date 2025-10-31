import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  try {
    const sticker = await prisma.sticker.findUnique({
      where: { id: params.id },
    });

    if (!sticker) {
      return {
        title: 'Sticker Not Found | MyStickers',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const pageUrl = `${baseUrl}/sticker/${params.id}`;

    return {
      title: `${sticker.title} | MyStickers`,
      description: sticker.description || 'View and download this sticker',
      openGraph: {
        title: sticker.title,
        description: sticker.description || 'View and download this sticker',
        url: pageUrl,
        images: [
          {
            url: sticker.file_url,
            width: 800,
            height: 800,
            alt: sticker.title,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: sticker.title,
        description: sticker.description || 'View and download this sticker',
        images: [sticker.file_url],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'MyStickers',
    };
  }
}

export default function StickerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

