'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Hero,
  HeroClass,
  HeroRarity,
  BattleLog,
  Ability,
  calculateHeroStats,
  calculateTotalPower,
  calculateHpMp,
  generateRandomStats,
  saveHeroToLocalStorage,
  getHeroesFromLocalStorage,
  deleteHeroFromLocalStorage,
  GameError,
  handleGameError
} from '@/lib/game-utils'

// Zustand Store Types
interface GameState {
  // Player Data
  playerWallet: string | null
  playerHeroes: Hero[]
  selectedHero: Hero | null
  playerStats: {
    level: number
    experience: number
    gamesWon: number
    gamesLost: number
    totalEarnings: number
    achievementsUnlocked: number
  }
  
  // Game Settings
  settings: {
    soundEnabled: boolean
    musicEnabled: boolean
    animationSpeed: number
    autoSave: boolean
    difficulty: 'easy' | 'normal' | 'hard'
    language: string
  }
  
  // UI State
  isLoading: boolean
  error: string | null
  notifications: Notification[]
  
  // Actions
  setPlayerWallet: (wallet: string | null) => void
  addHero: (hero: Hero) => void
  updateHero: (heroId: string, updates: Partial<Hero>) => void
  deleteHero: (heroId: string) => void
  setSelectedHero: (hero: Hero | null) => void
  updatePlayerStats: (updates: Partial<GameState['playerStats']>) => void
  updateSettings: (updates: Partial<GameState['settings']>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: number
  duration?: number
}

// Zustand Store
export const useGameStore = create<GameState>()()
  persist(
    (set, get) => ({
      // Initial State
      playerWallet: null,
      playerHeroes: [],
      selectedHero: null,
      playerStats: {
        level: 1,
        experience: 0,
        gamesWon: 0,
        gamesLost: 0,
        totalEarnings: 0,
        achievementsUnlocked: 0
      },
      settings: {
        soundEnabled: true,
        musicEnabled: true,
        animationSpeed: 1,
        autoSave: true,
        difficulty: 'normal',
        language: 'en'
      },
      isLoading: false,
      error: null,
      notifications: [],

      // Actions
      setPlayerWallet: (wallet) => set({ playerWallet: wallet }),
      
      addHero: (hero) => {
        set((state) => ({ 
          playerHeroes: [...state.playerHeroes, hero]
        }))
        saveHeroToLocalStorage(hero)
      },
      
      updateHero: (heroId, updates) => {
        set((state) => ({
          playerHeroes: state.playerHeroes.map(hero => 
            hero.id === heroId ? { ...hero, ...updates } : hero
          ),
          selectedHero: state.selectedHero?.id === heroId 
            ? { ...state.selectedHero, ...updates }
            : state.selectedHero
        }))
        
        const updatedHero = get().playerHeroes.find(h => h.id === heroId)
        if (updatedHero) {
          saveHeroToLocalStorage(updatedHero)
        }
      },
      
      deleteHero: (heroId) => {
        set((state) => ({
          playerHeroes: state.playerHeroes.filter(hero => hero.id !== heroId),
          selectedHero: state.selectedHero?.id === heroId ? null : state.selectedHero
        }))
        deleteHeroFromLocalStorage(heroId)
      },
      
      setSelectedHero: (hero) => set({ selectedHero: hero }),
      
      updatePlayerStats: (updates) => {
        set((state) => ({
          playerStats: { ...state.playerStats, ...updates }
        }))
      },
      
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates }
        }))
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: Date.now()
        }
        
        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }))
        
        // Auto-remove after duration
        if (notification.duration !== undefined) {
          setTimeout(() => {
            get().removeNotification(newNotification.id)
          }, notification.duration)
        }
      },
      
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }))
      },
      
      clearNotifications: () => set({ notifications: [] })
    }),
    {
      name: 'cosmic-legends-game-state',
      partialize: (state) => ({
        playerWallet: state.playerWallet,
        playerStats: state.playerStats,
        settings: state.settings
      })
    }
  )
)

