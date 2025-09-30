import { GoogleGenerativeAI } from '@google/generative-ai'

// Types
export interface Hero {
  id: string
  name: string
  class: HeroClass
  level: number
  experience: number
  rarity: HeroRarity
  stats: HeroStats
  currentHp: number
  maxHp: number
  currentMp: number
  maxMp: number
  element: Element
  abilities: Ability[]
  equipment: Equipment
  achievements: string[]
  createdAt: string
  lastActive: string
  owner: string
  nftId?: string
  metadata: HeroMetadata
}

export interface HeroStats {
  strength: number
  intelligence: number
  agility: number
  vitality: number
  luck: number
  charisma: number
}

export interface HeroMetadata {
  description: string
  backstory: string
  visualTraits: {
    bodyType: string
    skinColor: string
    hairColor: string
    eyeColor: string
    height: string
    build: string
  }
  personality: {
    primary: string
    secondary: string
    alignment: 'good' | 'neutral' | 'evil'
  }
  birthplace: string
  favoriteWeapon: string
}

export interface Ability {
  id: string
  name: string
  description: string
  damage: number
  healing: number
  mpCost: number
  cooldown: number
  currentCooldown: number
  element: Element
  type: AbilityType
  targetType: 'self' | 'enemy' | 'all-enemies' | 'all-allies'
  effects: StatusEffect[]
  requirements: {
    level: number
    stats?: Partial<HeroStats>
  }
}

export interface Equipment {
  weapon?: Item
  armor?: Item
  helmet?: Item
  boots?: Item
  accessory?: Item
}

export interface Item {
  id: string
  name: string
  type: ItemType
  rarity: HeroRarity
  stats: Partial<HeroStats>
  abilities: string[]
  description: string
  value: number
  durability: number
  maxDurability: number
}

export interface StatusEffect {
  id: string
  name: string
  description: string
  duration: number
  type: 'buff' | 'debuff'
  stats: Partial<HeroStats>
}

export type HeroClass = 'warrior' | 'mage' | 'ranger' | 'guardian' | 'assassin' | 'paladin'
export type HeroRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
export type Element = 'fire' | 'water' | 'earth' | 'air' | 'light' | 'dark' | 'neutral'
export type AbilityType = 'attack' | 'defend' | 'heal' | 'special' | 'ultimate'
export type ItemType = 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory' | 'consumable'

// Constants
export const HERO_CLASSES = {
  warrior: {
    name: 'Cosmic Warrior',
    description: 'Masters of physical combat with exceptional strength and defense',
    baseStats: { strength: 8, intelligence: 3, agility: 5, vitality: 7, luck: 4, charisma: 5 },
    primaryElement: 'fire' as Element,
    startingAbilities: ['slash', 'shield-bash', 'war-cry']
  },
  mage: {
    name: 'Astral Mage',
    description: 'Wielders of cosmic magic with devastating spell-casting abilities',
    baseStats: { strength: 2, intelligence: 9, agility: 4, vitality: 4, luck: 6, charisma: 7 },
    primaryElement: 'water' as Element,
    startingAbilities: ['magic-missile', 'mana-shield', 'fireball']
  },
  ranger: {
    name: 'Void Ranger',
    description: 'Swift hunters with unmatched agility and precision',
    baseStats: { strength: 6, intelligence: 5, agility: 9, vitality: 5, luck: 7, charisma: 6 },
    primaryElement: 'air' as Element,
    startingAbilities: ['arrow-shot', 'stealth', 'multi-shot']
  },
  guardian: {
    name: 'Stellar Guardian',
    description: 'Ultimate defenders with massive vitality and protective abilities',
    baseStats: { strength: 6, intelligence: 4, agility: 3, vitality: 9, luck: 5, charisma: 8 },
    primaryElement: 'earth' as Element,
    startingAbilities: ['taunt', 'healing-aura', 'fortress']
  },
  assassin: {
    name: 'Shadow Assassin',
    description: 'Masters of stealth and critical strikes',
    baseStats: { strength: 7, intelligence: 6, agility: 9, vitality: 4, luck: 8, charisma: 3 },
    primaryElement: 'dark' as Element,
    startingAbilities: ['backstab', 'vanish', 'poison-blade']
  },
  paladin: {
    name: 'Divine Paladin',
    description: 'Holy warriors blessed with healing and protective powers',
    baseStats: { strength: 7, intelligence: 6, agility: 4, vitality: 6, luck: 5, charisma: 9 },
    primaryElement: 'light' as Element,
    startingAbilities: ['holy-strike', 'bless', 'divine-protection']
  }
}

