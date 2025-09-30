// Error messages for smart contracts

// General Errors
pub const ERROR_NOT_OWNER: &str = "Only owner can perform this action";
pub const ERROR_INVALID_PAYMENT: &str = "Invalid payment amount";
pub const ERROR_INSUFFICIENT_FUNDS: &str = "Insufficient funds";
pub const ERROR_CONTRACT_PAUSED: &str = "Contract is paused";
pub const ERROR_INVALID_ADDRESS: &str = "Invalid address provided";

// Hero Errors
pub const ERROR_HERO_NOT_FOUND: &str = "Hero not found";
pub const ERROR_HERO_NOT_OWNED: &str = "Hero not owned by caller";
pub const ERROR_MAX_LEVEL_REACHED: &str = "Hero has reached maximum level";
pub const ERROR_INSUFFICIENT_EXPERIENCE: &str = "Insufficient experience for evolution";
pub const ERROR_HERO_IN_BATTLE: &str = "Hero is currently in battle";
pub const ERROR_MAX_HEROES_REACHED: &str = "Maximum heroes per account reached";
pub const ERROR_INVALID_HERO_CLASS: &str = "Invalid hero class";

// Equipment Errors
pub const ERROR_ITEM_NOT_FOUND: &str = "Item not found";
pub const ERROR_ITEM_NOT_OWNED: &str = "Item not owned by caller";
pub const ERROR_ITEM_ALREADY_EQUIPPED: &str = "Item already equipped";
pub const ERROR_INCOMPATIBLE_ITEM: &str = "Item incompatible with hero";
pub const ERROR_ITEM_BROKEN: &str = "Item is broken and cannot be used";
pub const ERROR_MAX_ITEMS_REACHED: &str = "Maximum items per account reached";
pub const ERROR_INVALID_ITEM_TYPE: &str = "Invalid item type";

// Battle Errors
pub const ERROR_BATTLE_NOT_FOUND: &str = "Battle not found";
pub const ERROR_BATTLE_ALREADY_STARTED: &str = "Battle has already started";
pub const ERROR_BATTLE_NOT_STARTED: &str = "Battle has not started yet";
pub const ERROR_BATTLE_FINISHED: &str = "Battle has already finished";
pub const ERROR_NOT_BATTLE_PARTICIPANT: &str = "Not a battle participant";
pub const ERROR_HERO_ALREADY_IN_BATTLE: &str = "Hero is already in another battle";
pub const ERROR_INSUFFICIENT_PARTICIPANTS: &str = "Insufficient battle participants";
pub const ERROR_BATTLE_TIMEOUT: &str = "Battle has timed out";

// AI Errors
pub const ERROR_AI_REQUEST_FAILED: &str = "AI request failed";
pub const ERROR_INVALID_AI_REQUEST: &str = "Invalid AI request type";
pub const ERROR_AI_COOLDOWN_ACTIVE: &str = "AI cooldown period active";
pub const ERROR_AI_QUOTA_EXCEEDED: &str = "AI request quota exceeded";
pub const ERROR_AI_RESPONSE_INVALID: &str = "Invalid AI response format";
pub const ERROR_AI_SERVICE_UNAVAILABLE: &str = "AI service temporarily unavailable";

// Cross-chain Errors
pub const ERROR_INVALID_CHAIN_ID: &str = "Invalid destination chain ID";
pub const ERROR_BRIDGE_PAUSED: &str = "Cross-chain bridge is paused";
pub const ERROR_INSUFFICIENT_BRIDGE_FEE: &str = "Insufficient bridge fee";
pub const ERROR_TRANSFER_NOT_FOUND: &str = "Cross-chain transfer not found";
pub const ERROR_TRANSFER_ALREADY_COMPLETED: &str = "Transfer already completed";
pub const ERROR_TRANSFER_EXPIRED: &str = "Transfer has expired";

// Subscription Errors
pub const ERROR_SUBSCRIPTION_NOT_FOUND: &str = "Subscription not found";
pub const ERROR_SUBSCRIPTION_EXPIRED: &str = "Subscription has expired";
pub const ERROR_SUBSCRIPTION_ALREADY_ACTIVE: &str = "Subscription already active";
pub const ERROR_INVALID_SUBSCRIPTION_TYPE: &str = "Invalid subscription type";

// Marketplace Errors
pub const ERROR_ASSET_NOT_FOR_SALE: &str = "Asset is not for sale";
pub const ERROR_INVALID_PRICE: &str = "Invalid sale price";
pub const ERROR_CANNOT_BUY_OWN_ASSET: &str = "Cannot buy your own asset";
pub const ERROR_SALE_EXPIRED: &str = "Sale has expired";
pub const ERROR_ASSET_NOT_OWNED_BY_SELLER: &str = "Asset not owned by seller";
