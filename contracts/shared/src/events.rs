multiversx_sc::imports!();
multiversx_sc::derive_imports!();

use crate::types::*;

#[multiversx_sc::module]
pub trait EventsModule {
    // Hero Events
    #[event("hero_created")]
    fn hero_created_event(
        &self,
        #[indexed] owner: &ManagedAddress,
        #[indexed] hero_id: u64,
        hero_class: &HeroClass,
        ai_generated: bool,
    );

    #[event("hero_evolved")]
    fn hero_evolved_event(
        &self,
        #[indexed] owner: &ManagedAddress,
        #[indexed] hero_id: u64,
        old_level: u32,
        new_level: u32,
        ai_evolution: bool,
    );

    #[event("hero_stats_updated")]
    fn hero_stats_updated_event(
        &self,
        #[indexed] hero_id: u64,
        old_stats: &HeroStats,
        new_stats: &HeroStats,
    );

    // Equipment Events
    #[event("item_created")]
    fn item_created_event(
        &self,
        #[indexed] owner: &ManagedAddress,
        #[indexed] item_id: u64,
        item_type: &ItemType,
        rarity: &Rarity,
        ai_generated: bool,
    );

    #[event("item_evolved")]
    fn item_evolved_event(
        &self,
        #[indexed] item_id: u64,
        old_stage: u32,
        new_stage: u32,
        usage_based: bool,
    );

    #[event("item_equipped")]
    fn item_equipped_event(
        &self,
        #[indexed] hero_id: u64,
        #[indexed] item_id: u64,
        slot: &ItemType,
    );

    // Battle Events
    #[event("battle_started")]
    fn battle_started_event(
        &self,
        #[indexed] battle_id: u64,
        participants: &ManagedVec<ManagedAddress>,
        battle_type: &BattleType,
        ai_difficulty: u32,
    );

    #[event("battle_completed")]
    fn battle_completed_event(
        &self,
        #[indexed] battle_id: u64,
        #[indexed] winner: &ManagedAddress,
        duration: u64,
        experience_gained: u64,
    );

    #[event("ai_prediction_made")]
    fn ai_prediction_made_event(
        &self,
        #[indexed] battle_id: u64,
        predicted_winner: &ManagedAddress,
        confidence: u32,
    );

    // AI Integration Events
    #[event("ai_request_submitted")]
    fn ai_request_submitted_event(
        &self,
        #[indexed] request_id: u64,
        request_type: &AIRequestType,
        #[indexed] requester: &ManagedAddress,
    );

    #[event("ai_response_received")]
    fn ai_response_received_event(
        &self,
        #[indexed] request_id: u64,
        success: bool,
        gas_used: u64,
    );

    // Cross-chain Events
    #[event("cross_chain_transfer_initiated")]
    fn cross_chain_transfer_initiated_event(
        &self,
        #[indexed] from_address: &ManagedAddress,
        #[indexed] to_chain: u64,
        #[indexed] asset_id: u64,
        asset_type: &ManagedBuffer,
    );

    #[event("cross_chain_transfer_completed")]
    fn cross_chain_transfer_completed_event(
        &self,
        #[indexed] transfer_id: u64,
        #[indexed] to_address: &ManagedAddress,
        success: bool,
    );

    // Revenue Events
    #[event("fee_collected")]
    fn fee_collected_event(
        &self,
        fee_type: &ManagedBuffer,
        amount: &BigUint,
        #[indexed] from_address: &ManagedAddress,
    );

    #[event("subscription_activated")]
    fn subscription_activated_event(
        &self,
        #[indexed] user: &ManagedAddress,
        subscription_type: &ManagedBuffer,
        duration: u64,
        amount_paid: &BigUint,
    );
}
