import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
export const alt = 'MyStickers';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
 
export default async function Image({ params }: { params: { id: string } }) {
  try {
    // Fetch sticker data
    const sticker = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stickers/${params.id}`
    ).then((res) => res.json());
 
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(to bottom right, #f3e8ff, #e0f2fe)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 60,
              fontWeight: 'bold',
              marginBottom: 20,
            }}
          >
            🎨 MyStickers
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 40,
              color: '#374151',
            }}
          >
            {sticker.title}
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (e) {
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(to bottom right, #f3e8ff, #e0f2fe)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 60,
            fontWeight: 'bold',
          }}
        >
          🎨 MyStickers
        </div>
      ),
      {
        ...size,
      }
    );
  }
}

