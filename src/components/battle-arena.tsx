'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sword, 
  Shield, 
  Zap, 
  Heart, 
  Star, 
  Target, 
  Clock, 
  Flame, 
  Snowflake, 
  Wind, 
  Sparkles,
  Crown, 
  Trophy, 
  Play,
  Pause,
  RotateCcw,
  Settings,
  Volume2,
  VolumeX,
  Maximize,
  Info
} from 'lucide-react'

// Battle types
interface BattleHero {
  id: string
  name: string
  class: string
  element: string
  level: number
  current_health: number
  max_health: number
  current_mana: number
  max_mana: number
  stats: {
    attack: number
    defense: number
    speed: number
  }
  powers: Array<{
    id: string
    name: string
    description: string
    type: 'attack' | 'defense' | 'special' | 'ultimate'
    damage?: number
    manaCost: number
    cooldown: number
    currentCooldown: number
  }>
  status_effects: string[]
  position: number
  is_player: boolean
}

interface BattleState {
  id: string
  status: 'preparing' | 'active' | 'paused' | 'completed'
  current_turn: number
  turn_timer: number
  max_turn_time: number
  environment: 'cosmic_void' | 'stellar_forge' | 'nebula_ruins' | 'quantum_arena'
  weather_effects: string[]
  heroes: BattleHero[]
  turn_order: string[]
  battle_log: Array<{
    id: string
    turn: number
    action: string
    result: string
    timestamp: string
  }>
  winner?: string
}

// Mock battle data
const mockBattleState: BattleState = {
  id: 'battle_cosmic_001',
  status: 'active',
  current_turn: 0,
  turn_timer: 25,
  max_turn_time: 30,
  environment: 'cosmic_void',
  weather_effects: ['stellar_winds', 'cosmic_radiation'],
  heroes: [
    {
      id: 'hero_player_1',
      name: 'Zyx the Flamebringer',
      class: 'Warrior',
      element: 'Fire',
      level: 50,
      current_health: 2100,
      max_health: 2500,
      current_mana: 650,
      max_mana: 800,
      stats: { attack: 950, defense: 800, speed: 650 },
      powers: [
        {
          id: 'power_1',
          name: 'Cosmic Slash',
          description: 'A devastating fire-infused sword strike',
          type: 'attack',
          damage: 450,
          manaCost: 60,
          cooldown: 3,
          currentCooldown: 0
        },
        {
          id: 'power_2',
          name: 'Stellar Shield',
          description: 'Creates a protective barrier of starlight',
          type: 'defense',
          manaCost: 80,
          cooldown: 5,
          currentCooldown: 2
        },
        {
          id: 'power_3',
          name: 'Supernova Rage',
          description: 'Ultimate fire attack with massive area damage',
          type: 'ultimate',
          damage: 850,
          manaCost: 150,
          cooldown: 8,
          currentCooldown: 0
        }
      ],
      status_effects: ['fire_aura'],
      position: 0,
      is_player: true
    },
    {
      id: 'hero_enemy_1',
      name: 'Shadow Reaper',
      class: 'Ranger',
      element: 'Shadow',
      level: 48,
      current_health: 1800,
      max_health: 2000,
      current_mana: 1000,
      max_mana: 1200,
      stats: { attack: 880, defense: 600, speed: 1050 },
      powers: [
        {
          id: 'power_e1',
          name: 'Shadow Arrow',
          description: 'Ethereal arrow that pierces armor',
          type: 'attack',
          damage: 480,
          manaCost: 55,
          cooldown: 2,
          currentCooldown: 1
        }
      ],
      status_effects: ['stealth'],
      position: 1,
      is_player: false
    }
  ],
  turn_order: ['hero_player_1', 'hero_enemy_1'],
  battle_log: [
    {
      id: 'log_1',
      turn: 0,
      action: 'Battle commenced in the Cosmic Void',
      result: 'Environmental effects: Stellar Winds active',
      timestamp: '2024-09-30T21:30:00Z'
    }
  ]
}

const HealthBar = ({ current, max, color = 'red-500' }: { current: number, max: number, color?: string }) => {
  const percentage = (current / max) * 100
  
  return (
    <div className="relative">
      <div className="h-3 bg-space-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r from-${color} to-${color}/70 rounded-full relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </motion.div>
      </div>
      <div className="text-xs text-center mt-1 text-gray-300">
        {current.toLocaleString()} / {max.toLocaleString()}
      </div>
    </div>
  )
}

