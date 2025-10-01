import { GoogleGenerativeAI } from '@google/generative-ai';
import { HfInference } from '@huggingface/inference';

// Advanced AI Game Engine for Dynamic Content Generation
// Powers intelligent NPCs, procedural quests, and adaptive gameplay

interface Hero {
  id: string;
  name: string;
  class: string;
  level: number;
  stats: {
    attack: number;
    defense: number;
    magic: number;
    speed: number;
    luck: number;
  };
  personality: {
    traits: string[];
    alignment: 'lawful' | 'neutral' | 'chaotic';
    motivation: string;
  };
  history: string[];
}

interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  rewards: {
    experience: number;
    tokens: number;
    items: string[];
  };
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  timeLimit?: number;
}

interface BattleScenario {
  environment: string;
  weather: string;
  obstacles: string[];
  strategicAdvantages: string[];
  narrativeContext: string;
}

interface NPCDialogue {
  npcId: string;
  context: string;
  playerHistory: string[];
  responses: {
    text: string;
    mood: 'friendly' | 'hostile' | 'neutral' | 'mysterious';
    consequences?: string[];
  }[];
}

class CosmicAIEngine {
  private static instance: CosmicAIEngine;
  private genAI: GoogleGenerativeAI;
  private hf: HfInference;
  private playerData: Map<string, any> = new Map();
  private worldState: Map<string, any> = new Map();

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
    this.hf = new HfInference(process.env.HUGGING_FACE_API_KEY || '');
    
