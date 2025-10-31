'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';

export function NFTGate({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state while checking wallet connection
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // NFT check temporarily disabled for testing
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
          <div className="text-6xl mb-6 animate-bounce">🔒</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Welcome to MyStickers!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Connect your wallet to access the sticker gallery and discover amazing content
          </p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💡 <strong>Tip:</strong> Your wallet connection persists across sessions
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If connected, allow access (NFT check disabled)
  return <>{children}</>;
}