// Custom Hooks
export function useHeroes() {
  const { playerHeroes, addHero, updateHero, deleteHero, setError, setLoading } = useGameStore()
  
  const createHero = useCallback(async (
    heroClass: HeroClass,
    rarity: HeroRarity,
    aiPrompt?: string,
    customName?: string
  ) => {
    try {
      setLoading(true)
      setError(null)
      
      const stats = generateRandomStats(heroClass, rarity)
      const { hp, mp } = calculateHpMp(stats, 1)
      
      let heroData: Partial<Hero> = {
        name: customName || `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} ${heroClass.charAt(0).toUpperCase() + heroClass.slice(1)}`
      }
      
      // Generate AI data if API key is available
      if (aiPrompt && process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY) {
        try {
          const { generateHeroWithAI } = await import('@/lib/game-utils')
          heroData = await generateHeroWithAI(
            aiPrompt,
            heroClass,
            rarity,
            process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY
          )
        } catch (aiError) {
          console.warn('AI generation failed, using fallback:', aiError)
        }
      }
      
      const newHero: Hero = {
        id: `hero-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: heroData.name || `Cosmic ${heroClass.charAt(0).toUpperCase() + heroClass.slice(1)}`,
        class: heroClass,
        level: 1,
        experience: 0,
        rarity,
        stats,
        currentHp: hp,
        maxHp: hp,
        currentMp: mp,
        maxMp: mp,
        element: 'neutral',
        abilities: [], // Will be populated based on class
        equipment: {},
        achievements: [],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        owner: 'player',
        metadata: heroData.metadata || {
          description: `A ${rarity} ${heroClass} from the cosmic realm`,
          backstory: 'A mysterious hero from the depths of space.',
          visualTraits: {
            bodyType: 'athletic',
            skinColor: 'pale',
            hairColor: 'dark',
            eyeColor: 'blue',
            height: 'average',
            build: 'balanced'
          },
          personality: {
            primary: 'brave',
            secondary: 'loyal',
            alignment: 'good'
          },
          birthplace: 'Unknown System',
          favoriteWeapon: 'Cosmic Blade'
        }
      }
      
      addHero(newHero)
      return newHero
    } catch (error) {
      const errorMessage = handleGameError(error)
      setError(errorMessage)
      throw new GameError(errorMessage, 'HERO_CREATION_FAILED', { heroClass, rarity })
    } finally {
      setLoading(false)
    }
  }, [addHero, setError, setLoading])
  
  const levelUpHero = useCallback((heroId: string) => {
    const hero = playerHeroes.find(h => h.id === heroId)
    if (!hero) return
    
    const newLevel = hero.level + 1
    const newStats = calculateHeroStats(hero.stats, newLevel, hero.rarity)
    const { hp, mp } = calculateHpMp(newStats, newLevel)
    
    updateHero(heroId, {
      level: newLevel,
      stats: newStats,
      maxHp: hp,
      currentHp: hp,
      maxMp: mp,
      currentMp: mp
    })
  }, [playerHeroes, updateHero])
  
  const sortedHeroes = useMemo(() => {
    return [...playerHeroes].sort((a, b) => {
      // Sort by rarity first, then by level, then by total power
      const rarityOrder = { mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1 }
      const rarityDiff = rarityOrder[b.rarity] - rarityOrder[a.rarity]
      
      if (rarityDiff !== 0) return rarityDiff
      
      const levelDiff = b.level - a.level
      if (levelDiff !== 0) return levelDiff
      
      return calculateTotalPower(b.stats) - calculateTotalPower(a.stats)
    })
  }, [playerHeroes])
  
  return {
    heroes: sortedHeroes,
    createHero,
    levelUpHero,
    updateHero,
    deleteHero
  }
}

export function useBattle() {
  const [battleState, setBattleState] = useState({
    phase: 'preparation' as 'preparation' | 'combat' | 'victory' | 'defeat',
    currentTurn: 'player' as 'player' | 'enemy',
    turnNumber: 0,
    battleLog: [] as BattleLog[],
    playerHero: null as Hero | null,
    enemyHero: null as Hero | null,
    turnTimer: 30,
    isAnimating: false
  })
  
  const { updatePlayerStats, addNotification } = useGameStore()
  
  const startBattle = useCallback((playerHero: Hero, enemyHero: Hero) => {
    setBattleState({
      phase: 'combat',
      currentTurn: 'player',
      turnNumber: 1,
      battleLog: [{
        id: Date.now().toString(),
        message: 'Battle begins! Choose your first move wisely.',
        type: 'system',
        timestamp: Date.now()
      }],
      playerHero: { ...playerHero },
      enemyHero: { ...enemyHero },
      turnTimer: 30,
      isAnimating: false
    })
  }, [])
  
  const endBattle = useCallback((winner: 'player' | 'enemy') => {
    setBattleState(prev => ({ ...prev, phase: winner === 'player' ? 'victory' : 'defeat' }))
    
    if (winner === 'player') {
      updatePlayerStats({
        gamesWon: useGameStore.getState().playerStats.gamesWon + 1,
        totalEarnings: useGameStore.getState().playerStats.totalEarnings + 50
      })
      
      addNotification({
        type: 'success',
        title: 'Victory!',
        message: 'You won the battle and earned 50 EGLD!',
        duration: 5000
      })
    } else {
      updatePlayerStats({
        gamesLost: useGameStore.getState().playerStats.gamesLost + 1
      })
      
      addNotification({
        type: 'error',
        title: 'Defeat',
        message: 'Your hero fought bravely but was defeated.',
        duration: 5000
      })
    }
  }, [updatePlayerStats, addNotification])
  
  const useAbility = useCallback((ability: Ability, target: Hero) => {
    if (battleState.isAnimating || !battleState.playerHero) return
    
    setBattleState(prev => ({ ...prev, isAnimating: true }))
    
    // Calculate damage/healing
    let effectValue = ability.damage
    
    setTimeout(() => {
      setBattleState(prev => ({
        ...prev,
        isAnimating: false,
        currentTurn: prev.currentTurn === 'player' ? 'enemy' : 'player',
        turnNumber: prev.turnNumber + (prev.currentTurn === 'enemy' ? 1 : 0),
        turnTimer: 30,
        battleLog: [...prev.battleLog, {
          id: Date.now().toString(),
          message: `${prev.playerHero?.name} used ${ability.name}!`,
          type: 'attack',
          timestamp: Date.now()
        }]
      }))
    }, 1000)
  }, [battleState.isAnimating, battleState.playerHero])
  
  return {
    battleState,
    startBattle,
    endBattle,
    useAbility,
    setBattleState
  }
}

export function useMarketplace() {
  const [marketplaceState, setMarketplaceState] = useState({
    listings: [] as any[],
    filters: {
      search: '',
      class: 'all' as HeroClass | 'all',
      rarity: 'all' as HeroRarity | 'all',
      priceRange: [0, 1000] as [number, number],
      sortBy: 'newest' as 'newest' | 'oldest' | 'price-low' | 'price-high' | 'rarity'
    },
    isLoading: false,
    error: null
  })
  
  const { addNotification } = useGameStore()
  
  const buyHero = useCallback(async (heroId: string, price: number) => {
    try {
      setMarketplaceState(prev => ({ ...prev, isLoading: true, error: null }))
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      addNotification({
        type: 'success',
        title: 'Purchase Successful!',
        message: `Hero acquired for ${price} EGLD`,
        duration: 5000
      })
      
      return true
    } catch (error) {
      const errorMessage = handleGameError(error)
      setMarketplaceState(prev => ({ ...prev, error: errorMessage }))
      
      addNotification({
        type: 'error',
        title: 'Purchase Failed',
        message: errorMessage,
        duration: 5000
      })
      
      return false
    } finally {
      setMarketplaceState(prev => ({ ...prev, isLoading: false }))
    }
  }, [addNotification])
  
  const sellHero = useCallback(async (heroId: string, price: number) => {
    try {
      setMarketplaceState(prev => ({ ...prev, isLoading: true, error: null }))
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      addNotification({
        type: 'success',
        title: 'Listing Created!',
        message: `Hero listed for ${price} EGLD`,
        duration: 5000
      })
      
      return true
    } catch (error) {
      const errorMessage = handleGameError(error)
      setMarketplaceState(prev => ({ ...prev, error: errorMessage }))
      
      addNotification({
        type: 'error',
        title: 'Listing Failed',
        message: errorMessage,
        duration: 5000
      })
      
      return false
    } finally {
      setMarketplaceState(prev => ({ ...prev, isLoading: false }))
    }
  }, [addNotification])
  
  return {
    marketplaceState,
    setMarketplaceState,
    buyHero,
    sellHero
  }
}

export function useWallet() {
  const { playerWallet, setPlayerWallet } = useGameStore()
  const [isConnecting, setIsConnecting] = useState(false)
  const [balance, setBalance] = useState<number>(0)
  
  const connectWallet = useCallback(async () => {
    try {
      setIsConnecting(true)
      
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockWallet = `erd1${Math.random().toString(36).substr(2, 32)}`
      setPlayerWallet(mockWallet)
      setBalance(Math.floor(Math.random() * 1000) + 100)
      
      return mockWallet
    } catch (error) {
      throw new GameError('Failed to connect wallet', 'WALLET_CONNECTION_FAILED')
    } finally {
      setIsConnecting(false)
    }
  }, [setPlayerWallet])
  
  const disconnectWallet = useCallback(() => {
    setPlayerWallet(null)
    setBalance(0)
  }, [setPlayerWallet])
  
  const isConnected = Boolean(playerWallet)
  
  return {
    wallet: playerWallet,
    balance,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet
  }
}

export function useNotifications() {
  const { notifications, addNotification, removeNotification, clearNotifications } = useGameStore()
  
  const showSuccess = useCallback((title: string, message: string, duration = 5000) => {
    addNotification({ type: 'success', title, message, duration })
  }, [addNotification])
  
  const showError = useCallback((title: string, message: string, duration = 8000) => {
    addNotification({ type: 'error', title, message, duration })
  }, [addNotification])
  
  const showWarning = useCallback((title: string, message: string, duration = 6000) => {
    addNotification({ type: 'warning', title, message, duration })
  }, [addNotification])
  
  const showInfo = useCallback((title: string, message: string, duration = 4000) => {
    addNotification({ type: 'info', title, message, duration })
  }, [addNotification])
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

export function useGameSettings() {
  const { settings, updateSettings } = useGameStore()
  
  const toggleSound = useCallback(() => {
    updateSettings({ soundEnabled: !settings.soundEnabled })
  }, [settings.soundEnabled, updateSettings])
  
  const toggleMusic = useCallback(() => {
    updateSettings({ musicEnabled: !settings.musicEnabled })
  }, [settings.musicEnabled, updateSettings])
  
  const setAnimationSpeed = useCallback((speed: number) => {
    updateSettings({ animationSpeed: Math.max(0.5, Math.min(3, speed)) })
  }, [updateSettings])
  
  const setDifficulty = useCallback((difficulty: 'easy' | 'normal' | 'hard') => {
    updateSettings({ difficulty })
  }, [updateSettings])
  
  return {
    settings,
    updateSettings,
    toggleSound,
    toggleMusic,
    setAnimationSpeed,
    setDifficulty
  }
}

// Performance Hooks
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error)
      return initialValue
    }
  })
  
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])
  
  return [storedValue, setValue] as const
}

// Animation Hooks
export function useCountUp(end: number, duration: number = 2000, startOnMount: boolean = true) {
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  
  const start = useCallback(() => {
    setIsAnimating(true)
    const startTime = Date.now()
    const startValue = count
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const currentCount = Math.floor(startValue + (end - startValue) * easedProgress)
      
      setCount(currentCount)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }
    
    requestAnimationFrame(animate)
  }, [count, duration, end])
  
  useEffect(() => {
    if (startOnMount) {
      start()
    }
  }, [start, startOnMount])
  
  return { count, isAnimating, start }
}

// Validation Hooks
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: { [K in keyof T]?: (value: T[K]) => string | null }
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  
  const validate = useCallback((fieldName?: keyof T) => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    
    const fieldsToValidate = fieldName ? [fieldName] : Object.keys(validationRules) as (keyof T)[]
    
    fieldsToValidate.forEach(field => {
      const rule = validationRules[field]
      if (rule) {
        const error = rule(values[field])
        if (error) {
          newErrors[field] = error
        }
      }
    })
    
    if (fieldName) {
      setErrors(prev => ({ ...prev, ...newErrors }))
    } else {
      setErrors(newErrors)
    }
    
    return Object.keys(newErrors).length === 0
  }, [values, validationRules])
  
  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }))
    setTouched(prev => ({ ...prev, [field]: true }))
    
    // Validate this field
    setTimeout(() => validate(field), 0)
  }, [validate])
  
  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])
  
  const isValid = Object.keys(errors).length === 0
  const hasErrors = Object.keys(errors).length > 0
  
  return {
    values,
    errors,
    touched,
    isValid,
    hasErrors,
    setValue,
    validate,
    resetForm
  }
}