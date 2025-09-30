'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Crown, 
  Sword, 
  Shield, 
  Trophy, 
  Star, 
  Zap, 
  Coins, 
  Users, 
  Target, 
  TrendingUp, 
  Calendar, 
  Settings, 
  Plus, 
  Eye, 
  Gamepad2,
  Gem,
  Clock,
  Award,
  BarChart3,
  Activity,
  Flame,
  Sparkles
} from 'lucide-react'

// Types for dashboard data
interface UserStats {
  total_heroes: number
  battles_won: number
  battles_lost: number
  win_rate: number
  cosmic_tokens: number
  experience: number
  level: number
  achievements: number
  nft_owned: number
  guild_rank?: string
}

interface RecentBattle {
  id: string
  opponent: string
  result: 'win' | 'loss' | 'draw'
  hero_used: string
  duration: string
  rewards: {
    experience: number
    tokens: number
  }
  timestamp: string
}

interface DashboardHero {
  id: string
  name: string
  class: string
  level: number
  rarity: string
  power_rating: number
  is_favorite: boolean
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlocked_at?: string
  progress?: number
  max_progress?: number
}

// Mock data - În producție va veni din API
const mockUserStats: UserStats = {
  total_heroes: 12,
  battles_won: 87,
  battles_lost: 23,
  win_rate: 79.1,
  cosmic_tokens: 2543,
  experience: 45890,
  level: 28,
  achievements: 15,
  nft_owned: 8,
  guild_rank: 'Cosmic Warrior'
}

const mockRecentBattles: RecentBattle[] = [
  {
    id: 'b1',
    opponent: 'StarCrusher92',
    result: 'win',
    hero_used: 'Zyx the Flamebringer',
    duration: '4:32',
    rewards: { experience: 450, tokens: 25 },
    timestamp: '2024-09-30T20:15:00Z'
  },
  {
    id: 'b2',
    opponent: 'VoidMaster',
    result: 'loss',
    hero_used: 'Aria the Voidweaver',
    duration: '6:18',
    rewards: { experience: 150, tokens: 5 },
    timestamp: '2024-09-30T19:45:00Z'
  }
]

const mockHeroes: DashboardHero[] = [
  {
    id: 'h1',
    name: 'Zyx the Flamebringer',
    class: 'Warrior',
    level: 50,
    rarity: 'legendary',
    power_rating: 4200,
    is_favorite: true
  },
  {
    id: 'h2',
    name: 'Aria the Voidweaver',
    class: 'Mage',
    level: 48,
    rarity: 'legendary',
    power_rating: 4500,
    is_favorite: true
  }
]

const mockAchievements: Achievement[] = [
  {
    id: 'ach1',
    name: 'First Victory',
    description: 'Win your first battle',
    icon: 'trophy',
    rarity: 'common',
    unlocked_at: '2024-09-15T10:30:00Z'
  },
  {
    id: 'ach2',
    name: 'Legendary Collector',
    description: 'Own 3 legendary heroes',
    icon: 'crown',
    rarity: 'epic',
    progress: 2,
    max_progress: 3
  }
]