export const RARITY_MULTIPLIERS = {
  common: 1.0,
  rare: 1.2,
  epic: 1.5,
  legendary: 2.0,
  mythic: 2.5
}

export const ELEMENT_ADVANTAGES = {
  fire: { weak: 'water', strong: 'earth' },
  water: { weak: 'earth', strong: 'fire' },
  earth: { weak: 'air', strong: 'water' },
  air: { weak: 'fire', strong: 'earth' },
  light: { weak: 'dark', strong: 'neutral' },
  dark: { weak: 'light', strong: 'neutral' },
  neutral: { weak: null, strong: null }
}

// Utility Functions
export function calculateHeroStats(baseStats: HeroStats, level: number, rarity: HeroRarity): HeroStats {
  const multiplier = RARITY_MULTIPLIERS[rarity]
  const levelBonus = Math.floor(level / 5) // +1 to all stats every 5 levels
  
  return {
    strength: Math.floor((baseStats.strength * multiplier) + levelBonus),
    intelligence: Math.floor((baseStats.intelligence * multiplier) + levelBonus),
    agility: Math.floor((baseStats.agility * multiplier) + levelBonus),
    vitality: Math.floor((baseStats.vitality * multiplier) + levelBonus),
    luck: Math.floor((baseStats.luck * multiplier) + levelBonus),
    charisma: Math.floor((baseStats.charisma * multiplier) + levelBonus)
  }
}

export function calculateTotalPower(stats: HeroStats): number {
  return Object.values(stats).reduce((total, stat) => total + stat, 0)
}

export function calculateHpMp(stats: HeroStats, level: number): { hp: number, mp: number } {
  const hp = (stats.vitality * 10) + (level * 5)
  const mp = (stats.intelligence * 8) + (level * 3)
  
  return { hp, mp }
}

export function getExperienceForNextLevel(currentLevel: number): number {
  return Math.floor(100 * Math.pow(1.5, currentLevel - 1))
}

export function calculateLevelFromExperience(experience: number): number {
  let level = 1
  let requiredExp = 0
  
  while (requiredExp <= experience) {
    level++
    requiredExp += getExperienceForNextLevel(level - 1)
  }
  
  return level - 1
}

export function getRarityFromRoll(roll: number): HeroRarity {
  if (roll >= 99.5) return 'mythic'    // 0.5%
  if (roll >= 97) return 'legendary'   // 2.5%
  if (roll >= 85) return 'epic'        // 12%
  if (roll >= 60) return 'rare'        // 25%
  return 'common'                      // 60%
}

export function calculateElementalDamage(
  baseDamage: number,
  attackerElement: Element,
  defenderElement: Element
): number {
  const advantage = ELEMENT_ADVANTAGES[attackerElement]
  
  if (advantage.strong === defenderElement) {
    return Math.floor(baseDamage * 1.25) // 25% bonus
  } else if (advantage.weak === defenderElement) {
    return Math.floor(baseDamage * 0.8)  // 20% penalty
  }
  
  return baseDamage
}

