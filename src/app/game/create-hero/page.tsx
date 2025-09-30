'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'
import { 
  Sparkles, 
  Crown, 
  Zap, 
  Shield, 
  Sword,
  Wand2,
  Bow,
  Star,
  RefreshCw,
  Save,
  Download,
  Eye,
  Brain,
  Shuffle,
  Lock,
  Unlock,
  Settings,
  Palette
} from 'lucide-react'

interface HeroClass {
  id: string
  name: string
  description: string
  icon: any
  color: string
  stats: {
    strength: number
    intelligence: number
    agility: number
    vitality: number
  }
}

interface HeroRarity {
  id: string
  name: string
  probability: number
  color: string
  multiplier: number
}

const heroClasses: HeroClass[] = [
  {
    id: 'warrior',
    name: 'Cosmic Warrior',
    description: 'Masters of physical combat with exceptional strength and defense capabilities.',
    icon: Sword,
    color: 'from-red-500 to-pink-500',
    stats: { strength: 9, intelligence: 4, agility: 6, vitality: 8 }
  },
  {
    id: 'mage',
    name: 'Astral Mage',
    description: 'Wielders of cosmic magic with devastating spell-casting abilities.',
    icon: Wand2,
    color: 'from-purple-500 to-blue-500',
    stats: { strength: 3, intelligence: 10, agility: 5, vitality: 5 }
  },
  {
    id: 'ranger',
    name: 'Void Ranger',
    description: 'Swift hunters with unmatched agility and precision in ranged combat.',
    icon: Bow,
    color: 'from-green-500 to-teal-500',
    stats: { strength: 6, intelligence: 6, agility: 10, vitality: 6 }
  },
  {
    id: 'guardian',
    name: 'Stellar Guardian',
    description: 'Ultimate defenders with massive vitality and protective abilities.',
    icon: Shield,
    color: 'from-yellow-500 to-orange-500',
    stats: { strength: 7, intelligence: 5, agility: 4, vitality: 10 }
  }
]

const heroRarities: HeroRarity[] = [
  { id: 'common', name: 'Common', probability: 60, color: 'text-gray-400', multiplier: 1.0 },
  { id: 'rare', name: 'Rare', probability: 25, color: 'text-blue-400', multiplier: 1.2 },
  { id: 'epic', name: 'Epic', probability: 12, color: 'text-purple-400', multiplier: 1.5 },
  { id: 'legendary', name: 'Legendary', probability: 3, color: 'text-yellow-400', multiplier: 2.0 }
]

