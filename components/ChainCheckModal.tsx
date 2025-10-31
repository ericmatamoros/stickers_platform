'use client';

import { useEffect, useState } from 'react';
import { useAccount, useSwitchChain, useChainId } from 'wagmi';
import { base } from 'wagmi/chains';

export function ChainCheckModal() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isConnected && chainId !== base.id) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [isConnected, chainId]);

  const handleSwitchChain = () => {
    if (switchChain) {
      switchChain({ chainId: base.id });
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-orange-600 dark:text-orange-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Switch to Base Network
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This application requires the Base network to verify NFT ownership and perform transactions.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> You must be on Base network to access the sticker gallery.
            </p>
          </div>

          <button
            onClick={handleSwitchChain}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Switch to Base Network
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Your wallet will prompt you to approve the network switch
          </p>
        </div>
      </div>
    </div>
  );
}