export function generateRandomStats(heroClass: HeroClass, rarity: HeroRarity): HeroStats {
  const baseStats = HERO_CLASSES[heroClass].baseStats
  const multiplier = RARITY_MULTIPLIERS[rarity]
  
  // Add some randomness (±10%)
  const variance = 0.1
  
  return {
    strength: Math.floor(baseStats.strength * multiplier * (1 + (Math.random() - 0.5) * variance)),
    intelligence: Math.floor(baseStats.intelligence * multiplier * (1 + (Math.random() - 0.5) * variance)),
    agility: Math.floor(baseStats.agility * multiplier * (1 + (Math.random() - 0.5) * variance)),
    vitality: Math.floor(baseStats.vitality * multiplier * (1 + (Math.random() - 0.5) * variance)),
    luck: Math.floor(baseStats.luck * multiplier * (1 + (Math.random() - 0.5) * variance)),
    charisma: Math.floor(baseStats.charisma * multiplier * (1 + (Math.random() - 0.5) * variance))
  }
}

// AI Generation Functions
export async function generateHeroWithAI(
  prompt: string,
  heroClass: HeroClass,
  rarity: HeroRarity,
  apiKey: string
): Promise<Partial<Hero>> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const enhancedPrompt = `
      Generate a unique cosmic RPG hero based on this description: "${prompt}"
      
      Hero Details:
      - Class: ${heroClass}
      - Rarity: ${rarity}
      - Setting: Cosmic/Space fantasy universe
      
      Please provide a JSON response with:
      {
        "name": "Hero name (2-3 words, cosmic/space themed)",
        "description": "Brief description of the hero (1-2 sentences)",
        "backstory": "Detailed backstory (2-3 sentences)",
        "visualTraits": {
          "bodyType": "muscular/lean/stocky/tall",
          "skinColor": "color description",
          "hairColor": "color description",
          "eyeColor": "color description",
          "height": "short/average/tall/giant",
          "build": "description"
        },
        "personality": {
          "primary": "main personality trait",
          "secondary": "secondary trait",
          "alignment": "good/neutral/evil"
        },
        "birthplace": "cosmic location name",
        "favoriteWeapon": "weapon name and description"
      }
      
      Make it creative and unique, fitting the cosmic/space fantasy theme.
    `
    
    const result = await model.generateContent(enhancedPrompt)
    const response = await result.response
    const text = response.text()
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const aiData = JSON.parse(jsonMatch[0])
      
      return {
        name: aiData.name,
        metadata: {
          description: aiData.description,
          backstory: aiData.backstory,
          visualTraits: aiData.visualTraits,
          personality: aiData.personality,
          birthplace: aiData.birthplace,
          favoriteWeapon: aiData.favoriteWeapon
        }
      }
    }
    
    throw new Error('Failed to parse AI response')
  } catch (error) {
    console.error('AI Generation Error:', error)
    
    // Fallback generation
    return generateFallbackHero(heroClass, rarity)
  }
}

export function generateFallbackHero(heroClass: HeroClass, rarity: HeroRarity): Partial<Hero> {
  const classNames = {
    warrior: ['Warrior', 'Knight', 'Champion', 'Gladiator'],
    mage: ['Mage', 'Wizard', 'Sorcerer', 'Warlock'],
    ranger: ['Ranger', 'Hunter', 'Scout', 'Tracker'],
    guardian: ['Guardian', 'Protector', 'Sentinel', 'Defender'],
    assassin: ['Assassin', 'Shadow', 'Rogue', 'Phantom'],
    paladin: ['Paladin', 'Crusader', 'Templar', 'Divine']
  }
  
  const cosmicPrefixes = ['Stellar', 'Cosmic', 'Void', 'Astral', 'Nebula', 'Quantum', 'Galactic']
  const cosmicSuffixes = ['storm', 'blade', 'walker', 'seeker', 'bringer', 'keeper', 'master']
  
  const prefix = cosmicPrefixes[Math.floor(Math.random() * cosmicPrefixes.length)]
  const className = classNames[heroClass][Math.floor(Math.random() * classNames[heroClass].length)]
  const suffix = cosmicSuffixes[Math.floor(Math.random() * cosmicSuffixes.length)]
  
  return {
    name: `${prefix} ${className} ${suffix}`,
    metadata: {
      description: `A ${rarity} ${heroClass} from the cosmic realm`,
      backstory: `This ${heroClass} has traveled across the cosmos, seeking glory and adventure in the vast universe.`,
      visualTraits: {
        bodyType: 'athletic',
        skinColor: 'pale blue',
        hairColor: 'silver',
        eyeColor: 'cosmic blue',
        height: 'tall',
        build: 'muscular'
      },
      personality: {
        primary: 'brave',
        secondary: 'determined',
        alignment: 'good' as const
      },
      birthplace: 'Cosmic Nebula',
      favoriteWeapon: 'Stellar Blade'
    }
  }
}