export default function CreateHeroPage() {
  const [selectedClass, setSelectedClass] = useState<HeroClass | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [generatedHero, setGeneratedHero] = useState<any>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [rarity, setRarity] = useState<HeroRarity>(heroRarities[0])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleGenerateHero = async () => {
    if (!selectedClass) return
    
    setIsGenerating(true)
    
    // Simulate AI generation process
    setTimeout(() => {
      const selectedRarity = heroRarities.find(r => Math.random() * 100 < r.probability) || heroRarities[0]
      
      const baseStats = selectedClass.stats
      const multipliedStats = {
        strength: Math.floor(baseStats.strength * selectedRarity.multiplier),
        intelligence: Math.floor(baseStats.intelligence * selectedRarity.multiplier),
        agility: Math.floor(baseStats.agility * selectedRarity.multiplier),
        vitality: Math.floor(baseStats.vitality * selectedRarity.multiplier)
      }
      
      setGeneratedHero({
        id: Date.now(),
        name: `Cosmic ${selectedClass.name.split(' ')[1]} #${Math.floor(Math.random() * 9999)}`,
        class: selectedClass,
        rarity: selectedRarity,
        stats: multipliedStats,
        level: 1,
        experience: 0,
        power: Object.values(multipliedStats).reduce((a, b) => a + b, 0),
        aiPrompt: aiPrompt || `A powerful ${selectedClass.name.toLowerCase()} from the cosmic realm`,
        createdAt: new Date().toISOString()
      })
      setIsGenerating(false)
    }, 3000)
  }

  const StatBar = ({ label, value, max = 10, color }: { label: string, value: number, max?: number, color: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        <span className="text-white font-bold">{value}/{max}</span>
      </div>
      <div className="h-2 bg-space-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>
    </div>
  )

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
          <div className="inline-flex items-center gap-2 bg-cosmic-purple/20 px-4 py-2 rounded-full border border-cosmic-purple/30 mb-6">
            <Brain className="w-4 h-4 text-cosmic-purple" />
            <span className="text-sm font-medium text-cosmic-purple">AI Hero Generation</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-cosmic-blue to-cosmic-purple bg-clip-text text-transparent mb-6">
            Create Your 
            <span className="text-cosmic-gold">Cosmic Legend</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Harness the power of AI to generate unique heroes with distinctive abilities, 
            backstories, and visual designs. Each hero is truly one-of-a-kind.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Creation Panel */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Class Selection */}
            <div className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Crown className="w-6 h-6 text-cosmic-gold" />
                Choose Hero Class
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {heroClasses.map((heroClass) => {
                  const Icon = heroClass.icon
                  const isSelected = selectedClass?.id === heroClass.id
                  
                  return (
                    <motion.button
                      key={heroClass.id}
                      className={`
                        relative p-6 rounded-xl border-2 transition-all duration-300
                        ${isSelected 
                          ? 'border-cosmic-purple bg-cosmic-purple/10' 
                          : 'border-space-600 hover:border-cosmic-purple/50 bg-space-700/30'
                        }
                      `}
                      onClick={() => setSelectedClass(heroClass)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${heroClass.color} p-3 mb-4 mx-auto`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <h3 className="font-bold text-white mb-2">{heroClass.name}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{heroClass.description}</p>
                      
                      {isSelected && (
                        <motion.div
                          className="absolute top-2 right-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <div className="w-6 h-6 bg-cosmic-purple rounded-full flex items-center justify-center">
                            <Crown className="w-3 h-3 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* AI Prompt */}
            <div className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-cosmic-blue" />
                AI Generation Prompt
              </h2>
              
              <div className="space-y-4">
                <textarea
                  className="w-full h-32 bg-space-700/50 border border-space-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:border-cosmic-purple focus:outline-none transition-colors duration-300"
                  placeholder="Describe your ideal hero... (e.g., 'A mystical warrior with glowing eyes who commands the power of stars and wears ancient cosmic armor')"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                
                <div className="flex flex-wrap gap-2">
                  {[
                    'Mystical and powerful',
                    'Dark and mysterious',
                    'Radiant and holy',
                    'Ancient and wise',
                    'Young and energetic',
                    'Battle-scarred veteran'
                  ].map((suggestion, index) => (
                    <motion.button
                      key={index}
                      className="px-3 py-1 text-xs bg-cosmic-purple/20 text-cosmic-purple border border-cosmic-purple/30 rounded-full hover:bg-cosmic-purple/30 transition-colors duration-200"
                      onClick={() => setAiPrompt(suggestion)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-2xl p-8">
              <button
                className="flex items-center gap-3 text-xl font-bold text-white mb-6 w-full justify-between"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-cosmic-gold" />
                  Advanced Options
                </div>
                <motion.div
                  animate={{ rotate: showAdvanced ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <RefreshCw className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">Preferred Rarity</label>
                      <div className="grid grid-cols-2 gap-2">
                        {heroRarities.map((rarityOption) => (
                          <button
                            key={rarityOption.id}
                            className={`p-3 rounded-lg border transition-all duration-200 ${
                              rarity.id === rarityOption.id
                                ? 'border-cosmic-purple bg-cosmic-purple/10'
                                : 'border-space-600 hover:border-cosmic-purple/50'
                            }`}
                            onClick={() => setRarity(rarityOption)}
                          >
                            <div className={`font-semibold ${rarityOption.color}`}>
                              {rarityOption.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {rarityOption.probability}% chance
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Generate Button */}
            <motion.button
              className="w-full py-6 bg-gradient-to-r from-cosmic-purple to-cosmic-blue hover:from-cosmic-blue hover:to-cosmic-purple text-white font-bold text-xl rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
              disabled={!selectedClass || isGenerating}
              onClick={handleGenerateHero}
              whileHover={{ scale: selectedClass && !isGenerating ? 1.02 : 1 }}
              whileTap={{ scale: selectedClass && !isGenerating ? 0.98 : 1 }}
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-6 h-6" />
                  </motion.div>
                  Generating Your Hero...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate AI Hero
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Preview Panel */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Eye className="w-6 h-6 text-cosmic-green" />
                Hero Preview
              </h2>
              
              {generatedHero ? (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Hero Info */}
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 ${generatedHero.rarity.color.replace('text-', 'bg-').replace('-400', '-500/20')} border ${generatedHero.rarity.color.replace('text-', 'border-').replace('-400', '-500/30')}`}>
                      <Star className={`w-4 h-4 ${generatedHero.rarity.color}`} />
                      <span className={`text-sm font-medium ${generatedHero.rarity.color}`}>
                        {generatedHero.rarity.name}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{generatedHero.name}</h3>
                    <p className="text-cosmic-purple font-semibold mb-4">{generatedHero.class.name}</p>
                    
                    {/* Hero Visual Placeholder */}
                    <div className="w-48 h-48 mx-auto bg-gradient-to-br from-space-700 to-space-800 rounded-2xl border-2 border-space-600 flex items-center justify-center mb-6">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                      >
                        <generatedHero.class.icon className="w-24 h-24 text-cosmic-purple" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-white mb-4">Hero Stats</h4>
                    <StatBar label="Strength" value={generatedHero.stats.strength} color="from-red-500 to-pink-500" />
                    <StatBar label="Intelligence" value={generatedHero.stats.intelligence} color="from-blue-500 to-purple-500" />
                    <StatBar label="Agility" value={generatedHero.stats.agility} color="from-green-500 to-teal-500" />
                    <StatBar label="Vitality" value={generatedHero.stats.vitality} color="from-yellow-500 to-orange-500" />
                  </div>

                  {/* Power Level */}
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-2">Total Power</div>
                    <div className="text-3xl font-bold text-cosmic-gold">
                      {generatedHero.power}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <motion.button
                      className="flex-1 py-3 bg-cosmic-purple hover:bg-cosmic-purple/80 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Save className="w-5 h-5" />
                      Save Hero
                    </motion.button>
                    
                    <motion.button
                      className="flex-1 py-3 bg-cosmic-gold hover:bg-cosmic-gold/80 text-space-900 font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-5 h-5" />
                      Mint NFT
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-16">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <Crown className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                  </motion.div>
                  <p className="text-gray-400 text-lg">Your generated hero will appear here</p>
                  <p className="text-gray-500 text-sm mt-2">Select a class and generate to see your cosmic legend</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}