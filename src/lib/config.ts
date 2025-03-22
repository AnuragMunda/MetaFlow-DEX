import { http, cookieStorage, createStorage } from 'wagmi'
import { mainnet, sepolia } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createPublicClient } from 'viem'

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
    throw new Error("Project ID is not defined")
}

export const networks = [mainnet, sepolia]

declare module 'wagmi' {
    interface Register {
        config: typeof wagmiConfig
    }
}

export const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
})

export const wagmiConfig = wagmiAdapter.wagmiConfig

export const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
})