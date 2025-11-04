'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const pageUrl = `${window.location.origin}/sticker/${sticker.id}`;
    await navigator.clipboard.writeText(pageUrl);
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
          className="w-full cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center"
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

