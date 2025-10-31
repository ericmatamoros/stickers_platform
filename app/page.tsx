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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🎨 Sticker Gallery
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Browse, download, and share amazing stickers and GIFs
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search stickers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Filter by tags:
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stickers Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin text-6xl mb-4">⏳</div>
              <p className="text-xl text-gray-700 dark:text-gray-300">Loading stickers...</p>
            </div>
          ) : stickers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-700 dark:text-gray-300">No stickers found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {stickers.map((sticker) => (
                <StickerCard key={sticker.id} sticker={sticker} />
              ))}
            </div>
          )}
        </main>
      </div>
    </NFTGate>
  );
}

