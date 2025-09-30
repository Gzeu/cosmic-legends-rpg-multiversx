import { NextRequest, NextResponse } from 'next/server'

// AI Hero Generation Types
interface GenerationRequest {
  theme?: string
  class?: 'Warrior' | 'Mage' | 'Ranger' | 'Guardian'
  element?: string
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
  player_preferences?: {
    combat_style: 'aggressive' | 'defensive' | 'balanced'
    favorite_elements: string[]
    preferred_abilities: string[]
  }
  inspiration?: string
  custom_prompt?: string
}

interface GeneratedHero {
  id: string
  name: string
  title: string
  class: string
  element: string
  rarity: string
  backstory: string
  personality: string
  appearance_description: string
  stats: {
    health: number
    mana: number
    attack: number
    defense: number
    speed: number
    cosmic_power: number
  }
  generated_powers: Array<{
    name: string
    description: string
    type: string
    element: string
    power_level: number
  }>
  passive_ability: {
    name: string
    description: string
  }
  cosmic_origin: string
  generation_params: {
    seed: string
    model_version: string
    creativity_level: number
    theme_adherence: number
  }
  created_at: string
}

// AI Name generators by class and element
const NAME_GENERATORS = {
  warrior: {
    fire: ['Zyx', 'Pyros', 'Blaze', 'Inferno', 'Ignis', 'Vulcan', 'Ember'],
    ice: ['Frost', 'Glacier', 'Blizzard', 'Arctic', 'Cryo', 'Neve', 'Icicle'],
    earth: ['Terra', 'Boulder', 'Granite', 'Quake', 'Stone', 'Ridge', 'Summit'],
    air: ['Gale', 'Storm', 'Tempest', 'Zephyr', 'Cyclone', 'Breeze', 'Whirl']
  },
  mage: {
    void: ['Aria', 'Cosmos', 'Void', 'Nexus', 'Quantum', 'Stellar', 'Nebula'],
    light: ['Lux', 'Radiant', 'Aurora', 'Prism', 'Lumina', 'Dawn', 'Ray'],
    shadow: ['Umbra', 'Eclipse', 'Midnight', 'Shade', 'Dusk', 'Raven', 'Noir'],
    arcane: ['Mystic', 'Spell', 'Rune', 'Magic', 'Cipher', 'Enigma', 'Sage']
  },
  ranger: {
    nature: ['Sylph', 'Forest', 'Grove', 'Thorn', 'Oak', 'Ivy', 'Cedar'],
    wind: ['Zephyr', 'Gust', 'Swift', 'Breeze', 'Drift', 'Soar', 'Glide'],
    shadow: ['Phantom', 'Ghost', 'Wraith', 'Stealth', 'Cloak', 'Veil', 'Shade'],
    lightning: ['Bolt', 'Thunder', 'Lightning', 'Spark', 'Volt', 'Flash', 'Strike']
  },
  guardian: {
    light: ['Titan', 'Beacon', 'Guardian', 'Sentinel', 'Paladin', 'Divine', 'Holy'],
    earth: ['Mountain', 'Fortress', 'Bastion', 'Shield', 'Armor', 'Wall', 'Keep'],
    cosmic: ['Stellar', 'Galaxy', 'Universe', 'Cosmos', 'Astral', 'Celestial', 'Eternal'],
    crystal: ['Gem', 'Crystal', 'Diamond', 'Prism', 'Shard', 'Jewel', 'Sapphire']
  }
}

const TITLE_TEMPLATES = {
  warrior: ['the Flamebringer', 'the Destroyer', 'the Conqueror', 'the Mighty', 'the Fearless', 'the Champion'],
  mage: ['the Voidweaver', 'the Spellbinder', 'the Arcane', 'the Mystic', 'the Enlightened', 'the Sage'],
  ranger: ['the Shadowstrike', 'the Hunter', 'the Swift', 'the Tracker', 'the Silent', 'the Phantom'],
  guardian: ['the Lightbearer', 'the Protector', 'the Eternal', 'the Divine', 'the Steadfast', 'the Shield']
}