const StatCard = ({ title, value, icon: Icon, change, color }: {
  title: string
  value: string | number
  icon: any
  change?: string
  color: string
}) => (
  <motion.div
    className={`bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-xl p-6 hover:border-${color}/50 transition-all duration-300`}
    whileHover={{ scale: 1.02 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${color} to-${color}/70 p-3`}>
        <Icon className="w-full h-full text-white" />
      </div>
      {change && (
        <span className={`text-sm font-semibold ${
          change.startsWith('+') ? 'text-green-400' : 'text-red-400'
        }`}>
          {change}
        </span>
      )}
    </div>
    
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-gray-400">{title}</div>
  </motion.div>
)

const HeroCard = ({ hero }: { hero: DashboardHero }) => {
  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    rare: 'from-blue-500 to-blue-600',
    epic: 'from-purple-500 to-purple-600',
    legendary: 'from-yellow-500 to-orange-500'
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-xl p-4 hover:border-cosmic-purple/50 transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`px-2 py-1 rounded-lg bg-gradient-to-r ${rarityColors[hero.rarity as keyof typeof rarityColors]} text-xs font-bold text-white`}>
          {hero.rarity.toUpperCase()}
        </div>
        {hero.is_favorite && (
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
        )}
      </div>
      
      <div className="text-center mb-3">
        <div className="w-16 h-16 mx-auto mb-2 rounded-xl bg-gradient-to-br from-cosmic-purple to-cosmic-blue p-3">
          {hero.class === 'Warrior' && <Sword className="w-full h-full text-white" />}
          {hero.class === 'Mage' && <Zap className="w-full h-full text-white" />}
          {hero.class === 'Ranger' && <Target className="w-full h-full text-white" />}
          {hero.class === 'Guardian' && <Shield className="w-full h-full text-white" />}
        </div>
        
        <h3 className="font-bold text-white text-sm mb-1">{hero.name}</h3>
        <p className="text-xs text-cosmic-purple font-semibold">{hero.class}</p>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Level:</span>
          <span className="text-white font-bold">{hero.level}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Power:</span>
          <span className="text-cosmic-gold font-bold">{hero.power_rating.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  )
}

const BattleHistoryItem = ({ battle }: { battle: RecentBattle }) => {
  const resultColors = {
    win: 'text-green-400 bg-green-400/10 border-green-400/20',
    loss: 'text-red-400 bg-red-400/10 border-red-400/20',
    draw: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
  }

  return (
    <motion.div
      className="flex items-center justify-between p-4 bg-space-800/30 rounded-lg border border-space-700/30 hover:border-space-600/50 transition-all duration-200"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <div className={`px-2 py-1 rounded text-xs font-bold border ${resultColors[battle.result]}`}>
          {battle.result.toUpperCase()}
        </div>
        <div>
          <div className="text-white font-semibold text-sm">vs {battle.opponent}</div>
          <div className="text-gray-400 text-xs">{battle.hero_used}</div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-white text-sm font-semibold">{battle.duration}</div>
        <div className="text-cosmic-gold text-xs">+{battle.rewards.tokens} tokens</div>
      </div>
    </motion.div>
  )
}

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'heroes' | 'battles' | 'achievements'>('overview')
  const [stats, setStats] = useState<UserStats>(mockUserStats)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'heroes', label: 'Heroes', icon: Crown },
    { id: 'battles', label: 'Battles', icon: Sword },
    { id: 'achievements', label: 'Achievements', icon: Trophy }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-space-900 to-space-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-cosmic-blue to-cosmic-purple bg-clip-text text-transparent mb-2">
                Cosmic Command Center
              </h1>
              <p className="text-gray-300">
                Welcome back, <span className="text-cosmic-gold font-semibold">Commander</span>! Ready to conquer the cosmos?
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.button 
                className="flex items-center gap-2 bg-gradient-to-r from-cosmic-purple to-cosmic-blue hover:from-cosmic-blue hover:to-cosmic-purple text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-5 h-5" />
                New Battle
              </motion.button>
              
              <motion.button 
                className="p-3 bg-space-800 hover:bg-space-700 border border-space-700 hover:border-space-600 text-gray-400 hover:text-white rounded-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-wrap gap-2 p-2 bg-space-800/50 backdrop-blur-sm border border-space-700/50 rounded-2xl">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <motion.button
                  key={tab.id}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-cosmic-purple to-cosmic-blue text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-space-700/50'
                  }`}
                  onClick={() => setActiveTab(tab.id as any)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Total Heroes" 
                  value={stats.total_heroes} 
                  icon={Crown} 
                  change="+2" 
                  color="cosmic-purple"
                />
                <StatCard 
                  title="Win Rate" 
                  value={`${stats.win_rate}%`} 
                  icon={Trophy} 
                  change="+3.2%" 
                  color="green-500"
                />
                <StatCard 
                  title="Cosmic Tokens" 
                  value={stats.cosmic_tokens.toLocaleString()} 
                  icon={Coins} 
                  change="+125" 
                  color="yellow-500"
                />
                <StatCard 
                  title="Power Level" 
                  value={stats.level} 
                  icon={Zap} 
                  change="+1" 
                  color="blue-500"
                />
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Battles */}
                <div className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 p-2.5">
                      <Sword className="w-full h-full text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Recent Battles</h3>
                      <p className="text-sm text-gray-400">Your latest cosmic encounters</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {mockRecentBattles.map(battle => (
                      <BattleHistoryItem key={battle.id} battle={battle} />
                    ))}
                  </div>
                  
                  <motion.button 
                    className="w-full mt-4 py-3 text-cosmic-blue hover:text-white font-semibold transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    View All Battles
                  </motion.button>
                </div>

                {/* Top Heroes */}
                <div className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cosmic-purple to-cosmic-blue p-2.5">
                      <Crown className="w-full h-full text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Elite Heroes</h3>
                      <p className="text-sm text-gray-400">Your most powerful champions</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {mockHeroes.map(hero => (
                      <HeroCard key={hero.id} hero={hero} />
                    ))}
                  </div>
                  
                  <motion.button 
                    className="w-full mt-4 py-3 text-cosmic-purple hover:text-white font-semibold transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    View All Heroes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'heroes' && (
            <motion.div
              key="heroes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center py-16">
                <Crown className="w-16 h-16 text-cosmic-purple mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Heroes Collection</h3>
                <p className="text-gray-400 mb-6">Detailed heroes management coming soon!</p>
                <motion.button 
                  className="bg-gradient-to-r from-cosmic-purple to-cosmic-blue hover:from-cosmic-blue hover:to-cosmic-purple text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Create New Hero
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === 'battles' && (
            <motion.div
              key="battles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center py-16">
                <Gamepad2 className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Battle Arena</h3>
                <p className="text-gray-400 mb-6">Advanced battle system coming soon!</p>
                <motion.button 
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Target className="w-5 h-5 inline mr-2" />
                  Enter Arena
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center py-16">
                <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Achievements</h3>
                <p className="text-gray-400 mb-6">Achievement system in development!</p>
                <div className="text-cosmic-gold font-semibold">15 achievements unlocked</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}