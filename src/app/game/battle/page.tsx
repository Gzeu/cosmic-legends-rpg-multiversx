'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Zap, 
  Shield, 
  Sword, 
  Heart,
  Star,
  Crown,
  Target,
  Flame,
  Snowflake,
  Wind,
  Mountain,
  Sparkles,
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Settings,
  Trophy,
  Coins,
  XCircle
} from 'lucide-react'

interface Hero {
  id: string
  name: string
  class: string
  level: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  stats: {
    strength: number
    intelligence: number
    agility: number
    vitality: number
  }
  currentHp: number
  maxHp: number
  currentMp: number
  maxMp: number
  element: 'fire' | 'water' | 'earth' | 'air'
  abilities: Ability[]
}

interface Ability {
  id: string
  name: string
  description: string
  damage: number
  mpCost: number
  cooldown: number
  currentCooldown: number
  element: 'fire' | 'water' | 'earth' | 'air' | 'neutral'
  type: 'attack' | 'defend' | 'heal' | 'special'
  icon: any
}

interface BattleLog {
  id: string
  message: string
  type: 'attack' | 'heal' | 'special' | 'system'
  timestamp: number
}

type BattlePhase = 'preparation' | 'combat' | 'victory' | 'defeat'

const mockPlayerHero: Hero = {
  id: 'player-1',
  name: 'Cosmic Warrior Zyx',
  class: 'warrior',
  level: 25,
  rarity: 'epic',
  stats: { strength: 85, intelligence: 45, agility: 60, vitality: 78 },
  currentHp: 780,
  maxHp: 780,
  currentMp: 120,
  maxMp: 180,
  element: 'fire',
  abilities: [
    {
      id: 'slash',
      name: 'Cosmic Slash',
      description: 'A powerful sword strike infused with cosmic energy',
      damage: 120,
      mpCost: 20,
      cooldown: 2,
      currentCooldown: 0,
      element: 'fire',
      type: 'attack',
      icon: Sword
    },
    {
      id: 'shield',
      name: 'Stellar Shield',
      description: 'Creates a protective barrier that absorbs damage',
      damage: 0,
      mpCost: 30,
      cooldown: 3,
      currentCooldown: 0,
      element: 'neutral',
      type: 'defend',
      icon: Shield
    },
    {
      id: 'fire-storm',
      name: 'Fire Storm',
      description: 'Unleashes a devastating area attack',
      damage: 200,
      mpCost: 60,
      cooldown: 5,
      currentCooldown: 0,
      element: 'fire',
      type: 'special',
      icon: Flame
    },
    {
      id: 'heal',
      name: 'Cosmic Recovery',
      description: 'Restores health using cosmic energy',
      damage: -150,
      mpCost: 40,
      cooldown: 4,
      currentCooldown: 0,
      element: 'neutral',
      type: 'heal',
      icon: Heart
    }
  ]
}

const mockEnemyHero: Hero = {
  id: 'enemy-1',
  name: 'Shadow Mage Nyx',
  class: 'mage',
  level: 27,
  rarity: 'legendary',
  stats: { strength: 40, intelligence: 95, agility: 65, vitality: 68 },
  currentHp: 680,
  maxHp: 680,
  currentMp: 280,
  maxMp: 280,
  element: 'water',
  abilities: [
    {
      id: 'ice-bolt',
      name: 'Ice Bolt',
      description: 'Launches a freezing projectile',
      damage: 110,
      mpCost: 25,
      cooldown: 2,
      currentCooldown: 0,
      element: 'water',
      type: 'attack',
      icon: Snowflake
    },
    {
      id: 'blizzard',
      name: 'Cosmic Blizzard',
      description: 'Summons a devastating ice storm',
      damage: 180,
      mpCost: 70,
      cooldown: 6,
      currentCooldown: 0,
      element: 'water',
      type: 'special',
      icon: Wind
    }
  ]
}

const elementColors = {
  fire: 'from-red-500 to-orange-500',
  water: 'from-blue-500 to-cyan-500',
  earth: 'from-green-500 to-yellow-500',
  air: 'from-purple-500 to-pink-500',
  neutral: 'from-gray-500 to-gray-600'
}

const rarityColors = {
  common: 'text-gray-400 border-gray-400/30',
  rare: 'text-blue-400 border-blue-400/30',
  epic: 'text-purple-400 border-purple-400/30',
  legendary: 'text-yellow-400 border-yellow-400/30'
}