    // Initialize world state
    this.initializeWorldState();
  }

  static getInstance(): CosmicAIEngine {
    if (!CosmicAIEngine.instance) {
      CosmicAIEngine.instance = new CosmicAIEngine();
    }
    return CosmicAIEngine.instance;
  }

  // === HERO GENERATION & EVOLUTION ===

  async generateHero(playerPreferences: {
    preferredClass?: string;
    personalityHints?: string[];
    backstoryElements?: string[];
  }): Promise<Hero> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Create a unique RPG hero with the following preferences:
      - Preferred class: ${playerPreferences.preferredClass || 'any'}
      - Personality hints: ${playerPreferences.personalityHints?.join(', ') || 'surprise me'}
      - Backstory elements: ${playerPreferences.backstoryElements?.join(', ') || 'creative freedom'}
      
      Generate a detailed hero with:
      1. Unique name that fits their background
      2. Class and specialization
      3. Balanced stats (total: 100 points)
      4. Rich personality with 3-5 traits
      5. Compelling backstory
      6. Motivation and goals
      
      Return as JSON with the Hero interface structure.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const heroData = JSON.parse(response.text());
      
      return {
        id: this.generateUniqueId(),
        ...heroData,
        history: []
      };
    } catch (error) {
      console.error('Hero generation failed:', error);
      return this.getFallbackHero();
    }
  }

  async evolveHero(hero: Hero, experiences: string[]): Promise<Partial<Hero>> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Evolve this hero based on their recent experiences:
      
      Current Hero:
      - Name: ${hero.name}
      - Class: ${hero.class}
      - Level: ${hero.level}
      - Personality: ${hero.personality.traits.join(', ')}
      - Recent experiences: ${experiences.join('; ')}
      
      Suggest evolution changes:
      1. Stat improvements (realistic growth)
      2. New personality traits or changes
      3. Updated motivation/goals
      4. Potential class evolution or specialization
      
      Return only the changes as JSON.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Hero evolution failed:', error);
      return {};
    }
  }

  // === DYNAMIC QUEST GENERATION ===

  async generatePersonalizedQuest(playerId: string, playerHistory: string[]): Promise<Quest> {
    const playerData = this.playerData.get(playerId) || {};
    const worldEvents = this.getRelevantWorldEvents();
    
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Generate a personalized quest for this player:
      
      Player Profile:
      - Previous quests: ${playerHistory.slice(-5).join('; ')}
      - Preferred activities: ${playerData.preferences || 'varied gameplay'}
      - Skill level: ${playerData.skillLevel || 'intermediate'}
      
      World Context:
      - Current events: ${worldEvents.join('; ')}
      - Active storylines: ${this.getActiveStorylines()}
      
      Create a quest that:
      1. Builds on player's history
      2. Introduces new challenges
      3. Connects to world events
      4. Offers meaningful rewards
      5. Has clear, achievable objectives
      
      Return as JSON with Quest interface structure.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const questData = JSON.parse(response.text());
      
      return {
        id: this.generateUniqueId(),
        ...questData
      };
    } catch (error) {
      console.error('Quest generation failed:', error);
      return this.getFallbackQuest();
    }
  }

  async generateDynamicObjectives(questId: string, playerActions: string[]): Promise<string[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Update quest objectives based on player actions:
      
      Original Quest: ${questId}
      Player Actions: ${playerActions.join('; ')}
      
      Generate 2-4 new objectives that:
      1. Respond to player choices
      2. Maintain quest coherence
      3. Provide interesting challenges
      4. Feel natural and immersive
      
      Return as array of objective strings.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Objective generation failed:', error);
      return ['Continue your journey', 'Overcome the challenges ahead'];
    }
  }

  // === INTELLIGENT BATTLE SYSTEM ===

  async generateBattleScenario(participants: Hero[], playerStrategy: string): Promise<BattleScenario> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Create an epic battle scenario:
      
      Participants:
      ${participants.map(h => `- ${h.name} (${h.class}, Level ${h.level})`).join('\n')}
      
      Player Strategy: ${playerStrategy}
      
      Generate:
      1. Atmospheric environment
      2. Weather conditions affecting combat
      3. Environmental obstacles/features
      4. Strategic advantages for each side
      5. Narrative context for the battle
      
      Make it cinematic and tactical.
      Return as JSON with BattleScenario interface.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Battle scenario generation failed:', error);
      return this.getFallbackBattleScenario();
    }
  }

  async predictBattleOutcome(scenario: BattleScenario, heroes: Hero[], strategies: string[]): Promise<{
    winProbability: number;
    keyFactors: string[];
    recommendedActions: string[];
  }> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Analyze this battle and predict outcomes:
      
      Environment: ${scenario.environment}
      Weather: ${scenario.weather}
      
      Heroes and Strategies:
      ${heroes.map((h, i) => `${h.name}: ${strategies[i]}`).join('\n')}
      
      Provide:
      1. Win probability (0-100)
      2. Key factors affecting outcome
      3. Recommended tactical adjustments
      
      Consider stats, environment, and strategy synergy.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Battle prediction failed:', error);
      return {
        winProbability: 50,
        keyFactors: ['Balanced matchup'],
        recommendedActions: ['Stay alert', 'Adapt to situation']
      };
    }
  }

  // === INTELLIGENT NPC SYSTEM ===

  async generateNPCDialogue(npcId: string, context: string, playerHistory: string[]): Promise<NPCDialogue> {
    const npcData = this.worldState.get(`npc_${npcId}`) || {};
    
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Generate NPC dialogue:
      
      NPC: ${npcData.name || 'Mysterious Figure'}
      Personality: ${npcData.personality || 'Wise and cryptic'}
      Role: ${npcData.role || 'Quest giver'}
      
      Context: ${context}
      Player History: ${playerHistory.slice(-3).join('; ')}
      
      Create 3-4 dialogue options that:
      1. Reflect NPC personality
      2. Respond to context
      3. Reference player actions
      4. Offer meaningful choices
      5. Advance the narrative
      
      Return as JSON with NPCDialogue interface.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error('NPC dialogue generation failed:', error);
      return this.getFallbackDialogue(npcId, context);
    }
  }

  // === WORLD STATE MANAGEMENT ===

  private initializeWorldState() {
    this.worldState.set('current_season', 'spring');
    this.worldState.set('global_events', ['The Great Convergence', 'Shadow Portal Instability']);
    this.worldState.set('active_storylines', ['The Lost Heir', 'Cosmic Awakening', 'Guild Wars']);
    this.worldState.set('economic_state', { inflation: 1.2, rare_items_demand: 'high' });
  }

  updateWorldState(key: string, value: any) {
    this.worldState.set(key, value);
  }

  getWorldState(key: string): any {
    return this.worldState.get(key);
  }

  private getRelevantWorldEvents(): string[] {
    return this.worldState.get('global_events') || [];
  }

  private getActiveStorylines(): string {
    const storylines = this.worldState.get('active_storylines') || [];
    return storylines.join(', ');
  }

  // === UTILITY FUNCTIONS ===

  private generateUniqueId(): string {
    return `cosmic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getFallbackHero(): Hero {
    return {
      id: this.generateUniqueId(),
      name: 'Cosmic Wanderer',
      class: 'Mystic',
      level: 1,
      stats: {
        attack: 20,
        defense: 20,
        magic: 25,
        speed: 20,
        luck: 15
      },
      personality: {
        traits: ['Curious', 'Determined', 'Wise'],
        alignment: 'neutral',
        motivation: 'Discover the secrets of the cosmos'
      },
      history: []
    };
  }

  private getFallbackQuest(): Quest {
    return {
      id: this.generateUniqueId(),
      title: 'The Cosmic Trial',
      description: 'Prove your worth by completing a series of challenges across the multiverse.',
      objectives: [
        'Complete 3 combat encounters',
        'Solve the Ancient Puzzle',
        'Collect cosmic essence fragments'
      ],
      rewards: {
        experience: 1000,
        tokens: 500,
        items: ['Cosmic Shard', 'Experience Booster']
      },
      difficulty: 'medium'
    };
  }

  private getFallbackBattleScenario(): BattleScenario {
    return {
      environment: 'Floating Cosmic Platform',
      weather: 'Clear with cosmic winds',
      obstacles: ['Energy barriers', 'Gravity wells'],
      strategicAdvantages: ['High ground', 'Elemental alignment'],
      narrativeContext: 'A destined confrontation among the stars'
    };
  }

  private getFallbackDialogue(npcId: string, context: string): NPCDialogue {
    return {
      npcId,
      context,
      playerHistory: [],
      responses: [
        {
          text: "Greetings, traveler. The cosmos has strange ways of bringing people together.",
          mood: 'friendly'
        },
        {
          text: "I sense great potential in you. Are you ready for what lies ahead?",
          mood: 'mysterious'
        }
      ]
    };
  }

  // === PUBLIC INTERFACE ===

  async processPlayerAction(playerId: string, action: string, context: any): Promise<any> {
    // Update player data
    const playerData = this.playerData.get(playerId) || {};
    playerData.lastAction = action;
    playerData.actionHistory = [...(playerData.actionHistory || []), action].slice(-10);
    this.playerData.set(playerId, playerData);

    // Generate AI response based on action type
    switch (action) {
      case 'generate_hero':
        return await this.generateHero(context);
      case 'generate_quest':
        return await this.generatePersonalizedQuest(playerId, context.history);
      case 'battle_scenario':
        return await this.generateBattleScenario(context.participants, context.strategy);
      case 'npc_dialogue':
        return await this.generateNPCDialogue(context.npcId, context.situation, context.playerHistory);
      default:
        return { message: 'Action processed successfully' };
    }
  }
}

// Global AI Engine Instance
export const aiEngine = CosmicAIEngine.getInstance();

// Convenience functions
export const generateHero = (preferences: any) => aiEngine.processPlayerAction('global', 'generate_hero', preferences);
export const generateQuest = (playerId: string, history: string[]) => aiEngine.processPlayerAction(playerId, 'generate_quest', { history });
export const createBattleScenario = (participants: Hero[], strategy: string) => 
  aiEngine.processPlayerAction('global', 'battle_scenario', { participants, strategy });
export const getNPCDialogue = (npcId: string, situation: string, playerHistory: string[]) => 
  aiEngine.processPlayerAction('global', 'npc_dialogue', { npcId, situation, playerHistory });

export default aiEngine;