const PowerButton = ({ power, isActive, onClick, disabled }: { 
  power: any
  isActive: boolean
  onClick: () => void
  disabled: boolean
}) => {
  const powerTypeColors = {
    attack: 'from-red-500 to-pink-500',
    defense: 'from-blue-500 to-cyan-500',
    special: 'from-purple-500 to-violet-500',
    ultimate: 'from-yellow-500 to-orange-500'
  }

  const isOnCooldown = power.currentCooldown > 0
  const canUse = !disabled && !isOnCooldown

  return (
    <motion.button
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
        isActive 
          ? 'border-white bg-white/10 shadow-lg shadow-white/25' 
          : canUse
          ? 'border-cosmic-purple/50 hover:border-cosmic-purple hover:bg-cosmic-purple/10'
          : 'border-gray-600/30 bg-gray-800/20 opacity-50'
      }`}
      onClick={canUse ? onClick : undefined}
      whileHover={canUse ? { scale: 1.05 } : {}}
      whileTap={canUse ? { scale: 0.95 } : {}}
      disabled={!canUse}
    >
      {/* Cooldown Overlay */}
      {isOnCooldown && (
        <div className="absolute inset-0 bg-space-900/80 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <Clock className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <div className="text-xs text-gray-400">{power.currentCooldown}t</div>
          </div>
        </div>
      )}

      {/* Power Icon */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${powerTypeColors[power.type]} p-3 mb-3 mx-auto`}>
        {power.type === 'attack' && <Sword className="w-full h-full text-white" />}
        {power.type === 'defense' && <Shield className="w-full h-full text-white" />}
        {power.type === 'special' && <Sparkles className="w-full h-full text-white" />}
        {power.type === 'ultimate' && <Star className="w-full h-full text-white" />}
      </div>

      {/* Power Info */}
      <div className="text-center">
        <div className="text-sm font-bold text-white mb-1">{power.name}</div>
        <div className="text-xs text-gray-400 mb-2 h-8 overflow-hidden">{power.description}</div>
        
        <div className="flex justify-between text-xs">
          {power.damage && (
            <span className="text-red-400">{power.damage} DMG</span>
          )}
          <span className="text-blue-400">{power.manaCost} MP</span>
        </div>
      </div>
    </motion.button>
  )
}

const BattleLog = ({ logs }: { logs: any[] }) => (
  <div className="bg-space-800/50 backdrop-blur-sm border border-space-700/50 rounded-xl p-4 h-64 overflow-y-auto">
    <h3 className="font-bold text-white mb-3 flex items-center gap-2">
      <Info className="w-4 h-4 text-cosmic-blue" />
      Battle Log
    </h3>
    
    <div className="space-y-2">
      {logs.map(log => (
        <motion.div
          key={log.id}
          className="p-2 bg-space-700/30 rounded-lg border-l-2 border-cosmic-purple/50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-sm text-white">{log.action}</div>
          <div className="text-xs text-gray-400">{log.result}</div>
        </motion.div>
      ))}
    </div>
  </div>
)

