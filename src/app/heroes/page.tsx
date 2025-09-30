'use client'

import { HeroCards } from '@/components/hero-cards'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Crown, 
  Star,
  Zap,
  Shield,
  Infinity,
  Globe,
  Users,
  Trophy,
  Target
} from 'lucide-react'

export default function HeroesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-space-900 to-space-950">
      {/* Navigation Breadcrumb */}
      <motion.div 
        className="pt-8 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <a href="/" className="text-cosmic-blue hover:text-white transition-colors duration-200">
              Home
            </a>
            <span className="text-gray-500">/</span>
            <span className="text-gray-300">Legendary Heroes</span>
          </nav>
        </div>
      </motion.div>

      {/* Hero Cards Section */}
      <HeroCards />

      {/* Additional Info Section */}
      <section className="py-16 bg-gradient-to-b from-space-950 to-space-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Power System */}
            <div className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-2xl p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cosmic-purple to-cosmic-blue p-4 mb-6">
                <Zap className="w-full h-full text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Cosmic Power System</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Each hero possesses unique cosmic abilities with different types:
              </p>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full" />
                  <span className="text-gray-300"><span className="text-red-400 font-semibold">Attack</span> - Offensive abilities</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-gray-300"><span className="text-blue-400 font-semibold">Defense</span> - Protective abilities</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-gray-300"><span className="text-purple-400 font-semibold">Special</span> - Unique abilities</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span className="text-gray-300"><span className="text-yellow-400 font-semibold">Ultimate</span> - Devastating powers</span>
                </li>
              </ul>
            </div>

            {/* Rarity System */}
            <div className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-2xl p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cosmic-gold to-cosmic-purple p-4 mb-6">
                <Crown className="w-full h-full text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Rarity & Power</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Heroes and abilities are classified by cosmic rarity:
              </p>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span className="text-gray-400">Common</span>
                  <span className="text-gray-400">60% - Base power</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-blue-400">Rare</span>
                  <span className="text-blue-400">25% - +20% power</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-purple-400">Epic</span>
                  <span className="text-purple-400">12% - +50% power</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-yellow-400">Legendary</span>
                  <span className="text-yellow-400">3% - +100% power</span>
                </li>
              </ul>
            </div>

            {/* Combat System */}
            <div className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-2xl p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 p-4 mb-6">
                <Target className="w-full h-full text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Battle Mechanics</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Strategic turn-based combat with deep mechanics:
              </p>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Infinity className="w-3 h-3 text-cosmic-purple" />
                  <span className="text-gray-300">Elemental advantages & resistances</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-cosmic-gold" />
                  <span className="text-gray-300">Critical strike calculations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-3 h-3 text-blue-400" />
                  <span className="text-gray-300">Defense & damage mitigation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span className="text-gray-300">Combo attacks & synergies</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <div className="bg-gradient-to-r from-space-800/50 to-space-900/50 backdrop-blur-sm border border-space-700/50 rounded-3xl p-8">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Command 
                <span className="bg-gradient-to-r from-cosmic-purple to-cosmic-gold bg-clip-text text-transparent">
                  Cosmic Legends?
                </span>
              </h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Step into the cosmic arena and prove your worth as a legendary commander. 
                Each battle shapes the fate of the universe.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button 
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-cosmic-purple to-cosmic-blue hover:from-cosmic-blue hover:to-cosmic-purple text-white font-bold py-4 px-8 rounded-full transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Crown className="w-5 h-5" />
                  Create Your Hero
                </motion.button>
                
                <motion.button 
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-orange-500 hover:from-orange-500 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Target className="w-5 h-5" />
                  Enter Battle Arena
                </motion.button>
                
                <motion.button 
                  className="inline-flex items-center gap-3 bg-transparent border-2 border-cosmic-gold hover:bg-cosmic-gold hover:text-space-900 text-cosmic-gold font-bold py-4 px-8 rounded-full transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Globe className="w-5 h-5" />
                  Explore Marketplace
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}