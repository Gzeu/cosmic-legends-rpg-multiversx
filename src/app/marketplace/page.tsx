import { NFTMarketplace } from '@/components/nft-marketplace'

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          NFT Marketplace
        </h1>
        <NFTMarketplace />
      </div>
    </div>
  )
}