const COSMIC_ORIGINS = [
  'The Andromeda Forge Nebula',
  'The Great Void Between Galaxies',
  'The Whispering Dark Between Worlds',
  'The First Light - Origin Point of Creation',
  'The Shattered Constellation of Eternal War',
  'The Temporal Rift of Lost Dimensions',
  'The Crystal Caves of the Quantum Moon',
  'The Stellar Graveyard of Ancient Heroes',
  'The Cosmic Library of Infinite Knowledge',
  'The Phoenix Nebula of Endless Rebirth'
]

// AI Hero Generation Engine
class AIHeroGenerator {
  static generateName(heroClass: string, element: string): string {
    const classNames = NAME_GENERATORS[heroClass.toLowerCase() as keyof typeof NAME_GENERATORS]
    if (!classNames) return 'Unknown'
    
    const elementNames = classNames[element.toLowerCase() as keyof typeof classNames] || Object.values(classNames).flat()
    const baseName = elementNames[Math.floor(Math.random() * elementNames.length)]
    
    // Add cosmic prefixes/suffixes occasionally
    const cosmicPrefixes = ['', '', '', 'Cosmic ', 'Stellar ', 'Quantum ', 'Astral ']
    const cosmicSuffixes = ['', '', '', 'star', 'void', 'flux', 'prime']
    
    const prefix = cosmicPrefixes[Math.floor(Math.random() * cosmicPrefixes.length)]
    const suffix = cosmicSuffixes[Math.floor(Math.random() * cosmicSuffixes.length)]
    
    return `${prefix}${baseName}${suffix ? ' ' + suffix : ''}`
  }

  static generateTitle(heroClass: string): string {
    const titles = TITLE_TEMPLATES[heroClass.toLowerCase() as keyof typeof TITLE_TEMPLATES] || ['the Legendary']
    return titles[Math.floor(Math.random() * titles.length)]
  }

  static generateStats(heroClass: string, rarity: string, level: number = 1): any {
    const baseStats = {
      warrior: { health: 2000, mana: 600, attack: 800, defense: 900, speed: 500 },
      mage: { health: 1500, mana: 2000, attack: 1000, defense: 400, speed: 700 },
      ranger: { health: 1800, mana: 1200, attack: 850, defense: 600, speed: 1000 },
      guardian: { health: 2800, mana: 800, attack: 600, defense: 1200, speed: 400 }
    }

    const rarityMultipliers = {
      common: 0.8,
      rare: 1.0,
      epic: 1.3,
      legendary: 1.6
    }

    const levelMultiplier = 1 + (level - 1) * 0.05 // 5% per level
    
    const base = baseStats[heroClass.toLowerCase() as keyof typeof baseStats]
    const rarityMult = rarityMultipliers[rarity as keyof typeof rarityMultipliers]
    const totalMult = rarityMult * levelMultiplier

    // Add some randomness (±10%)
    const randomVariance = () => 0.9 + Math.random() * 0.2

    const stats = {
      health: Math.floor(base.health * totalMult * randomVariance()),
      mana: Math.floor(base.mana * totalMult * randomVariance()),
      attack: Math.floor(base.attack * totalMult * randomVariance()),
      defense: Math.floor(base.defense * totalMult * randomVariance()),
      speed: Math.floor(base.speed * totalMult * randomVariance())
    }

    return {
      ...stats,
      cosmic_power: Math.floor((stats.health + stats.mana + stats.attack + stats.defense + stats.speed) / 2.5)
    }
  }

