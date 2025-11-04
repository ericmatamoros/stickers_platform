'use client';

import { useEffect, useState } from 'react';
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

export default function Home() {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetchStickers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedTags]);

  const fetchStickers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));

      const response = await fetch(`/api/stickers?${params}`);
      const data = await response.json();
      setStickers(data);

      // Extract all unique tags
      const tags = new Set<string>();
      data.forEach((sticker: Sticker) => {
        sticker.tags.forEach((tag: string) => tags.add(tag));
      });
      setAllTags(Array.from(tags).sort());
    } catch (error) {
      console.error('Error fetching stickers:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <NFTGate>
      <div className="min-h-screen" style={{ backgroundColor: '#0D0D0D' }}>
        <Navbar />
        
        <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col gap-4 mb-8 lg:ml-[341px] mt-[84px] lg:max-w-[1230px]">
            {/* Title */}
            <h1 
              className="text-[36px] font-semibold leading-[44px]" 
              style={{ color: '#FFFFFF' }}
            >
              Sticker Gallery
            </h1>
            
            {/* Subtitle */}
            <p 
              className="text-[16px] font-normal leading-[19px]" 
              style={{ color: '#939393' }}
            >
              Browse, download, and share amazing stickers and GIFs
            </p>

            {/* Search Bar */}
            <div className="w-full">
              <input
                type="text"
                placeholder="Search stickers"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-[10px] text-[16px] font-medium leading-[19px] focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{
                  height: '45px',
                  padding: '10px 13px',
                  backgroundColor: '#141414',
                  border: '2px solid rgba(147, 147, 147, 0.35)',
                  color: '#FFFFFF',
                  backdropFilter: 'blur(10px)',
                }}
              />
            </div>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="mb-6 lg:ml-[341px] lg:max-w-[1230px]">
              <h3 className="text-sm font-semibold mb-2" style={{ color: '#939393' }}>
                Filter by tags:
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: selectedTags.includes(tag) ? '#FF8000' : '#141414',
                      color: selectedTags.includes(tag) ? '#FFFFFF' : '#939393',
                      border: selectedTags.includes(tag) ? '1px solid #FF8000' : '1px solid rgba(147, 147, 147, 0.35)',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stickers Grid */}
          <div className="lg:ml-[341px] lg:max-w-[1230px] pb-[60px]">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin text-6xl mb-4">⏳</div>
                <p className="text-xl" style={{ color: '#939393' }}>Loading stickers...</p>
              </div>
            ) : stickers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl" style={{ color: '#939393' }}>No stickers found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {stickers.map((sticker) => (
                  <StickerCard key={sticker.id} sticker={sticker} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </NFTGate>
  );
}

