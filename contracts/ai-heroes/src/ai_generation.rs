multiversx_sc::imports!();
multiversx_sc::derive_imports!();

use shared::*;

#[multiversx_sc::module]
pub trait AIGenerationModule:
    shared::StorageModule
    + shared::EventsModule
{
    // AI-powered hero generation
    #[payable("EGLD")]
    #[endpoint(generateAIHero)]
    fn generate_ai_hero(
        &self,
        name: ManagedBuffer,
        preferred_class: Option<HeroClass>,
        ai_personality: ManagedBuffer,
    ) -> u64 {
        self.require_not_paused();
        
        let payment = self.call_value().egld_value().clone_value();
        let ai_generation_fee = BigUint::from(1_000_000_000_000_000_000u64); // 1 EGLD
        require!(payment >= ai_generation_fee, shared::ERROR_INSUFFICIENT_FUNDS);
        
        let caller = self.blockchain().get_caller();
        let user_hero_count = self.user_heroes(&caller).len();
        require!(user_hero_count < shared::MAX_HEROES_PER_ACCOUNT as usize, shared::ERROR_MAX_HEROES_REACHED);
        
        // Generate AI request
        let request_id = self.create_ai_request(
            AIRequestType::HeroGeneration,
            &self.build_hero_generation_prompt(&name, &preferred_class, &ai_personality),
        );
        
        // Create hero with AI-generated stats
        let hero_id = self.create_hero_from_ai_request(request_id, &caller, name, preferred_class, ai_personality);
        
        // Track revenue
        self.add_revenue(&ManagedBuffer::from(b"ai_hero_generation"), &payment);
        
        hero_id
    }

    // Traditional hero generation (fallback)
    #[payable("EGLD")]
    #[endpoint(generateBasicHero)]
    fn generate_basic_hero(&self, name: ManagedBuffer, hero_class: HeroClass) -> u64 {
        self.require_not_paused();
        
        let payment = self.call_value().egld_value().clone_value();
        let basic_generation_fee = BigUint::from(500_000_000_000_000_000u64); // 0.5 EGLD
        require!(payment >= basic_generation_fee, shared::ERROR_INSUFFICIENT_FUNDS);
        
        let caller = self.blockchain().get_caller();
        let user_hero_count = self.user_heroes(&caller).len();
        require!(user_hero_count < shared::MAX_HEROES_PER_ACCOUNT as usize, shared::ERROR_MAX_HEROES_REACHED);
        
        let hero_id = self.create_basic_hero(&caller, name, hero_class);
        
        // Track revenue
        self.add_revenue(&ManagedBuffer::from(b"basic_hero_generation"), &payment);
        
        hero_id
    }

    fn create_ai_request(&self, request_type: AIRequestType, data: &ManagedBuffer) -> u64 {
        let request_id = self.ai_request_count().get() + 1;
        self.ai_request_count().set(request_id);
        
        let ai_request = AIRequest {
            request_id,
            request_type,
            data: data.clone(),
            callback_address: self.blockchain().get_sc_address(),
            timestamp: self.blockchain().get_block_timestamp(),
            processed: false,
        };
        
        self.ai_requests(&request_id).set(ai_request);
        self.pending_ai_requests().insert(request_id);
        
        let caller = self.blockchain().get_caller();
        self.user_ai_requests(&caller).insert(request_id);
        
        self.ai_request_submitted_event(&request_id, &request_type, &caller);
        
        request_id
    }

    fn build_hero_generation_prompt(
        &self,
        name: &ManagedBuffer,
        preferred_class: &Option<HeroClass>,
        personality: &ManagedBuffer,
    ) -> ManagedBuffer {
        let mut prompt = ManagedBuffer::from(b"Generate RPG hero with name: ");
        prompt.append(name);
        
        if let Some(class) = preferred_class {
            prompt.append(&ManagedBuffer::from(b", preferred class: "));
            match class {
                HeroClass::Warrior => prompt.append(&ManagedBuffer::from(b"Warrior")),
                HeroClass::Mage => prompt.append(&ManagedBuffer::from(b"Mage")),
                HeroClass::Rogue => prompt.append(&ManagedBuffer::from(b"Rogue")),
                HeroClass::Paladin => prompt.append(&ManagedBuffer::from(b"Paladin")),
                HeroClass::Necromancer => prompt.append(&ManagedBuffer::from(b"Necromancer")),
                HeroClass::Elementalist => prompt.append(&ManagedBuffer::from(b"Elementalist")),
            }
        }
        
        prompt.append(&ManagedBuffer::from(b", personality: "));
        prompt.append(personality);
        prompt.append(&ManagedBuffer::from(b". Return JSON with stats, traits, and battle style."));
        
        prompt
    }

    fn create_hero_from_ai_request(
        &self,
        request_id: u64,
        owner: &ManagedAddress,
        name: ManagedBuffer,
        preferred_class: Option<HeroClass>,
        ai_personality: ManagedBuffer,
    ) -> u64 {
        let hero_id = self.hero_count().get() + 1;
        self.hero_count().set(hero_id);
        
        // Generate AI-enhanced stats (simplified for now - would use AI response in production)
        let stats = self.generate_ai_enhanced_stats(&preferred_class, &ai_personality);
        let hero_class = preferred_class.unwrap_or(self.determine_class_from_personality(&ai_personality));
        
        // Create AI traits
        let ai_traits = AITraits {
            personality: ai_personality,
            battle_style: self.determine_battle_style(&hero_class),
            adaptation_rate: self.generate_random_in_range(70, 100),
            learning_factor: self.generate_random_in_range(60, 90),
            ai_seed: self.blockchain().get_block_timestamp() + hero_id,
        };
        
        let hero = Hero {
            id: hero_id,
            name,
            class: hero_class.clone(),
            level: 1,
            experience: 0,
            stats,
            equipment: Equipment {
                weapon: None,
                armor: None,
                helmet: None,
                boots: None,
                accessory: None,
            },
            ai_traits,
            creation_timestamp: self.blockchain().get_block_timestamp(),
            last_evolution: self.blockchain().get_block_timestamp(),
        };
        
        self.heroes(&hero_id).set(hero);
        self.hero_owners(&hero_id).set(owner);
        self.user_heroes(owner).insert(hero_id);
        
        self.hero_created_event(owner, hero_id, &hero_class, true);
        
        hero_id
    }

    fn create_basic_hero(&self, owner: &ManagedAddress, name: ManagedBuffer, hero_class: HeroClass) -> u64 {
        let hero_id = self.hero_count().get() + 1;
        self.hero_count().set(hero_id);
        
        let stats = self.generate_basic_stats(&hero_class);
        
        let ai_traits = AITraits {
            personality: ManagedBuffer::from(b"Balanced"),
            battle_style: BattleStyle::Balanced,
            adaptation_rate: 50,
            learning_factor: 50,
            ai_seed: self.blockchain().get_block_timestamp() + hero_id,
        };
        
        let hero = Hero {
            id: hero_id,
            name,
            class: hero_class.clone(),
            level: 1,
            experience: 0,
            stats,
            equipment: Equipment {
                weapon: None,
                armor: None,
                helmet: None,
                boots: None,
                accessory: None,
            },
            ai_traits,
            creation_timestamp: self.blockchain().get_block_timestamp(),
            last_evolution: self.blockchain().get_block_timestamp(),
        };
        
        self.heroes(&hero_id).set(hero);
        self.hero_owners(&hero_id).set(owner);
        self.user_heroes(owner).insert(hero_id);
        
        self.hero_created_event(owner, hero_id, &hero_class, false);
        
        hero_id
    }

    fn generate_ai_enhanced_stats(&self, preferred_class: &Option<HeroClass>, personality: &ManagedBuffer) -> HeroStats {
        // This would integrate with actual AI in production
        // For now, generate enhanced stats based on class and personality
        let base_stats = if let Some(class) = preferred_class {
            self.generate_basic_stats(class)
        } else {
            HeroStats {
                strength: shared::BASE_STAT_POINTS,
                intelligence: shared::BASE_STAT_POINTS,
                agility: shared::BASE_STAT_POINTS,
                vitality: shared::BASE_STAT_POINTS,
                luck: shared::BASE_STAT_POINTS,
                magic_power: shared::BASE_STAT_POINTS,
            }
        };
        
        // Enhance based on personality (simplified)
        let personality_str = personality.to_boxed_bytes();
        let enhancement = (personality_str.len() % 20) as u32 + 10;
        
        HeroStats {
            strength: base_stats.strength + enhancement,
            intelligence: base_stats.intelligence + enhancement,
            agility: base_stats.agility + enhancement,
            vitality: base_stats.vitality + enhancement,
            luck: base_stats.luck + enhancement,
            magic_power: base_stats.magic_power + enhancement,
        }
    }

    fn generate_basic_stats(&self, hero_class: &HeroClass) -> HeroStats {
        match hero_class {
            HeroClass::Warrior => HeroStats {
                strength: shared::BASE_STAT_POINTS + 30,
                intelligence: shared::BASE_STAT_POINTS,
                agility: shared::BASE_STAT_POINTS + 10,
                vitality: shared::BASE_STAT_POINTS + 20,
                luck: shared::BASE_STAT_POINTS,
                magic_power: shared::BASE_STAT_POINTS - 10,
            },
            HeroClass::Mage => HeroStats {
                strength: shared::BASE_STAT_POINTS - 10,
                intelligence: shared::BASE_STAT_POINTS + 30,
                agility: shared::BASE_STAT_POINTS,
                vitality: shared::BASE_STAT_POINTS,
                luck: shared::BASE_STAT_POINTS + 10,
                magic_power: shared::BASE_STAT_POINTS + 20,
            },
            HeroClass::Rogue => HeroStats {
                strength: shared::BASE_STAT_POINTS + 10,
                intelligence: shared::BASE_STAT_POINTS + 10,
                agility: shared::BASE_STAT_POINTS + 30,
                vitality: shared::BASE_STAT_POINTS,
                luck: shared::BASE_STAT_POINTS + 20,
                magic_power: shared::BASE_STAT_POINTS - 10,
            },
            HeroClass::Paladin => HeroStats {
                strength: shared::BASE_STAT_POINTS + 20,
                intelligence: shared::BASE_STAT_POINTS + 10,
                agility: shared::BASE_STAT_POINTS,
                vitality: shared::BASE_STAT_POINTS + 20,
                luck: shared::BASE_STAT_POINTS,
                magic_power: shared::BASE_STAT_POINTS + 10,
            },
            HeroClass::Necromancer => HeroStats {
                strength: shared::BASE_STAT_POINTS,
                intelligence: shared::BASE_STAT_POINTS + 25,
                agility: shared::BASE_STAT_POINTS + 5,
                vitality: shared::BASE_STAT_POINTS - 5,
                luck: shared::BASE_STAT_POINTS + 5,
                magic_power: shared::BASE_STAT_POINTS + 30,
            },
            HeroClass::Elementalist => HeroStats {
                strength: shared::BASE_STAT_POINTS - 5,
                intelligence: shared::BASE_STAT_POINTS + 20,
                agility: shared::BASE_STAT_POINTS + 15,
                vitality: shared::BASE_STAT_POINTS + 5,
                luck: shared::BASE_STAT_POINTS + 15,
                magic_power: shared::BASE_STAT_POINTS + 25,
            },
        }
    }

    fn determine_class_from_personality(&self, personality: &ManagedBuffer) -> HeroClass {
        let bytes = personality.to_boxed_bytes();
        match bytes.len() % 6 {
            0 => HeroClass::Warrior,
            1 => HeroClass::Mage,
            2 => HeroClass::Rogue,
            3 => HeroClass::Paladin,
            4 => HeroClass::Necromancer,
            _ => HeroClass::Elementalist,
        }
    }

    fn determine_battle_style(&self, hero_class: &HeroClass) -> BattleStyle {
        match hero_class {
            HeroClass::Warrior => BattleStyle::Aggressive,
            HeroClass::Mage => BattleStyle::Tactical,
            HeroClass::Rogue => BattleStyle::Balanced,
            HeroClass::Paladin => BattleStyle::Defensive,
            HeroClass::Necromancer => BattleStyle::Tactical,
            HeroClass::Elementalist => BattleStyle::Balanced,
        }
    }

    fn generate_random_in_range(&self, min: u32, max: u32) -> u32 {
        let timestamp = self.blockchain().get_block_timestamp();
        let random_seed = timestamp % (max - min + 1) as u64;
        min + random_seed as u32
    }

    fn require_not_paused(&self);
    fn add_revenue(&self, fee_type: &ManagedBuffer, amount: &BigUint);
}
