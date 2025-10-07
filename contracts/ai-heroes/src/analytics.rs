#![allow(non_snake_case)]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

use shared::*;

#[multiversx_sc::module]
pub trait AnalyticsModule:
    shared::StorageModule
    + shared::EventsModule
{
    // Analytics Data Collection
    #[endpoint(recordPlayerAction)]
    fn record_player_action(
        &self,
        action_type: ManagedBuffer,
        hero_id: u64,
        value: u64
    ) {
        let caller = self.blockchain().get_caller();
        let timestamp = self.blockchain().get_block_timestamp();
        
        // Update player activity metrics
        self.player_activity_count(&caller).update(|count| count + 1);
        self.last_activity_timestamp(&caller).set(timestamp);
        
        // Update action-specific metrics
        self.action_count(&action_type).update(|count| count + 1);
        
        // Update daily statistics
        let day_key = timestamp / 86400; // Seconds in a day
        self.daily_active_users(&day_key).insert(caller.clone());
        self.daily_actions(&day_key, &action_type).update(|count| count + 1);
        
        // Hero-specific analytics
        if hero_id > 0 {
            self.hero_usage_count(&hero_id).update(|count| count + 1);
            self.hero_last_used(&hero_id).set(timestamp);
        }
        
        // Emit analytics event
        self.player_action_recorded_event(
            &caller,
            &action_type,
            &hero_id,
            &value,
            &timestamp
        );
    }
    
    #[endpoint(recordBattleOutcome)]
    fn record_battle_outcome(
        &self,
        hero1_id: u64,
        hero2_id: u64,
        winner_id: u64,
        battle_duration: u64,
        damage_dealt: u64
    ) {
        let caller = self.blockchain().get_caller();
        require!(self.is_authorized_caller(&caller), "Unauthorized caller");
        
        let timestamp = self.blockchain().get_block_timestamp();
        
        // Update battle statistics
        self.total_battles().update(|count| count + 1);
        
        // Update hero battle statistics
        self.hero_battles_fought(&hero1_id).update(|count| count + 1);
        self.hero_battles_fought(&hero2_id).update(|count| count + 1);
        
        if winner_id == hero1_id {
            self.hero_battles_won(&hero1_id).update(|count| count + 1);
        } else if winner_id == hero2_id {
            self.hero_battles_won(&hero2_id).update(|count| count + 1);
        }
        
        // Update battle duration metrics
        self.total_battle_time().update(|time| time + battle_duration);
        self.update_average_battle_duration(battle_duration);
        
        // Update damage statistics
        self.total_damage_dealt().update(|damage| damage + damage_dealt);
        
        // Daily battle metrics
        let day_key = timestamp / 86400;
        self.daily_battles(&day_key).update(|count| count + 1);
        
        // Emit battle analytics event
        self.battle_outcome_recorded_event(
            &hero1_id,
            &hero2_id,
            &winner_id,
            &battle_duration,
            &damage_dealt
        );
    }
    
    #[endpoint(recordEconomicTransaction)]
    fn record_economic_transaction(
        &self,
        transaction_type: ManagedBuffer,
        amount: BigUint,
        currency: ManagedBuffer
    ) {
        let caller = self.blockchain().get_caller();
        let timestamp = self.blockchain().get_block_timestamp();
        
        // Update economic metrics
        self.total_transactions().update(|count| count + 1);
        self.transaction_volume(&currency).update(|volume| volume + &amount);
        
        // Update transaction type metrics
        self.transaction_count_by_type(&transaction_type).update(|count| count + 1);
        self.transaction_volume_by_type(&transaction_type, &currency)
            .update(|volume| volume + &amount);
        
        // Daily economic metrics
        let day_key = timestamp / 86400;
        self.daily_transaction_volume(&day_key, &currency)
            .update(|volume| volume + &amount);
        
        // Player economic activity
        self.player_transaction_count(&caller).update(|count| count + 1);
        self.player_total_spent(&caller, &currency).update(|spent| spent + &amount);
        
        // Emit economic event
        self.economic_transaction_recorded_event(
            &caller,
            &transaction_type,
            &amount,
            &currency
        );
    }
    
    #[endpoint(updateHeroPerformanceMetrics)]
    fn update_hero_performance_metrics(
        &self,
        hero_id: u64,
        exp_gained: u64,
        damage_dealt: u64,
        damage_taken: u64
    ) {
        let caller = self.blockchain().get_caller();
        require!(self.is_authorized_caller(&caller), "Unauthorized caller");
        
        // Update hero performance metrics
        self.hero_total_exp_gained(&hero_id).update(|exp| exp + exp_gained);
        self.hero_total_damage_dealt(&hero_id).update(|damage| damage + damage_dealt);
        self.hero_total_damage_taken(&hero_id).update(|damage| damage + damage_taken);
        
        // Calculate and update efficiency metrics
        let battles_fought = self.hero_battles_fought(&hero_id).get();
        if battles_fought > 0 {
            let avg_damage_per_battle = self.hero_total_damage_dealt(&hero_id).get() / battles_fought;
            self.hero_avg_damage_per_battle(&hero_id).set(avg_damage_per_battle);
            
            let avg_exp_per_battle = self.hero_total_exp_gained(&hero_id).get() / battles_fought;
            self.hero_avg_exp_per_battle(&hero_id).set(avg_exp_per_battle);
        }
        
        // Update global performance metrics
        self.total_exp_gained().update(|exp| exp + exp_gained);
        self.total_damage_in_game().update(|damage| damage + damage_dealt + damage_taken);
    }
    
    // Helper functions
    fn update_average_battle_duration(&self, new_duration: u64) {
        let total_battles = self.total_battles().get();
        let current_avg = self.average_battle_duration().get();
        
        if total_battles > 0 {
            let new_avg = ((current_avg * (total_battles - 1)) + new_duration) / total_battles;
            self.average_battle_duration().set(new_avg);
        } else {
            self.average_battle_duration().set(new_duration);
        }
    }
    
    // View functions for analytics
    #[view(getPlayerStats)]
    fn get_player_stats(&self, player: ManagedAddress) -> MultiValue4<u64, u64, u64, BigUint> {
        (
            self.player_activity_count(&player).get(),
            self.last_activity_timestamp(&player).get(),
            self.player_transaction_count(&player).get(),
            self.player_total_spent(&player, &ManagedBuffer::from(b"EGLD")).get(),
        ).into()
    }
    
    #[view(getHeroPerformanceStats)]
    fn get_hero_performance_stats(&self, hero_id: u64) -> MultiValue6<u64, u64, u64, u64, u64, u64> {
        (
            self.hero_battles_fought(&hero_id).get(),
            self.hero_battles_won(&hero_id).get(),
            self.hero_total_exp_gained(&hero_id).get(),
            self.hero_total_damage_dealt(&hero_id).get(),
            self.hero_total_damage_taken(&hero_id).get(),
            self.hero_usage_count(&hero_id).get(),
        ).into()
    }
    
    #[view(getGameWideStats)]
    fn get_game_wide_stats(&self) -> MultiValue5<u64, u64, u64, u64, u64> {
        (
            self.total_battles().get(),
            self.total_transactions().get(),
            self.total_exp_gained().get(),
            self.total_damage_in_game().get(),
            self.average_battle_duration().get(),
        ).into()
    }
    
    #[view(getDailyStats)]
    fn get_daily_stats(&self, day_timestamp: u64) -> MultiValue3<u32, u64, u64> {
        let day_key = day_timestamp / 86400;
        (
            self.daily_active_users(&day_key).len() as u32,
            self.daily_battles(&day_key).get(),
            self.daily_transaction_volume(&day_key, &ManagedBuffer::from(b"EGLD")).get(),
        ).into()
    }
    
    #[view(getActionStats)]
    fn get_action_stats(&self, action_type: ManagedBuffer) -> u64 {
        self.action_count(&action_type).get()
    }
    
    #[view(getTransactionStats)]
    fn get_transaction_stats(
        &self,
        transaction_type: ManagedBuffer,
        currency: ManagedBuffer
    ) -> MultiValue2<u64, BigUint> {
        (
            self.transaction_count_by_type(&transaction_type).get(),
            self.transaction_volume_by_type(&transaction_type, &currency).get(),
        ).into()
    }
    
    #[view(getHeroWinRate)]
    fn get_hero_win_rate(&self, hero_id: u64) -> u32 {
        let battles_fought = self.hero_battles_fought(&hero_id).get();
        let battles_won = self.hero_battles_won(&hero_id).get();
        
        if battles_fought == 0 {
            return 0;
        }
        
        ((battles_won * 100) / battles_fought) as u32
    }
    
    #[view(getTopPerformingHeroes)]
    fn get_top_performing_heroes(&self, limit: u32) -> ManagedVec<u64> {
        let mut top_heroes = ManagedVec::new();
        let total_heroes = self.hero_count().get();
        let mut hero_scores = ManagedVec::new();
        
        // Calculate performance score for each hero
        for hero_id in 1..=total_heroes {
            let battles_won = self.hero_battles_won(&hero_id).get();
            let battles_fought = self.hero_battles_fought(&hero_id).get();
            let avg_damage = self.hero_avg_damage_per_battle(&hero_id).get();
            
            if battles_fought > 0 {
                let win_rate = (battles_won * 100) / battles_fought;
                let performance_score = win_rate + (avg_damage / 10); // Simple scoring formula
                hero_scores.push((hero_id, performance_score));
            }
        }
        
        // Sort and return top performers (simplified selection)
        let max_results = core::cmp::min(limit as usize, hero_scores.len());
        for i in 0..max_results {
            if i < hero_scores.len() {
                let (hero_id, _score) = hero_scores.get(i);
                top_heroes.push(hero_id);
            }
        }
        
        top_heroes
    }
    
    #[view(getPlayerRanking)]
    fn get_player_ranking(&self, player: ManagedAddress) -> u32 {
        let player_activity = self.player_activity_count(&player).get();
        let player_transactions = self.player_transaction_count(&player).get();
        
        // Simple ranking based on activity (in a real implementation, this would be more sophisticated)
        let player_score = player_activity + (player_transactions * 2);
        
        // Return a mock ranking for now (would need more complex implementation)
        if player_score > 1000 {
            1 // Top tier
        } else if player_score > 500 {
            2 // High tier
        } else if player_score > 100 {
            3 // Medium tier
        } else {
            4 // Low tier
        }
    }
    
    #[view(getTotalRevenue)]
    fn get_total_revenue(&self) -> BigUint {
        self.total_fees().get()
    }
    
    #[view(getRevenueByCategory)]
    fn get_revenue_by_category(&self, category: ManagedBuffer) -> BigUint {
        self.fees_per_type(&category).get()
    }
    
    // Admin functions for analytics
    #[only_owner]
    #[endpoint(resetAnalytics)]
    fn reset_analytics(&self, confirm: bool) {
        require!(confirm, "Must confirm analytics reset");
        
        // Reset global counters
        self.total_battles().clear();
        self.total_transactions().clear();
        self.total_exp_gained().clear();
        self.total_damage_in_game().clear();
        self.average_battle_duration().clear();
        
        // Emit reset event
        self.analytics_reset_event(&self.blockchain().get_caller());
    }
    
    #[only_owner]
    #[endpoint(exportAnalyticsData)]
    fn export_analytics_data(&self, data_type: ManagedBuffer) -> ManagedBuffer {
        // This would generate and return analytics data in a specific format
        // For now, return a simple summary
        match data_type.as_managed_buffer().to_boxed_bytes().as_slice() {
            b"battles" => {
                let total = self.total_battles().get();
                ManagedBuffer::from(format!("Total battles: {}", total).as_bytes())
            },
            b"economy" => {
                let total = self.total_transactions().get();
                ManagedBuffer::from(format!("Total transactions: {}", total).as_bytes())
            },
            _ => ManagedBuffer::from(b"Invalid data type")
        }
    }
}
