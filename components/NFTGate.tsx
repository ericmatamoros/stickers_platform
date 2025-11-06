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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D0D0D' }}>
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-xl" style={{ color: '#939393' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // NFT check temporarily disabled for testing
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0D0D0D' }}>
        <div 
          className="text-center rounded-2xl max-w-md w-full"
          style={{
            padding: '48px 32px',
            backgroundColor: '#141414',
            border: '1px solid rgba(147, 147, 147, 0.15)',
          }}
        >
          <div className="text-6xl mb-6">🔒</div>
          <h2 
            className="text-3xl font-bold mb-4" 
            style={{ color: '#FFFFFF' }}
          >
            Welcome to Jira Stickers!
          </h2>
          <p 
            className="mb-8 text-base"
            style={{ color: '#939393' }}
          >
            Connect your wallet to access the sticker gallery and discover amazing content
          </p>
          <div className="flex justify-center">
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="rounded-[10px] transition-all text-[16px] font-semibold"
                  style={{
                    width: '200px',
                    height: '48px',
                    background: 'radial-gradient(88.54% 235.56% at 50.22% 50.31%, rgba(247, 153, 40, 0.021) 0%, rgba(247, 153, 40, 0.084) 100%)',
                    border: '1px solid #FF8000',
                    boxShadow: 'inset 3px 3px 4px rgba(247, 153, 40, 0.17)',
                    backdropFilter: 'blur(10px)',
                    color: '#E8E8E8',
                  }}
                >
                  Connect Wallet
                </button>
              )}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    );
  }

  // If connected, allow access (NFT check disabled)
  return <>{children}</>;
}

