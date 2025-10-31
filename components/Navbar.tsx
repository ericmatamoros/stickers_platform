'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ADMIN_WALLETS } from '@/lib/config';

export function Navbar() {
  const { address } = useAccount();
  const isAdmin = address && ADMIN_WALLETS.includes(address.toLowerCase());

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
              🎨 MyStickers
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Gallery
              </Link>
              {isAdmin && (
                <Link
                  href="/upload"
                  className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Upload
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <ConnectButton.Custom>
              {({ openConnectModal, mounted, account, openAccountModal, chain }) => {
                // Show skeleton while mounting to prevent layout shift
                if (!mounted) {
                  return (
                    <div className="bg-gray-200 dark:bg-gray-700 animate-pulse px-4 py-2 rounded-lg h-10 w-36" />
                  );
                }

                if (!account) {
                  return (
                    <button
                      onClick={openConnectModal}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13 7H7v6h6V7z" />
                        <path
                          fillRule="evenodd"
                          d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Connect Wallet</span>
                    </button>
                  );
                }

                return (
                  <button
                    onClick={openAccountModal}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" style={{boxShadow:'0 0 8px #00FF00'}} />
                    <span>{account.displayName}</span>
                    {chain?.unsupported && (
                      <span className="text-red-300 text-xs">⚠️</span>
                    )}
                  </button>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </nav>
  );
}

