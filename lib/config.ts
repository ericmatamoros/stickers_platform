// Server-safe configuration (can be imported in API routes)
export const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`;

export const ADMIN_WALLETS = process.env.NEXT_PUBLIC_ADMIN_WALLETS?.split(',').map(w => w.toLowerCase().trim()) || [];

