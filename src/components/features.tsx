'use client'

import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Shield, 
  Zap, 
  Crown, 
  Gamepad2, 
  Trophy,
  Users,
  Globe,
  Brain,
  Coins
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Generated Heroes',
    description: 'Unique characters created with advanced AI, each with distinctive abilities, backstories, and visual designs.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Shield,
    title: 'MultiversX Blockchain',
    description: 'Built on the secure and fast MultiversX network, ensuring true ownership and lightning-fast transactions.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Sparkles,
    title: 'Dynamic NFTs',
    description: 'Heroes that evolve and change based on gameplay achievements, creating truly living digital assets.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Globe,
    title: 'Cross-Chain Support',
    description: 'Seamless interoperability across multiple blockchain networks for maximum accessibility.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Zap,
    title: 'Advanced Combat',
    description: 'Strategic turn-based battles with elemental affinities, combo systems, and skill trees.',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: Crown,
    title: 'Epic Quests',
    description: 'AI-generated storylines and adventures that adapt to your choices and hero development.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Trophy,
    title: 'Achievement System',
    description: 'Comprehensive progression system with rewards, badges, and exclusive content unlocks.',
    color: 'from-amber-500 to-yellow-500'
  },
  {
    icon: Users,
    title: 'Multiplayer Battles',
    description: 'Real-time PvP combat, guilds, tournaments, and cooperative raid missions.',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    icon: Gamepad2,
    title: 'Immersive Gameplay',
    description: 'Rich 3D environments, cinematic animations, and engaging sound design.',
    color: 'from-violet-500 to-purple-500'
  },
  {
    icon: Coins,
    title: 'Play-to-Earn',
    description: 'Earn valuable tokens and NFTs through gameplay, trading, and competitive achievements.',
    color: 'from-emerald-500 to-teal-500'
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
    y: 30,
    scale: 0.95
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

export function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-space-900 to-space-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-cosmic-purple/20 px-4 py-2 rounded-full border border-cosmic-purple/30 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <Sparkles className="w-4 h-4 text-cosmic-purple" />
            <span className="text-sm font-medium text-cosmic-purple">Game Features</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-cosmic-blue to-cosmic-purple bg-clip-text text-transparent mb-6">
            Revolutionary Gaming
            <br />
            <span className="text-cosmic-gold">Experience</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover the next generation of blockchain gaming with cutting-edge AI technology, 
            immersive gameplay, and true digital ownership.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                className={`
                  group relative overflow-hidden
                  bg-gradient-to-br from-space-800/50 to-space-900/50 
                  backdrop-blur-sm border border-space-700/50
                  rounded-2xl p-6 hover:border-cosmic-purple/30
                  transition-all duration-300
                  ${index < 5 ? 'lg:col-span-1' : 'md:col-span-1 lg:col-span-1'}
                `}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300, damping: 10 }
                }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div 
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-4`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <Icon className="w-full h-full text-white" />
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cosmic-purple transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Floating Particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-cosmic-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-4 w-1 h-1 bg-cosmic-purple rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button 
            className="
              inline-flex items-center gap-3 
              bg-gradient-to-r from-cosmic-purple to-cosmic-blue
              hover:from-cosmic-blue hover:to-cosmic-purple
              text-white font-bold py-4 px-8 rounded-full
              transition-all duration-300 transform hover:scale-105
              shadow-lg hover:shadow-cosmic-purple/25
            "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Gamepad2 className="w-5 h-5" />
            Start Your Adventure
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}