'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Crown, 
  Star, 
  Sword, 
  Shield, 
  Target, 
  Zap, 
  Gem, 
  Coins, 
  Users, 
  Calendar, 
  Award,
  Lock,
  CheckCircle,
  Progress,
  Sparkles,
  Flame,
  Infinity,
  Globe,
  Heart,
  Eye
} from 'lucide-react'

// Achievement types
interface Achievement {
  id: string
  name: string
  description: string
  category: 'combat' | 'collection' | 'social' | 'exploration' | 'special'
  type: 'progress' | 'milestone' | 'secret' | 'seasonal'
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  icon: any
  requirements: {
    description: string
    criteria: { [key: string]: number | string }
  }
  rewards: {
    experience: number
    cosmic_tokens: number
    title?: string
    badge?: string
    nft_reward?: string
  }
  progress: {
    current: number
    required: number
    percentage: number
  }
  status: 'locked' | 'in_progress' | 'completed'
  unlocked_at?: string
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme' | 'impossible'
  is_secret: boolean
  hint?: string
}

interface AchievementCategory {
  id: string
  name: string
  icon: any
  color: string
  description: string
  total_achievements: number
  completed: number
}

// Mock achievements data
const mockAchievements: Achievement[] = [
  {
    id: 'first_victory',
    name: 'First Blood',
    description: 'Win your first battle in the cosmic arena',
    category: 'combat',
    type: 'milestone',
    rarity: 'common',
    icon: Trophy,
    requirements: {
      description: 'Win 1 battle',
      criteria: { battles_won: 1 }
    },
    rewards: {
      experience: 500,
      cosmic_tokens: 50,
      title: 'Battle Initiate'
    },
    progress: { current: 1, required: 1, percentage: 100 },
    status: 'completed',
    unlocked_at: '2024-09-15T10:30:00Z',
    difficulty: 'easy',
    is_secret: false
  },
  {
    id: 'legendary_collector',
    name: 'Legendary Collector',
    description: 'Own 5 legendary heroes in your collection',
    category: 'collection',
    type: 'progress',
    rarity: 'epic',
    icon: Crown,
    requirements: {
      description: 'Collect 5 legendary heroes',
      criteria: { legendary_heroes: 5 }
    },
    rewards: {
      experience: 2500,
      cosmic_tokens: 300,
      title: 'Legend Master',
      badge: 'legendary_collector'
    },
    progress: { current: 2, required: 5, percentage: 40 },
    status: 'in_progress',
    difficulty: 'hard',
    is_secret: false
  },
  {
    id: 'cosmic_dominator',
    name: 'Cosmic Dominator',
    description: 'Win 100 battles without losing',
    category: 'combat',
    type: 'milestone',
    rarity: 'legendary',
    icon: Infinity,
    requirements: {
      description: 'Achieve a 100-win streak',
      criteria: { win_streak: 100 }
    },
    rewards: {
      experience: 10000,
      cosmic_tokens: 1000,
      title: 'Cosmic Dominator',
      nft_reward: 'COSMIC-CROWN-LEGENDARY'
    },
    progress: { current: 12, required: 100, percentage: 12 },
    status: 'in_progress',
    difficulty: 'extreme',
    is_secret: false
  },
  {
    id: 'void_walker',
    name: 'Void Walker',
    description: '???',
    category: 'special',
    type: 'secret',
    rarity: 'mythic',
    icon: Eye,
    requirements: {
      description: 'Discover the secret of the void',
      criteria: { secret_condition: 'void_ritual' }
    },
    rewards: {
      experience: 25000,
      cosmic_tokens: 5000,
      title: 'Void Walker',
      nft_reward: 'VOID-ARTIFACT-MYTHIC'
    },
    progress: { current: 0, required: 1, percentage: 0 },
    status: 'locked',
    difficulty: 'impossible',
    is_secret: true,
    hint: 'The void calls to those who dare to listen...'
  },
  {
    id: 'social_butterfly',
    name: 'Guild Master',
    description: 'Create a guild with 50+ active members',
    category: 'social',
    type: 'milestone',
    rarity: 'rare',
    icon: Users,
    requirements: {
      description: 'Build and manage a large guild',
      criteria: { guild_members: 50 }
    },
    rewards: {
      experience: 3000,
      cosmic_tokens: 400,
      title: 'Guild Master',
      badge: 'guild_leader'
    },
    progress: { current: 0, required: 50, percentage: 0 },
    status: 'locked',
    difficulty: 'medium',
    is_secret: false
  }
]

