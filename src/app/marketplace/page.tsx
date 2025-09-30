'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  TrendingUp, 
  TrendingDown,
  Star,
  Crown,
  Zap,
  Shield,
  Sword,
  Wand2,
  Bow,
  Eye,
  ShoppingCart,
  Heart,
  BarChart3,
  Clock,
  Coins,
  Users,
  ArrowUpDown,
  ChevronDown,
  Sparkles
} from 'lucide-react'

interface MarketplaceItem {
  id: string
  name: string
  class: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  price: number
  priceChange: number
  seller: string
  level: number
  stats: {
    strength: number
    intelligence: number
    agility: number
    vitality: number
  }
  image: string
  createdAt: string
  views: number
  likes: number
  isAuction: boolean
  auctionEnds?: string
  lastSale?: number
}

type SortOption = 'price-low' | 'price-high' | 'newest' | 'oldest' | 'popular' | 'rarity'
type ViewMode = 'grid' | 'list'
type FilterType = 'all' | 'warrior' | 'mage' | 'ranger' | 'guardian'

const mockItems: MarketplaceItem[] = [
  {
    id: '1',
    name: 'Stellar Warrior Zyx',
    class: 'warrior',
    rarity: 'legendary',
    price: 250,
    priceChange: 15.5,
    seller: '0x1234...5678',
    level: 45,
    stats: { strength: 95, intelligence: 40, agility: 70, vitality: 85 },
    image: '/hero-1.jpg',
    createdAt: '2025-09-28T10:30:00Z',
    views: 1250,
    likes: 89,
    isAuction: false
  },
  {
    id: '2',
    name: 'Cosmic Mage Aria',
    class: 'mage',
    rarity: 'epic',
    price: 180,
    priceChange: -5.2,
    seller: '0x9876...4321',
    level: 38,
    stats: { strength: 35, intelligence: 98, agility: 55, vitality: 60 },
    image: '/hero-2.jpg',
    createdAt: '2025-09-29T14:15:00Z',
    views: 890,
    likes: 67,
    isAuction: true,
    auctionEnds: '2025-10-02T12:00:00Z'
  },
  {
    id: '3',
    name: 'Void Ranger Kaine',
    class: 'ranger',
    rarity: 'rare',
    price: 95,
    priceChange: 8.7,
    seller: '0x5555...9999',
    level: 32,
    stats: { strength: 60, intelligence: 65, agility: 92, vitality: 58 },
    image: '/hero-3.jpg',
    createdAt: '2025-09-30T08:45:00Z',
    views: 456,
    likes: 34,
    isAuction: false,
    lastSale: 88
  },
  {
    id: '4',
    name: 'Guardian Titan',
    class: 'guardian',
    rarity: 'epic',
    price: 220,
    priceChange: 22.1,
    seller: '0x7777...3333',
    level: 41,
    stats: { strength: 78, intelligence: 45, agility: 42, vitality: 99 },
    image: '/hero-4.jpg',
    createdAt: '2025-09-27T16:20:00Z',
    views: 1456,
    likes: 112,
    isAuction: false
  },
  {
    id: '5',
    name: 'Astral Warrior Nova',
    class: 'warrior',
    rarity: 'rare',
    price: 125,
    priceChange: -2.8,
    seller: '0x2222...8888',
    level: 35,
    stats: { strength: 88, intelligence: 42, agility: 65, vitality: 72 },
    image: '/hero-5.jpg',
    createdAt: '2025-09-29T11:00:00Z',
    views: 678,
    likes: 45,
    isAuction: true,
    auctionEnds: '2025-10-01T20:00:00Z'
  },
  {
    id: '6',
    name: 'Mystic Sage Elara',
    class: 'mage',
    rarity: 'legendary',
    price: 320,
    priceChange: 35.2,
    seller: '0x4444...6666',
    level: 52,
    stats: { strength: 38, intelligence: 100, agility: 58, vitality: 68 },
    image: '/hero-6.jpg',
    createdAt: '2025-09-26T09:15:00Z',
    views: 2134,
    likes: 178,
    isAuction: false,
    lastSale: 285
  }
]

const rarityColors = {
  common: 'text-gray-400 border-gray-400/30 bg-gray-400/10',
  rare: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  epic: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  legendary: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
}

const classIcons = {
  warrior: Sword,
  mage: Wand2,
  ranger: Bow,
  guardian: Shield
}

