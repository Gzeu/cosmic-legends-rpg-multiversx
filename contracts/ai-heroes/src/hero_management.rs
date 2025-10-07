#![allow(non_snake_case)]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

use shared::*;

#[multiversx_sc::module]
pub trait HeroManagementModule:
    shared::StorageModule
    + shared::EventsModule
{
    // Hero Creation and Management
    #[endpoint(createHero)]
    #[payable("EGLD")]
    fn create_hero(&self, hero_class: ManagedBuffer, name: ManagedBuffer) -> u64 {
        self.require_not_paused();
        
        let payment = self.call_value().egld_value().clone_value();
        let creation_fee = BigUint::from(1_000_000_000_000_000_000u64); // 1 EGLD
        require!(payment >= creation_fee, "Insufficient payment for hero creation");
        
        let caller = self.blockchain().get_caller();
        let current_count = self.user_hero_count(&caller).get();
        let max_heroes = 50u32; // From game settings
        require!(current_count < max_heroes, "Maximum heroes per user reached");
        
        let hero_id = self.hero_count().get() + 1;
        self.hero_count().set(hero_id);
        
        // Create hero with initial stats
        let hero = Hero {
            id: hero_id,
            owner: caller.clone(),
            name: name.clone(),
            class: hero_class.clone(),
            level: 1u32,
            experience: 0u64,
            health: 100u32,
            attack: 20u32,
            defense: 15u32,
            speed: 10u32,
            intelligence: 10u32,
            created_at: self.blockchain().get_block_timestamp(),
            evolved_at: 0u64,
            battle_count: 0u32,
            win_count: 0u32,
            rarity: Rarity::Common,
            equipment_slots: ManagedVec::new(),
            special_abilities: ManagedVec::new(),
            metadata_uri: ManagedBuffer::new(),
        };
        
        // Store hero data
        self.heroes(&hero_id).set(&hero);
        self.user_heroes(&caller).insert(hero_id);
        self.user_hero_count(&caller).set(current_count + 1);
        
        // Track revenue
        self.add_revenue(&ManagedBuffer::from(b"hero_creation"), &payment);
        
        // Emit event
        self.hero_created_event(
            &hero_id,
            &caller,
            &name,
            &hero_class,
            &payment
        );
        
        hero_id
    }
    
    #[endpoint(transferHero)]
    fn transfer_hero(&self, hero_id: u64, to: ManagedAddress) {
        self.require_not_paused();
        
        let caller = self.blockchain().get_caller();
        let mut hero = self.heroes(&hero_id).get();
        
        require!(hero.owner == caller, "Only hero owner can transfer");
        require!(to.is_valid(), "Invalid recipient address");
        require!(caller != to, "Cannot transfer to yourself");
        
        // Update ownership
        hero.owner = to.clone();
        self.heroes(&hero_id).set(&hero);
        
        // Update user collections
        self.user_heroes(&caller).swap_remove(&hero_id);
        self.user_heroes(&to).insert(hero_id);
        
        let caller_count = self.user_hero_count(&caller).get();
        let to_count = self.user_hero_count(&to).get();
        
        self.user_hero_count(&caller).set(caller_count - 1);
        self.user_hero_count(&to).set(to_count + 1);
        
        // Emit event
        self.hero_transferred_event(&hero_id, &caller, &to);
    }
    
    #[endpoint(evolveHero)]
    #[payable("EGLD")]
    fn evolve_hero(&self, hero_id: u64) {
        self.require_not_paused();
        
        let payment = self.call_value().egld_value().clone_value();
        let evolution_fee = BigUint::from(500_000_000_000_000_000u64); // 0.5 EGLD
        require!(payment >= evolution_fee, "Insufficient payment for evolution");
        
        let caller = self.blockchain().get_caller();
        let mut hero = self.heroes(&hero_id).get();
        
        require!(hero.owner == caller, "Only hero owner can evolve");
        require!(hero.level >= 10, "Hero must be at least level 10 to evolve");
        require!(hero.experience >= 1000, "Insufficient experience for evolution");
        
        // Evolution logic
        hero.level += 5;
        hero.health += 50;
        hero.attack += 25;
        hero.defense += 20;
        hero.speed += 15;
        hero.intelligence += 20;
        hero.experience = 0; // Reset experience after evolution
        hero.evolved_at = self.blockchain().get_block_timestamp();
        
        // Upgrade rarity if conditions met
        if hero.level >= 50 && hero.rarity == Rarity::Common {
            hero.rarity = Rarity::Rare;
        } else if hero.level >= 100 && hero.rarity == Rarity::Rare {
            hero.rarity = Rarity::Epic;
        } else if hero.level >= 200 && hero.rarity == Rarity::Epic {
            hero.rarity = Rarity::Legendary;
        }
        
        self.heroes(&hero_id).set(&hero);
        
        // Track revenue
        self.add_revenue(&ManagedBuffer::from(b"hero_evolution"), &payment);
        
        // Emit event
        self.hero_evolved_event(&hero_id, &hero.level, &hero.rarity);
    }
    
    #[endpoint(levelUpHero)]
    fn level_up_hero(&self, hero_id: u64) {
        self.require_not_paused();
        
        let caller = self.blockchain().get_caller();
        let mut hero = self.heroes(&hero_id).get();
        
        require!(hero.owner == caller, "Only hero owner can level up");
        
        let exp_required = (hero.level as u64) * 100; // 100 exp per level
        require!(hero.experience >= exp_required, "Insufficient experience");
        
        // Level up calculations
        hero.experience -= exp_required;
        hero.level += 1;
        
        // Stat increases based on class
        match hero.class.as_managed_buffer().to_boxed_bytes().as_slice() {
            b"warrior" => {
                hero.health += 15;
                hero.attack += 8;
                hero.defense += 6;
                hero.speed += 2;
                hero.intelligence += 1;
            },
            b"mage" => {
                hero.health += 8;
                hero.attack += 6;
                hero.defense += 3;
                hero.speed += 4;
                hero.intelligence += 10;
            },
            b"archer" => {
                hero.health += 10;
                hero.attack += 7;
                hero.defense += 4;
                hero.speed += 8;
                hero.intelligence += 3;
            },
            b"assassin" => {
                hero.health += 6;
                hero.attack += 10;
                hero.defense += 2;
                hero.speed += 12;
                hero.intelligence += 2;
            },
            _ => {
                // Default balanced growth
                hero.health += 10;
                hero.attack += 6;
                hero.defense += 4;
                hero.speed += 5;
                hero.intelligence += 5;
            }
        }
        
        self.heroes(&hero_id).set(&hero);
        
        // Emit event
        self.hero_level_up_event(&hero_id, &hero.level);
    }
    
    // View functions
    #[view(getHero)]
    fn get_hero(&self, hero_id: u64) -> Hero {
        self.heroes(&hero_id).get()
    }
    
    #[view(getUserHeroes)]
    fn get_user_heroes(&self, user: ManagedAddress) -> ManagedVec<u64> {
        self.user_heroes(&user).iter().collect()
    }
    
    #[view(getUserHeroCount)]
    fn get_user_hero_count(&self, user: ManagedAddress) -> u32 {
        self.user_hero_count(&user).get()
    }
    
    #[view(getHeroStats)]
    fn get_hero_stats(&self, hero_id: u64) -> MultiValue6<u32, u32, u32, u32, u32, u32> {
        let hero = self.heroes(&hero_id).get();
        (
            hero.level,
            hero.health,
            hero.attack,
            hero.defense,
            hero.speed,
            hero.intelligence,
        ).into()
    }
    
    #[view(getHeroBattleStats)]
    fn get_hero_battle_stats(&self, hero_id: u64) -> MultiValue2<u32, u32> {
        let hero = self.heroes(&hero_id).get();
        (hero.battle_count, hero.win_count).into()
    }
    
    #[view(getHerosByRarity)]
    fn get_heroes_by_rarity(&self, rarity: Rarity) -> ManagedVec<u64> {
        let mut result = ManagedVec::new();
        let total_heroes = self.hero_count().get();
        
        for hero_id in 1..=total_heroes {
            let hero = self.heroes(&hero_id).get();
            if hero.rarity == rarity {
                result.push(hero_id);
            }
        }
        
        result
    }
    
    // Battle system integration
    #[endpoint(updateBattleStats)]
    fn update_battle_stats(&self, hero_id: u64, won: bool, exp_gained: u64) {
        // This would typically be called by the battle system contract
        let caller = self.blockchain().get_caller();
        require!(self.is_authorized_caller(&caller), "Unauthorized caller");
        
        let mut hero = self.heroes(&hero_id).get();
        hero.battle_count += 1;
        
        if won {
            hero.win_count += 1;
        }
        
        hero.experience += exp_gained;
        self.heroes(&hero_id).set(&hero);
        
        // Emit event
        self.hero_battle_completed_event(&hero_id, &won, &exp_gained);
    }
    
    // Equipment system
    #[endpoint(equipItem)]
    fn equip_item(&self, hero_id: u64, item_id: u64, slot: u32) {
        let caller = self.blockchain().get_caller();
        let mut hero = self.heroes(&hero_id).get();
        
        require!(hero.owner == caller, "Only hero owner can equip items");
        require!(slot < 6, "Invalid equipment slot"); // 6 equipment slots
        
        // Add item to hero's equipment
        if hero.equipment_slots.len() <= slot as usize {
            hero.equipment_slots.push(item_id);
        } else {
            hero.equipment_slots.set(slot as usize, &item_id);
        }
        
        self.heroes(&hero_id).set(&hero);
        
        // Emit event
        self.item_equipped_event(&hero_id, &item_id, &slot);
    }
    
    // Helper functions
    fn is_authorized_caller(&self, caller: &ManagedAddress) -> bool {
        // Check if caller is authorized (owner, battle contract, etc.)
        caller == &self.owner().get() || self.authorized_contracts(caller).get()
    }
    
    #[only_owner]
    #[endpoint(addAuthorizedContract)]
    fn add_authorized_contract(&self, contract_address: ManagedAddress) {
        self.authorized_contracts(&contract_address).set(true);
    }
    
    #[only_owner]
    #[endpoint(removeAuthorizedContract)]
    fn remove_authorized_contract(&self, contract_address: ManagedAddress) {
        self.authorized_contracts(&contract_address).clear();
    }
}
