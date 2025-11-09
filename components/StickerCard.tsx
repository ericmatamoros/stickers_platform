'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface StickerCardProps {
  sticker: {
    id: string;
    title: string;
    file_url: string;
    file_type: string;
    tags: string[];
    telegram_pack_url?: string | null;
    discord_pack_url?: string | null;
  };
}

export function StickerCard({ sticker }: StickerCardProps) {
  const { address } = useAccount();
  const [copied, setCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Check if sticker is favorited when component mounts or address changes
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!address) return;

      try {
        const response = await fetch(`/api/favorites?wallet=${address}`);
        const favorites = await response.json();
        const isFav = favorites.some((fav: any) => fav.id === sticker.id);
        setIsFavorited(isFav);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [address, sticker.id]);

  const handleToggleFavorite = async () => {
    if (!address || favoriteLoading) return;

    setFavoriteLoading(true);
    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites?wallet=${address}&stickerId=${sticker.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setIsFavorited(false);
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wallet_address: address,
            sticker_id: sticker.id,
          }),
        });
        if (response.ok) {
          setIsFavorited(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(sticker.file_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(sticker.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${sticker.title}.${sticker.file_type === 'gif' ? 'gif' : 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to opening in new tab
      window.open(sticker.file_url, '_blank');
    }
  };

  return (
    <div 
      className="w-full rounded-[10px] overflow-hidden transition-all duration-300 hover:transform hover:scale-105"
      style={{
        maxWidth: '290px',
        height: '383px',
        backgroundColor: '#141414',
        position: 'relative',
      }}
    >
      {/* Sticker Image */}
      <Link href={`/sticker/${sticker.id}`}>
        <div
          className="w-full cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center relative"
          style={{
            height: '283px',
            padding: '39px 32px 0px 32px',
          }}
        >
          <Image
            src={sticker.file_url}
            alt={sticker.title}
            width={226}
            height={226}
            className="object-contain max-w-full max-h-[226px]"
            unoptimized={sticker.file_type === 'gif'}
          />

          {/* Favorite Star */}
          {address && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleFavorite();
              }}
              disabled={favoriteLoading}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110 disabled:opacity-50"
              style={{
                backgroundColor: 'rgba(20, 20, 20, 0.8)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span
                className="text-xl"
                style={{ color: isFavorited ? '#FF8000' : '#939393' }}
              >
                {isFavorited ? '★' : '☆'}
              </span>
            </button>
          )}
        </div>
      </Link>
      
      {/* Bottom Section */}
      <div 
        className="absolute bottom-0 left-0 right-0 rounded-b-[10px]"
        style={{
          height: '100px',
          backgroundColor: '#1B1B1B',
          padding: '9px',
        }}
      >
        {/* Title */}
        <h3 
          className="font-semibold text-[18px] leading-[22px] truncate mb-2"
          style={{ color: '#FFFFFF' }}
        >
          {sticker.title}
        </h3>
        
        {/* Buttons */}
        <div className="flex gap-2">
          {/* Copy Button */}
          <button
            onClick={handleCopyLink}
            className="flex-1 rounded-[6px] text-[16px] font-semibold leading-[19px] transition-all duration-200 hover:border-opacity-50 flex items-center justify-center"
            style={{
              height: '32px',
              backgroundColor: '#141414',
              border: copied ? '1px solid #FF8000' : '1px solid rgba(147, 147, 147, 0.35)',
              color: copied ? '#FFFFFF' : 'rgba(147, 147, 147, 0.35)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {copied ? 'copied!' : 'copy'}
          </button>
          
          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex-1 rounded-[6px] text-[16px] font-semibold leading-[19px] transition-all duration-200 hover:border-opacity-80 flex items-center justify-center"
            style={{
              height: '32px',
              backgroundColor: '#141414',
              border: '1px solid #FF8000',
              color: '#FFFFFF',
              backdropFilter: 'blur(10px)',
            }}
          >
            download
          </button>
        </div>
      </div>
    </div>
  );
}

