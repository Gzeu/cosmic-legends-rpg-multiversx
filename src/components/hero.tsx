'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Play, Zap, Shield, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            COSMIC LEGENDS
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold mb-8 text-blue-200">
            AI-Powered MultiversX RPG
          </h2>
        </motion.div>

        <motion.p
          className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-gray-300 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Experience the future of blockchain gaming with dynamic NFTs that evolve through AI, 
          cross-chain interoperability, and immersive gameplay on the MultiversX ecosystem.
        </motion.p>

        {/* Feature highlights */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur rounded-lg px-4 py-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur rounded-lg px-4 py-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span>Dynamic NFTs</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur rounded-lg px-4 py-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span>Cross-Chain</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            href="/game"
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 cosmic-glow"
          >
            <Play className="w-5 h-5" />
            <span>Start Playing</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/marketplace"
            className="group bg-white/10 backdrop-blur hover:bg-white/20 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 border border-white/20"
          >
            <span>Explore NFTs</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">10K+</div>
            <div className="text-gray-300">Players</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">5K+</div>
            <div className="text-gray-300">NFTs Minted</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">50+</div>
            <div className="text-gray-300">Tournaments</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">100+</div>
            <div className="text-gray-300">AI Evolutions</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
