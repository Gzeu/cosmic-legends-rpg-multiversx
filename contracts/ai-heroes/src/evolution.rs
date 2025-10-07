#![allow(non_snake_case)]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

use shared::*;

#[multiversx_sc::module]
pub trait EvolutionModule:
    shared::StorageModule
    + shared::EventsModule
{
    // Evolution System
    #[endpoint(triggerEvolution)]
    #[payable("EGLD")]
    fn trigger_evolution(&self, hero_id: u64, evolution_type: EvolutionType) {
        self.require_not_paused();
        
        let payment = self.call_value().egld_value().clone_value();
        let caller = self.blockchain().get_caller();
        let mut hero = self.heroes(&hero_id).get();
        
        require!(hero.owner == caller, "Only hero owner can trigger evolution");
        
        // Check evolution requirements
        self.check_evolution_requirements(&hero, &evolution_type, &payment);
        
        // Apply evolution
        self.apply_evolution(&mut hero, &evolution_type);
        
        // Update hero
        self.heroes(&hero_id).set(&hero);
        
        // Track revenue
        let evolution_name = self.get_evolution_type_name(&evolution_type);
        self.add_revenue(&evolution_name, &payment);
        
        // Emit evolution event
        self.hero_evolution_triggered_event(
            &hero_id,
            &evolution_type,
            &hero.rarity,
            &hero.level
        );
    }
    
    #[endpoint(unlockSpecialAbility)]
    #[payable("EGLD")]
    fn unlock_special_ability(&self, hero_id: u64, ability_id: u32) {
        self.require_not_paused();
        
        let payment = self.call_value().egld_value().clone_value();
        let ability_cost = BigUint::from(200_000_000_000_000_000u64); // 0.2 EGLD
        require!(payment >= ability_cost, "Insufficient payment for ability unlock");
        
        let caller = self.blockchain().get_caller();
        let mut hero = self.heroes(&hero_id).get();
        
        require!(hero.owner == caller, "Only hero owner can unlock abilities");
        require!(hero.level >= 25, "Hero must be at least level 25");
        require!(!self.hero_has_ability(&hero, ability_id), "Ability already unlocked");
        require!(hero.special_abilities.len() < 5, "Maximum abilities reached");
        
        // Add ability to hero
        hero.special_abilities.push(ability_id);
        self.heroes(&hero_id).set(&hero);
        
        // Track revenue
        self.add_revenue(&ManagedBuffer::from(b"ability_unlock"), &payment);
        
        // Emit event
        self.special_ability_unlocked_event(&hero_id, &ability_id);
    }
    
    #[endpoint(ascendHero)]
    #[payable("EGLD")]
    fn ascend_hero(&self, hero_id: u64) {
        self.require_not_paused();
        
        let payment = self.call_value().egld_value().clone_value();
        let ascension_cost = BigUint::from(5_000_000_000_000_000_000u64); // 5 EGLD
        require!(payment >= ascension_cost, "Insufficient payment for ascension");
        
        let caller = self.blockchain().get_caller();
        let mut hero = self.heroes(&hero_id).get();
        
        require!(hero.owner == caller, "Only hero owner can ascend hero");
        require!(hero.level >= 100, "Hero must be at least level 100");
        require!(hero.rarity == Rarity::Legendary, "Only legendary heroes can ascend");
        require!(hero.win_count >= 50, "Hero needs at least 50 battle wins");
        
        // Ascension transforms the hero to mythical status
        hero.rarity = Rarity::Mythical;
        hero.level = 1; // Reset level but with much higher base stats
        hero.health *= 2;
        hero.attack *= 2;
        hero.defense *= 2;
        hero.speed *= 2;
        hero.intelligence *= 2;
        hero.evolved_at = self.blockchain().get_block_timestamp();
        
        // Grant special ascension ability
        if !hero.special_abilities.contains(&999) {
            hero.special_abilities.push(999); // Ascended power ability
        }
        
        self.heroes(&hero_id).set(&hero);
        
        // Track revenue
        self.add_revenue(&ManagedBuffer::from(b"hero_ascension"), &payment);
        
        // Emit event
        self.hero_ascended_event(&hero_id, &hero.health, &hero.attack);
    }
    
    // Evolution requirement checks
    fn check_evolution_requirements(
        &self,
        hero: &Hero,
        evolution_type: &EvolutionType,
        payment: &BigUint
    ) {
        match evolution_type {
            EvolutionType::StatBoost => {
                let cost = BigUint::from(500_000_000_000_000_000u64); // 0.5 EGLD
                require!(*payment >= cost, "Insufficient payment for stat boost");
                require!(hero.level >= 10, "Hero must be at least level 10");
            },
            EvolutionType::RarityUpgrade => {
                let cost = BigUint::from(1_000_000_000_000_000_000u64); // 1 EGLD
                require!(*payment >= cost, "Insufficient payment for rarity upgrade");
                require!(hero.level >= 25, "Hero must be at least level 25");
                require!(hero.rarity != Rarity::Mythical, "Cannot upgrade mythical rarity");
            },
            EvolutionType::ClassEvolution => {
                let cost = BigUint::from(2_000_000_000_000_000_000u64); // 2 EGLD
                require!(*payment >= cost, "Insufficient payment for class evolution");
                require!(hero.level >= 50, "Hero must be at least level 50");
                require!(hero.battle_count >= 20, "Hero needs battle experience");
            },
            EvolutionType::ElementalInfusion => {
                let cost = BigUint::from(1_500_000_000_000_000_000u64); // 1.5 EGLD
                require!(*payment >= cost, "Insufficient payment for elemental infusion");
                require!(hero.level >= 30, "Hero must be at least level 30");
                require!(hero.rarity >= Rarity::Rare, "Hero must be at least rare");
            },
        }
    }
    
    // Apply evolution effects
    fn apply_evolution(&self, hero: &mut Hero, evolution_type: &EvolutionType) {
        match evolution_type {
            EvolutionType::StatBoost => {
                // Moderate stat increases
                hero.health += 25;
                hero.attack += 15;
                hero.defense += 12;
                hero.speed += 10;
                hero.intelligence += 8;
            },
            EvolutionType::RarityUpgrade => {
                // Upgrade rarity and provide significant stat boost
                match hero.rarity {
                    Rarity::Common => {
                        hero.rarity = Rarity::Rare;
                        hero.health += 50;
                        hero.attack += 30;
                        hero.defense += 25;
                        hero.speed += 20;
                        hero.intelligence += 15;
                    },
                    Rarity::Rare => {
                        hero.rarity = Rarity::Epic;
                        hero.health += 75;
                        hero.attack += 45;
                        hero.defense += 35;
                        hero.speed += 30;
                        hero.intelligence += 25;
                    },
                    Rarity::Epic => {
                        hero.rarity = Rarity::Legendary;
                        hero.health += 100;
                        hero.attack += 60;
                        hero.defense += 50;
                        hero.speed += 40;
                        hero.intelligence += 35;
                    },
                    _ => {} // Already at max non-mythical rarity
                }
            },
            EvolutionType::ClassEvolution => {
                // Enhance class-specific stats significantly
                match hero.class.as_managed_buffer().to_boxed_bytes().as_slice() {
                    b"warrior" => {
                        hero.health += 80;
                        hero.attack += 50;
                        hero.defense += 40;
                    },
                    b"mage" => {
                        hero.intelligence += 70;
                        hero.attack += 40;
                        hero.speed += 20;
                    },
                    b"archer" => {
                        hero.speed += 60;
                        hero.attack += 45;
                        hero.intelligence += 25;
                    },
                    b"assassin" => {
                        hero.speed += 70;
                        hero.attack += 55;
                        hero.defense += 15;
                    },
                    _ => {
                        // Balanced evolution
                        hero.health += 40;
                        hero.attack += 35;
                        hero.defense += 25;
                        hero.speed += 30;
                        hero.intelligence += 30;
                    }
                }
            },
            EvolutionType::ElementalInfusion => {
                // Add elemental damage and resistance
                hero.health += 40;
                hero.attack += 35;
                hero.defense += 30;
                hero.intelligence += 40;
                
                // Add elemental ability if not present
                let elemental_ability_id = self.get_random_elemental_ability();
                if !hero.special_abilities.contains(&elemental_ability_id) {
                    hero.special_abilities.push(elemental_ability_id);
                }
            },
        }
        
        // Update evolution timestamp
        hero.evolved_at = self.blockchain().get_block_timestamp();
        hero.level += 1; // Small level bonus for evolution
    }
    
    // Utility functions
    fn hero_has_ability(&self, hero: &Hero, ability_id: u32) -> bool {
        hero.special_abilities.contains(&ability_id)
    }
    
    fn get_evolution_type_name(&self, evolution_type: &EvolutionType) -> ManagedBuffer {
        match evolution_type {
            EvolutionType::StatBoost => ManagedBuffer::from(b"stat_boost"),
            EvolutionType::RarityUpgrade => ManagedBuffer::from(b"rarity_upgrade"),
            EvolutionType::ClassEvolution => ManagedBuffer::from(b"class_evolution"),
            EvolutionType::ElementalInfusion => ManagedBuffer::from(b"elemental_infusion"),
        }
    }
    
    fn get_random_elemental_ability(&self) -> u32 {
        // Simple pseudo-random selection based on block timestamp
        let timestamp = self.blockchain().get_block_timestamp();
        let elemental_abilities = [100, 101, 102, 103, 104]; // Fire, Water, Earth, Air, Lightning
        let index = (timestamp % 5) as usize;
        elemental_abilities[index]
    }
    
    // View functions
    #[view(getEvolutionCost)]
    fn get_evolution_cost(&self, evolution_type: EvolutionType) -> BigUint {
        match evolution_type {
            EvolutionType::StatBoost => BigUint::from(500_000_000_000_000_000u64),
            EvolutionType::RarityUpgrade => BigUint::from(1_000_000_000_000_000_000u64),
            EvolutionType::ClassEvolution => BigUint::from(2_000_000_000_000_000_000u64),
            EvolutionType::ElementalInfusion => BigUint::from(1_500_000_000_000_000_000u64),
        }
    }
    
    #[view(canEvolve)]
    fn can_evolve(&self, hero_id: u64, evolution_type: EvolutionType) -> bool {
        let hero = self.heroes(&hero_id).get();
        
        match evolution_type {
            EvolutionType::StatBoost => hero.level >= 10,
            EvolutionType::RarityUpgrade => {
                hero.level >= 25 && hero.rarity != Rarity::Mythical
            },
            EvolutionType::ClassEvolution => {
                hero.level >= 50 && hero.battle_count >= 20
            },
            EvolutionType::ElementalInfusion => {
                hero.level >= 30 && hero.rarity >= Rarity::Rare
            },
        }
    }
    
    #[view(getHeroEvolutionHistory)]
    fn get_hero_evolution_history(&self, hero_id: u64) -> MultiValue2<u64, u32> {
        let hero = self.heroes(&hero_id).get();
        (hero.evolved_at, hero.special_abilities.len() as u32).into()
    }
    
    #[view(getAbilityCost)]
    fn get_ability_cost(&self) -> BigUint {
        BigUint::from(200_000_000_000_000_000u64) // 0.2 EGLD
    }
    
    #[view(getAscensionCost)]
    fn get_ascension_cost(&self) -> BigUint {
        BigUint::from(5_000_000_000_000_000_000u64) // 5 EGLD
    }
    
    #[view(canAscend)]
    fn can_ascend(&self, hero_id: u64) -> bool {
        let hero = self.heroes(&hero_id).get();
        hero.level >= 100 && hero.rarity == Rarity::Legendary && hero.win_count >= 50
    }
}
