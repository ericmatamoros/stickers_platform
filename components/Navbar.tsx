'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ADMIN_WALLETS } from '@/lib/config';

export function Navbar() {
  const { address } = useAccount();
  const isAdmin = address && ADMIN_WALLETS.includes(address.toLowerCase());

  return (
    <nav className="sticky top-0 z-50" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-4 md:gap-8 lg:ml-[341px]">
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              {/* Orange Square Icon */}
              <div className="w-7 h-7 flex items-center justify-center" style={{ transform: 'rotate(-90deg)' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2.33" y="2.33" width="23.34" height="23.34" rx="4" stroke="#FF8000" strokeWidth="2.33" fill="none"/>
                </svg>
              </div>
              {/* Brand Text */}
              <span className="text-lg md:text-[22px] font-semibold leading-[27px]" style={{ color: '#FFFFFF' }}>
                Jira Stickers
              </span>
            </Link>
            
            {/* Gallery Link */}
            <Link
              href="/"
              className="hidden md:block text-[22px] font-normal leading-[27px]"
              style={{ color: '#777777' }}
            >
              Gallery
            </Link>
            
            {/* Upload Link (Admin Only) */}
            {isAdmin && (
              <Link
                href="/upload"
                className="hidden md:block text-[22px] font-normal leading-[27px]"
                style={{ color: '#777777' }}
              >
                Upload
              </Link>
            )}
          </div>

          {/* Wallet Connect Button */}
          <div className="flex items-center lg:mr-[345px]">
            <ConnectButton.Custom>
              {({ openConnectModal, mounted, account, openAccountModal, chain }) => {
                if (!mounted) {
                  return (
                    <div className="animate-pulse rounded-[10px] h-10 w-[120px] md:w-[150px]" style={{ background: 'rgba(247, 153, 40, 0.084)' }} />
                  );
                }

                if (!account) {
                  return (
                    <button
                      onClick={openConnectModal}
                      className="relative rounded-[10px] transition-all"
                      style={{
                        width: '120px',
                        height: '40px',
                        background: 'radial-gradient(88.54% 235.56% at 50.22% 50.31%, rgba(247, 153, 40, 0.021) 0%, rgba(247, 153, 40, 0.084) 100%)',
                        border: '1px solid #FF8000',
                        boxShadow: 'inset 3px 3px 4px rgba(247, 153, 40, 0.17)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <span className="text-[14px] md:text-[16px] font-semibold leading-[16px] text-center" style={{ color: '#E8E8E8' }}>
                        Connect
                      </span>
                    </button>
                  );
                }

                return (
                  <button
                    onClick={openAccountModal}
                    className="relative rounded-[10px] transition-all"
                    style={{
                      width: '150px',
                      height: '40px',
                      background: 'radial-gradient(88.54% 235.56% at 50.22% 50.31%, rgba(247, 153, 40, 0.021) 0%, rgba(247, 153, 40, 0.084) 100%)',
                      border: '1px solid #FF8000',
                      boxShadow: 'inset 3px 3px 4px rgba(247, 153, 40, 0.17)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <div className="flex items-center justify-center gap-2 md:gap-3 px-3 md:px-5">
                      {/* Green Dot Indicator */}
                      <div 
                        className="w-[7px] h-[7px] rounded-full flex-shrink-0" 
                        style={{ 
                          background: '#00EE17',
                          boxShadow: '0px 0px 4px rgba(0, 238, 24, 0.5)'
                        }} 
                      />
                      {/* Wallet Address */}
                      <span className="text-[14px] md:text-[16px] font-semibold leading-[16px] text-center truncate" style={{ color: '#E8E8E8' }}>
                        {account.displayName}
                      </span>
                    </div>
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