const classColors = {
  warrior: 'from-red-500 to-pink-500',
  mage: 'from-purple-500 to-blue-500',
  ranger: 'from-green-500 to-teal-500',
  guardian: 'from-yellow-500 to-orange-500'
}

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>(mockItems)
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>(mockItems)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filterBy, setFilterBy] = useState<FilterType>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 500])

  useEffect(() => {
    let filtered = [...items]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.class.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Class filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(item => item.class === filterBy)
    }

    // Price range filter
    filtered = filtered.filter(item => 
      item.price >= priceRange[0] && item.price <= priceRange[1]
    )

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'popular':
          return b.views - a.views
        case 'rarity':
          const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 }
          return rarityOrder[b.rarity] - rarityOrder[a.rarity]
        default:
          return 0
      }
    })

    setFilteredItems(filtered)
  }, [items, searchTerm, sortBy, filterBy, priceRange])

  const formatTimeRemaining = (endTime: string) => {
    const now = new Date().getTime()
    const end = new Date(endTime).getTime()
    const diff = end - now
    
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const HeroCard = ({ item }: { item: MarketplaceItem }) => {
    const ClassIcon = classIcons[item.class as keyof typeof classIcons]
    const totalPower = Object.values(item.stats).reduce((a, b) => a + b, 0)

    return (
      <motion.div
        className="group bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-2xl overflow-hidden hover:border-cosmic-purple/30 transition-all duration-500"
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Image */}
        <div className="relative aspect-square bg-gradient-to-br from-space-700 to-space-800 flex items-center justify-center">
          <ClassIcon className="w-24 h-24 text-cosmic-purple opacity-50" />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-space-900/60 to-transparent" />
          
          {/* Rarity Badge */}
          <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg border text-xs font-semibold ${rarityColors[item.rarity]}`}>
            {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
          </div>
          
          {/* Auction Badge */}
          {item.isAuction && (
            <div className="absolute top-3 right-3 bg-red-500/20 border border-red-500/30 text-red-400 px-2 py-1 rounded-lg text-xs font-semibold">
              Auction
            </div>
          )}
          
          {/* Level */}
          <div className="absolute bottom-3 left-3 bg-space-800/80 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-sm font-bold">
            Lv. {item.level}
          </div>
          
          {/* Actions */}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="w-8 h-8 bg-space-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 bg-space-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-400 hover:text-cosmic-purple transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Name and Class */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cosmic-purple transition-colors duration-300">
              {item.name}
            </h3>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${classColors[item.class as keyof typeof classColors]} p-1`}>
                <ClassIcon className="w-full h-full text-white" />
              </div>
              <span className="text-sm text-gray-400 capitalize">{item.class}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <span className="text-xs text-gray-400">STR: {item.stats.strength}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-xs text-gray-400">INT: {item.stats.intelligence}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-xs text-gray-400">AGI: {item.stats.agility}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span className="text-xs text-gray-400">VIT: {item.stats.vitality}</span>
            </div>
          </div>

          {/* Power */}
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-1">Total Power</div>
            <div className="text-xl font-bold text-cosmic-gold">{totalPower}</div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">{item.price} EGLD</div>
              <div className={`flex items-center gap-1 text-sm ${
                item.priceChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {item.priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(item.priceChange)}%
              </div>
            </div>
            {item.lastSale && (
              <div className="text-xs text-gray-400">Last sale: {item.lastSale} EGLD</div>
            )}
          </div>

          {/* Auction Timer */}
          {item.isAuction && item.auctionEnds && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <Clock className="w-4 h-4" />
                Ends in {formatTimeRemaining(item.auctionEnds)}
              </div>
            </div>
          )}

          {/* Seller */}
          <div className="mb-4 text-xs text-gray-400">
            Seller: <span className="text-cosmic-blue">{item.seller}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {item.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {item.likes}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <motion.button
              className="flex-1 py-3 bg-gradient-to-r from-cosmic-purple to-cosmic-blue hover:from-cosmic-blue hover:to-cosmic-purple text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCart className="w-4 h-4" />
              {item.isAuction ? 'Bid' : 'Buy'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-space-900 to-space-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-cosmic-gold/20 px-4 py-2 rounded-full border border-cosmic-gold/30 mb-6">
            <ShoppingCart className="w-4 h-4 text-cosmic-gold" />
            <span className="text-sm font-medium text-cosmic-gold">NFT Marketplace</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-cosmic-blue to-cosmic-purple bg-clip-text text-transparent mb-6">
            Cosmic 
            <span className="text-cosmic-gold">Marketplace</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover, trade, and collect unique AI-generated heroes. Each NFT represents 
            true ownership of your cosmic legends with verified blockchain provenance.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { label: 'Total Volume', value: '12,450 EGLD', icon: BarChart3, color: 'text-cosmic-purple' },
            { label: 'Active Listings', value: '3,247', icon: Crown, color: 'text-cosmic-blue' },
            { label: 'Unique Owners', value: '1,892', icon: Users, color: 'text-cosmic-gold' },
            { label: 'Floor Price', value: '2.5 EGLD', icon: TrendingUp, color: 'text-green-400' }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-xl p-6 text-center">
                <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            )
          })}
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search heroes by name or class..."
                className="w-full pl-10 pr-4 py-3 bg-space-700/50 border border-space-600 rounded-xl text-white placeholder-gray-400 focus:border-cosmic-purple focus:outline-none transition-colors duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Sort */}
            <div className="relative">
              <select
                className="appearance-none bg-space-700/50 border border-space-600 rounded-xl px-4 py-3 pr-10 text-white focus:border-cosmic-purple focus:outline-none transition-colors duration-300"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="rarity">Rarity</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
            
            {/* Filter Toggle */}
            <button
              className="flex items-center gap-2 px-4 py-3 bg-cosmic-purple/20 border border-cosmic-purple/30 text-cosmic-purple rounded-xl hover:bg-cosmic-purple/30 transition-colors duration-200"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
            
            {/* View Mode */}
            <div className="flex border border-space-600 rounded-xl overflow-hidden">
              <button
                className={`px-4 py-3 flex items-center gap-2 transition-colors duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-cosmic-purple text-white' 
                    : 'bg-space-700/50 text-gray-400 hover:text-white'
                }`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                className={`px-4 py-3 flex items-center gap-2 transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-cosmic-purple text-white' 
                    : 'bg-space-700/50 text-gray-400 hover:text-white'
                }`}
                onClick={() => setViewMode('list')}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-space-600"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Class Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Class</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['all', 'warrior', 'mage', 'ranger', 'guardian'].map((classType) => (
                        <button
                          key={classType}
                          className={`p-3 rounded-lg border transition-all duration-200 text-sm font-medium ${
                            filterBy === classType
                              ? 'border-cosmic-purple bg-cosmic-purple/10 text-cosmic-purple'
                              : 'border-space-600 hover:border-cosmic-purple/50 text-gray-400'
                          }`}
                          onClick={() => setFilterBy(classType as FilterType)}
                        >
                          {classType.charAt(0).toUpperCase() + classType.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Price Range (EGLD)</label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          placeholder="Min"
                          className="flex-1 px-3 py-2 bg-space-700/50 border border-space-600 rounded-lg text-white text-sm focus:border-cosmic-purple focus:outline-none"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        />
                        <span className="text-gray-400">-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          className="flex-1 px-3 py-2 bg-space-700/50 border border-space-600 rounded-lg text-white text-sm focus:border-cosmic-purple focus:outline-none"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Filters */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Quick Filters</label>
                    <div className="space-y-2">
                      {[
                        'Auction Only',
                        'Buy Now Only',
                        'Recently Listed',
                        'Legendary Only'
                      ].map((filter, index) => (
                        <label key={index} className="flex items-center gap-2 text-sm text-gray-400">
                          <input 
                            type="checkbox" 
                            className="rounded border-space-600 bg-space-700 text-cosmic-purple focus:ring-cosmic-purple focus:ring-offset-0"
                          />
                          {filter}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-gray-300">
            Showing <span className="text-white font-semibold">{filteredItems.length}</span> of {items.length} heroes
          </div>
          <div className="text-sm text-gray-400">
            Updated {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Items Grid */}
        <motion.div 
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}
          layout
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <HeroCard key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More */}
        {filteredItems.length > 0 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.button
              className="inline-flex items-center gap-3 bg-gradient-to-r from-cosmic-purple to-cosmic-blue hover:from-cosmic-blue hover:to-cosmic-purple text-white font-bold py-4 px-8 rounded-full transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-5 h-5" />
              Load More Heroes
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}