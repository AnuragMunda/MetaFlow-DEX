"use client";

import { type State, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { projectId, wagmiAdapter, wagmiConfig } from "@/lib/config";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, sepolia } from '@reown/appkit/networks'

const queryClient = new QueryClient();

if (!projectId) {
    throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
    name: 'start-it-up',
    description: 'Startup finding dapp',
    url: 'http://localhost:3000', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [mainnet, sepolia],
    defaultNetwork: mainnet,
    metadata: metadata,
    features: {
        analytics: true
    }
})

type Props = {
    children: React.ReactNode;
    initialState?: State | undefined
};

export default function Providers({ children, initialState }: Props) {

    return (
        <WagmiProvider config={wagmiConfig} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}