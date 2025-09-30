import { NextRequest, NextResponse } from 'next/server'

// Hero interface for type safety
interface Hero {
  id: string
  name: string
  title: string
  class: 'Warrior' | 'Mage' | 'Ranger' | 'Guardian'
  element: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  level: number
  experience: number
  stats: {
    health: number
    mana: number
    attack: number
    defense: number
    speed: number
    cosmic_power: number
  }
  powers: Array<{
    id: string
    name: string
    description: string
    type: 'attack' | 'defense' | 'special' | 'ultimate'
    element: string
    damage?: number
    cooldown: number
    manaCost: number
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  }>
  owner: string
  nft_id?: string
  created_at: string
  updated_at: string
}

// Mock database - În producție va fi înlocuit cu database real
let heroesDatabase: Hero[] = [
  {
    id: 'hero_001',
    name: 'Zyx the Flamebringer',
    title: 'Cosmic Warrior Supreme',
    class: 'Warrior',
    element: 'Fire',
    rarity: 'legendary',
    level: 50,
    experience: 125000,
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
        rarity: 'epic'
      }
    ],
    owner: 'erd1234...abc',
    nft_id: 'COSMIC-123456',
    created_at: '2024-09-30T21:00:00Z',
    updated_at: '2024-09-30T21:00:00Z'
  }
]

// GET - Retrieve heroes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const owner = searchParams.get('owner')
    const class_filter = searchParams.get('class')
    const rarity = searchParams.get('rarity')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filteredHeroes = heroesDatabase

    // Filter by owner
    if (owner) {
      filteredHeroes = filteredHeroes.filter(hero => hero.owner === owner)
    }

    // Filter by class
    if (class_filter) {
      filteredHeroes = filteredHeroes.filter(hero => 
        hero.class.toLowerCase() === class_filter.toLowerCase()
      )
    }

    // Filter by rarity
    if (rarity) {
      filteredHeroes = filteredHeroes.filter(hero => 
        hero.rarity === rarity.toLowerCase()
      )
    }

    // Pagination
    const paginatedHeroes = filteredHeroes.slice(offset, offset + limit)
    
    const response = {
      success: true,
      data: {
        heroes: paginatedHeroes,
        total: filteredHeroes.length,
        limit,
        offset,
        has_more: offset + limit < filteredHeroes.length
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching heroes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch heroes' },
      { status: 500 }
    )
  }
}

// POST - Create new hero
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, title, class: heroClass, element, owner } = body

    // Validation
    if (!name || !title || !heroClass || !element || !owner) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate hero stats based on class and rarity
    const generateStats = (heroClass: string, rarity: string) => {
      const baseStats = {
        Warrior: { health: 2000, mana: 600, attack: 800, defense: 900, speed: 500 },
        Mage: { health: 1500, mana: 2000, attack: 1000, defense: 400, speed: 700 },
        Ranger: { health: 1800, mana: 1200, attack: 850, defense: 600, speed: 1000 },
        Guardian: { health: 2800, mana: 800, attack: 600, defense: 1200, speed: 400 }
      }

      const multipliers = {
        common: 0.8,
        rare: 1.0,
        epic: 1.3,
        legendary: 1.6
      }

      const base = baseStats[heroClass as keyof typeof baseStats]
      const multiplier = multipliers[rarity as keyof typeof multipliers]

      return {
        health: Math.floor(base.health * multiplier),
        mana: Math.floor(base.mana * multiplier),
        attack: Math.floor(base.attack * multiplier),
        defense: Math.floor(base.defense * multiplier),
        speed: Math.floor(base.speed * multiplier),
        cosmic_power: Math.floor((base.health + base.mana + base.attack + base.defense + base.speed) * multiplier / 2)
      }
    }

    // Determine rarity (for now random, later será based on minting cost)
    const rarities = ['common', 'rare', 'epic', 'legendary']
    const rarityWeights = [50, 30, 15, 5] // Percentage chances
    let randomValue = Math.random() * 100
    let selectedRarity = 'common'
    
    for (let i = 0; i < rarities.length; i++) {
      if (randomValue <= rarityWeights[i]) {
        selectedRarity = rarities[i]
        break
      }
      randomValue -= rarityWeights[i]
    }

    const newHero: Hero = {
      id: `hero_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      title,
      class: heroClass,
      element,
      rarity: selectedRarity as Hero['rarity'],
      level: 1,
      experience: 0,
      stats: generateStats(heroClass, selectedRarity),
      powers: [], // Will be populated based on class and level
      owner,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Add to mock database
    heroesDatabase.push(newHero)

    return NextResponse.json({
      success: true,
      data: {
        hero: newHero,
        message: `${selectedRarity.charAt(0).toUpperCase() + selectedRarity.slice(1)} ${heroClass} created successfully!`
      }
    })
  } catch (error) {
    console.error('Error creating hero:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create hero' },
      { status: 500 }
    )
  }
}

// PUT - Update hero
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Hero ID required' },
        { status: 400 }
      )
    }

    const heroIndex = heroesDatabase.findIndex(hero => hero.id === id)
    
    if (heroIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Hero not found' },
        { status: 404 }
      )
    }

    // Update hero
    heroesDatabase[heroIndex] = {
      ...heroesDatabase[heroIndex],
      ...updates,
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: {
        hero: heroesDatabase[heroIndex],
        message: 'Hero updated successfully'
      }
    })
  } catch (error) {
    console.error('Error updating hero:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update hero' },
      { status: 500 }
    )
  }
}

// DELETE - Delete hero (soft delete - mark as inactive)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Hero ID required' },
        { status: 400 }
      )
    }

    const heroIndex = heroesDatabase.findIndex(hero => hero.id === id)
    
    if (heroIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Hero not found' },
        { status: 404 }
      )
    }

    // In a real app, we'd soft delete or transfer ownership
    // For now, we'll remove from array
    const deletedHero = heroesDatabase.splice(heroIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: {
        message: `Hero ${deletedHero.name} has been removed from the cosmic realm`,
        hero_id: id
      }
    })
  } catch (error) {
    console.error('Error deleting hero:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete hero' },
      { status: 500 }
    )
  }
}