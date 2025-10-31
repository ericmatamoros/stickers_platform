'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Navbar } from '@/components/Navbar';
import { NFTGate } from '@/components/NFTGate';
import { ADMIN_WALLETS } from '@/lib/config';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const { address } = useAccount();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file_type: 'image',
    tags: '',
    telegram_pack_url: '',
    discord_pack_url: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const isAdmin = address && ADMIN_WALLETS.includes(address.toLowerCase());

  if (!isAdmin) {
    return (
      <NFTGate>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <Navbar />
          <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md">
              <div className="text-6xl mb-4">🚫</div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Admin Access Required
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                You need to be an admin to upload stickers.
              </p>
            </div>
          </div>
        </div>
      </NFTGate>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !address) return;

    setUploading(true);

    try {
      // Step 1: Get presigned URL
      const urlResponse = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          walletAddress: address,
        }),
      });

      if (!urlResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, fileUrl } = await urlResponse.json();

      // Step 2: Upload file to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      // Step 3: Save metadata to database
      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      const stickerResponse = await fetch('/api/stickers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          file_url: fileUrl,
          file_type: formData.file_type,
          tags,
          telegram_pack_url: formData.telegram_pack_url || null,
          discord_pack_url: formData.discord_pack_url || null,
          uploader_wallet: address,
        }),
      });

      if (!stickerResponse.ok) {
        throw new Error('Failed to save sticker metadata');
      }

      // Success! Redirect to gallery
      alert('Sticker uploaded successfully!');
      router.push('/');
    } catch (error) {
      console.error('Error uploading sticker:', error);
      alert('Failed to upload sticker. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <NFTGate>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              📤 Upload Sticker
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  File *
                </label>
                <input
                  type="file"
                  accept="image/*,.gif"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  File Type *
                </label>
                <select
                  value={formData.file_type}
                  onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="image">Image</option>
                  <option value="gif">GIF</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="funny, cute, reaction"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telegram Pack URL
                </label>
                <input
                  type="url"
                  value={formData.telegram_pack_url}
                  onChange={(e) =>
                    setFormData({ ...formData, telegram_pack_url: e.target.value })
                  }
                  placeholder="https://t.me/addstickers/..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discord Pack URL
                </label>
                <input
                  type="url"
                  value={formData.discord_pack_url}
                  onChange={(e) =>
                    setFormData({ ...formData, discord_pack_url: e.target.value })
                  }
                  placeholder="https://discord.com/..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
              >
                {uploading ? 'Uploading...' : 'Upload Sticker'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </NFTGate>
  );
}

