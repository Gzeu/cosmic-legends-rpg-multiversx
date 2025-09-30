#![no_std]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

use shared::*;

mod ai_generation;
mod hero_management;
mod evolution;
mod analytics;

#[multiversx_sc::contract]
pub trait AIHeroesContract:
    shared::StorageModule
    + shared::EventsModule
    + ai_generation::AIGenerationModule
    + hero_management::HeroManagementModule
    + evolution::EvolutionModule
    + analytics::AnalyticsModule
{
    #[init]
    fn init(&self) {
        self.owner().set(&self.blockchain().get_caller());
        self.paused().set(false);
        self.hero_count().set(0u64);
        
        // Initialize AI endpoints
        self.ai_endpoint().set(ManagedBuffer::from(b"https://api.cosmic-legends.com/ai"));
        
        // Set initial game settings
        self.game_settings(&ManagedBuffer::from(b"max_heroes_per_user"))
            .set(ManagedBuffer::from(b"50"));
        self.game_settings(&ManagedBuffer::from(b"ai_generation_fee"))
            .set(ManagedBuffer::from(b"1000000000000000000")); // 1 EGLD
    }

    #[upgrade]
    fn upgrade(&self) {}

    // Admin Functions
    #[only_owner]
    #[endpoint(setPaused)]
    fn set_paused(&self, paused: bool) {
        self.paused().set(paused);
    }

    #[only_owner]
    #[endpoint(setAIEndpoint)]
    fn set_ai_endpoint(&self, endpoint: ManagedBuffer) {
        self.ai_endpoint().set(endpoint);
    }

    #[only_owner]
    #[endpoint(setGameSetting)]
    fn set_game_setting(&self, key: ManagedBuffer, value: ManagedBuffer) {
        self.game_settings(&key).set(value);
    }

    #[only_owner]
    #[endpoint(withdrawFees)]
    fn withdraw_fees(&self) {
        let caller = self.blockchain().get_caller();
        let balance = self.blockchain().get_sc_balance(&EgldOrEsdtTokenIdentifier::egld(), 0);
        
        if balance > 0 {
            self.send().direct_egld(&caller, &balance);
        }
    }

    // Public Views
    #[view(getTotalHeroes)]
    fn get_total_heroes(&self) -> u64 {
        self.hero_count().get()
    }

    #[view(getContractInfo)]
    fn get_contract_info(&self) -> MultiValue4<ManagedAddress, bool, u64, ManagedBuffer> {
        (
            self.owner().get(),
            self.paused().get(),
            self.hero_count().get(),
            self.ai_endpoint().get(),
        ).into()
    }

    // Revenue tracking
    #[view(getTotalRevenue)]
    fn get_total_revenue(&self) -> BigUint {
        self.total_fees().get()
    }

    #[view(getRevenueByType)]
    fn get_revenue_by_type(&self, fee_type: ManagedBuffer) -> BigUint {
        self.fees_per_type(&fee_type).get()
    }

    // Emergency functions
    #[only_owner]
    #[endpoint(emergencyPause)]
    fn emergency_pause(&self) {
        self.paused().set(true);
    }

    fn require_not_paused(&self) {
        require!(!self.paused().get(), shared::ERROR_CONTRACT_PAUSED);
    }

    fn add_revenue(&self, fee_type: &ManagedBuffer, amount: &BigUint) {
        let total = self.total_fees().get();
        self.total_fees().set(total + amount);
        
        let type_total = self.fees_per_type(fee_type).get();
        self.fees_per_type(fee_type).set(type_total + amount);
        
        self.fee_collected_event(fee_type, amount, &self.blockchain().get_caller());
    }
}
