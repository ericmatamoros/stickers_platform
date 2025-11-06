'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { NFTGate } from '@/components/NFTGate';
import { useAccount } from 'wagmi';
import { ADMIN_WALLETS } from '@/lib/config';

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
  const router = useRouter();
  const { address } = useAccount();
  const [sticker, setSticker] = useState<Sticker | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = address && ADMIN_WALLETS.includes(address.toLowerCase());

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

  const handleDelete = async () => {
    if (!sticker || !isAdmin) return;
    
    if (!confirm('Are you sure you want to delete this sticker? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/stickers/${sticker.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Sticker deleted successfully!');
        router.push('/');
      } else {
        throw new Error('Failed to delete sticker');
      }
    } catch (error) {
      console.error('Error deleting sticker:', error);
      alert('Failed to delete sticker. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <NFTGate>
        <div className="min-h-screen" style={{ backgroundColor: '#0D0D0D' }}>
          <Navbar />
          <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
            <div className="text-center">
              <div className="animate-spin text-6xl mb-4">⏳</div>
              <p className="text-xl" style={{ color: '#939393' }}>Loading sticker...</p>
            </div>
          </div>
        </div>
      </NFTGate>
    );
  }

  if (!sticker) {
    return (
      <NFTGate>
        <div className="min-h-screen" style={{ backgroundColor: '#0D0D0D' }}>
          <Navbar />
          <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
            <div 
              className="text-center rounded-2xl"
              style={{
                padding: '48px 32px',
                backgroundColor: '#141414',
                border: '1px solid rgba(147, 147, 147, 0.15)',
              }}
            >
              <div className="text-6xl mb-4">😢</div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
                Sticker Not Found
              </h2>
              <Link
                href="/"
                className="hover:underline"
                style={{ color: '#FF8000' }}
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
      <div className="min-h-screen" style={{ backgroundColor: '#0D0D0D' }}>
        <Navbar />
        
        <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-[600px] mx-auto">
            <Link
              href="/"
              className="inline-flex items-center hover:underline mb-6"
              style={{ color: '#FF8000' }}
            >
              ← Back to Gallery
            </Link>

            <div 
              className="rounded-2xl p-8"
              style={{
                backgroundColor: '#141414',
                border: '1px solid rgba(147, 147, 147, 0.15)',
              }}
            >
              {/* Image Section */}
              <div className="relative w-full aspect-square bg-transparent rounded-lg mb-6 flex items-center justify-center">
                <Image
                  src={sticker.file_url}
                  alt={sticker.title}
                  width={500}
                  height={500}
                  className="object-contain max-w-full max-h-full"
                  unoptimized={sticker.file_type === 'gif'}
                  priority
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 rounded-[6px] text-[16px] font-semibold leading-[19px] transition-all duration-200 hover:border-opacity-50 flex items-center justify-center"
                    style={{
                      height: '48px',
                      backgroundColor: '#141414',
                      border: copied ? '1px solid #FF8000' : '1px solid rgba(147, 147, 147, 0.35)',
                      color: copied ? '#FFFFFF' : 'rgba(147, 147, 147, 0.35)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {copied ? 'copied!' : 'copy link'}
                  </button>

                  <button
                    onClick={handleDownload}
                    className="flex-1 rounded-[6px] text-[16px] font-semibold leading-[19px] transition-all duration-200 hover:border-opacity-80 flex items-center justify-center"
                    style={{
                      height: '48px',
                      backgroundColor: '#141414',
                      border: '1px solid #FF8000',
                      color: '#FFFFFF',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    download
                  </button>
                </div>

                {isAdmin && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full rounded-[6px] text-[16px] font-semibold leading-[19px] transition-all duration-200 flex items-center justify-center"
                    style={{
                      height: '48px',
                      backgroundColor: '#141414',
                      border: '1px solid #FF0000',
                      color: deleting ? '#939393' : '#FF0000',
                      backdropFilter: 'blur(10px)',
                      cursor: deleting ? 'not-allowed' : 'pointer',
                      opacity: deleting ? 0.5 : 1,
                    }}
                  >
                    {deleting ? 'deleting...' : 'delete sticker'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </NFTGate>
  );
}

