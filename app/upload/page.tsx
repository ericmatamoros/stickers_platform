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
    file_type: 'image',
  });
  const [file, setFile] = useState<File | null>(null);

  const isAdmin = address && ADMIN_WALLETS.includes(address.toLowerCase());

  if (!isAdmin) {
    return (
      <NFTGate>
        <div className="min-h-screen" style={{ backgroundColor: '#0D0D0D' }}>
          <Navbar />
          <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
            <div 
              className="text-center rounded-2xl max-w-md"
              style={{
                padding: '48px 32px',
                backgroundColor: '#141414',
                border: '1px solid rgba(147, 147, 147, 0.15)',
              }}
            >
              <div className="text-6xl mb-4">🚫</div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
                Admin Access Required
              </h2>
              <p style={{ color: '#939393' }}>
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
      const stickerResponse = await fetch('/api/stickers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: null,
          file_url: fileUrl,
          file_type: formData.file_type,
          tags: [],
          telegram_pack_url: null,
          discord_pack_url: null,
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
      <div className="min-h-screen" style={{ backgroundColor: '#0D0D0D' }}>
        <Navbar />
        
        <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto py-8">
            <div 
              className="rounded-2xl p-8"
              style={{
                backgroundColor: '#141414',
                border: '1px solid rgba(147, 147, 147, 0.15)',
              }}
            >
              <h1 className="text-3xl font-bold mb-6" style={{ color: '#FFFFFF' }}>
                📤 Upload Sticker
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#939393' }}>
                    File *
                  </label>
                  <input
                    type="file"
                    accept="image/*,.gif"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{
                      backgroundColor: '#1B1B1B',
                      border: '1px solid rgba(147, 147, 147, 0.35)',
                      color: '#FFFFFF',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#939393' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{
                      backgroundColor: '#1B1B1B',
                      border: '1px solid rgba(147, 147, 147, 0.35)',
                      color: '#FFFFFF',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#939393' }}>
                    File Type *
                  </label>
                  <select
                    value={formData.file_type}
                    onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{
                      backgroundColor: '#1B1B1B',
                      border: '1px solid rgba(147, 147, 147, 0.35)',
                      color: '#FFFFFF',
                    }}
                  >
                    <option value="image">Image</option>
                    <option value="gif">GIF</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={uploading || !file}
                  className="w-full py-3 px-6 font-semibold rounded-lg transition-all"
                  style={{
                    background: uploading || !file ? 'rgba(147, 147, 147, 0.35)' : 'radial-gradient(88.54% 235.56% at 50.22% 50.31%, rgba(247, 153, 40, 0.021) 0%, rgba(247, 153, 40, 0.084) 100%)',
                    border: uploading || !file ? '1px solid rgba(147, 147, 147, 0.35)' : '1px solid #FF8000',
                    color: uploading || !file ? '#939393' : '#E8E8E8',
                    cursor: uploading || !file ? 'not-allowed' : 'pointer',
                    boxShadow: uploading || !file ? 'none' : 'inset 3px 3px 4px rgba(247, 153, 40, 0.17)',
                  }}
                >
                  {uploading ? 'Uploading...' : 'Upload Sticker'}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </NFTGate>
  );
}

