'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Navbar } from '@/components/Navbar';
import { NFTGate } from '@/components/NFTGate';
import { StickerCard } from '@/components/StickerCard';

interface Sticker {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  tags: string[];
  telegram_pack_url: string | null;
  discord_pack_url: string | null;
  uploader_wallet: string;
  created_at: string;
}

export default function FavoritesPage() {
  const { address } = useAccount();
  const [favorites, setFavorites] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/favorites?wallet=${address}`);
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [address, fetchFavorites]);

  return (
    <NFTGate>
      <div className="min-h-screen" style={{ backgroundColor: '#0D0D0D' }}>
        <Navbar />

        <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Content Container */}
          <div className="max-w-[1230px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col gap-4 mb-8 mt-[84px]">
              {/* Title */}
              <h1
                className="text-[36px] font-semibold leading-[44px]"
                style={{ color: '#FFFFFF' }}
              >
                My Favorite Stickers
              </h1>

              {/* Subtitle */}
              <p
                className="text-[16px] font-normal leading-[19px]"
                style={{ color: '#939393' }}
              >
                Your collection of favorite stickers
              </p>
            </div>

            {/* Content */}
            {!address ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔗</div>
                <p className="text-xl" style={{ color: '#939393' }}>
                  Connect your wallet to view your favorites
                </p>
              </div>
            ) : loading ? (
              <div className="text-center py-12">
                <div className="animate-spin text-6xl mb-4">⏳</div>
                <p className="text-xl" style={{ color: '#939393' }}>Loading your favorites...</p>
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⭐</div>
                <p className="text-xl" style={{ color: '#939393' }}>No favorite stickers yet</p>
                <p className="text-sm mt-2" style={{ color: '#777777' }}>
                  Click the star icon on any sticker to add it to your favorites
                </p>
              </div>
            ) : (
              <div className="pb-[60px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                  {favorites.map((sticker) => (
                    <StickerCard key={sticker.id} sticker={sticker} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </NFTGate>
  );
}
