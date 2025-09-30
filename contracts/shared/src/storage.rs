multiversx_sc::imports!();
multiversx_sc::derive_imports!();

use crate::types::*;

#[multiversx_sc::module]
pub trait StorageModule {
    // Contract Administration
    #[view(getOwner)]
    #[storage_mapper("owner")]
    fn owner(&self) -> SingleValueMapper<ManagedAddress>;

    #[view(isPaused)]
    #[storage_mapper("paused")]
    fn paused(&self) -> SingleValueMapper<bool>;

    // Hero Storage
    #[view(getHero)]
    #[storage_mapper("heroes")]
    fn heroes(&self, hero_id: &u64) -> SingleValueMapper<Hero>;

    #[view(getHeroOwner)]
    #[storage_mapper("hero_owners")]
    fn hero_owners(&self, hero_id: &u64) -> SingleValueMapper<ManagedAddress>;

    #[view(getUserHeroes)]
    #[storage_mapper("user_heroes")]
    fn user_heroes(&self, user: &ManagedAddress) -> UnorderedSetMapper<u64>;

    #[view(getHeroCount)]
    #[storage_mapper("hero_count")]
    fn hero_count(&self) -> SingleValueMapper<u64>;

    // Equipment Storage
    #[view(getItem)]
    #[storage_mapper("items")]
    fn items(&self, item_id: &u64) -> SingleValueMapper<Item>;

    #[view(getItemOwner)]
    #[storage_mapper("item_owners")]
    fn item_owners(&self, item_id: &u64) -> SingleValueMapper<ManagedAddress>;

    #[view(getUserItems)]
    #[storage_mapper("user_items")]
    fn user_items(&self, user: &ManagedAddress) -> UnorderedSetMapper<u64>;

    #[view(getItemCount)]
    #[storage_mapper("item_count")]
    fn item_count(&self) -> SingleValueMapper<u64>;

    // Battle Storage
    #[view(getBattle)]
    #[storage_mapper("battles")]
    fn battles(&self, battle_id: &u64) -> SingleValueMapper<Battle>;

    #[view(getActiveBattles)]
    #[storage_mapper("active_battles")]
    fn active_battles(&self) -> UnorderedSetMapper<u64>;

    #[view(getUserBattles)]
    #[storage_mapper("user_battles")]
    fn user_battles(&self, user: &ManagedAddress) -> UnorderedSetMapper<u64>;

    #[view(getBattleCount)]
    #[storage_mapper("battle_count")]
    fn battle_count(&self) -> SingleValueMapper<u64>;

    // AI Integration Storage
    #[view(getAIRequest)]
    #[storage_mapper("ai_requests")]
    fn ai_requests(&self, request_id: &u64) -> SingleValueMapper<AIRequest>;

    #[view(getPendingAIRequests)]
    #[storage_mapper("pending_ai_requests")]
    fn pending_ai_requests(&self) -> UnorderedSetMapper<u64>;

    #[view(getUserAIRequests)]
    #[storage_mapper("user_ai_requests")]
    fn user_ai_requests(&self, user: &ManagedAddress) -> UnorderedSetMapper<u64>;

    #[view(getAIRequestCount)]
    #[storage_mapper("ai_request_count")]
    fn ai_request_count(&self) -> SingleValueMapper<u64>;

    // Subscription Storage
    #[view(getSubscription)]
    #[storage_mapper("subscriptions")]
    fn subscriptions(&self, user: &ManagedAddress) -> SingleValueMapper<u64>; // expiry timestamp

    #[view(getSubscriptionType)]
    #[storage_mapper("subscription_types")]
    fn subscription_types(&self, user: &ManagedAddress) -> SingleValueMapper<ManagedBuffer>;

    // Cross-chain Storage
    #[view(getCrossChainTransfer)]
    #[storage_mapper("cross_chain_transfers")]
    fn cross_chain_transfers(&self, transfer_id: &u64) -> SingleValueMapper<ManagedBuffer>; // JSON data

    #[view(getPendingTransfers)]
    #[storage_mapper("pending_transfers")]
    fn pending_transfers(&self) -> UnorderedSetMapper<u64>;

    // Revenue Storage
    #[view(getTotalFees)]
    #[storage_mapper("total_fees")]
    fn total_fees(&self) -> SingleValueMapper<BigUint>;

    #[view(getFeesPerType)]
    #[storage_mapper("fees_per_type")]
    fn fees_per_type(&self, fee_type: &ManagedBuffer) -> SingleValueMapper<BigUint>;

    // Game Configuration
    #[view(getAIEndpoint)]
    #[storage_mapper("ai_endpoint")]
    fn ai_endpoint(&self) -> SingleValueMapper<ManagedBuffer>;

    #[view(getBridgeContracts)]
    #[storage_mapper("bridge_contracts")]
    fn bridge_contracts(&self, chain_id: &u64) -> SingleValueMapper<ManagedAddress>;

    #[view(getGameSettings)]
    #[storage_mapper("game_settings")]
    fn game_settings(&self, key: &ManagedBuffer) -> SingleValueMapper<ManagedBuffer>;
}
