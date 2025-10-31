import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { NFT_CONTRACT_ADDRESS } from './config';

// ERC-721 balanceOf ABI
const ERC721_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export async function checkNFTOwnership(walletAddress: string): Promise<boolean> {
  if (!NFT_CONTRACT_ADDRESS || NFT_CONTRACT_ADDRESS === '0x' || NFT_CONTRACT_ADDRESS === '0x0') {
    console.warn('NFT_CONTRACT_ADDRESS not configured, skipping NFT check');
    return true; // Allow access if not configured (for development)
  }

  try {
    const balance = await publicClient.readContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: ERC721_ABI,
      functionName: 'balanceOf',
      args: [walletAddress as `0x${string}`],
    });

    return balance > 0n;
  } catch (error) {
    console.error('Error checking NFT ownership:', error);
    return false;
  }
}