  static generatePowers(heroClass: string, element: string, level: number): any[] {
    const powerTemplates = {
      warrior: {
        attack: ['Devastating Slash', 'Berserker Strike', 'Crushing Blow', 'Fury Combo'],
        defense: ['Iron Wall', 'Battle Stance', 'Armor Up', 'Shield Slam'],
        ultimate: ['Cosmic Rage', 'Divine Wrath', 'Apocalypse Strike', 'World Breaker']
      },
      mage: {
        attack: ['Arcane Missile', 'Elemental Burst', 'Mind Blast', 'Energy Bolt'],
        defense: ['Mage Shield', 'Barrier Field', 'Spell Ward', 'Reflection'],
        ultimate: ['Reality Storm', 'Cosmic Singularity', 'Time Fracture', 'Dimension Rift']
      },
      ranger: {
        attack: ['Precision Shot', 'Multi Arrow', 'Poison Dart', 'Hunter Mark'],
        defense: ['Evasion', 'Camouflage', 'Trap Field', 'Stealth Mode'],
        ultimate: ['Arrow Storm', 'Phantom Strike', 'Void Rain', 'Shadow Barrage']
      },
      guardian: {
        attack: ['Holy Strike', 'Divine Hammer', 'Judgment', 'Righteous Fury'],
        defense: ['Sanctuary', 'Divine Shield', 'Healing Aura', 'Protection Field'],
        ultimate: ['Stellar Judgment', 'Divine Intervention', 'Cosmic Sanctuary', 'Eternal Light']
      }
    }

    const classTemplates = powerTemplates[heroClass.toLowerCase() as keyof typeof powerTemplates]
    if (!classTemplates) return []

    const powers = []
    const numPowers = Math.min(3 + Math.floor(level / 10), 6) // 3-6 powers based on level

    // Generate attack power
    const attackName = classTemplates.attack[Math.floor(Math.random() * classTemplates.attack.length)]
    powers.push({
      name: `${element} ${attackName}`,
      description: `A powerful ${element.toLowerCase()} attack that devastates enemies`,
      type: 'attack',
      element,
      power_level: 300 + level * 10
    })

    // Generate defense power
    const defenseName = classTemplates.defense[Math.floor(Math.random() * classTemplates.defense.length)]
    powers.push({
      name: `${element} ${defenseName}`,
      description: `A defensive ability that protects against ${element.toLowerCase()} attacks`,
      type: 'defense',
      element,
      power_level: 200 + level * 8
    })

    // Generate ultimate (if high enough level)
    if (level >= 20) {
      const ultimateName = classTemplates.ultimate[Math.floor(Math.random() * classTemplates.ultimate.length)]
      powers.push({
        name: `${element} ${ultimateName}`,
        description: `The ultimate ${element.toLowerCase()} technique that can change the tide of battle`,
        type: 'ultimate',
        element,
        power_level: 500 + level * 20
      })
    }

    return powers
  }

  static generateBackstory(name: string, heroClass: string, element: string, cosmicOrigin: string): string {
    const backstoryTemplates = {
      warrior: `Born in the heart of ${cosmicOrigin}, ${name} was forged through countless battles across the cosmic realms. Wielding the power of ${element.toLowerCase()}, this legendary warrior has never known defeat and seeks only the greatest challenges the universe can offer.`,
      mage: `${name} transcended mortal limitations eons ago, becoming one with the ${element.toLowerCase()} forces of ${cosmicOrigin}. This ancient being manipulates reality itself, weaving spells that can reshape the very fabric of space and time.`,
      ranger: `From the silent depths of ${cosmicOrigin}, ${name} emerged as the ultimate cosmic hunter. Moving between dimensions with ${element.toLowerCase()} energy, this phantom strikes with precision that defies the laws of physics.`,
      guardian: `Chosen by the Cosmic Council from ${cosmicOrigin}, ${name} serves as the eternal protector of universal balance. Channeling pure ${element.toLowerCase()} energy, this divine guardian brings hope to the darkest corners of existence.`
    }
    
    return backstoryTemplates[heroClass.toLowerCase() as keyof typeof backstoryTemplates] || 'A mysterious cosmic entity with unknown origins.'
  }

