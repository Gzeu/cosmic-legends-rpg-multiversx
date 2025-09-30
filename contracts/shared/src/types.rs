multiversx_sc::imports!();
multiversx_sc::derive_imports!();

// Hero Types
#[derive(TypeAbi, TopEncode, TopDecode, Clone, PartialEq, Eq, Debug)]
pub struct Hero {
    pub id: u64,
    pub name: ManagedBuffer,
    pub class: HeroClass,
    pub level: u32,
    pub experience: u64,
    pub stats: HeroStats,
    pub equipment: Equipment,
    pub ai_traits: AITraits,
    pub creation_timestamp: u64,
    pub last_evolution: u64,
}

#[derive(TypeAbi, TopEncode, TopDecode, Clone, PartialEq, Eq, Debug)]
pub enum HeroClass {
    Warrior,
    Mage,
    Rogue,
    Paladin,
    Necromancer,
    Elementalist,
}

#[derive(TypeAbi, TopEncode, TopDecode, Clone, PartialEq, Eq, Debug)]
pub struct HeroStats {
    pub strength: u32,
    pub intelligence: u32,
    pub agility: u32,
    pub vitality: u32,
    pub luck: u32,
    pub magic_power: u32,
}

#[derive(TypeAbi, TopEncode, TopDecode, Clone, PartialEq, Eq, Debug)]
pub struct Equipment {
    pub weapon: Option<u64>,
    pub armor: Option<u64>,
    pub helmet: Option<u64>,
    pub boots: Option<u64>,
    pub accessory: Option<u64>,
}

#[derive(TypeAbi, TopEncode, TopDecode, Clone, PartialEq, Eq, Debug)]
pub struct AITraits {
    pub personality: ManagedBuffer,
    pub battle_style: BattleStyle,
    pub adaptation_rate: u32,
    pub learning_factor: u32,
    pub ai_seed: u64,
}

#[derive(TypeAbi, TopEncode, TopDecode, Clone, PartialEq, Eq, Debug)]
pub enum BattleStyle {
    Aggressive,
    Defensive,
    Balanced,
    Tactical,
    Berserker,
}

// Equipment Types
#[derive(TypeAbi, TopEncode, TopDecode, Clone, PartialEq, Eq, Debug)]
pub struct Item {
    pub id: u64,
    pub name: ManagedBuffer,
    pub item_type: ItemType,
    pub rarity: Rarity,
    pub level: u32,
    pub stats_bonus: HeroStats,
    pub special_effects: ManagedVec<SpecialEffect>,
    pub durability: u32,
    pub max_durability: u32,
    pub evolution_stage: u32,
    pub usage_count: u64,
    pub ai_generated: bool,
}

#[derive(TypeAbi, TopEncode, TopDecode, Clone, PartialEq, Eq, Debug)]
pub enum ItemType {
    Weapon,
    Armor,
    Helmet,
    Boots,
    Accessory,
    Consumable,
}

#[derive(TypeAbi, TopEncode, TopDecode, Clone, PartialEq, Eq, Debug)]
pub enum Rarity {
    Common,
    Uncommon,
    Rare,
    Epic,
    Legendary,
    Mythic,
    AI_Generated,
}

#[derive(TypeAbi, TopEncode, TopDecode, Clone, PartialEq, Eq, Debug)]
pub struct SpecialEffect {
    pub effect_type: EffectType,
    pub value: u32,
    pub duration: u32,
}

#[derive(TypeAbi, TopEncode, TopDecode, Clone, PartialEq, Eq, Debug)]
pub enum EffectType {
    DamageBoost,
    DefenseBoost,
    SpeedBoost,
    CriticalChance,
    LifeSteal,
    ManaRegeneration,
    ElementalResistance,
    AILearningBoost,
}

// Battle Types
#[derive(TypeAbi, TopEncode, TopDecode, Clone, PartialEq, Eq, Debug)]
pub struct Battle {
    pub id: u64,
    pub participants: ManagedVec<ManagedAddress>,
    pub hero_ids: ManagedVec<u64>,
    pub battle_type: BattleType,
    pub status: BattleStatus,
    pub start_time: u64,
    pub end_time: Option<u64>,
    pub winner: Option<ManagedAddress>,
    pub rewards: BattleRewards,
    pub ai_difficulty: u32,
}

#[derive(TypeAbi, TopEncode, TopDecode, Clone, PartialEq, Eq, Debug)]
pub enum BattleType {
    PvP,
    PvE,
    Tournament,
    AITraining,
    GuildWar,
}

#[derive(TypeAbi, TopEncode, TopDecode, Clone, PartialEq, Eq, Debug)]
pub enum BattleStatus {
    Pending,
    InProgress,
    Completed,
    Cancelled,
}

#[derive(TypeAbi, TopEncode, TopDecode, Clone, PartialEq, Eq, Debug)]
pub struct BattleRewards {
    pub experience: u64,
    pub tokens: BigUint,
    pub items: ManagedVec<u64>,
    pub ai_evolution_points: u32,
}

// AI Integration Types
#[derive(TypeAbi, TopEncode, TopDecode, Clone, PartialEq, Eq, Debug)]
pub struct AIRequest {
    pub request_id: u64,
    pub request_type: AIRequestType,
    pub data: ManagedBuffer,
    pub callback_address: ManagedAddress,
    pub timestamp: u64,
    pub processed: bool,
}

#[derive(TypeAbi, TopEncode, TopDecode, Clone, PartialEq, Eq, Debug)]
pub enum AIRequestType {
    HeroGeneration,
    ItemEvolution,
    BattlePrediction,
    PersonalityAnalysis,
    MatchmakingOptimization,
}
