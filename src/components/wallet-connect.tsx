'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Wallet } from 'lucide-react'
import {
  ExtensionLoginButton,
  WebWalletLoginButton,
  WalletConnectLoginButton,
  LedgerLoginButton,
} from '@multiversx/sdk-dapp'

export function WalletConnect() {
  const router = useRouter()

  const handleLoginRedirect = () => {
    router.push('/game')
  }

  return (
    <div className="flex flex-wrap gap-2">
      <ExtensionLoginButton
        callbackRoute="/game"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        onLoginRedirect={handleLoginRedirect}
      >
        <Wallet className="w-4 h-4" />
        <span>DeFi Wallet</span>
      </ExtensionLoginButton>
      
      <WebWalletLoginButton
        callbackRoute="/game"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        onLoginRedirect={handleLoginRedirect}
      >
        <Wallet className="w-4 h-4" />
        <span>Web Wallet</span>
      </WebWalletLoginButton>
      
      <WalletConnectLoginButton
        callbackRoute="/game"
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        onLoginRedirect={handleLoginRedirect}
      >
        <Wallet className="w-4 h-4" />
        <span>Mobile</span>
      </WalletConnectLoginButton>
    </div>
  )
}
