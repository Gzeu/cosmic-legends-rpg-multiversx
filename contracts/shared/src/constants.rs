// Game Constants
pub const MAX_HERO_LEVEL: u32 = 100;
pub const MAX_ITEM_LEVEL: u32 = 50;
pub const MAX_EVOLUTION_STAGE: u32 = 10;
pub const BASE_STAT_POINTS: u32 = 100;
pub const STAT_POINTS_PER_LEVEL: u32 = 5;

// AI Constants
pub const AI_EVOLUTION_THRESHOLD: u64 = 1000; // usage count for AI evolution
pub const AI_LEARNING_COOLDOWN: u64 = 86400; // 24 hours in seconds
pub const MAX_AI_REQUESTS_PER_HOUR: u32 = 100;
pub const AI_PREDICTION_CONFIDENCE_THRESHOLD: u32 = 75;

// Battle Constants
pub const BATTLE_TIMEOUT: u64 = 1800; // 30 minutes
pub const MAX_BATTLE_PARTICIPANTS: usize = 10;
pub const TOURNAMENT_ENTRY_FEE: u64 = 1_000_000_000_000_000_000; // 1 EGLD
pub const PVP_MATCH_FEE: u64 = 100_000_000_000_000_000; // 0.1 EGLD

// Cross-chain Constants
pub const BRIDGE_FEE_PERCENTAGE: u64 = 50; // 0.5% (basis points)
pub const MIN_BRIDGE_AMOUNT: u64 = 1_000_000_000_000_000_000; // 1 EGLD
pub const CROSS_CHAIN_TIMEOUT: u64 = 3600; // 1 hour

// Revenue Constants
pub const AI_COMPANION_MONTHLY_FEE: u64 = 15_000_000_000_000_000_000; // 15 EGLD
pub const NFT_EVOLUTION_FEE: u64 = 8_000_000_000_000_000_000; // 8 EGLD
pub const MARKETPLACE_FEE_PERCENTAGE: u64 = 250; // 2.5% (basis points)
pub const TOURNAMENT_FEE_PERCENTAGE: u64 = 100; // 1% (basis points)

// Time Constants
pub const SECONDS_PER_DAY: u64 = 86400;
pub const SECONDS_PER_WEEK: u64 = 604800;
pub const SECONDS_PER_MONTH: u64 = 2592000; // 30 days

// Limits
pub const MAX_HEROES_PER_ACCOUNT: u32 = 50;
pub const MAX_ITEMS_PER_ACCOUNT: u32 = 200;
pub const MAX_NAME_LENGTH: usize = 32;
pub const MAX_DESCRIPTION_LENGTH: usize = 256;

// Gas Limits
pub const AI_REQUEST_GAS_LIMIT: u64 = 10_000_000;
pub const BATTLE_EXECUTION_GAS_LIMIT: u64 = 50_000_000;
pub const CROSS_CHAIN_GAS_LIMIT: u64 = 25_000_000;
