import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';
import { http } from 'wagmi';

// Use a working demo project ID or fallback
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '2f05ae7f1116030fde2d36508f472bfb';

export const config = getDefaultConfig({
  appName: 'MyStickers',
  projectId,
  chains: [base],
  transports: { [base.id]: http() },
  ssr: true,
  walletConnectProjectId: projectId,
});

