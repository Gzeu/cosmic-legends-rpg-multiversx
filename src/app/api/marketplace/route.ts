import { NextRequest, NextResponse } from 'next/server'

// Marketplace interfaces
interface MarketplaceListing {
  id: string
  nft_id: string
  hero_id: string
  seller_address: string
  seller_name?: string
  hero_name: string
  hero_class: string
  hero_rarity: string
  hero_level: number
  hero_power: number
  price: {
    amount: string
    token: 'EGLD' | 'COSMIC-TOKEN'
  }
  listing_type: 'fixed_price' | 'auction'
  status: 'active' | 'sold' | 'cancelled' | 'expired'
  created_at: string
  expires_at?: string
  sold_at?: string
  sold_to?: string
  final_price?: string
  views: number
  favorites: number
  metadata: {
    image: string
    description: string
    attributes: { [key: string]: any }
  }
}

interface AuctionBid {
  id: string
  listing_id: string
  bidder_address: string
  bidder_name?: string
  amount: string
  token: 'EGLD' | 'COSMIC-TOKEN'
  timestamp: string
  is_winning: boolean
  transaction_hash?: string
}

interface MarketplaceStats {
  total_listings: number
  total_sales: number
  total_volume: string
  average_price: string
  top_collections: Array<{
    name: string
    volume: string
    floor_price: string
    items: number
  }>
  recent_sales: Array<{
    hero_name: string
    price: string
    timestamp: string
  }>
}

// Mock marketplace database
let marketplaceListings: MarketplaceListing[] = [
  {
    id: 'listing_001',
    nft_id: 'COSMIC-HEROES-123456',
    hero_id: 'hero_001',
    seller_address: 'erd1abc...xyz',
    seller_name: 'CosmicMaster88',
    hero_name: 'Zyx the Flamebringer',
    hero_class: 'Warrior',
    hero_rarity: 'legendary',
    hero_level: 50,
    hero_power: 4200,
    price: {
      amount: '5.5',
      token: 'EGLD'
    },
    listing_type: 'fixed_price',
    status: 'active',
    created_at: '2024-09-30T18:00:00Z',
    views: 127,
    favorites: 23,
    metadata: {
      image: 'https://cosmic-legends.s3.amazonaws.com/heroes/zyx.png',
      description: 'Legendary Cosmic Warrior with maximum power level',
      attributes: {
        class: 'Warrior',
        element: 'Fire',
        rarity: 'Legendary',
        power: 4200
      }
    }
  },
  {
    id: 'listing_002',
    nft_id: 'COSMIC-HEROES-789012',
    hero_id: 'hero_002',
    seller_address: 'erd1def...uvw',
    seller_name: 'VoidHunter',
    hero_name: 'Aria the Voidweaver',
    hero_class: 'Mage',
    hero_rarity: 'legendary',
    hero_level: 48,
    hero_power: 4500,
    price: {
      amount: '7.2',
      token: 'EGLD'
    },
    listing_type: 'auction',
    status: 'active',
    created_at: '2024-09-30T16:30:00Z',
    expires_at: '2024-10-03T16:30:00Z',
    views: 89,
    favorites: 31,
    metadata: {
      image: 'https://cosmic-legends.s3.amazonaws.com/heroes/aria.png',
      description: 'Legendary Astral Mage with reality-bending powers',
      attributes: {
        class: 'Mage',
        element: 'Void',
        rarity: 'Legendary',
        power: 4500
      }
    }
  }
]

let auctionBids: AuctionBid[] = [
  {
    id: 'bid_001',
    listing_id: 'listing_002',
    bidder_address: 'erd1ghi...rst',
    bidder_name: 'StellarCollector',
    amount: '8.1',
    token: 'EGLD',
    timestamp: '2024-09-30T20:15:00Z',
    is_winning: true
  }
]

