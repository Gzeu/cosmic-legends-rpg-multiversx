'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { 
  Sword, 
  Wand2, 
  Bow, 
  Shield,
  Star,
  Flame,
  Snowflake,
  Wind,
  Mountain,
  Zap,
  Heart,
  Crown,
  Sparkles,
  Eye,
  Target,
  Swords,
  ShieldCheck,
  Bolt,
  Gem,
  Infinity,
  Sun,
  Moon,
  Orbit
} from 'lucide-react'

interface HeroPower {
  id: string
  name: string
  description: string
  type: 'attack' | 'defense' | 'special' | 'ultimate'
  element: string
  damage?: number
  cooldown: number
  manaCost: number
  icon: any
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface CosmicHero {
  id: string
  name: string
  title: string
  class: string
  element: string
  rarity: 'legendary'
  level: number
  description: string
  lore: string
  stats: {
    health: number
    mana: number
    attack: number
    defense: number
    speed: number
    cosmic_power: number
  }
  powers: HeroPower[]
  passiveAbility: {
    name: string
    description: string
    icon: any
  }
  weaknesses: string[]
  strengths: string[]
  cosmicOrigin: string
  cardColor: string
  glowColor: string
}

const cosmicHeroes: CosmicHero[] = [
  {
    id: 'warrior-zyx',
    name: 'Zyx the Flamebringer',
    title: 'Cosmic Warrior Supreme',
    class: 'Warrior',
    element: 'Fire',
    rarity: 'legendary',
    level: 50,
    description: 'Forged in the heart of dying stars, wielder of the Cosmic Inferno Blade',
    lore: 'Born from the collision of two supernovas, Zyx carries the eternal flames of creation and destruction. His armor is crafted from stellar metal that glows with the intensity of a thousand suns.',
    stats: {
      health: 2500,
      mana: 800,
      attack: 950,
      defense: 800,
      speed: 650,
      cosmic_power: 4200
    },
    powers: [
      {
        id: 'cosmic-slash',
        name: 'Cosmic Inferno Slash',
        description: 'Unleashes a devastating sword strike that ignites enemies with stellar fire',
        type: 'attack',
        element: 'Fire',
        damage: 450,
        cooldown: 3,
        manaCost: 60,
        icon: Sword,
        rarity: 'epic'
      },
      {
        id: 'stellar-shield',
        name: 'Stellar Aegis',
        description: 'Creates an impenetrable barrier of crystallized starlight',
        type: 'defense',
        element: 'Fire',
        cooldown: 5,
        manaCost: 80,
        icon: Shield,
        rarity: 'rare'
      },
      {
        id: 'supernova-rage',
        name: 'Supernova Rage',
        description: 'Channels the power of exploding stars for massive area damage',
        type: 'ultimate',
        element: 'Fire',
        damage: 850,
        cooldown: 8,
        manaCost: 150,
        icon: Sun,
        rarity: 'legendary'
      }
    ],
    passiveAbility: {
      name: 'Stellar Regeneration',
      description: 'Gains 2% health per turn when health is below 50%',
      icon: Heart
    },
    weaknesses: ['Ice magic', 'Void abilities'],
    strengths: ['Physical attacks', 'Fire resistance', 'High durability'],
    cosmicOrigin: 'Andromeda Forge Nebula',
    cardColor: 'from-red-600 via-orange-500 to-yellow-400',
    glowColor: 'shadow-red-500/50'
  },
  {
    id: 'mage-aria',
    name: 'Aria the Voidweaver',
    title: 'Astral Mage Sovereign',
    class: 'Mage',
    element: 'Void',
    rarity: 'legendary',
    level: 48,
    description: 'Master of dimensional magic and cosmic manipulation across infinite realms',
    lore: 'Aria transcended physical form eons ago, existing as pure cosmic consciousness. She weaves reality itself, bending space-time to her will and commanding the very fabric of the universe.',
    stats: {
      health: 1800,
      mana: 2200,
      attack: 1100,
      defense: 450,
      speed: 750,
      cosmic_power: 4500
    },
    powers: [
      {
        id: 'void-bolt',
        name: 'Dimensional Void Bolt',
        description: 'Launches concentrated void energy that pierces through reality',
        type: 'attack',
        element: 'Void',
        damage: 520,
        cooldown: 2,
        manaCost: 70,
        icon: Zap,
        rarity: 'epic'
      },
      {
        id: 'cosmic-barrier',
        name: 'Cosmic Reflection Barrier',
        description: 'Creates a barrier that reflects 50% of incoming damage',
        type: 'defense',
        element: 'Void',
        cooldown: 4,
        manaCost: 90,
        icon: ShieldCheck,
        rarity: 'rare'
      },
      {
        id: 'reality-storm',
        name: 'Reality Storm',
        description: 'Tears holes in space-time, dealing massive damage to all enemies',
        type: 'ultimate',
        element: 'Void',
        damage: 920,
        cooldown: 10,
        manaCost: 200,
        icon: Orbit,
        rarity: 'legendary'
      }
    ],
    passiveAbility: {
      name: 'Void Mastery',
      description: 'Abilities have 15% chance to reset their cooldown',
      icon: Infinity
    },
    weaknesses: ['Physical burst damage', 'Silence effects'],
    strengths: ['Magic damage', 'Area control', 'Reality manipulation'],
    cosmicOrigin: 'The Great Void Between Galaxies',
    cardColor: 'from-purple-600 via-blue-500 to-cyan-400',
    glowColor: 'shadow-purple-500/50'
  },
  {
    id: 'ranger-kaine',
    name: 'Kaine the Shadowstrike',
    title: 'Void Ranger Phantom',
    class: 'Ranger',
    element: 'Shadow',
    rarity: 'legendary',
    level: 46,
    description: 'Silent hunter of the cosmic winds, master of stealth and precision strikes',
    lore: 'Kaine moves between dimensions like shadows between light. Born in the silent spaces between stars, he hunts cosmic threats with unmatched precision and ethereal arrows that never miss their mark.',
    stats: {
      health: 2000,
      mana: 1200,
      attack: 880,
      defense: 600,
      speed: 1050,
      cosmic_power: 3950
    },
    powers: [
      {
        id: 'phantom-arrow',
        name: 'Phantom Shadow Arrow',
        description: 'Fires an ethereal arrow that phases through armor and strikes the soul',
        type: 'attack',
        element: 'Shadow',
        damage: 480,
        cooldown: 2,
        manaCost: 55,
        icon: Bow,
        rarity: 'epic'
      },
      {
        id: 'shadow-cloak',
        name: 'Dimensional Shadow Cloak',
        description: 'Becomes invisible for 3 turns, next attack deals double damage',
        type: 'special',
        element: 'Shadow',
        cooldown: 6,
        manaCost: 100,
        icon: Eye,
        rarity: 'rare'
      },
      {
        id: 'void-rain',
        name: 'Void Arrow Rain',
        description: 'Summons a barrage of shadow arrows from parallel dimensions',
        type: 'ultimate',
        element: 'Shadow',
        damage: 750,
        cooldown: 7,
        manaCost: 140,
        icon: Target,
        rarity: 'legendary'
      }
    ],
    passiveAbility: {
      name: 'Shadow Step',
      description: 'Has 25% chance to dodge any attack completely',
      icon: Wind
    },
    weaknesses: ['Light magic', 'Area detection'],
    strengths: ['Critical strikes', 'Evasion', 'Multi-target attacks'],
    cosmicOrigin: 'The Whispering Dark Between Worlds',
    cardColor: 'from-green-600 via-teal-500 to-emerald-400',
    glowColor: 'shadow-green-500/50'
  },
  {
    id: 'guardian-titan',
    name: 'Titan the Lightbearer',
    title: 'Stellar Guardian Eternal',
    class: 'Guardian',
    element: 'Light',
    rarity: 'legendary',
    level: 52,
    description: 'Eternal protector of cosmic balance, wielder of divine stellar energy',
    lore: 'Titan was chosen by the Cosmic Council to maintain balance across all dimensions. His shield contains a fragment of the first star ever born, and his presence brings hope to the darkest corners of space.',
    stats: {
      health: 3200,
      mana: 1000,
      attack: 650,
      defense: 1100,
      speed: 500,
      cosmic_power: 4100
    },
    powers: [
      {
        id: 'divine-smite',
        name: 'Divine Stellar Smite',
        description: 'Calls down a pillar of pure starlight that purifies and damages',
        type: 'attack',
        element: 'Light',
        damage: 420,
        cooldown: 3,
        manaCost: 65,
        icon: Bolt,
        rarity: 'epic'
      },
      {
        id: 'cosmic-sanctuary',
        name: 'Cosmic Sanctuary',
        description: 'Creates a protective dome that heals all allies over time',
        type: 'defense',
        element: 'Light',
        cooldown: 5,
        manaCost: 95,
        icon: Sparkles,
        rarity: 'rare'
      },
      {
        id: 'stellar-judgment',
        name: 'Stellar Judgment',
        description: 'Unleashes the collective power of a thousand stars in divine judgment',
        type: 'ultimate',
        element: 'Light',
        damage: 680,
        cooldown: 9,
        manaCost: 180,
        icon: Crown,
        rarity: 'legendary'
      }
    ],
    passiveAbility: {
      name: 'Stellar Aura',
      description: 'All allies gain +20% defense when near Titan',
      icon: Star
    },
    weaknesses: ['Dark magic', 'Corruption effects'],
    strengths: ['Healing abilities', 'Team support', 'Damage mitigation'],
    cosmicOrigin: 'The First Light - Origin Point of Creation',
    cardColor: 'from-yellow-500 via-amber-400 to-orange-300',
    glowColor: 'shadow-yellow-500/50'
  }
]

const powerTypeColors = {
  attack: 'from-red-500 to-pink-500',
  defense: 'from-blue-500 to-cyan-500',
  special: 'from-purple-500 to-violet-500',
  ultimate: 'from-yellow-500 to-orange-500'
}

const rarityGlow = {
  common: 'shadow-gray-400/20',
  rare: 'shadow-blue-400/30',
  epic: 'shadow-purple-400/40',
  legendary: 'shadow-yellow-400/60'
}

export function HeroCards() {
  const [selectedHero, setSelectedHero] = useState<CosmicHero | null>(null)
  const [selectedPower, setSelectedPower] = useState<HeroPower | null>(null)
  const [flipCard, setFlipCard] = useState<string | null>(null)

  const StatBar = ({ label, value, max, color }: { label: string, value: number, max: number, color: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-300">{label}</span>
        <span className="text-white font-bold">{value}</span>
      </div>
      <div className="h-1.5 bg-space-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>
    </div>
  )

  const PowerCard = ({ power, isSelected }: { power: HeroPower, isSelected: boolean }) => {
    const Icon = power.icon
    return (
      <motion.div
        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
          isSelected 
            ? 'border-cosmic-purple bg-cosmic-purple/10' 
            : 'border-space-600 hover:border-cosmic-purple/50'
        }`}
        onClick={() => setSelectedPower(isSelected ? null : power)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Power Type Badge */}
        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-r ${powerTypeColors[power.type]} p-1`}>
          <div className="w-full h-full bg-white/20 rounded-full" />
        </div>

        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${powerTypeColors[power.type]} p-3 mb-3`}>
          <Icon className="w-full h-full text-white" />
        </div>

        {/* Content */}
        <h4 className="font-bold text-white mb-2 text-sm">{power.name}</h4>
        <p className="text-xs text-gray-400 leading-tight mb-3">{power.description}</p>

        {/* Stats */}
        <div className="space-y-1 text-xs">
          {power.damage && (
            <div className="flex justify-between">
              <span className="text-gray-400">Damage:</span>
              <span className="text-red-400 font-bold">{power.damage}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-400">Mana:</span>
            <span className="text-blue-400 font-bold">{power.manaCost}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Cooldown:</span>
            <span className="text-yellow-400 font-bold">{power.cooldown}t</span>
          </div>
        </div>

        {/* Rarity Indicator */}
        <div className={`absolute bottom-2 left-2 w-2 h-2 rounded-full ${rarityGlow[power.rarity]} ${
          power.rarity === 'legendary' ? 'bg-yellow-400' :
          power.rarity === 'epic' ? 'bg-purple-400' :
          power.rarity === 'rare' ? 'bg-blue-400' : 'bg-gray-400'
        }`} />
      </motion.div>
    )
  }

  const HeroCard = ({ hero }: { hero: CosmicHero }) => {
    const isFlipped = flipCard === hero.id
    const totalStats = Object.values(hero.stats).reduce((sum, stat) => sum + stat, 0)

    return (
      <motion.div
        className="relative h-96 w-80 mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div 
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Side */}
          <div className={`absolute inset-0 w-full h-full backface-hidden`}>
            <motion.div
              className={`relative w-full h-full bg-gradient-to-br ${hero.cardColor} p-1 rounded-2xl ${hero.glowColor} shadow-2xl`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Inner Card */}
              <div className="w-full h-full bg-gradient-to-br from-space-800 to-space-900 rounded-xl p-6 relative overflow-hidden">
                
                {/* Background Effects */}
                <div className={`absolute inset-0 bg-gradient-to-br ${hero.cardColor} opacity-5`} />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-white/5 to-transparent rounded-full blur-2xl" />
                
                {/* Header */}
                <div className="relative z-10 text-center mb-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${hero.cardColor} mb-2`}>
                    <Star className="w-4 h-4 text-white" />
                    <span className="text-white font-bold text-xs">LEGENDARY</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">{hero.name}</h2>
                  <p className="text-sm text-cosmic-gold font-semibold">{hero.title}</p>
                  <p className="text-xs text-gray-400 mt-2 leading-tight">{hero.description}</p>
                </div>

                {/* Hero Visual */}
                <div className="relative">
                  <div className={`w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br ${hero.cardColor} p-4 mb-4 ${hero.glowColor} shadow-lg`}>
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
                      className="w-full h-full flex items-center justify-center"
                    >
                      {hero.class === 'Warrior' && <Sword className="w-16 h-16 text-white" />}
                      {hero.class === 'Mage' && <Wand2 className="w-16 h-16 text-white" />}
                      {hero.class === 'Ranger' && <Bow className="w-16 h-16 text-white" />}
                      {hero.class === 'Guardian' && <Shield className="w-16 h-16 text-white" />}
                    </motion.div>
                  </div>

                  {/* Level and Power */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Level</div>
                      <div className="text-2xl font-bold text-white">{hero.level}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Cosmic Power</div>
                      <div className="text-2xl font-bold text-cosmic-gold">{hero.stats.cosmic_power}</div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-2 mb-4">
                  <StatBar label="Health" value={hero.stats.health} max={3500} color="from-red-500 to-pink-500" />
                  <StatBar label="Mana" value={hero.stats.mana} max={2500} color="from-blue-500 to-cyan-500" />
                  <StatBar label="Attack" value={hero.stats.attack} max={1200} color="from-orange-500 to-red-500" />
                  <StatBar label="Defense" value={hero.stats.defense} max={1200} color="from-green-500 to-teal-500" />
                </div>

                {/* Element and Origin */}
                <div className="text-center text-xs space-y-1">
                  <div className="text-gray-400">
                    Element: <span className="text-cosmic-purple font-bold">{hero.element}</span>
                  </div>
                  <div className="text-gray-500 truncate">{hero.cosmicOrigin}</div>
                </div>

                {/* Flip Button */}
                <button
                  className="absolute bottom-3 right-3 w-8 h-8 bg-cosmic-purple/20 hover:bg-cosmic-purple/30 border border-cosmic-purple/30 rounded-full flex items-center justify-center transition-colors duration-200"
                  onClick={() => setFlipCard(isFlipped ? null : hero.id)}
                >
                  <Eye className="w-4 h-4 text-cosmic-purple" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Back Side */}
          <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180`}>
            <motion.div
              className={`relative w-full h-full bg-gradient-to-br ${hero.cardColor} p-1 rounded-2xl ${hero.glowColor} shadow-2xl`}
            >
              <div className="w-full h-full bg-gradient-to-br from-space-800 to-space-900 rounded-xl p-4 relative overflow-hidden">
                
                {/* Background Effects */}
                <div className={`absolute inset-0 bg-gradient-to-br ${hero.cardColor} opacity-10`} />
                
                {/* Header */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-white mb-1">{hero.name}</h3>
                  <p className="text-xs text-cosmic-gold">{hero.title}</p>
                </div>

                {/* Powers */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cosmic-purple" />
                    Cosmic Powers
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {hero.powers.slice(0, 2).map((power, index) => {
                      const Icon = power.icon
                      return (
                        <div key={index} className="flex items-start gap-2 p-2 bg-space-700/30 rounded-lg">
                          <div className={`w-6 h-6 rounded bg-gradient-to-br ${powerTypeColors[power.type]} p-1`}>
                            <Icon className="w-full h-full text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-white truncate">{power.name}</div>
                            <div className="text-xs text-gray-400 leading-tight">{power.description}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Passive Ability */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Gem className="w-4 h-4 text-cosmic-gold" />
                    Passive Ability
                  </h4>
                  <div className="p-3 bg-cosmic-gold/10 border border-cosmic-gold/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <hero.passiveAbility.icon className="w-4 h-4 text-cosmic-gold" />
                      <span className="text-sm font-semibold text-cosmic-gold">{hero.passiveAbility.name}</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-tight">{hero.passiveAbility.description}</p>
                  </div>
                </div>

                {/* Lore */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-cosmic-blue" />
                    Cosmic Lore
                  </h4>
                  <p className="text-xs text-gray-400 leading-tight max-h-16 overflow-y-auto">{hero.lore}</p>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-green-400 font-semibold mb-1">Strengths</div>
                    <ul className="space-y-1">
                      {hero.strengths.slice(0, 2).map((strength, index) => (
                        <li key={index} className="text-green-300 text-xs">• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-red-400 font-semibold mb-1">Weaknesses</div>
                    <ul className="space-y-1">
                      {hero.weaknesses.slice(0, 2).map((weakness, index) => (
                        <li key={index} className="text-red-300 text-xs">• {weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Flip Back Button */}
                <button
                  className="absolute bottom-2 right-2 w-6 h-6 bg-cosmic-purple/20 hover:bg-cosmic-purple/30 border border-cosmic-purple/30 rounded-full flex items-center justify-center transition-colors duration-200"
                  onClick={() => setFlipCard(null)}
                >
                  <Swords className="w-3 h-3 text-cosmic-purple" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <section className="py-24 bg-gradient-to-b from-space-900 to-space-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,69,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,215,0,0.1),transparent_50%)]" />
        
        {/* Floating Orbs */}
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            className={`absolute w-2 h-2 bg-gradient-to-r ${
              index % 2 === 0 ? 'from-cosmic-purple to-cosmic-blue' : 'from-cosmic-gold to-cosmic-purple'
            } rounded-full blur-sm`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-cosmic-purple/20 px-6 py-3 rounded-full border border-cosmic-purple/30 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <Crown className="w-5 h-5 text-cosmic-purple" />
            <span className="text-sm font-medium text-cosmic-purple">Legendary Cosmic Entities</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-cosmic-blue to-cosmic-purple bg-clip-text text-transparent mb-6">
            The Four
            <br />
            <span className="text-cosmic-gold">Cosmic Guardians</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Ancient beings of immense power, born from the cosmic forces that shaped the universe. 
            Each guardian represents a fundamental aspect of creation and destruction.
          </p>
        </motion.div>

        {/* Hero Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
          {cosmicHeroes.map((hero, index) => (
            <motion.div
              key={hero.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <HeroCard hero={hero} />
            </motion.div>
          ))}
        </div>

        {/* Power Details Modal */}
        <AnimatePresence>
          {selectedPower && (
            <motion.div
              className="fixed inset-0 bg-space-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPower(null)}
            >
              <motion.div
                className="bg-gradient-to-br from-space-800 to-space-900 border border-space-700 rounded-3xl p-8 max-w-md w-full"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Icon */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${powerTypeColors[selectedPower.type]} p-4 mb-6 mx-auto ${rarityGlow[selectedPower.rarity]} shadow-xl`}>
                  <selectedPower.icon className="w-full h-full text-white" />
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                    selectedPower.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    selectedPower.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    selectedPower.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {selectedPower.rarity.toUpperCase()} {selectedPower.type.toUpperCase()}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{selectedPower.name}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">{selectedPower.description}</p>
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {selectedPower.damage && (
                    <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <Swords className="w-6 h-6 text-red-400 mx-auto mb-2" />
                      <div className="text-xs text-gray-400">Damage</div>
                      <div className="text-xl font-bold text-red-400">{selectedPower.damage}</div>
                    </div>
                  )}
                  <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <Sparkles className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-xs text-gray-400">Mana Cost</div>
                    <div className="text-xl font-bold text-blue-400">{selectedPower.manaCost}</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <div className="text-xs text-gray-400">Cooldown</div>
                    <div className="text-xl font-bold text-yellow-400">{selectedPower.cooldown}t</div>
                  </div>
                  <div className="text-center p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <Star className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-xs text-gray-400">Element</div>
                    <div className="text-sm font-bold text-purple-400">{selectedPower.element}</div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  className="w-full py-3 bg-cosmic-purple hover:bg-cosmic-purple/80 text-white font-bold rounded-xl transition-colors duration-300"
                  onClick={() => setSelectedPower(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collection Overview */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-3xl p-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              Collect All 
              <span className="bg-gradient-to-r from-cosmic-purple to-cosmic-gold bg-clip-text text-transparent">
                Cosmic Guardians
              </span>
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Each legendary guardian possesses unique cosmic powers and centuries of battle experience. 
              Build your ultimate team and conquer the universe!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-cosmic-purple to-cosmic-blue hover:from-cosmic-blue hover:to-cosmic-purple text-white font-bold py-4 px-8 rounded-full transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Crown className="w-5 h-5" />
                Start Collection
              </motion.button>
              
              <motion.button 
                className="inline-flex items-center gap-3 bg-transparent border-2 border-cosmic-gold hover:bg-cosmic-gold hover:text-space-900 text-cosmic-gold font-bold py-4 px-8 rounded-full transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="w-5 h-5" />
                View All Powers
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom CSS for card flip effect */}
      <style jsx>{`
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  )
}