// Battle System
export function calculateDamage(
  attacker: Hero,
  defender: Hero,
  ability: Ability,
  isCritical: boolean = false
): number {
  let baseDamage = ability.damage
  
  // Apply attacker's stats
  if (ability.type === 'attack') {
    baseDamage += Math.floor(attacker.stats.strength * 0.5)
  } else if (ability.type === 'special') {
    baseDamage += Math.floor(attacker.stats.intelligence * 0.3)
  }
  
  // Apply elemental advantages
  baseDamage = calculateElementalDamage(baseDamage, ability.element, defender.element)
  
  // Apply defender's vitality as defense
  const defense = Math.floor(defender.stats.vitality * 0.3)
  baseDamage = Math.max(1, baseDamage - defense)
  
  // Apply critical hit
  if (isCritical) {
    baseDamage = Math.floor(baseDamage * 1.5)
  }
  
  // Add some randomness (±15%)
  const variance = 0.15
  baseDamage = Math.floor(baseDamage * (1 + (Math.random() - 0.5) * variance))
  
  return Math.max(1, baseDamage)
}

export function calculateCriticalChance(attacker: Hero): boolean {
  const baseCritChance = 5 // 5% base
  const luckBonus = Math.floor(attacker.stats.luck * 0.5)
  const agilityBonus = Math.floor(attacker.stats.agility * 0.2)
  
  const totalCritChance = baseCritChance + luckBonus + agilityBonus
  
  return Math.random() * 100 < totalCritChance
}

export function calculateTurnOrder(hero1: Hero, hero2: Hero): [Hero, Hero] {
  const hero1Speed = hero1.stats.agility + (Math.random() * 10)
  const hero2Speed = hero2.stats.agility + (Math.random() * 10)
  
  return hero1Speed >= hero2Speed ? [hero1, hero2] : [hero2, hero1]
}

// Experience and Leveling
export function calculateExperienceGain(
  winnerLevel: number,
  loserLevel: number,
  battleType: 'pve' | 'pvp' | 'tournament'
): number {
  const baseExp = 100
  const levelDifference = loserLevel - winnerLevel
  const difficultyBonus = Math.max(0, levelDifference * 10)
  
  const typeMultiplier = {
    pve: 1.0,
    pvp: 1.5,
    tournament: 2.0
  }
  
  return Math.floor((baseExp + difficultyBonus) * typeMultiplier[battleType])
}

export function shouldLevelUp(currentExp: number, currentLevel: number): boolean {
  const requiredExp = getExperienceForNextLevel(currentLevel)
  return currentExp >= requiredExp
}

export function applyLevelUp(hero: Hero): Hero {
  const newLevel = hero.level + 1
  const statBonus = Math.floor(newLevel / 5) // Bonus stats every 5 levels
  
  const updatedStats = {
    ...hero.stats,
    strength: hero.stats.strength + statBonus,
    intelligence: hero.stats.intelligence + statBonus,
    agility: hero.stats.agility + statBonus,
    vitality: hero.stats.vitality + statBonus,
    luck: hero.stats.luck + statBonus,
    charisma: hero.stats.charisma + statBonus
  }
  
  const { hp, mp } = calculateHpMp(updatedStats, newLevel)
  
  return {
    ...hero,
    level: newLevel,
    stats: updatedStats,
    maxHp: hp,
    currentHp: hp, // Full heal on level up
    maxMp: mp,
    currentMp: mp
  }
}

