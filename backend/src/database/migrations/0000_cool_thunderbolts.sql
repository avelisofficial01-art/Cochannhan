CREATE TABLE "account_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"refresh_token" text NOT NULL,
	"expired_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(50) NOT NULL,
	"password_hash" text NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_email_unique" UNIQUE("email"),
	CONSTRAINT "accounts_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "combat_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"monster_id" uuid NOT NULL,
	"damage" integer NOT NULL,
	"skill" varchar(100),
	"is_critical" varchar(5) DEFAULT 'false' NOT NULL,
	"damage_type" varchar(30) DEFAULT 'physical' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "craft_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"recipe_id" uuid NOT NULL,
	"success" varchar(5) DEFAULT 'true' NOT NULL,
	"crafted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "craft_recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"result_type" varchar(20) NOT NULL,
	"result_id" uuid NOT NULL,
	"result_quantity" integer DEFAULT 1 NOT NULL,
	"required_gold" integer DEFAULT 0 NOT NULL,
	"success_rate" integer DEFAULT 100 NOT NULL,
	"min_realm" integer DEFAULT 1 NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cultivation_realms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"level" integer NOT NULL,
	"stat_multiplier" integer DEFAULT 100 NOT NULL,
	"required_breakthrough" varchar(5) DEFAULT 'true' NOT NULL,
	"breakthrough_gold" integer DEFAULT 0 NOT NULL,
	"breakthrough_item_id" uuid,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cultivation_realms_level_unique" UNIQUE("level")
);
--> statement-breakpoint
CREATE TABLE "equipment_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"type" varchar(20) NOT NULL,
	"slot" varchar(30) NOT NULL,
	"tier" varchar(20) DEFAULT 'common' NOT NULL,
	"base_hp" integer DEFAULT 0 NOT NULL,
	"base_atk" integer DEFAULT 0 NOT NULL,
	"base_def" integer DEFAULT 0 NOT NULL,
	"base_crit" integer DEFAULT 0 NOT NULL,
	"required_level" integer DEFAULT 1 NOT NULL,
	"description" text,
	"icon" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "game_config_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "gu_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gu_template_id" uuid NOT NULL,
	"skill_id" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"type" varchar(20) NOT NULL,
	"description" text,
	"cooldown" integer DEFAULT 0 NOT NULL,
	"damage_multiplier" integer DEFAULT 100 NOT NULL,
	"target_type" varchar(20) DEFAULT 'single' NOT NULL,
	"aoe_radius" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gu_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gu_template_id" uuid NOT NULL,
	"hp" integer DEFAULT 0 NOT NULL,
	"atk" integer DEFAULT 0 NOT NULL,
	"def" integer DEFAULT 0 NOT NULL,
	"crit" integer DEFAULT 0 NOT NULL,
	"crit_damage" integer DEFAULT 0 NOT NULL,
	"move_speed" integer DEFAULT 0 NOT NULL,
	"attack_speed" integer DEFAULT 0 NOT NULL,
	"life_steal" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gu_stats_gu_template_id_unique" UNIQUE("gu_template_id")
);
--> statement-breakpoint
CREATE TABLE "gu_synergy" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gu_a" uuid NOT NULL,
	"gu_b" uuid NOT NULL,
	"result_name" varchar(200) NOT NULL,
	"result_description" text,
	"result_skill_id" varchar(100),
	"bonus_hp" integer DEFAULT 0 NOT NULL,
	"bonus_atk" integer DEFAULT 0 NOT NULL,
	"bonus_def" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gu_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"rank" integer DEFAULT 1 NOT NULL,
	"element" varchar(30) NOT NULL,
	"role" varchar(30) NOT NULL,
	"quality" varchar(20) DEFAULT 'common' NOT NULL,
	"description" text,
	"sprite" varchar(255),
	"is_immortal" varchar(5) DEFAULT 'false' NOT NULL,
	"unique_world" varchar(5) DEFAULT 'false' NOT NULL,
	"max_enhance" integer DEFAULT 20 NOT NULL,
	"can_evolve" varchar(5) DEFAULT 'true' NOT NULL,
	"evolve_to" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hidden_areas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"map_id" uuid NOT NULL,
	"condition" text NOT NULL,
	"reward" text
);
--> statement-breakpoint
CREATE TABLE "item_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"type" varchar(30) NOT NULL,
	"description" text,
	"stackable" varchar(5) DEFAULT 'false' NOT NULL,
	"max_stack" integer DEFAULT 1 NOT NULL,
	"sell_price" integer DEFAULT 0 NOT NULL,
	"sprite" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "map_portals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_map_id" uuid NOT NULL,
	"to_map_id" uuid NOT NULL,
	"from_x" integer NOT NULL,
	"from_y" integer NOT NULL,
	"to_x" integer NOT NULL,
	"to_y" integer NOT NULL,
	"portal_name" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "map_spawns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"map_id" uuid NOT NULL,
	"spawn_type" varchar(20) NOT NULL,
	"spawn_ref" varchar(100) NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"respawn_time" integer DEFAULT 30 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"background" varchar(255) DEFAULT 'default' NOT NULL,
	"music" varchar(255),
	"level_min" integer DEFAULT 1 NOT NULL,
	"level_max" integer DEFAULT 9 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "maps_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "monster_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"realm" integer DEFAULT 1 NOT NULL,
	"hp" integer DEFAULT 50 NOT NULL,
	"atk" integer DEFAULT 10 NOT NULL,
	"def" integer DEFAULT 5 NOT NULL,
	"speed" integer DEFAULT 200 NOT NULL,
	"element" varchar(30) DEFAULT 'physical' NOT NULL,
	"sprite" varchar(255) DEFAULT 'monster_1' NOT NULL,
	"drop_table" text,
	"map_id" uuid NOT NULL,
	"respawn_time" integer DEFAULT 30 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "npc_dialogues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"npc_id" uuid NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"text" text NOT NULL,
	"speaker" varchar(50) DEFAULT 'npc' NOT NULL,
	"choices" text,
	"condition_flag" varchar(100),
	"condition_affection_min" integer,
	"set_flag" varchar(100),
	"next_dialogue_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "npc_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"sprite" varchar(255) DEFAULT 'char_2' NOT NULL,
	"faction" varchar(50) DEFAULT 'neutral' NOT NULL,
	"occupation" varchar(50) NOT NULL,
	"map_id" uuid NOT NULL,
	"x" integer DEFAULT 0 NOT NULL,
	"y" integer DEFAULT 0 NOT NULL,
	"affection_min" integer DEFAULT -100 NOT NULL,
	"affection_max" integer DEFAULT 100 NOT NULL,
	"has_shop" varchar(5) DEFAULT 'false' NOT NULL,
	"schedule" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_cultivation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"realm_level" integer DEFAULT 1 NOT NULL,
	"experience" integer DEFAULT 0 NOT NULL,
	"breakthrough_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "player_cultivation_player_id_unique" UNIQUE("player_id")
);
--> statement-breakpoint
CREATE TABLE "player_equipment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"equipment_id" uuid NOT NULL,
	"enhancement" integer DEFAULT 0 NOT NULL,
	"is_equipped" varchar(5) DEFAULT 'false' NOT NULL,
	"slot_index" integer,
	"obtained_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_gu" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"gu_template_id" uuid NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"enhancement" integer DEFAULT 0 NOT NULL,
	"mastery" integer DEFAULT 0 NOT NULL,
	"bond_level" integer DEFAULT 0 NOT NULL,
	"is_equipped" varchar(5) DEFAULT 'false' NOT NULL,
	"slot_index" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"slot" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_quests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"quest_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"objectives_progress" text DEFAULT '[]' NOT NULL,
	"accepted_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_saves" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"save_name" varchar(100) NOT NULL,
	"is_auto" varchar(5) DEFAULT 'false' NOT NULL,
	"save_data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"hp_bonus" integer DEFAULT 0 NOT NULL,
	"atk_bonus" integer DEFAULT 0 NOT NULL,
	"def_bonus" integer DEFAULT 0 NOT NULL,
	"crit_bonus" integer DEFAULT 0 NOT NULL,
	"move_speed" integer DEFAULT 300 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "player_stats_player_id_unique" UNIQUE("player_id")
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"realm" integer DEFAULT 1 NOT NULL,
	"dao_id" uuid,
	"exp" integer DEFAULT 0 NOT NULL,
	"hp" integer DEFAULT 100 NOT NULL,
	"mana" integer DEFAULT 50 NOT NULL,
	"gold" integer DEFAULT 0 NOT NULL,
	"spirit_stone" integer DEFAULT 0 NOT NULL,
	"current_map" varchar(100) DEFAULT 'bac_nguyen_village' NOT NULL,
	"current_x" integer DEFAULT 0 NOT NULL,
	"current_y" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "players_account_id_unique" UNIQUE("account_id")
);
--> statement-breakpoint
CREATE TABLE "portals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_map" uuid NOT NULL,
	"to_map" uuid NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"condition" text
);
--> statement-breakpoint
CREATE TABLE "quest_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"type" varchar(20) DEFAULT 'side' NOT NULL,
	"description" text NOT NULL,
	"npc_giver_id" uuid,
	"prerequisites" text,
	"objectives" text NOT NULL,
	"rewards" text,
	"flag_required" varchar(100),
	"flag_complete" varchar(100),
	"is_repeatable" varchar(5) DEFAULT 'false' NOT NULL,
	"min_realm" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shop_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shop_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"stock" integer,
	"refresh_time" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"npc_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shops_npc_id_unique" UNIQUE("npc_id")
);
--> statement-breakpoint
CREATE TABLE "story_flags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"flag_key" varchar(100) NOT NULL,
	"flag_value" varchar(100) DEFAULT 'true' NOT NULL,
	"set_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "world_maps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"region" varchar(50) NOT NULL,
	"recommended_realm" integer DEFAULT 1 NOT NULL,
	"is_safe_zone" varchar(5) DEFAULT 'false' NOT NULL,
	"background" varchar(255),
	"width" integer DEFAULT 2000 NOT NULL,
	"height" integer DEFAULT 2000 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account_sessions" ADD CONSTRAINT "account_sessions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "combat_logs" ADD CONSTRAINT "combat_logs_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "craft_logs" ADD CONSTRAINT "craft_logs_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "craft_logs" ADD CONSTRAINT "craft_logs_recipe_id_craft_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."craft_recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gu_skills" ADD CONSTRAINT "gu_skills_gu_template_id_gu_templates_id_fk" FOREIGN KEY ("gu_template_id") REFERENCES "public"."gu_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gu_stats" ADD CONSTRAINT "gu_stats_gu_template_id_gu_templates_id_fk" FOREIGN KEY ("gu_template_id") REFERENCES "public"."gu_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gu_synergy" ADD CONSTRAINT "gu_synergy_gu_a_gu_templates_id_fk" FOREIGN KEY ("gu_a") REFERENCES "public"."gu_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gu_synergy" ADD CONSTRAINT "gu_synergy_gu_b_gu_templates_id_fk" FOREIGN KEY ("gu_b") REFERENCES "public"."gu_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hidden_areas" ADD CONSTRAINT "hidden_areas_map_id_maps_id_fk" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_portals" ADD CONSTRAINT "map_portals_from_map_id_world_maps_id_fk" FOREIGN KEY ("from_map_id") REFERENCES "public"."world_maps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_portals" ADD CONSTRAINT "map_portals_to_map_id_world_maps_id_fk" FOREIGN KEY ("to_map_id") REFERENCES "public"."world_maps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_spawns" ADD CONSTRAINT "map_spawns_map_id_world_maps_id_fk" FOREIGN KEY ("map_id") REFERENCES "public"."world_maps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monster_templates" ADD CONSTRAINT "monster_templates_map_id_maps_id_fk" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_dialogues" ADD CONSTRAINT "npc_dialogues_npc_id_npc_templates_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npc_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_templates" ADD CONSTRAINT "npc_templates_map_id_maps_id_fk" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_cultivation" ADD CONSTRAINT "player_cultivation_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_equipment" ADD CONSTRAINT "player_equipment_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_equipment" ADD CONSTRAINT "player_equipment_equipment_id_equipment_templates_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_gu" ADD CONSTRAINT "player_gu_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_gu" ADD CONSTRAINT "player_gu_gu_template_id_gu_templates_id_fk" FOREIGN KEY ("gu_template_id") REFERENCES "public"."gu_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_inventory" ADD CONSTRAINT "player_inventory_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_inventory" ADD CONSTRAINT "player_inventory_item_id_item_templates_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_quests" ADD CONSTRAINT "player_quests_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_quests" ADD CONSTRAINT "player_quests_quest_id_quest_templates_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quest_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_saves" ADD CONSTRAINT "player_saves_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portals" ADD CONSTRAINT "portals_from_map_maps_id_fk" FOREIGN KEY ("from_map") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portals" ADD CONSTRAINT "portals_to_map_maps_id_fk" FOREIGN KEY ("to_map") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_templates" ADD CONSTRAINT "quest_templates_npc_giver_id_npc_templates_id_fk" FOREIGN KEY ("npc_giver_id") REFERENCES "public"."npc_templates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_materials" ADD CONSTRAINT "recipe_materials_recipe_id_craft_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."craft_recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_materials" ADD CONSTRAINT "recipe_materials_item_id_item_templates_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shop_items" ADD CONSTRAINT "shop_items_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shop_items" ADD CONSTRAINT "shop_items_item_id_item_templates_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shops" ADD CONSTRAINT "shops_npc_id_npc_templates_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npc_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_flags" ADD CONSTRAINT "story_flags_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;