'use client'

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { 
  Users, 
  Crown, 
  Zap, 
  Trophy, 
  Coins, 
  Sword,
  Shield,
  Star
} from 'lucide-react'

interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
  prefix?: string
}

function AnimatedCounter({ value, duration = 2, suffix = '', prefix = '' }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: duration * 1000 })
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [motionValue, isInView, value])

  useEffect(() => {
    springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = prefix + Math.floor(latest).toLocaleString() + suffix
      }
    })
  }, [springValue, prefix, suffix])

  return <span ref={ref} />
}

const stats = [
  {
    icon: Users,
    label: 'Active Players',
    value: 15420,
    suffix: '+',
    description: 'Growing community of cosmic adventurers',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Crown,
    label: 'Heroes Created',
    value: 8750,
    suffix: '',
    description: 'Unique AI-generated heroes in the cosmos',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Zap,
    label: 'Battles Fought',
    value: 42300,
    suffix: '+',
    description: 'Epic confrontations across the universe',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Trophy,
    label: 'Tournaments Won',
    value: 1250,
    suffix: '',
    description: 'Champions crowned in cosmic arenas',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: Coins,
    label: 'EGLD Traded',
    value: 125000,
    suffix: '+',
    description: 'Total value exchanged in marketplace',
    color: 'from-amber-500 to-yellow-500'
  },
  {
    icon: Sword,
    label: 'Legendary Items',
    value: 3400,
    suffix: '',
    description: 'Rare artifacts discovered by players',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: Shield,
    label: 'Guilds Active',
    value: 890,
    suffix: '+',
    description: 'Player organizations conquering realms',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Star,
    label: 'Achievements',
    value: 67500,
    suffix: '+',
    description: 'Milestones unlocked by the community',
    color: 'from-violet-500 to-purple-500'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
}

export function GameStats() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-space-950 to-space-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,69,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,69,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Floating Orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cosmic-purple/20 to-transparent rounded-full blur-xl"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-cosmic-blue/20 to-transparent rounded-full blur-xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2, duration: 8 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-cosmic-gold/20 to-transparent rounded-full blur-xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 4, duration: 10 }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-cosmic-gold/20 px-4 py-2 rounded-full border border-cosmic-gold/30 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <Trophy className="w-4 h-4 text-cosmic-gold" />
            <span className="text-sm font-medium text-cosmic-gold">Live Statistics</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-cosmic-gold to-cosmic-purple bg-clip-text text-transparent mb-6">
            Cosmic Universe
            <br />
            <span className="text-cosmic-blue">By The Numbers</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of players in the most ambitious blockchain RPG ever created. 
            These numbers represent our thriving cosmic community.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                className="group relative"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-2xl p-8 group-hover:border-cosmic-purple/30 transition-all duration-500">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Glow Effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} p-4 mb-6 mx-auto`}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-full h-full text-white" />
                    </motion.div>
                    
                    {/* Number */}
                    <div className="text-center mb-4">
                      <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                        <AnimatedCounter 
                          value={stat.value} 
                          suffix={stat.suffix}
                          duration={2.5}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-300 group-hover:text-white transition-colors duration-300">
                        {stat.label}
                      </h3>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-400 text-center leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {stat.description}
                    </p>
                  </div>

                  {/* Floating Particles */}
                  <motion.div 
                    className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-60"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-space-800/50 to-space-900/50 backdrop-blur-sm border border-space-700/50 rounded-3xl p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Join the 
              <span className="bg-gradient-to-r from-cosmic-purple to-cosmic-gold bg-clip-text text-transparent">
                Cosmic Revolution?
              </span>
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Be part of the next generation of blockchain gaming. Create your hero, 
              build your legend, and earn rewards in the cosmic universe.
            </p>
            
            <motion.button 
              className="
                inline-flex items-center gap-3 
                bg-gradient-to-r from-cosmic-purple to-cosmic-gold
                hover:from-cosmic-gold hover:to-cosmic-purple
                text-white font-bold py-4 px-8 rounded-full
                transition-all duration-300 transform hover:scale-105
                shadow-lg hover:shadow-cosmic-purple/25
              "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Crown className="w-5 h-5" />
              Create Your Hero
              <motion.div
                className="w-2 h-2 bg-white rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}