// Market Functions
export function calculateHeroValue(hero: Hero): number {
  const basePriceByRarity = {
    common: 10,
    rare: 50,
    epic: 200,
    legendary: 800,
    mythic: 2000
  }
  
  let price = basePriceByRarity[hero.rarity]
  
  // Level bonus
  price += hero.level * 2
  
  // Stats bonus
  const totalStats = calculateTotalPower(hero.stats)
  price += Math.floor(totalStats * 0.5)
  
  // Equipment bonus
  if (hero.equipment.weapon) price += hero.equipment.weapon.value
  if (hero.equipment.armor) price += hero.equipment.armor.value
  
  // Achievement bonus
  price += hero.achievements.length * 5
  
  return Math.floor(price)
}

export function formatEGLD(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`
  }
  return amount.toString()
}

// Validation Functions
export function validateHeroName(name: string): { valid: boolean, error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Hero name is required' }
  }
  
  if (name.length < 3 || name.length > 30) {
    return { valid: false, error: 'Hero name must be between 3 and 30 characters' }
  }
  
  if (!/^[a-zA-Z0-9\s-_]+$/.test(name)) {
    return { valid: false, error: 'Hero name can only contain letters, numbers, spaces, hyphens, and underscores' }
  }
  
  return { valid: true }
}

export function validateAIPrompt(prompt: string): { valid: boolean, error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { valid: false, error: 'AI prompt is required' }
  }
  
  if (prompt.length < 10 || prompt.length > 500) {
    return { valid: false, error: 'AI prompt must be between 10 and 500 characters' }
  }
  
  return { valid: true }
}

// Storage Functions
export function saveHeroToLocalStorage(hero: Hero): void {
  try {
    const existingHeroes = getHeroesFromLocalStorage()
    const updatedHeroes = [...existingHeroes.filter(h => h.id !== hero.id), hero]
    localStorage.setItem('cosmic-heroes', JSON.stringify(updatedHeroes))
  } catch (error) {
    console.error('Failed to save hero to localStorage:', error)
  }
}

export function getHeroesFromLocalStorage(): Hero[] {
  try {
    const stored = localStorage.getItem('cosmic-heroes')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load heroes from localStorage:', error)
    return []
  }
}

export function deleteHeroFromLocalStorage(heroId: string): void {
  try {
    const existingHeroes = getHeroesFromLocalStorage()
    const updatedHeroes = existingHeroes.filter(h => h.id !== heroId)
    localStorage.setItem('cosmic-heroes', JSON.stringify(updatedHeroes))
  } catch (error) {
    console.error('Failed to delete hero from localStorage:', error)
  }
}

// Animation Helpers
export const heroCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
}

export const battleActionVariants = {
  idle: { scale: 1, rotate: 0 },
  attack: { 
    scale: [1, 1.2, 1], 
    rotate: [0, 10, -10, 0],
    transition: { duration: 0.6 }
  },
  damage: {
    x: [-5, 5, -5, 5, 0],
    transition: { duration: 0.4 }
  },
  heal: {
    scale: [1, 1.1, 1],
    filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'],
    transition: { duration: 0.8 }
  }
}

// Utility Classes
export const rarityGradients = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-500',
  epic: 'from-purple-400 to-purple-500',
  legendary: 'from-yellow-400 to-yellow-500',
  mythic: 'from-pink-400 to-purple-500'
}

export const elementGradients = {
  fire: 'from-red-500 to-orange-500',
  water: 'from-blue-500 to-cyan-500',
  earth: 'from-green-500 to-yellow-600',
  air: 'from-purple-400 to-pink-500',
  light: 'from-yellow-300 to-white',
  dark: 'from-gray-800 to-purple-900',
  neutral: 'from-gray-500 to-gray-600'
}

// Error Handling
export class GameError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: any
  ) {
    super(message)
    this.name = 'GameError'
  }
}

export function handleGameError(error: unknown): string {
  if (error instanceof GameError) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}

// Performance Utilities
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    
    if (now - lastCall >= delay) {
      lastCall = now
      func.apply(null, args)
    }
  }
}