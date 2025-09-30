'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { DappProvider } from '@multiversx/sdk-dapp'
import { WalletConnectV2Provider } from '@multiversx/sdk-wallet-connect-provider'
import { NotificationModal, SignTransactionsModal, TransactionsToastList } from '@multiversx/sdk-dapp'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// MultiversX configuration
const environment = process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet'
const chainId = environment === 'mainnet' ? '1' : 'D'
const apiUrl = environment === 'mainnet' 
  ? 'https://api.multiversx.com' 
  : 'https://devnet-api.multiversx.com'

const walletConnectV2ProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <DappProvider
        environment={environment}
        customNetworkConfig={{
          name: environment === 'mainnet' ? 'MultiversX Mainnet' : 'MultiversX Devnet',
          apiTimeout: 6000,
          walletConnectV2ProjectId,
        }}
        dAppName="Cosmic Legends RPG"
        shouldUseWebViewProvider={false}
      >
        {children}
        <NotificationModal />
        <SignTransactionsModal />
        <TransactionsToastList />
      </DappProvider>
    </QueryClientProvider>
  )
}
