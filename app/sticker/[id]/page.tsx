'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { NFTGate } from '@/components/NFTGate';

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

export default function StickerDetailPage() {
  const params = useParams();
  const [sticker, setSticker] = useState<Sticker | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSticker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchSticker = async () => {
    try {
      const response = await fetch(`/api/stickers/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setSticker(data);
      }
    } catch (error) {
      console.error('Error fetching sticker:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (sticker) {
      await navigator.clipboard.writeText(sticker.file_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    if (sticker) {
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
        window.open(sticker.file_url, '_blank');
      }
    }
  };

  if (loading) {
    return (
      <NFTGate>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <Navbar />
          <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
            <div className="text-center">
              <div className="animate-spin text-6xl mb-4">⏳</div>
              <p className="text-xl text-gray-700 dark:text-gray-300">Loading sticker...</p>
            </div>
          </div>
        </div>
      </NFTGate>
    );
  }

  if (!sticker) {
    return (
      <NFTGate>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <Navbar />
          <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
              <div className="text-6xl mb-4">😢</div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Sticker Not Found
              </h2>
              <Link
                href="/"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                ← Back to Gallery
              </Link>
            </div>
          </div>
        </div>
      </NFTGate>
    );
  }

  return (
    <NFTGate>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:underline mb-6"
          >
            ← Back to Gallery
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Image Section - Much larger */}
              <div className="relative w-full h-[600px] bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Image
                  src={sticker.file_url}
                  alt={sticker.title}
                  fill
                  className="object-contain p-4"
                  unoptimized={sticker.file_type === 'gif'}
                  priority
                />
              </div>

              {/* Details Section */}
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {sticker.title}
                </h1>

                {sticker.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {sticker.description}
                  </p>
                )}

                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tags:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sticker.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <strong>Type:</strong> {sticker.file_type.toUpperCase()}
                  </p>
                  <p>
                    <strong>Uploaded:</strong>{' '}
                    {new Date(sticker.created_at).toLocaleDateString()}
                  </p>
                  <p className="truncate">
                    <strong>By:</strong> {sticker.uploader_wallet}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mt-auto">
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    {copied ? '✓' : '📋'} {copied ? 'Copied!' : 'Copy Link'}
                  </button>

                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    ⬇️ Download
                  </button>

                  {sticker.telegram_pack_url && (
                    <a
                      href={sticker.telegram_pack_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      📱 Add to Telegram
                    </a>
                  )}

                  {sticker.discord_pack_url && (
                    <a
                      href={sticker.discord_pack_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      💬 Add to Discord
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </NFTGate>
  );
}