const categories: AchievementCategory[] = [
  {
    id: 'combat',
    name: 'Combat',
    icon: Sword,
    color: 'red-500',
    description: 'Battle achievements and combat mastery',
    total_achievements: 15,
    completed: 8
  },
  {
    id: 'collection',
    name: 'Collection',
    icon: Gem,
    color: 'purple-500',
    description: 'Hero collecting and NFT achievements',
    total_achievements: 12,
    completed: 4
  },
  {
    id: 'social',
    name: 'Social',
    icon: Users,
    color: 'blue-500',
    description: 'Community and guild achievements',
    total_achievements: 8,
    completed: 2
  },
  {
    id: 'exploration',
    name: 'Explorer',
    icon: Globe,
    color: 'green-500',
    description: 'Cosmic exploration and discovery',
    total_achievements: 10,
    completed: 1
  },
  {
    id: 'special',
    name: 'Legendary',
    icon: Star,
    color: 'yellow-500',
    description: 'Rare and secret achievements',
    total_achievements: 5,
    completed: 0
  }
]

const rarityColors = {
  common: 'from-gray-500 to-gray-600',
  rare: 'from-blue-500 to-blue-600', 
  epic: 'from-purple-500 to-purple-600',
  legendary: 'from-yellow-500 to-orange-500',
  mythic: 'from-pink-500 to-purple-600'
}