export function BattleArena() {
  const [battleState, setBattleState] = useState<BattleState>(mockBattleState)
  const [selectedPower, setSelectedPower] = useState<string | null>(null)
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null)
  const [isActionExecuting, setIsActionExecuting] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(1)

  // Timer effect
  useEffect(() => {
    if (battleState.status === 'active') {
      const timer = setInterval(() => {
        setBattleState(prev => ({
          ...prev,
          turn_timer: Math.max(0, prev.turn_timer - 1)
        }))
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [battleState.status])

  const currentHero = battleState.heroes.find(
    hero => hero.id === battleState.turn_order[battleState.current_turn % battleState.turn_order.length]
  )

  const executeAction = async (powerType: string, targetId?: string) => {
    if (!currentHero || !currentHero.is_player) return
    
    setIsActionExecuting(true)
    
    // Simulate API call to execute battle action
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock battle result
    const target = battleState.heroes.find(h => h.id === targetId)
    if (target && powerType !== 'defense') {
      target.current_health = Math.max(0, target.current_health - 300)
    }
    
    // Add to battle log
    const newLogEntry = {
      id: `log_${Date.now()}`,
      turn: battleState.current_turn,
      action: `${currentHero.name} used ${powerType}`,
      result: target ? `Dealt 300 damage to ${target.name}` : 'Defensive action',
      timestamp: new Date().toISOString()
    }
    
    setBattleState(prev => ({
      ...prev,
      current_turn: prev.current_turn + 1,
      turn_timer: prev.max_turn_time,
      battle_log: [...prev.battle_log, newLogEntry]
    }))
    
    setSelectedPower(null)
    setSelectedTarget(null)
    setIsActionExecuting(false)
  }

  const environmentEffects = {
    cosmic_void: {
      name: 'Cosmic Void',
      description: 'Zero gravity environment with void energy',
      effects: ['Spell damage +20%', 'Movement speed +10%'],
      particles: 'cosmic'
    },
    stellar_forge: {
      name: 'Stellar Forge',
      description: 'Intense heat and molten energy',
      effects: ['Fire damage +25%', 'Ice damage -15%'],
      particles: 'fire'
    },
    nebula_ruins: {
      name: 'Nebula Ruins',
      description: 'Ancient ruins with mystical energy',
      effects: ['Mana regeneration +2/turn', 'Critical chance +5%'],
      particles: 'mystical'
    },
    quantum_arena: {
      name: 'Quantum Arena',
      description: 'Reality-shifting battlefield',
      effects: ['Random stat boost each turn', 'Time effects doubled'],
      particles: 'quantum'
    }
  }

  const currentEnvironment = environmentEffects[battleState.environment]

  return (
    <div className="min-h-screen bg-gradient-to-b from-space-900 to-space-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,69,255,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,69,139,0.1),transparent_60%)]" />
        
        {/* Floating Particles */}
        {[...Array(12)].map((_, index) => (
          <motion.div
            key={index}
            className={`absolute w-1 h-1 bg-gradient-to-r ${
              index % 3 === 0 ? 'from-cosmic-purple to-cosmic-blue' : 
              index % 3 === 1 ? 'from-red-500 to-orange-500' :
              'from-cosmic-gold to-yellow-400'
            } rounded-full blur-sm`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-20, 20, -20],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4">
        {/* Battle Header */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-space-800 to-space-700 backdrop-blur-sm border border-space-600 rounded-xl p-3">
              <h1 className="text-xl font-bold text-white">Battle Arena</h1>
              <p className="text-sm text-cosmic-blue">{currentEnvironment.name}</p>
            </div>
            
            {/* Turn Timer */}
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-3 min-w-[120px]">
              <div className="text-center">
                <Clock className="w-5 h-5 text-red-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{battleState.turn_timer}s</div>
                <div className="text-xs text-red-400">Turn Timer</div>
              </div>
            </div>
          </div>

          {/* Battle Controls */}
          <div className="flex items-center gap-2">
            <motion.button
              className="p-3 bg-space-800/50 hover:bg-space-700/50 border border-space-600 hover:border-space-500 text-gray-400 hover:text-white rounded-xl transition-all duration-200"
              onClick={() => setSoundEnabled(!soundEnabled)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </motion.button>
            
            <motion.button
              className="p-3 bg-space-800/50 hover:bg-space-700/50 border border-space-600 hover:border-space-500 text-gray-400 hover:text-white rounded-xl transition-all duration-200"
              onClick={() => setShowSettings(!showSettings)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Environment Info */}
        <motion.div 
          className="bg-gradient-to-r from-space-800/30 to-space-700/30 backdrop-blur-sm border border-space-600/50 rounded-xl p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white mb-1">{currentEnvironment.name}</h3>
              <p className="text-sm text-gray-300">{currentEnvironment.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-cosmic-purple font-semibold mb-1">Active Effects:</div>
              <div className="space-y-1">
                {currentEnvironment.effects.map((effect, index) => (
                  <div key={index} className="text-xs text-green-400">• {effect}</div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Battle Field */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Player Hero */}
          <motion.div 
            className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30 mb-3">
                <Crown className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400">YOUR HERO</span>
              </div>
              
              <div className="w-24 h-24 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 p-4 shadow-lg shadow-red-500/25">
                <Sword className="w-full h-full text-white" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1">{battleState.heroes[0].name}</h3>
              <p className="text-sm text-cosmic-gold">{battleState.heroes[0].class} • Level {battleState.heroes[0].level}</p>
            </div>
            
            {/* Health & Mana */}
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-red-400">Health</span>
                </div>
                <HealthBar 
                  current={battleState.heroes[0].current_health} 
                  max={battleState.heroes[0].max_health}
                  color="red-500"
                />
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-blue-400">Mana</span>
                </div>
                <HealthBar 
                  current={battleState.heroes[0].current_mana} 
                  max={battleState.heroes[0].max_mana}
                  color="blue-500"
                />
              </div>
            </div>
            
            {/* Status Effects */}
            {battleState.heroes[0].status_effects.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {battleState.heroes[0].status_effects.map((effect, index) => (
                  <div key={index} className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <span className="text-xs text-red-400 font-semibold">{effect}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Battle Actions */}
          <motion.div 
            className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Choose Your Action</h3>
              <p className="text-sm text-gray-400">
                {currentHero?.is_player ? 'Your turn!' : `${currentHero?.name}'s turn`}
              </p>
            </div>
            
            {currentHero?.is_player ? (
              <div className="grid grid-cols-2 gap-4">
                {currentHero.powers.map(power => (
                  <PowerButton
                    key={power.id}
                    power={power}
                    isActive={selectedPower === power.id}
                    onClick={() => {
                      setSelectedPower(selectedPower === power.id ? null : power.id)
                      if (power.type !== 'defense') {
                        setSelectedTarget(battleState.heroes.find(h => !h.is_player)?.id || null)
                      }
                    }}
                    disabled={isActionExecuting}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cosmic-purple to-cosmic-blue p-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Target className="w-full h-full text-white" />
                </motion.div>
                <p className="text-white font-semibold">Enemy is thinking...</p>
              </div>
            )}
            
            {/* Action Confirmation */}
            {selectedPower && selectedTarget && currentHero?.is_player && (
              <motion.div 
                className="mt-6 p-4 bg-cosmic-purple/10 border border-cosmic-purple/30 rounded-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-3">
                  <p className="text-white font-semibold">Ready to execute action?</p>
                  <p className="text-sm text-gray-400">This will end your turn</p>
                </div>
                
                <div className="flex gap-3">
                  <motion.button
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-emerald-500 hover:to-green-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300"
                    onClick={() => executeAction(selectedPower, selectedTarget)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isActionExecuting}
                  >
                    {isActionExecuting ? 'Executing...' : 'Confirm'}
                  </motion.button>
                  
                  <motion.button
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300"
                    onClick={() => {
                      setSelectedPower(null)
                      setSelectedTarget(null)
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Enemy Hero */}
          <motion.div 
            className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30 mb-3">
                <Target className="w-4 h-4 text-red-400" />
                <span className="text-sm font-semibold text-red-400">OPPONENT</span>
              </div>
              
              <div className="w-24 h-24 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 p-4 shadow-lg shadow-purple-500/25">
                <Target className="w-full h-full text-white" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1">{battleState.heroes[1].name}</h3>
              <p className="text-sm text-cosmic-gold">{battleState.heroes[1].class} • Level {battleState.heroes[1].level}</p>
            </div>
            
            {/* Health & Mana */}
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-red-400">Health</span>
                </div>
                <HealthBar 
                  current={battleState.heroes[1].current_health} 
                  max={battleState.heroes[1].max_health}
                  color="red-500"
                />
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-blue-400">Mana</span>
                </div>
                <HealthBar 
                  current={battleState.heroes[1].current_mana} 
                  max={battleState.heroes[1].max_mana}
                  color="blue-500"
                />
              </div>
            </div>
            
            {/* Status Effects */}
            {battleState.heroes[1].status_effects.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {battleState.heroes[1].status_effects.map((effect, index) => (
                  <div key={index} className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                    <span className="text-xs text-purple-400 font-semibold">{effect}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Battle Log */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <BattleLog logs={battleState.battle_log} />
        </motion.div>
      </div>

      {/* Battle Completed Modal */}
      <AnimatePresence>
        {battleState.status === 'completed' && (
          <motion.div
            className="fixed inset-0 bg-space-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-space-800 to-space-900 border border-space-700 rounded-3xl p-8 max-w-md w-full text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Trophy className="w-20 h-20 text-cosmic-gold mx-auto mb-6" />
              
              <h2 className="text-3xl font-bold text-white mb-4">Victory!</h2>
              <p className="text-gray-300 mb-6">You have proven your cosmic mastery!</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <Star className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">+1,250</div>
                  <div className="text-xs text-gray-400">Experience</div>
                </div>
                
                <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <Coins className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">+75</div>
                  <div className="text-xs text-gray-400">Cosmic Tokens</div>
                </div>
              </div>
              
              <motion.button 
                className="w-full bg-gradient-to-r from-cosmic-purple to-cosmic-blue hover:from-cosmic-blue hover:to-cosmic-purple text-white font-bold py-4 px-6 rounded-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue to Dashboard
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}