import { NextRequest, NextResponse } from 'next/server'

// Battle related interfaces
interface BattleAction {
  id: string
  battle_id: string
  turn: number
  player_id: string
  hero_id: string
  action_type: 'attack' | 'defend' | 'skill' | 'ultimate'
  target_id?: string
  power_id?: string
  damage_dealt?: number
  healing_done?: number
  status_effects?: string[]
  timestamp: string
}

interface BattleParticipant {
  player_id: string
  hero_id: string
  hero_name: string
  current_health: number
  max_health: number
  current_mana: number
  max_mana: number
  status_effects: string[]
  position: number
}

interface Battle {
  id: string
  type: 'pvp' | 'pve' | 'tournament' | 'guild_war'
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  participants: BattleParticipant[]
  current_turn: number
  turn_order: string[] // hero_ids in turn order
  actions: BattleAction[]
  winner?: string
  rewards?: {
    experience: number
    cosmic_tokens?: number
    items?: string[]
    nft_drops?: string[]
  }
  battlefield: {
    environment: 'cosmic_void' | 'stellar_forge' | 'nebula_ruins' | 'quantum_arena'
    effects: string[]
  }
  created_at: string
  updated_at: string
  completed_at?: string
}

// Mock battles database
let battlesDatabase: Battle[] = []
let battleActionsDatabase: BattleAction[] = []

// Battle calculation utilities
class BattleEngine {
  static calculateDamage(attacker: BattleParticipant, defender: BattleParticipant, power: any): number {
    const baseAttack = 100 // Would get from hero stats
    const defense = 80 // Would get from hero stats
    const powerMultiplier = power?.damage || 1
    
    // Basic damage formula with some randomness
    const baseDamage = (baseAttack * powerMultiplier) - (defense * 0.5)
    const criticalChance = 0.15 // 15% crit chance
    const criticalMultiplier = Math.random() < criticalChance ? 1.5 : 1
    
    return Math.max(1, Math.floor(baseDamage * criticalMultiplier * (0.9 + Math.random() * 0.2)))
  }

  static calculateTurnOrder(participants: BattleParticipant[]): string[] {
    // Sort by speed (would get from hero stats)
    // For now, simple randomized order
    const shuffled = [...participants]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled.map(p => p.hero_id)
  }

  static checkBattleEnd(participants: BattleParticipant[]): boolean {
    const alivePlayers = participants.filter(p => p.current_health > 0)
    const uniquePlayerIds = new Set(alivePlayers.map(p => p.player_id))
    return uniquePlayerIds.size <= 1
  }

  static determineBattlefieldEffects(environment: string): string[] {
    const effects = {
      'cosmic_void': ['zero_gravity', 'void_energy'],
      'stellar_forge': ['fire_damage_boost', 'metal_armor_bonus'],
      'nebula_ruins': ['energy_regeneration', 'mystical_enhancement'],
      'quantum_arena': ['reality_shift', 'temporal_flux']
    }
    return effects[environment as keyof typeof effects] || []
  }
}

// GET - Retrieve battles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const player_id = searchParams.get('player_id')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const battle_id = searchParams.get('battle_id')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filteredBattles = battlesDatabase

    // Get specific battle
    if (battle_id) {
      const battle = battlesDatabase.find(b => b.id === battle_id)
      if (!battle) {
        return NextResponse.json(
          { success: false, error: 'Battle not found' },
          { status: 404 }
        )
      }

      // Include battle actions
      const actions = battleActionsDatabase.filter(a => a.battle_id === battle_id)
      
      return NextResponse.json({
        success: true,
        data: {
          battle: {
            ...battle,
            actions
          }
        }
      })
    }

    // Filter by player
    if (player_id) {
      filteredBattles = filteredBattles.filter(battle => 
        battle.participants.some(p => p.player_id === player_id)
      )
    }

    // Filter by status
    if (status) {
      filteredBattles = filteredBattles.filter(battle => battle.status === status)
    }

    // Filter by type
    if (type) {
      filteredBattles = filteredBattles.filter(battle => battle.type === type)
    }

    // Pagination
    const paginatedBattles = filteredBattles.slice(offset, offset + limit)
    
    return NextResponse.json({
      success: true,
      data: {
        battles: paginatedBattles,
        total: filteredBattles.length,
        limit,
        offset,
        has_more: offset + limit < filteredBattles.length
      }
    })
  } catch (error) {
    console.error('Error fetching battles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch battles' },
      { status: 500 }
    )
  }
}

// POST - Create new battle or execute battle action
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'create_battle') {
      return await createBattle(data)
    } else if (action === 'execute_action') {
      return await executeBattleAction(data)
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error in battle POST:', error)
    return NextResponse.json(
      { success: false, error: 'Battle operation failed' },
      { status: 500 }
    )
  }
}