// GET - Retrieve marketplace data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const listingId = searchParams.get('listing_id')
    const heroClass = searchParams.get('class')
    const rarity = searchParams.get('rarity')
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = searchParams.get('sort_order') || 'desc'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    switch (action) {
      case 'stats':
        const stats: MarketplaceStats = {
          total_listings: marketplaceListings.filter(l => l.status === 'active').length,
          total_sales: marketplaceListings.filter(l => l.status === 'sold').length,
          total_volume: '156.7',
          average_price: '4.8',
          top_collections: [
            {
              name: 'Cosmic Heroes',
              volume: '156.7 EGLD',
              floor_price: '2.1 EGLD',
              items: marketplaceListings.length
            }
          ],
          recent_sales: [
            {
              hero_name: 'Stellar Warrior',
              price: '6.3 EGLD',
              timestamp: '2024-09-30T19:45:00Z'
            }
          ]
        }
        
        return NextResponse.json({
          success: true,
          data: stats
        })

      case 'listing':
        if (!listingId) {
          return NextResponse.json(
            { success: false, error: 'Listing ID required' },
            { status: 400 }
          )
        }
        
        const listing = marketplaceListings.find(l => l.id === listingId)
        if (!listing) {
          return NextResponse.json(
            { success: false, error: 'Listing not found' },
            { status: 404 }
          )
        }

        // Get auction bids if applicable
        const bids = listing.listing_type === 'auction' 
          ? auctionBids.filter(b => b.listing_id === listingId)
            .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
          : []

        return NextResponse.json({
          success: true,
          data: {
            listing,
            bids,
            highest_bid: bids[0] || null
          }
        })

      default:
        // List all active listings with filters
        let filteredListings = marketplaceListings.filter(l => l.status === 'active')

        // Apply filters
        if (heroClass) {
          filteredListings = filteredListings.filter(l => 
            l.hero_class.toLowerCase() === heroClass.toLowerCase()
          )
        }

        if (rarity) {
          filteredListings = filteredListings.filter(l => 
            l.hero_rarity.toLowerCase() === rarity.toLowerCase()
          )
        }

        // Sort listings
        filteredListings.sort((a, b) => {
          let aValue: any = a[sortBy as keyof MarketplaceListing]
          let bValue: any = b[sortBy as keyof MarketplaceListing]
          
          if (sortBy === 'price') {
            aValue = parseFloat(a.price.amount)
            bValue = parseFloat(b.price.amount)
          }
          
          if (sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1
          } else {
            return aValue > bValue ? 1 : -1
          }
        })

        // Pagination
        const paginatedListings = filteredListings.slice(offset, offset + limit)
        
        return NextResponse.json({
          success: true,
          data: {
            listings: paginatedListings,
            total: filteredListings.length,
            limit,
            offset,
            has_more: offset + limit < filteredListings.length,
            filters: {
              class: heroClass,
              rarity,
              sort_by: sortBy,
              sort_order: sortOrder
            }
          }
        })
    }
  } catch (error) {
    console.error('Marketplace GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch marketplace data' },
      { status: 500 }
    )
  }
}

// POST - Create listing, place bid, or purchase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'create_listing':
        return await createListing(data)
        
      case 'place_bid':
        return await placeBid(data)
        
      case 'purchase':
        return await purchaseNFT(data)
        
      case 'cancel_listing':
        return await cancelListing(data)
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Marketplace POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Marketplace operation failed' },
      { status: 500 }
    )
  }
}

