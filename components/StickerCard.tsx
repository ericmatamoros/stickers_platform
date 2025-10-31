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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/sticker/${sticker.id}`}>
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 cursor-pointer hover:opacity-90 transition-opacity">
          <Image
            src={sticker.file_url}
            alt={sticker.title}
            fill
            className="object-contain p-4"
            unoptimized={sticker.file_type === 'gif'}
          />
        </div>
      </Link>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white truncate">
          {sticker.title}
        </h3>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {sticker.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
          >
            {copied ? '✓' : '📋'} {copied ? 'Copied!' : 'Copy'}
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg transition-colors"
          >
            ⬇️ Download
          </button>
          
          {sticker.telegram_pack_url && (
            <a
              href={sticker.telegram_pack_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm rounded-lg transition-colors"
            >
              📱 Telegram
            </a>
          )}
          
          {sticker.discord_pack_url && (
            <a
              href={sticker.discord_pack_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-lg transition-colors"
            >
              💬 Discord
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