async function createBattle(data: any) {
  const { participants, type = 'pvp', environment = 'cosmic_void' } = data

  if (!participants || participants.length < 2) {
    return NextResponse.json(
      { success: false, error: 'At least 2 participants required' },
      { status: 400 }
    )
  }

  // Initialize battle participants with full health/mana
  const battleParticipants: BattleParticipant[] = participants.map((p: any, index: number) => ({
    player_id: p.player_id,
    hero_id: p.hero_id,
    hero_name: p.hero_name,
    current_health: p.max_health || 1000,
    max_health: p.max_health || 1000,
    current_mana: p.max_mana || 500,
    max_mana: p.max_mana || 500,
    status_effects: [],
    position: index
  }))

  const newBattle: Battle = {
    id: `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    status: 'active',
    participants: battleParticipants,
    current_turn: 0,
    turn_order: BattleEngine.calculateTurnOrder(battleParticipants),
    actions: [],
    battlefield: {
      environment,
      effects: BattleEngine.determineBattlefieldEffects(environment)
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  battlesDatabase.push(newBattle)

  return NextResponse.json({
    success: true,
    data: {
      battle: newBattle,
      message: `Battle initiated in ${environment}!`,
      next_turn: {
        hero_id: newBattle.turn_order[0],
        hero_name: battleParticipants.find(p => p.hero_id === newBattle.turn_order[0])?.hero_name
      }
    }
  })
}

async function executeBattleAction(data: any) {
  const { battle_id, player_id, hero_id, action_type, target_id, power_id } = data

  // Find battle
  const battleIndex = battlesDatabase.findIndex(b => b.id === battle_id)
  if (battleIndex === -1) {
    return NextResponse.json(
      { success: false, error: 'Battle not found' },
      { status: 404 }
    )
  }

  const battle = battlesDatabase[battleIndex]

  // Validate it's the player's turn
  const currentHeroId = battle.turn_order[battle.current_turn % battle.turn_order.length]
  if (currentHeroId !== hero_id) {
    return NextResponse.json(
      { success: false, error: 'Not your turn!' },
      { status: 400 }
    )
  }

  // Find attacker and target
  const attacker = battle.participants.find(p => p.hero_id === hero_id)
  const target = battle.participants.find(p => p.hero_id === target_id)

  if (!attacker) {
    return NextResponse.json(
      { success: false, error: 'Attacker not found' },
      { status: 400 }
    )
  }

  let actionResult: any = {
    damage_dealt: 0,
    healing_done: 0,
    status_effects: []
  }

  // Execute action based on type
  if (action_type === 'attack' && target) {
    const damage = BattleEngine.calculateDamage(attacker, target, { damage: 1 })
    target.current_health = Math.max(0, target.current_health - damage)
    actionResult.damage_dealt = damage
  } else if (action_type === 'skill' && power_id && target) {
    // Mock skill execution with higher damage
    const damage = BattleEngine.calculateDamage(attacker, target, { damage: 1.5 })
    target.current_health = Math.max(0, target.current_health - damage)
    actionResult.damage_dealt = damage
    attacker.current_mana = Math.max(0, attacker.current_mana - 50)
  }

  // Create battle action record
  const battleAction: BattleAction = {
    id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    battle_id,
    turn: battle.current_turn,
    player_id,
    hero_id,
    action_type,
    target_id,
    power_id,
    ...actionResult,
    timestamp: new Date().toISOString()
  }

  battleActionsDatabase.push(battleAction)
  battle.actions.push(battleAction)

  // Check if battle is over
  const battleEnded = BattleEngine.checkBattleEnd(battle.participants)
  if (battleEnded) {
    battle.status = 'completed'
    battle.completed_at = new Date().toISOString()
    
    // Determine winner
    const winner = battle.participants.find(p => p.current_health > 0)
    if (winner) {
      battle.winner = winner.player_id
      battle.rewards = {
        experience: 1000,
        cosmic_tokens: 50,
        items: ['cosmic_shard']
      }
    }
  }

  // Advance turn
  battle.current_turn += 1
  battle.updated_at = new Date().toISOString()

  // Update battle in database
  battlesDatabase[battleIndex] = battle

  const nextHeroId = battle.turn_order[battle.current_turn % battle.turn_order.length]
  const nextHero = battle.participants.find(p => p.hero_id === nextHeroId)

  return NextResponse.json({
    success: true,
    data: {
      battle,
      action: battleAction,
      battle_ended: battleEnded,
      next_turn: battleEnded ? null : {
        hero_id: nextHeroId,
        hero_name: nextHero?.hero_name
      },
      message: battleEnded ? 
        `Battle completed! Winner: ${battle.participants.find(p => p.current_health > 0)?.hero_name}` :
        `Action executed: ${action_type}${actionResult.damage_dealt ? ` dealing ${actionResult.damage_dealt} damage` : ''}`
    }
  })
}

// PUT - Update battle (for admin purposes)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { battle_id, status, ...updates } = body

    const battleIndex = battlesDatabase.findIndex(b => b.id === battle_id)
    if (battleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Battle not found' },
        { status: 404 }
      )
    }

    battlesDatabase[battleIndex] = {
      ...battlesDatabase[battleIndex],
      ...updates,
      status: status || battlesDatabase[battleIndex].status,
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: {
        battle: battlesDatabase[battleIndex],
        message: 'Battle updated successfully'
      }
    })
  } catch (error) {
    console.error('Error updating battle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update battle' },
      { status: 500 }
    )
  }
}