  static generatePersonality(heroClass: string, element: string): string {
    const personalities = {
      warrior: {
        fire: 'Passionate and aggressive, quick to anger but fiercely loyal to allies',
        ice: 'Cool and calculated, prefers strategic thinking over rash actions',
        earth: 'Steadfast and reliable, values honor and tradition above all',
        air: 'Swift and unpredictable, adapts quickly to changing situations'
      },
      mage: {
        void: 'Mysterious and philosophical, sees patterns others cannot comprehend',
        light: 'Wise and benevolent, seeks to guide others toward enlightenment',
        shadow: 'Introspective and cunning, understands the necessity of darkness',
        arcane: 'Curious and experimental, constantly pushes magical boundaries'
      },
      ranger: {
        nature: 'Patient and observant, deeply connected to natural rhythms',
        wind: 'Free-spirited and independent, values freedom above comfort',
        shadow: 'Silent and efficient, speaks only when necessary',
        lightning: 'Energetic and quick-witted, thrives in fast-paced situations'
      },
      guardian: {
        light: 'Compassionate and protective, will sacrifice everything for others',
        earth: 'Patient and enduring, provides stability in chaotic times',
        cosmic: 'Wise and eternal, sees the bigger picture beyond mortal concerns',
        crystal: 'Pure and focused, maintains clarity even in darkest moments'
      }
    }

    const classPersonalities = personalities[heroClass.toLowerCase() as keyof typeof personalities] as any
    return classPersonalities?.[element.toLowerCase()] || 'A being of mysterious nature and hidden depths'
  }