const rarityGlow = {
  common: 'shadow-gray-400/20',
  rare: 'shadow-blue-400/30',
  epic: 'shadow-purple-400/40', 
  legendary: 'shadow-yellow-400/60',
  mythic: 'shadow-pink-400/80'
}

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  const Icon = achievement.icon
  const isCompleted = achievement.status === 'completed'
  const isLocked = achievement.status === 'locked'
  
  return (
    <motion.div
      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
        isCompleted 
          ? 'border-green-400/50 bg-green-400/5'
          : isLocked 
          ? 'border-gray-600/30 bg-gray-800/20'
          : 'border-cosmic-purple/30 bg-cosmic-purple/5 hover:border-cosmic-purple/50'
      }`}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        {isCompleted && <CheckCircle className="w-6 h-6 text-green-400" />}
        {isLocked && <Lock className="w-6 h-6 text-gray-500" />}
        {!isCompleted && !isLocked && <Progress className="w-6 h-6 text-cosmic-purple" />}
      </div>

      {/* Rarity Badge */}
      <div className={`absolute top-4 left-4 px-2 py-1 rounded-lg bg-gradient-to-r ${rarityColors[achievement.rarity]} text-xs font-bold text-white`}>
        {achievement.rarity.toUpperCase()}
      </div>

      {/* Icon */}
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${rarityColors[achievement.rarity]} p-4 mb-4 mx-auto ${rarityGlow[achievement.rarity]} shadow-lg`}>
        <Icon className={`w-full h-full ${isLocked ? 'text-gray-400' : 'text-white'}`} />
      </div>

      {/* Content */}
      <div className="text-center mb-4">
        <h3 className={`text-lg font-bold mb-2 ${
          isLocked ? 'text-gray-500' : isCompleted ? 'text-white' : 'text-white'
        }`}>
          {achievement.is_secret && isLocked ? '???' : achievement.name}
        </h3>
        <p className={`text-sm leading-tight ${
          isLocked ? 'text-gray-600' : 'text-gray-300'
        }`}>
          {achievement.is_secret && isLocked ? achievement.hint || 'Secret achievement' : achievement.description}
        </p>
      </div>

      {/* Progress Bar */}
      {!isLocked && achievement.progress.required > 1 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="text-white font-bold">
              {achievement.progress.current}/{achievement.progress.required}
            </span>
          </div>
          <div className="h-2 bg-space-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${rarityColors[achievement.rarity]} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${achievement.progress.percentage}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
          <div className="text-center mt-1">
            <span className={`text-xs font-semibold ${
              isCompleted ? 'text-green-400' : 'text-cosmic-purple'
            }`}>
              {achievement.progress.percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* Rewards */}
      {!isLocked && (
        <div className="border-t border-space-700 pt-4">
          <div className="text-xs text-gray-400 mb-2">Rewards:</div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-blue-400" />
              <span className="text-white">{achievement.rewards.experience} XP</span>
            </div>
            <div className="flex items-center gap-1">
              <Coins className="w-3 h-3 text-yellow-400" />
              <span className="text-white">{achievement.rewards.cosmic_tokens}</span>
            </div>
            {achievement.rewards.title && (
              <div className="flex items-center gap-1">
                <Crown className="w-3 h-3 text-purple-400" />
                <span className="text-purple-400">Title</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Difficulty Indicator */}
      <div className="absolute bottom-2 left-2">
        <div className={`w-2 h-2 rounded-full ${
          achievement.difficulty === 'easy' ? 'bg-green-400' :
          achievement.difficulty === 'medium' ? 'bg-yellow-400' :
          achievement.difficulty === 'hard' ? 'bg-orange-400' :
          achievement.difficulty === 'extreme' ? 'bg-red-400' :
          'bg-pink-400'
        }`} />
      </div>
    </motion.div>
  )
}

const CategoryCard = ({ category, isSelected, onClick }: { 
  category: AchievementCategory
  isSelected: boolean
  onClick: () => void 
}) => {
  const Icon = category.icon
  const completionRate = (category.completed / category.total_achievements) * 100
  
  return (
    <motion.div
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
        isSelected 
          ? `border-${category.color} bg-${category.color}/10` 
          : `border-space-600 hover:border-${category.color}/50 hover:bg-${category.color}/5`
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${category.color} to-${category.color}/70 p-3`}>
          <Icon className="w-full h-full text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white text-sm">{category.name}</h3>
          <p className="text-xs text-gray-400">{category.description}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Progress</span>
          <span className="text-white font-bold">
            {category.completed}/{category.total_achievements}
          </span>
        </div>
        <div className="h-1.5 bg-space-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r from-${category.color} to-${category.color}/70 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <div className="text-center">
          <span className={`text-xs font-semibold text-${category.color}`}>
            {completionRate.toFixed(1)}%
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export function AchievementSystem() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [achievements] = useState<Achievement[]>(mockAchievements)
  const [showCompleted, setShowCompleted] = useState(true)
  const [showLocked, setShowLocked] = useState(false)

  const filteredAchievements = achievements.filter(achievement => {
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) return false
    if (!showCompleted && achievement.status === 'completed') return false
    if (!showLocked && achievement.status === 'locked') return false
    return true
  })

  const completedCount = achievements.filter(a => a.status === 'completed').length
  const totalExperience = achievements
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + a.rewards.experience, 0)
  const totalTokens = achievements
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + a.rewards.cosmic_tokens, 0)

  return (
    <section className="py-12 bg-gradient-to-b from-space-900 to-space-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full border border-yellow-500/30 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Achievement System</span>
          </motion.div>
          
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-cosmic-gold to-yellow-400 bg-clip-text text-transparent mb-4">
            Cosmic Achievements
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Prove your mastery across the cosmos and earn legendary rewards
          </p>
        </motion.div>

        {/* Statistics */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-xl p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">{completedCount}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          
          <div className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-xl p-6 text-center">
            <Star className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">{totalExperience.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total XP</div>
          </div>
          
          <div className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-xl p-6 text-center">
            <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">{totalTokens.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Tokens Earned</div>
          </div>
          
          <div className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-xl p-6 text-center">
            <Progress className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">
              {((completedCount / achievements.length) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">Completion</div>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Achievement Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {/* All Category */}
            <CategoryCard 
              category={{
                id: 'all',
                name: 'All',
                icon: Sparkles,
                color: 'cosmic-purple',
                description: 'View all achievements',
                total_achievements: achievements.length,
                completed: completedCount
              }}
              isSelected={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
            />
            
            {categories.map(category => (
              <CategoryCard 
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="flex flex-wrap gap-4 justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.button
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              showCompleted 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-space-700/50 text-gray-400 hover:text-white'
            }`}
            onClick={() => setShowCompleted(!showCompleted)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Show Completed
          </motion.button>
          
          <motion.button
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              showLocked 
                ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                : 'bg-space-700/50 text-gray-400 hover:text-white'
            }`}
            onClick={() => setShowLocked(!showLocked)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Lock className="w-4 h-4 inline mr-2" />
            Show Locked
          </motion.button>
        </motion.div>

        {/* Achievement Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <AchievementCard achievement={achievement} />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Award className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No achievements found</h3>
            <p className="text-gray-500">Try adjusting your filters or start completing achievements!</p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="bg-gradient-to-r from-space-800/50 to-space-900/50 backdrop-blur-sm border border-space-700/50 rounded-3xl p-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              Become a 
              <span className="bg-gradient-to-r from-cosmic-gold to-yellow-400 bg-clip-text text-transparent">
                Legendary Champion
              </span>
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Every battle, every hero collected, every friendship forged brings you closer to cosmic greatness.
              Start your journey and claim your place among the stars!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-cosmic-purple to-cosmic-blue hover:from-cosmic-blue hover:to-cosmic-purple text-white font-bold py-4 px-8 rounded-full transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sword className="w-5 h-5" />
                Start Battle
              </motion.button>
              
              <motion.button 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Crown className="w-5 h-5" />
                Collect Heroes
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}