async function createListing(data: any) {
  const { nft_id, hero_id, price, token, listing_type, duration, seller_address } = data

  if (!nft_id || !hero_id || !price || !seller_address) {
    return NextResponse.json(
      { success: false, error: 'Missing required listing data' },
      { status: 400 }
    )
  }

  const newListing: MarketplaceListing = {
    id: `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    nft_id,
    hero_id,
    seller_address,
    hero_name: data.hero_name || 'Unknown Hero',
    hero_class: data.hero_class || 'Warrior',
    hero_rarity: data.hero_rarity || 'common',
    hero_level: data.hero_level || 1,
    hero_power: data.hero_power || 1000,
    price: {
      amount: price.toString(),
      token: token || 'EGLD'
    },
    listing_type: listing_type || 'fixed_price',
    status: 'active',
    created_at: new Date().toISOString(),
    expires_at: listing_type === 'auction' && duration 
      ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString() 
      : undefined,
    views: 0,
    favorites: 0,
    metadata: {
      image: data.image || 'https://cosmic-legends.s3.amazonaws.com/heroes/default.png',
      description: data.description || 'A legendary cosmic hero',
      attributes: data.attributes || {}
    }
  }

  marketplaceListings.push(newListing)

  return NextResponse.json({
    success: true,
    data: {
      listing: newListing,
      message: `${listing_type === 'auction' ? 'Auction' : 'Listing'} created successfully!`
    }
  })
}

async function placeBid(data: any) {
  const { listing_id, bidder_address, amount, token } = data

  if (!listing_id || !bidder_address || !amount) {
    return NextResponse.json(
      { success: false, error: 'Listing ID, bidder address, and amount required' },
      { status: 400 }
    )
  }

  const listing = marketplaceListings.find(l => l.id === listing_id)
  if (!listing) {
    return NextResponse.json(
      { success: false, error: 'Listing not found' },
      { status: 404 }
    )
  }

  if (listing.listing_type !== 'auction') {
    return NextResponse.json(
      { success: false, error: 'This is not an auction listing' },
      { status: 400 }
    )
  }

  // Check if bid is higher than current highest bid
  const currentBids = auctionBids.filter(b => b.listing_id === listing_id)
  const highestBid = currentBids.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))[0]
  
  if (highestBid && parseFloat(amount) <= parseFloat(highestBid.amount)) {
    return NextResponse.json(
      { success: false, error: 'Bid must be higher than current highest bid' },
      { status: 400 }
    )
  }

  // Mark previous bids as not winning
  currentBids.forEach(bid => bid.is_winning = false)

  const newBid: AuctionBid = {
    id: `bid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    listing_id,
    bidder_address,
    bidder_name: data.bidder_name,
    amount: amount.toString(),
    token: token || 'EGLD',
    timestamp: new Date().toISOString(),
    is_winning: true,
    transaction_hash: `tx_${Date.now()}`
  }

  auctionBids.push(newBid)

  return NextResponse.json({
    success: true,
    data: {
      bid: newBid,
      message: 'Bid placed successfully!',
      is_highest: true,
      previous_highest: highestBid?.amount || '0'
    }
  })
}

async function purchaseNFT(data: any) {
  const { listing_id, buyer_address, payment_token } = data

  if (!listing_id || !buyer_address) {
    return NextResponse.json(
      { success: false, error: 'Listing ID and buyer address required' },
      { status: 400 }
    )
  }

  const listingIndex = marketplaceListings.findIndex(l => l.id === listing_id)
  if (listingIndex === -1) {
    return NextResponse.json(
      { success: false, error: 'Listing not found' },
      { status: 404 }
    )
  }

  const listing = marketplaceListings[listingIndex]
  
  if (listing.status !== 'active') {
    return NextResponse.json(
      { success: false, error: 'Listing is not active' },
      { status: 400 }
    )
  }

  if (listing.listing_type !== 'fixed_price') {
    return NextResponse.json(
      { success: false, error: 'This is an auction - place a bid instead' },
      { status: 400 }
    )
  }

  // Update listing status
  marketplaceListings[listingIndex] = {
    ...listing,
    status: 'sold',
    sold_at: new Date().toISOString(),
    sold_to: buyer_address,
    final_price: listing.price.amount
  }

  // Mock transaction (in production, would execute blockchain transaction)
  const transactionHash = `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  return NextResponse.json({
    success: true,
    data: {
      transaction_hash: transactionHash,
      purchase: {
        listing_id,
        hero_name: listing.hero_name,
        price: listing.price,
        buyer: buyer_address,
        seller: listing.seller_address
      },
      message: `Successfully purchased ${listing.hero_name}!`,
      explorer_url: `https://devnet-explorer.multiversx.com/transactions/${transactionHash}`
    }
  })
}

async function cancelListing(data: any) {
  const { listing_id, seller_address } = data

  if (!listing_id || !seller_address) {
    return NextResponse.json(
      { success: false, error: 'Listing ID and seller address required' },
      { status: 400 }
    )
  }

  const listingIndex = marketplaceListings.findIndex(l => l.id === listing_id)
  if (listingIndex === -1) {
    return NextResponse.json(
      { success: false, error: 'Listing not found' },
      { status: 404 }
    )
  }

  const listing = marketplaceListings[listingIndex]
  
  if (listing.seller_address !== seller_address) {
    return NextResponse.json(
      { success: false, error: 'Only the seller can cancel this listing' },
      { status: 403 }
    )
  }

  // Update listing status
  marketplaceListings[listingIndex] = {
    ...listing,
    status: 'cancelled'
  }

  return NextResponse.json({
    success: true,
    data: {
      listing_id,
      message: `Listing for ${listing.hero_name} has been cancelled`
    }
  })
}