  static async generateHero(request: GenerationRequest): Promise<GeneratedHero> {
    // Determine class if not specified
    const classes = ['Warrior', 'Mage', 'Ranger', 'Guardian']
    const heroClass = request.class || classes[Math.floor(Math.random() * classes.length)]

    // Determine element based on class
    const classElements = {
      Warrior: ['Fire', 'Ice', 'Earth', 'Air'],
      Mage: ['Void', 'Light', 'Shadow', 'Arcane'],
      Ranger: ['Nature', 'Wind', 'Shadow', 'Lightning'],
      Guardian: ['Light', 'Earth', 'Cosmic', 'Crystal']
    }
    
    const possibleElements = classElements[heroClass]
    const element = request.element || possibleElements[Math.floor(Math.random() * possibleElements.length)]

    // Determine rarity with weighted probability
    let rarity = request.rarity
    if (!rarity) {
      const rarityRoll = Math.random() * 100
      if (rarityRoll < 60) rarity = 'common'
      else if (rarityRoll < 85) rarity = 'rare'
      else if (rarityRoll < 97) rarity = 'epic'
      else rarity = 'legendary'
    }

    // Generate basic info
    const name = this.generateName(heroClass, element)
    const title = this.generateTitle(heroClass)
    const cosmicOrigin = COSMIC_ORIGINS[Math.floor(Math.random() * COSMIC_ORIGINS.length)]
    const level = 1 + Math.floor(Math.random() * 10) // Level 1-10 for new heroes

    // Generate stats
    const stats = this.generateStats(heroClass, rarity, level)

    // Generate powers
    const powers = this.generatePowers(heroClass, element, level)

    // Generate personality and backstory
    const personality = this.generatePersonality(heroClass, element)
    const backstory = this.generateBackstory(name, heroClass, element, cosmicOrigin)

    // Generate appearance description
    const appearanceDescription = `A ${rarity} ${heroClass.toLowerCase()} radiating ${element.toLowerCase()} energy, with intricate cosmic armor and ${element.toLowerCase()}-infused weapons. Their presence commands respect and fear across all dimensions.`

    // Generate passive ability
    const passiveAbility = {
      name: `${element} Mastery`,
      description: `Inherent connection to ${element.toLowerCase()} forces grants enhanced abilities and resistance`
    }

    const generatedHero: GeneratedHero = {
      id: `ai_hero_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      title,
      class: heroClass,
      element,
      rarity,
      backstory,
      personality,
      appearance_description: appearanceDescription,
      stats,
      generated_powers: powers,
      passive_ability: passiveAbility,
      cosmic_origin: cosmicOrigin,
      generation_params: {
        seed: Math.random().toString(36).substr(2, 9),
        model_version: 'CosmicAI-v1.0',
        creativity_level: 0.8,
        theme_adherence: 0.9
      },
      created_at: new Date().toISOString()
    }

    return generatedHero
  }

  static async generateMultipleHeroes(count: number, baseRequest: GenerationRequest): Promise<GeneratedHero[]> {
    const heroes: GeneratedHero[] = []
    
    for (let i = 0; i < Math.min(count, 10); i++) { // Max 10 heroes per request
      // Add some variation to each hero
      const request = {
        ...baseRequest,
        // Rotate through different classes/elements
        class: undefined, // Let it be random
        element: undefined // Let it be random
      }
      
      const hero = await this.generateHero(request)
      heroes.push(hero)
      
      // Small delay to ensure unique IDs
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    
    return heroes
  }
}

// GET - Get generation options or hero templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'options':
        return NextResponse.json({
          success: true,
          data: {
            classes: ['Warrior', 'Mage', 'Ranger', 'Guardian'],
            elements: {
              Warrior: ['Fire', 'Ice', 'Earth', 'Air'],
              Mage: ['Void', 'Light', 'Shadow', 'Arcane'],
              Ranger: ['Nature', 'Wind', 'Shadow', 'Lightning'],
              Guardian: ['Light', 'Earth', 'Cosmic', 'Crystal']
            },
            rarities: {
              common: { chance: '60%', power_bonus: '0%' },
              rare: { chance: '25%', power_bonus: '20%' },
              epic: { chance: '12%', power_bonus: '50%' },
              legendary: { chance: '3%', power_bonus: '100%' }
            },
            generation_cost: {
              common: '0.1 EGLD',
              rare: '0.3 EGLD',
              epic: '0.8 EGLD',
              legendary: '2.0 EGLD'
            }
          }
        })

      case 'preview':
        // Generate a preview hero without saving
        const previewRequest: GenerationRequest = {
          class: searchParams.get('class') as any || undefined,
          element: searchParams.get('element') || undefined,
          rarity: searchParams.get('rarity') as any || undefined
        }
        
        const previewHero = await AIHeroGenerator.generateHero(previewRequest)
        
        return NextResponse.json({
          success: true,
          data: {
            hero: previewHero,
            message: 'Preview hero generated - not saved'
          }
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('AI Generation GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get generation options' },
      { status: 500 }
    )
  }
}

// POST - Generate heroes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'generate_single':
        const hero = await AIHeroGenerator.generateHero(data as GenerationRequest)
        
        return NextResponse.json({
          success: true,
          data: {
            hero,
            message: `Generated ${hero.rarity} ${hero.class}: ${hero.name}`,
            generation_time: '2.3s',
            ready_for_mint: true
          }
        })

      case 'generate_batch':
        const count = Math.min(data.count || 1, 10)
        const heroes = await AIHeroGenerator.generateMultipleHeroes(count, data)
        
        return NextResponse.json({
          success: true,
          data: {
            heroes,
            count: heroes.length,
            message: `Generated ${heroes.length} cosmic heroes`,
            generation_time: `${heroes.length * 2.1}s`,
            total_power: heroes.reduce((sum, h) => sum + h.stats.cosmic_power, 0)
          }
        })

      case 'generate_themed':
        // Generate hero based on specific theme or inspiration
        const themedRequest: GenerationRequest = {
          ...data,
          theme: data.theme || 'cosmic_warrior',
          inspiration: data.inspiration || 'ancient_legends'
        }
        
        const themedHero = await AIHeroGenerator.generateHero(themedRequest)
        
        return NextResponse.json({
          success: true,
          data: {
            hero: themedHero,
            theme: data.theme,
            message: `Generated themed ${themedHero.class}: ${themedHero.name}`,
            unique_traits: themedHero.generated_powers.length
          }
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid generation action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('AI Generation POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Hero generation failed' },
      { status: 500 }
    )
  }
}