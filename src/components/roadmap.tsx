'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  CheckCircle, 
  Clock, 
  Zap, 
  Rocket, 
  Star,
  Gamepad2,
  Crown,
  Shield,
  Users,
  Globe,
  Brain,
  Sparkles
} from 'lucide-react'

interface RoadmapPhase {
  phase: string
  title: string
  status: 'completed' | 'in-progress' | 'planned' | 'future'
  timeline: string
  description: string
  features: {
    name: string
    completed: boolean
    icon: any
  }[]
  color: string
}

const roadmapData: RoadmapPhase[] = [
  {
    phase: "Phase 1",
    title: "Foundation",
    status: "completed",
    timeline: "Q3 2025",
    description: "Core infrastructure and basic game mechanics implementation",
    features: [
      { name: "Project Setup & Architecture", completed: true, icon: Rocket },
      { name: "Basic Smart Contract Implementation", completed: true, icon: Shield },
      { name: "AI Integration Framework", completed: true, icon: Brain },
      { name: "Core Frontend Components", completed: true, icon: Gamepad2 },
      { name: "MultiversX SDK Integration", completed: true, icon: Zap }
    ],
    color: "from-green-500 to-emerald-500"
  },
  {
    phase: "Phase 2",
    title: "Core Features",
    status: "in-progress",
    timeline: "Q4 2025",
    description: "Essential gameplay features and user experience enhancements",
    features: [
      { name: "Complete Hero Generation System", completed: true, icon: Crown },
      { name: "Combat Mechanics Implementation", completed: false, icon: Zap },
      { name: "NFT Marketplace Integration", completed: false, icon: Star },
      { name: "Multiplayer Functionality", completed: false, icon: Users },
      { name: "Achievement System", completed: false, icon: CheckCircle }
    ],
    color: "from-blue-500 to-cyan-500"
  },
  {
    phase: "Phase 3",
    title: "Advanced Features",
    status: "planned",
    timeline: "Q1 2026",
    description: "Advanced gaming mechanics and cross-chain functionality",
    features: [
      { name: "Cross-Chain Bridge Implementation", completed: false, icon: Globe },
      { name: "Advanced AI Features", completed: false, icon: Brain },
      { name: "Mobile Application", completed: false, icon: Gamepad2 },
      { name: "Community Features & Guilds", completed: false, icon: Users },
      { name: "Advanced Analytics Dashboard", completed: false, icon: Star }
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    phase: "Phase 4",
    title: "Expansion",
    status: "future",
    timeline: "Q2-Q3 2026",
    description: "Next-generation features and ecosystem expansion",
    features: [
      { name: "VR/AR Integration", completed: false, icon: Sparkles },
      { name: "Metaverse Compatibility", completed: false, icon: Globe },
      { name: "DeFi Integration", completed: false, icon: Zap },
      { name: "Governance Token Launch", completed: false, icon: Crown },
      { name: "Global Tournament System", completed: false, icon: Star }
    ],
    color: "from-amber-500 to-orange-500"
  }
]

const statusConfig = {
  completed: {
    icon: CheckCircle,
    color: "text-green-400",
    bg: "bg-green-500/20",
    border: "border-green-500/30",
    label: "Completed"
  },
  'in-progress': {
    icon: Clock,
    color: "text-blue-400",
    bg: "bg-blue-500/20",
    border: "border-blue-500/30",
    label: "In Progress"
  },
  planned: {
    icon: Zap,
    color: "text-purple-400",
    bg: "bg-purple-500/20",
    border: "border-purple-500/30",
    label: "Planned"
  },
  future: {
    icon: Rocket,
    color: "text-orange-400",
    bg: "bg-orange-500/20",
    border: "border-orange-500/30",
    label: "Future"
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    x: -50,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

export function Roadmap() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-24 bg-gradient-to-b from-space-900 to-space-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,69,255,0.1),transparent_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cosmic-purple/30 to-transparent" />
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
            className="inline-flex items-center gap-2 bg-cosmic-purple/20 px-4 py-2 rounded-full border border-cosmic-purple/30 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <Star className="w-4 h-4 text-cosmic-purple" />
            <span className="text-sm font-medium text-cosmic-purple">Development Roadmap</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-cosmic-blue to-cosmic-purple bg-clip-text text-transparent mb-6">
            Journey to the
            <br />
            <span className="text-cosmic-gold">Cosmic Future</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Follow our development journey as we build the most innovative blockchain RPG. 
            Each phase brings new features and capabilities to the cosmic universe.
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={ref} className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cosmic-purple via-cosmic-blue to-cosmic-gold transform md:-translate-x-0.5" />
          
          <motion.div
            className="space-y-12"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {roadmapData.map((phase, index) => {
              const StatusIcon = statusConfig[phase.status].icon
              const isEven = index % 2 === 0
              
              return (
                <motion.div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                    <motion.div 
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${phase.color} p-4 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                      <StatusIcon className="w-full h-full text-white" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className={`w-full md:w-5/12 ${
                    isEven ? 'md:pr-8 ml-20 md:ml-0' : 'md:pl-8 ml-20 md:ml-0 md:text-right'
                  }`}>
                    <motion.div
                      className="bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm border border-space-700/50 rounded-2xl p-8 group hover:border-cosmic-purple/30 transition-all duration-500"
                      whileHover={{ y: -5 }}
                    >
                      {/* Status Badge */}
                      <div className={`inline-flex items-center gap-2 ${statusConfig[phase.status].bg} ${statusConfig[phase.status].border} border px-3 py-1 rounded-full mb-4`}>
                        <StatusIcon className={`w-4 h-4 ${statusConfig[phase.status].color}`} />
                        <span className={`text-sm font-medium ${statusConfig[phase.status].color}`}>
                          {statusConfig[phase.status].label}
                        </span>
                      </div>

                      {/* Phase Info */}
                      <div className="mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <h3 className="text-2xl font-bold text-white group-hover:text-cosmic-purple transition-colors duration-300">
                            {phase.phase}: {phase.title}
                          </h3>
                          <span className="text-sm text-cosmic-gold font-semibold bg-cosmic-gold/10 px-3 py-1 rounded-full">
                            {phase.timeline}
                          </span>
                        </div>
                        <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                          {phase.description}
                        </p>
                      </div>

                      {/* Features List */}
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-white mb-4">Key Features:</h4>
                        {phase.features.map((feature, featureIndex) => {
                          const FeatureIcon = feature.icon
                          return (
                            <motion.div
                              key={featureIndex}
                              className="flex items-center gap-3"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * featureIndex }}
                            >
                              <div className={`w-8 h-8 rounded-lg ${feature.completed ? 'bg-green-500/20' : 'bg-gray-500/20'} p-2`}>
                                <FeatureIcon className={`w-full h-full ${feature.completed ? 'text-green-400' : 'text-gray-400'}`} />
                              </div>
                              <span className={`text-sm ${feature.completed ? 'text-green-300' : 'text-gray-400'} ${feature.completed ? 'line-through' : ''}`}>
                                {feature.name}
                              </span>
                              {feature.completed && (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              )}
                            </motion.div>
                          )
                        })}
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">Progress</span>
                          <span className="text-sm text-cosmic-purple font-semibold">
                            {Math.round((phase.features.filter(f => f.completed).length / phase.features.length) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-space-700 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full bg-gradient-to-r ${phase.color}`}
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${(phase.features.filter(f => f.completed).length / phase.features.length) * 100}%`
                            }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-space-800/50 to-space-900/50 backdrop-blur-sm border border-space-700/50 rounded-3xl p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Want to Shape the 
              <span className="bg-gradient-to-r from-cosmic-purple to-cosmic-gold bg-clip-text text-transparent">
                Future of Gaming?
              </span>
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join our community and help us build the most ambitious blockchain RPG. 
              Your feedback and participation drive our development.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                className="
                  inline-flex items-center justify-center gap-3 
                  bg-gradient-to-r from-cosmic-purple to-cosmic-blue
                  hover:from-cosmic-blue hover:to-cosmic-purple
                  text-white font-bold py-4 px-8 rounded-full
                  transition-all duration-300 transform hover:scale-105
                  shadow-lg hover:shadow-cosmic-purple/25
                "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Users className="w-5 h-5" />
                Join Community
              </motion.button>
              
              <motion.button 
                className="
                  inline-flex items-center justify-center gap-3 
                  bg-transparent border-2 border-cosmic-gold
                  hover:bg-cosmic-gold hover:text-space-900
                  text-cosmic-gold font-bold py-4 px-8 rounded-full
                  transition-all duration-300 transform hover:scale-105
                "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Star className="w-5 h-5" />
                Follow Updates
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}