export default function BattlePage() {
  const [playerHero, setPlayerHero] = useState<Hero>(mockPlayerHero)
  const [enemyHero, setEnemyHero] = useState<Hero>(mockEnemyHero)
  const [battlePhase, setBattlePhase] = useState<BattlePhase>('preparation')
  const [currentTurn, setCurrentTurn] = useState<'player' | 'enemy'>('player')
  const [battleLog, setBattleLog] = useState<BattleLog[]>([])
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null)
  const [battleSpeed, setBattleSpeed] = useState(1)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [turnTimer, setTurnTimer] = useState(30)

  useEffect(() => {
    if (battlePhase === 'combat' && currentTurn === 'player') {
      const timer = setInterval(() => {
        setTurnTimer(prev => {
          if (prev <= 1) {
            // Auto-select basic attack if time runs out
            handleAbilityUse(playerHero.abilities[0])
            return 30
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [currentTurn, battlePhase])

  const handleAbilityUse = async (ability: Ability) => {
    if (isAnimating || currentTurn !== 'player' || ability.currentCooldown > 0) return
    
    setIsAnimating(true)
    setSelectedAbility(ability)
    
    // Calculate damage/healing
    let effectValue = ability.damage
    if (ability.type === 'attack') {
      // Apply elemental advantages/disadvantages
      if ((playerHero.element === 'fire' && enemyHero.element === 'water') ||
          (playerHero.element === 'water' && enemyHero.element === 'fire')) {
        effectValue *= 0.8 // Disadvantage
      } else if ((playerHero.element === 'fire' && enemyHero.element === 'earth') ||
                (playerHero.element === 'water' && enemyHero.element === 'fire')) {
        effectValue *= 1.25 // Advantage
      }
      
      // Apply to enemy
      setEnemyHero(prev => ({
        ...prev,
        currentHp: Math.max(0, prev.currentHp - effectValue)
      }))
      
      setBattleLog(prev => [...prev, {
        id: Date.now().toString(),
        message: `${playerHero.name} used ${ability.name} for ${effectValue} damage!`,
        type: 'attack',
        timestamp: Date.now()
      }])
    } else if (ability.type === 'heal') {
      setPlayerHero(prev => ({
        ...prev,
        currentHp: Math.min(prev.maxHp, prev.currentHp + Math.abs(effectValue))
      }))
      
      setBattleLog(prev => [...prev, {
        id: Date.now().toString(),
        message: `${playerHero.name} healed for ${Math.abs(effectValue)} HP!`,
        type: 'heal',
        timestamp: Date.now()
      }])
    }
    
    // Reduce MP
    setPlayerHero(prev => ({
      ...prev,
      currentMp: Math.max(0, prev.currentMp - ability.mpCost),
      abilities: prev.abilities.map(a => 
        a.id === ability.id ? { ...a, currentCooldown: a.cooldown } : a
      )
    }))
    
    setTimeout(() => {
      setIsAnimating(false)
      setCurrentTurn('enemy')
      setTurnTimer(30)
      
      // Enemy AI turn
      setTimeout(() => {
        enemyTurn()
      }, 1500)
    }, 1000)
  }
  
  const enemyTurn = () => {
    const availableAbilities = enemyHero.abilities.filter(a => 
      a.currentCooldown === 0 && enemyHero.currentMp >= a.mpCost
    )
    
    if (availableAbilities.length > 0) {
      const selectedAbility = availableAbilities[Math.floor(Math.random() * availableAbilities.length)]
      
      let effectValue = selectedAbility.damage
      setPlayerHero(prev => ({
        ...prev,
        currentHp: Math.max(0, prev.currentHp - effectValue)
      }))
      
      setBattleLog(prev => [...prev, {
        id: Date.now().toString(),
        message: `${enemyHero.name} used ${selectedAbility.name} for ${effectValue} damage!`,
        type: 'attack',
        timestamp: Date.now()
      }])
      
      setEnemyHero(prev => ({
        ...prev,
        currentMp: Math.max(0, prev.currentMp - selectedAbility.mpCost),
        abilities: prev.abilities.map(a => 
          a.id === selectedAbility.id ? { ...a, currentCooldown: a.cooldown } : a
        )
      }))
    }
    
    // Reduce cooldowns
    setPlayerHero(prev => ({
      ...prev,
      abilities: prev.abilities.map(a => ({
        ...a,
        currentCooldown: Math.max(0, a.currentCooldown - 1)
      }))
    }))
    
    setEnemyHero(prev => ({
      ...prev,
      abilities: prev.abilities.map(a => ({
        ...a,
        currentCooldown: Math.max(0, a.currentCooldown - 1)
      }))
    }))
    
    setTimeout(() => {
      setCurrentTurn('player')
      setTurnTimer(30)
    }, 1500)
  }

  const startBattle = () => {
    setBattlePhase('combat')
    setCurrentTurn('player')
    setBattleLog([{
      id: Date.now().toString(),
      message: 'Battle begins! Choose your first move wisely.',
      type: 'system',
      timestamp: Date.now()
    }])
  }

  const HeroDisplay = ({ hero, isPlayer }: { hero: Hero, isPlayer: boolean }) => {
    const hpPercentage = (hero.currentHp / hero.maxHp) * 100
    const mpPercentage = (hero.currentMp / hero.maxMp) * 100
    
    return (
      <motion.div
        className={`relative ${
          isPlayer ? 'order-1' : 'order-2'
        }`}
        initial={{ opacity: 0, x: isPlayer ? -50 : 50 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          scale: currentTurn === (isPlayer ? 'player' : 'enemy') ? 1.05 : 1
        }}
        transition={{ duration: 0.6 }}
      >
        <div className={`bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border ${
          currentTurn === (isPlayer ? 'player' : 'enemy') 
            ? 'border-cosmic-purple' 
            : 'border-space-700/50'
        } rounded-2xl p-6 transition-all duration-300`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">{hero.name}</h3>
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded-lg border text-xs ${rarityColors[hero.rarity]}`}>
                  {hero.rarity.charAt(0).toUpperCase() + hero.rarity.slice(1)}
                </div>
                <span className="text-sm text-gray-400">Level {hero.level}</span>
              </div>
            </div>
            
            {currentTurn === (isPlayer ? 'player' : 'enemy') && (
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-blue flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Crown className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </div>

          {/* Hero Visual */}
          <div className="relative aspect-square bg-gradient-to-br from-space-700 to-space-800 rounded-xl mb-4 flex items-center justify-center">
            <motion.div
              animate={currentTurn === (isPlayer ? 'player' : 'enemy') ? {
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown className="w-32 h-32 text-cosmic-purple opacity-80" />
            </motion.div>
            
            {/* Element Indicator */}
            <div className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-gradient-to-br ${elementColors[hero.element]} flex items-center justify-center`}>
              {hero.element === 'fire' && <Flame className="w-4 h-4 text-white" />}
              {hero.element === 'water' && <Snowflake className="w-4 h-4 text-white" />}
              {hero.element === 'earth' && <Mountain className="w-4 h-4 text-white" />}
              {hero.element === 'air' && <Wind className="w-4 h-4 text-white" />}
            </div>
          </div>

          {/* Health Bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-300">Health</span>
              </div>
              <span className="text-sm text-white font-bold">
                {hero.currentHp}/{hero.maxHp}
              </span>
            </div>
            <div className="h-3 bg-space-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full"
                animate={{ width: `${hpPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Mana Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Mana</span>
              </div>
              <span className="text-sm text-white font-bold">
                {hero.currentMp}/{hero.maxMp}
              </span>
            </div>
            <div className="h-3 bg-space-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                animate={{ width: `${mpPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-xs">
              <Sword className="w-3 h-3 text-red-400" />
              <span className="text-gray-400">STR:</span>
              <span className="text-white font-bold">{hero.stats.strength}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Star className="w-3 h-3 text-blue-400" />
              <span className="text-gray-400">INT:</span>
              <span className="text-white font-bold">{hero.stats.intelligence}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Zap className="w-3 h-3 text-green-400" />
              <span className="text-gray-400">AGI:</span>
              <span className="text-white font-bold">{hero.stats.agility}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Shield className="w-3 h-3 text-yellow-400" />
              <span className="text-gray-400">VIT:</span>
              <span className="text-white font-bold">{hero.stats.vitality}</span>
            </div>
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
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-full border border-red-500/30 mb-6">
            <Sword className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">Combat Arena</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-cosmic-blue to-cosmic-purple bg-clip-text text-transparent mb-4">
            Epic 
            <span className="text-cosmic-gold">Battle</span>
          </h1>
        </motion.div>

        {/* Battle Controls */}
        <motion.div 
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 bg-space-800/60 rounded-full px-4 py-2 border border-space-700/50">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <button
              className={`w-10 h-6 rounded-full transition-colors duration-200 ${
                soundEnabled ? 'bg-cosmic-purple' : 'bg-gray-600'
              } relative`}
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                soundEnabled ? 'translate-x-5' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          {battlePhase === 'preparation' && (
            <motion.button
              className="flex items-center gap-2 bg-gradient-to-r from-cosmic-purple to-cosmic-blue hover:from-cosmic-blue hover:to-cosmic-purple text-white font-bold py-3 px-6 rounded-full transition-all duration-300"
              onClick={startBattle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5" />
              Start Battle
            </motion.button>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Player Hero */}
          <HeroDisplay hero={playerHero} isPlayer={true} />

          {/* Battle Arena */}
          <motion.div 
            className="lg:order-2 space-y-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Turn Indicator */}
            {battlePhase === 'combat' && (
              <motion.div 
                className="bg-gradient-to-r from-cosmic-purple to-cosmic-blue rounded-2xl p-6 text-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="text-2xl font-bold text-white mb-2">
                  {currentTurn === 'player' ? 'Your Turn' : 'Enemy Turn'}
                </div>
                {currentTurn === 'player' && (
                  <div className="text-cosmic-gold font-semibold">
                    Time: {turnTimer}s
                  </div>
                )}
              </motion.div>
            )}

            {/* Battle Log */}
            <div className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cosmic-gold" />
                Battle Log
              </h3>
              
              <div className="h-48 overflow-y-auto space-y-2">
                <AnimatePresence>
                  {battleLog.slice(-10).map((log) => (
                    <motion.div
                      key={log.id}
                      className={`p-3 rounded-lg text-sm ${
                        log.type === 'attack' ? 'bg-red-500/10 text-red-300' :
                        log.type === 'heal' ? 'bg-green-500/10 text-green-300' :
                        log.type === 'special' ? 'bg-purple-500/10 text-purple-300' :
                        'bg-space-700/30 text-gray-300'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      {log.message}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {battleLog.length === 0 && (
                  <div className="text-gray-400 text-center py-8">
                    Battle log will appear here
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Enemy Hero */}
          <HeroDisplay hero={enemyHero} isPlayer={false} />
        </div>

        {/* Player Actions */}
        {battlePhase === 'combat' && currentTurn === 'player' && (
          <motion.div 
            className="mt-8 bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-2xl p-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-cosmic-gold" />
              Choose Your Action
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {playerHero.abilities.map((ability) => {
                const Icon = ability.icon
                const canUse = ability.currentCooldown === 0 && playerHero.currentMp >= ability.mpCost && !isAnimating
                
                return (
                  <motion.button
                    key={ability.id}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                      canUse
                        ? 'border-cosmic-purple/50 hover:border-cosmic-purple bg-cosmic-purple/5 hover:bg-cosmic-purple/10'
                        : 'border-gray-600 bg-gray-600/10 cursor-not-allowed opacity-50'
                    }`}
                    disabled={!canUse}
                    onClick={() => handleAbilityUse(ability)}
                    whileHover={canUse ? { scale: 1.02 } : {}}
                    whileTap={canUse ? { scale: 0.98 } : {}}
                  >
                    {/* Cooldown Overlay */}
                    {ability.currentCooldown > 0 && (
                      <div className="absolute inset-0 bg-space-900/80 rounded-xl flex items-center justify-center">
                        <div className="text-white font-bold">{ability.currentCooldown}</div>
                      </div>
                    )}
                    
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${elementColors[ability.element]} p-3 mb-3 mx-auto`}>
                      <Icon className="w-full h-full text-white" />
                    </div>
                    
                    <h4 className="font-bold text-white mb-2 text-sm">{ability.name}</h4>
                    
                    <div className="space-y-1 text-xs text-gray-400">
                      {ability.type === 'attack' && (
                        <div>Damage: <span className="text-red-400 font-bold">{ability.damage}</span></div>
                      )}
                      {ability.type === 'heal' && (
                        <div>Heal: <span className="text-green-400 font-bold">{Math.abs(ability.damage)}</span></div>
                      )}
                      <div>MP Cost: <span className="text-blue-400 font-bold">{ability.mpCost}</span></div>
                      <div>Cooldown: {ability.cooldown}t</div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2 leading-tight">
                      {ability.description}
                    </p>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Battle Results */}
        <AnimatePresence>
          {(battlePhase === 'victory' || battlePhase === 'defeat') && (
            <motion.div
              className="fixed inset-0 bg-space-900/80 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gradient-to-br from-space-800 to-space-900 border border-space-700 rounded-3xl p-12 text-center max-w-md mx-4"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {battlePhase === 'victory' ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    >
                      <Trophy className="w-24 h-24 text-cosmic-gold mx-auto mb-6" />
                    </motion.div>
                    <h2 className="text-4xl font-bold text-cosmic-gold mb-4">Victory!</h2>
                    <p className="text-gray-300 mb-6">Your hero has triumphed in cosmic battle!</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Reward:</span>
                        <span className="text-cosmic-gold font-bold">+50 EGLD</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Experience:</span>
                        <span className="text-cosmic-blue font-bold">+1,250 XP</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-24 h-24 text-red-400 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold text-red-400 mb-4">Defeat</h2>
                    <p className="text-gray-300 mb-6">Your hero fought bravely but fell in battle.</p>
                  </>
                )}
                
                <div className="flex gap-4">
                  <motion.button
                    className="flex-1 py-3 bg-cosmic-purple hover:bg-cosmic-purple/80 text-white font-bold rounded-xl transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setBattlePhase('preparation')
                      setPlayerHero(mockPlayerHero)
                      setEnemyHero(mockEnemyHero)
                      setBattleLog([])
                    }}
                  >
                    Battle Again
                  </motion.button>
                  
                  <motion.button
                    className="flex-1 py-3 bg-space-700 hover:bg-space-600 text-white font-bold rounded-xl transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Return Home
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}