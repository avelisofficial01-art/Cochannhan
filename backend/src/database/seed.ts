import { db } from './connection.js';
import * as schema from './schema/index.js';
import { eq, inArray } from 'drizzle-orm';
import {
  npcSeeds,
  itemSeeds,
  monsterSeeds,
  guSeeds,
  bossSeeds,
  worldMapSeeds,
  mapPortalSeeds,
  mapSpawnSeeds,
  dialogueSeeds,
  chapter1QuestSeeds,
} from '../config/index.js';

// Convert monster seeds into compatible formats
const bacNguyenMonsterSeeds = monsterSeeds;

export async function seedDatabase(): Promise<void> {
  try {
    // Check each critical table independently — allows partial re-seeding
    // if some tables were created but others are empty (e.g. maps exist but no NPCs)
    const [
      existingMaps,
      existingNpcs,
      existingMonsters,
      existingDialogues,
      existingQuests,
      existingGu
    ] = await Promise.all([
      db.select().from(schema.worldMaps).limit(1),
      db.select().from(schema.npcTemplates).limit(1),
      db.select().from(schema.monsterTemplates).limit(1),
      db.select().from(schema.npcDialogues).limit(1),
      db.select().from(schema.questTemplates).limit(1),
      db.select().from(schema.guTemplates).limit(1),
    ]);

    const needsWorldData = existingMaps.length === 0;
    const needsNpcs = existingNpcs.length === 0;
    const needsMonsters = existingMonsters.length === 0;
    const needsDialogues = existingDialogues.length === 0;
    const needsQuests = existingQuests.length === 0;
    const needsGu = existingGu.length === 0;

    if (!needsWorldData && !needsNpcs && !needsMonsters && !needsDialogues && !needsQuests && !needsGu) {
      console.log('[Seed] Database already fully populated — refreshing map config...');
      await refreshMapConfig();
      console.log('[Seed] ✅ Map config refresh completed.');
      return;
    }

    console.log(`[Seed] Seeding database (maps:${needsWorldData} npcs:${needsNpcs} monsters:${needsMonsters} dialogues:${needsDialogues} quests:${needsQuests} gu:${needsGu})...`);

    // 1. Seed cultivation realms
    console.log('[Seed] Seeding cultivation realms...');
    const realms = [
      { level: 1, name: 'Nhất Chuyển', stat_multiplier: 100, breakthrough_gold: 0, required_breakthrough: 'false', description: 'Realm level 1' },
      { level: 2, name: 'Nhị Chuyển', stat_multiplier: 120, breakthrough_gold: 1000, required_breakthrough: 'true', description: 'Realm level 2' },
      { level: 3, name: 'Tam Chuyển', stat_multiplier: 150, breakthrough_gold: 5000, required_breakthrough: 'true', description: 'Realm level 3' },
      { level: 4, name: 'Tứ Chuyển', stat_multiplier: 200, breakthrough_gold: 20000, required_breakthrough: 'true', description: 'Realm level 4' },
      { level: 5, name: 'Ngũ Chuyển', stat_multiplier: 300, breakthrough_gold: 100000, required_breakthrough: 'true', description: 'Realm level 5' },
      { level: 6, name: 'Lục Chuyển (Tiên)', stat_multiplier: 500, breakthrough_gold: 500000, required_breakthrough: 'true', description: 'Realm level 6 (Immortal)' },
      { level: 7, name: 'Thất Chuyển (Tiên)', stat_multiplier: 800, breakthrough_gold: 2000000, required_breakthrough: 'true', description: 'Realm level 7 (Immortal)' },
      { level: 8, name: 'Bát Chuyển (Tiên)', stat_multiplier: 1300, breakthrough_gold: 10000000, required_breakthrough: 'true', description: 'Realm level 8 (Immortal)' },
      { level: 9, name: 'Cửu Chuyển (Tôn)', stat_multiplier: 2100, breakthrough_gold: 99999999, required_breakthrough: 'true', description: 'Realm level 9 (Venerable)' },
    ];
    for (const r of realms) {
      await db.insert(schema.cultivationRealms).values(r).onConflictDoNothing();
    }

    // 2. Seed items
    const itemMap = new Map<string, string>(); // name -> id
    const existingItems = await db.select().from(schema.itemTemplates);
    if (existingItems.length === 0) {
      console.log('[Seed] Seeding items...');
      for (const item of itemSeeds) {
        const [inserted] = await db.insert(schema.itemTemplates).values({
          name: item.name,
          type: item.type,
          description: item.description,
          stackable: item.stackable,
          max_stack: item.maxStack,
          sell_price: item.sellPrice,
          sprite: item.sprite,
        }).returning();
        if (inserted) {
          itemMap.set(inserted.name, inserted.id);
        }
      }
    } else {
      for (const item of existingItems) {
        itemMap.set(item.name, item.id);
      }
    }

    // 3. Seed maps (or load existing map IDs for use by NPC/monster seeding)
    const mapUuidMap = new Map<string, string>(); // ref -> UUID
    let villageMapId: string | undefined;

    if (needsWorldData) {
      console.log('[Seed] Seeding maps...');
      for (const m of worldMapSeeds) {
        const [insertedWorldMap] = await db.insert(schema.worldMaps).values({
          name: m.name,
          region: m.region,
          recommended_realm: m.recommended_realm,
          is_safe_zone: m.is_safe_zone,
          background: m.background,
          width: m.width,
          height: m.height,
        }).returning();

        await db.insert(schema.maps).values({
          id: insertedWorldMap.id,
          name: m.name,
          background: m.background === 'bg_village' ? 'map_bac_nguyen' : m.background,
          level_min: m.recommended_realm,
          level_max: m.recommended_realm + 5,
        }).onConflictDoNothing();

        mapUuidMap.set(m.ref, insertedWorldMap.id);
        if (m.ref === 'lang_cothao') {
          villageMapId = insertedWorldMap.id;
        }
      }

      if (villageMapId) {
        await db.insert(schema.maps).values({
          id: villageMapId,
          name: 'bac_nguyen_village',
          background: 'map_bac_nguyen',
          level_min: 1,
          level_max: 9,
        }).onConflictDoNothing();
      }
    } else {
      // Maps already in DB — load their IDs so NPC/monster seeding can reference them
      const allMaps = await db.select().from(schema.worldMaps);
      for (const m of worldMapSeeds) {
        const found = allMaps.find((row) => row.name === m.name);
        if (found) {
          mapUuidMap.set(m.ref, found.id);
          if (m.ref === 'lang_cothao') {
            villageMapId = found.id;
          }
        }
      }
    }

    // 4. Seed portals
    if (needsWorldData) {
      console.log('[Seed] Seeding portals...');
      for (const p of mapPortalSeeds) {
        const fromId = mapUuidMap.get(p.from_map_ref);
        const toId = mapUuidMap.get(p.to_map_ref);
        if (fromId && toId) {
          await db.insert(schema.mapPortals).values({
            from_map_id: fromId,
            to_map_id: toId,
            from_x: p.from_x,
            from_y: p.from_y,
            to_x: p.to_x,
            to_y: p.to_y,
            portal_name: p.portal_name,
          });

          // Also seed older portals table
          await db.insert(schema.portals).values({
            from_map: fromId,
            to_map: toId,
            x: p.from_x,
            y: p.from_y,
            condition: null,
          });
        }
      }
    }

    // 4.5 Seed Item Templates
    const dbItems = await db.select().from(schema.itemTemplates).limit(1);
    const needsItems = dbItems.length === 0;
    if (needsItems) {
      console.log('[Seed] Seeding item templates...');
      for (const item of itemSeeds) {
        await db.insert(schema.itemTemplates).values({
          name: item.name,
          type: item.type,
          description: item.description,
          stackable: item.stackable ?? 'false',
          max_stack: item.maxStack ?? 1,
          sell_price: item.sellPrice ?? 0,
          sprite: item.sprite ?? null,
        });
      }
    } else {
      // Check and add any missing item templates
      const allItems = await db.select().from(schema.itemTemplates);
      for (const item of itemSeeds) {
        if (!allItems.some(i => i.name === item.name)) {
          console.log(`[Seed] Item template "${item.name}" is missing. Seeding...`);
          await db.insert(schema.itemTemplates).values({
            name: item.name,
            type: item.type,
            description: item.description,
            stackable: item.stackable ?? 'false',
            max_stack: item.maxStack ?? 1,
            sell_price: item.sellPrice ?? 0,
            sprite: item.sprite ?? null,
          });
        }
      }
    }

    // 5. Seed NPCs
    const npcMap = new Map<string, string>(); // name -> UUID
    const npcGiverIdMap = new Map<string, string>(); // ref name -> UUID
    
    // Always fetch existing NPCs to see what is already there
    const dbNpcs = await db.select().from(schema.npcTemplates);
    for (const n of dbNpcs) {
      npcMap.set(n.name, n.id);
      npcGiverIdMap.set(n.name, n.id);
    }

    // Now seed any NPCs that are missing in the DB
    for (const npc of npcSeeds) {
      if (!npcMap.has(npc.name)) {
        console.log(`[Seed] NPC "${npc.name}" is missing. Seeding...`);
        const defaultMapId = mapUuidMap.get('lang_cothao') || villageMapId || '';
        const npcMapId = npc.mapId ? (mapUuidMap.get(npc.mapId) || npc.mapId) : defaultMapId;
        const [inserted] = await db.insert(schema.npcTemplates).values({
          name: npc.name,
          sprite: npc.sprite,
          faction: npc.faction,
          occupation: npc.occupation,
          map_id: npcMapId,
          x: npc.x,
          y: npc.y,
          has_shop: npc.hasShop ?? 'false',
        }).returning();
        if (inserted) {
          npcMap.set(inserted.name, inserted.id);
          npcGiverIdMap.set(npc.name, inserted.id);
        }
      }
    }

    // 6. Seed NPC Dialogues (delete all and re-seed to apply config changes instantly)
    console.log('[Seed] Refreshing NPC dialogues...');
    await db.delete(schema.npcDialogues);
    const dialogueUuidMap = new Map<string, string>(); // ref -> UUID
    for (const d of dialogueSeeds) {
      const npcId = npcMap.get(d.npc_ref);
      if (npcId) {
        const [inserted] = await db.insert(schema.npcDialogues).values({
          npc_id: npcId,
          order_index: d.order_index,
          text: d.text,
          speaker: d.speaker,
          choices: d.choices ?? null,
          condition_flag: d.condition_flag ?? '',
          set_flag: d.set_flag ?? '',
        }).returning();
        if (inserted) {
          dialogueUuidMap.set(d.ref, inserted.id);
        }
      }
    }

    // Now update next_dialogue_id links
    for (const d of dialogueSeeds) {
      const dId = dialogueUuidMap.get(d.ref);
      if (dId && d.choices) {
        const parsedChoices = JSON.parse(d.choices) as Array<{ text: string; next_dialogue_ref: string; next_dialogue_id?: string }>;
        let updated = false;
        for (const choice of parsedChoices) {
          const nextId = dialogueUuidMap.get(choice.next_dialogue_ref);
          if (nextId) {
            choice.next_dialogue_id = nextId;
            updated = true;
          }
        }
        if (updated) {
          await db.update(schema.npcDialogues)
            .set({ choices: JSON.stringify(parsedChoices) })
            .where(eq(schema.npcDialogues.id, dId));
        }
      }
    }

    // 7. Seed Monsters
    const monsterTemplateMap = new Map<string, string>(); // name -> UUID
    if (needsMonsters) {
      console.log('[Seed] Seeding monsters...');
      const defaultRegionMapId = mapUuidMap.get('dongco_hoang') || mapUuidMap.get('lang_cothao') || villageMapId || '';
      
      const allMonsterSeeds = [
        ...bacNguyenMonsterSeeds.map(m => ({ ...m, isBoss: false })),
        ...bossSeeds.map(b => ({ ...b, isBoss: true })),
      ];

      for (const m of allMonsterSeeds) {
        const [inserted] = await db.insert(schema.monsterTemplates).values({
          name: m.name,
          realm: m.realm === 'luyen_khi' ? 2 : 1,
          hp: m.hp,
          atk: m.atk,
          def: m.def,
          speed: m.speed * 40,
          element: m.element,
          sprite: m.sprite,
          drop_table: m.drop_table,
          map_id: defaultRegionMapId,
          respawn_time: m.respawn_time,
        }).returning();
        if (inserted) {
          monsterTemplateMap.set(inserted.name, inserted.id);
        }
      }
    } else {
      const allMonsters = await db.select().from(schema.monsterTemplates);
      for (const m of allMonsters) {
        monsterTemplateMap.set(m.name, m.id);
      }
      
      // Also add Thiết Bì Cự Hùng if missing
      const defaultRegionMapId = mapUuidMap.get('dongco_hoang') || mapUuidMap.get('lang_cothao') || villageMapId || '';
      const allMonsterSeeds = [
        ...bacNguyenMonsterSeeds.map(m => ({ ...m, isBoss: false })),
        ...bossSeeds.map(b => ({ ...b, isBoss: true })),
      ];
      for (const m of allMonsterSeeds) {
        if (!monsterTemplateMap.has(m.name)) {
          console.log(`[Seed] Monster template "${m.name}" is missing. Seeding...`);
          const [inserted] = await db.insert(schema.monsterTemplates).values({
            name: m.name,
            realm: m.realm === 'luyen_khi' ? 2 : 1,
            hp: m.hp,
            atk: m.atk,
            def: m.def,
            speed: m.speed * 40,
            element: m.element,
            sprite: m.sprite,
            drop_table: m.drop_table,
            map_id: defaultRegionMapId,
            respawn_time: m.respawn_time,
          }).returning();
          if (inserted) {
            monsterTemplateMap.set(inserted.name, inserted.id);
          }
        }
      }
    }

    // 8. Seed Map Spawns
    if (needsWorldData) {
      console.log('[Seed] Seeding map spawns...');
      for (const s of mapSpawnSeeds) {
        const mapId = mapUuidMap.get(s.map_ref);
        if (mapId) {
          await db.insert(schema.mapSpawns).values({
            map_id: mapId,
            spawn_type: s.spawn_type,
            spawn_ref: s.spawn_ref,
            x: s.x,
            y: s.y,
            respawn_time: s.respawn_time,
          });
        }
      }
    }

    // 9. Seed Quest Templates (safely checking for missing templates)
    console.log('[Seed] Checking and seeding quest templates...');
    const existingQuestsList = await db.select().from(schema.questTemplates);
    for (const q of chapter1QuestSeeds) {
      if (!existingQuestsList.some(eq => eq.name === q.name)) {
        console.log(`[Seed] Quest template "${q.name}" is missing. Seeding...`);
        const npcGiverId = q.npc_giver_ref ? npcGiverIdMap.get(q.npc_giver_ref) : null;
        await db.insert(schema.questTemplates).values({
          name: q.name,
          type: q.type,
          description: q.description,
          npc_giver_id: npcGiverId ?? null,
          prerequisites: q.prerequisites ?? null,
          objectives: q.objectives,
          rewards: q.rewards ?? null,
          flag_required: q.flag_required ?? null,
          flag_complete: q.flag_complete ?? null,
          is_repeatable: 'false',
          min_realm: q.min_realm ?? 1,
        });
      }
    }

    // 10. Seed Gu templates, stats, skills, and synergies
    if (needsGu) {
      console.log('[Seed] Seeding Gu templates...');
      for (const gu of guSeeds) {
        const [insertedGu] = await db.insert(schema.guTemplates).values({
          name: gu.template.name,
          rank: gu.template.rank,
          element: gu.template.element,
          role: gu.template.role,
          quality: gu.template.quality,
          description: gu.template.description,
          sprite: gu.template.sprite,
          is_immortal: gu.template.is_immortal,
          unique_world: gu.template.unique_world,
          max_enhance: gu.template.max_enhance,
          can_evolve: gu.template.can_evolve,
        }).returning();

        if (insertedGu) {
          // Seed stats
          await db.insert(schema.guStats).values({
            gu_template_id: insertedGu.id,
            hp: gu.stats.hp,
            atk: gu.stats.atk,
            def: gu.stats.def,
            crit: gu.stats.crit,
            crit_damage: gu.stats.crit_damage,
            move_speed: gu.stats.move_speed,
            attack_speed: gu.stats.attack_speed,
            life_steal: gu.stats.life_steal,
          });

          // Seed skills
          for (const skill of gu.skills) {
            await db.insert(schema.guSkills).values({
              gu_template_id: insertedGu.id,
              skill_id: skill.skill_id,
              name: skill.name,
              type: skill.type,
              description: skill.description,
              cooldown: skill.cooldown,
              damage_multiplier: skill.damage_multiplier,
              target_type: skill.target_type,
              aoe_radius: skill.aoe_radius,
            });
          }
        }
      }

      // Seed default synergies
      console.log('[Seed] Seeding Gu synergies...');
      const synergies = [
        { result_name: 'Hỏa Phong Bạo', gu_a_name: 'Hỏa Cổ', gu_b_name: 'Phong Cổ', bonus_atk: 10, bonus_def: 0, bonus_hp: 0, result_description: 'Kết hợp Hỏa và Phong, tăng sức mạnh tấn công.' },
        { result_name: 'Huyết Thạch Giáp', gu_a_name: 'Thạch Cổ', gu_b_name: 'Huyết Cổ', bonus_atk: 0, bonus_def: 15, bonus_hp: 0, result_description: 'Kết hợp Thổ và Huyết, tăng sức mạnh phòng ngự.' },
        { result_name: 'Hỏa Độc Vụ', gu_a_name: 'Độc Cổ', gu_b_name: 'Hỏa Cổ', bonus_atk: 5, bonus_def: 5, bonus_hp: 0, result_description: 'Kết hợp Độc và Hỏa, tăng đều công thủ.' },
      ];
      for (const syn of synergies) {
        const [guATemplate] = await db.select().from(schema.guTemplates).where(eq(schema.guTemplates.name, syn.gu_a_name)).limit(1);
        const [guBTemplate] = await db.select().from(schema.guTemplates).where(eq(schema.guTemplates.name, syn.gu_b_name)).limit(1);
        if (guATemplate && guBTemplate) {
          await db.insert(schema.guSynergy).values({
            gu_a: guATemplate.id,
            gu_b: guBTemplate.id,
            result_name: syn.result_name,
            result_description: syn.result_description,
            bonus_atk: syn.bonus_atk,
            bonus_def: syn.bonus_def,
            bonus_hp: syn.bonus_hp,
          });
        }
      }
    }

    console.log('[Seed] ✅ Database seeding completed successfully.');
  } catch (err) {
    console.error('[Seed] ❌ Database seeding FAILED:', err);
    throw err;
  }
}

/**
 * Always refresh map spawns and portals (config data that may change between deploys).
 * Delete + re-insert pattern ensures idempotency without needing unique constraints.
 */
async function refreshMapConfig(): Promise<void> {
  const allMaps = await db.select().from(schema.worldMaps);
  if (allMaps.length === 0) return; // Maps haven't been seeded yet

  const mapUuidMap = new Map<string, string>();
  for (const m of allMaps) {
    mapUuidMap.set(m.name, m.id);
  }

  const mapIds = Array.from(mapUuidMap.values());

  // Delete old spawns + portals for known maps
  if (mapIds.length > 0) {
    await db.delete(schema.mapSpawns).where(inArray(schema.mapSpawns.map_id, mapIds));
    await db.delete(schema.mapPortals).where(inArray(schema.mapPortals.from_map_id, mapIds));
  }

  // Insert map spawns
  let spawnCount = 0;
  for (const s of mapSpawnSeeds) {
    const mapId = mapUuidMap.get(s.map_ref);
    if (mapId) {
      await db.insert(schema.mapSpawns).values({
        map_id: mapId,
        spawn_type: s.spawn_type,
        spawn_ref: s.spawn_ref,
        x: s.x,
        y: s.y,
        respawn_time: s.respawn_time,
      });
      spawnCount++;
    }
  }

  // Insert map portals
  let portalCount = 0;
  for (const p of mapPortalSeeds) {
    const fromMapId = mapUuidMap.get(p.from_map_ref);
    const toMapId = mapUuidMap.get(p.to_map_ref);
    if (fromMapId && toMapId) {
      await db.insert(schema.mapPortals).values({
        from_map_id: fromMapId,
        to_map_id: toMapId,
        from_x: p.from_x,
        from_y: p.from_y,
        to_x: p.to_x,
        to_y: p.to_y,
        portal_name: p.portal_name,
      });

      // Also seed older portals table
      await db.insert(schema.portals).values({
        from_map: fromMapId,
        to_map: toMapId,
        x: p.from_x,
        y: p.from_y,
        condition: null,
      });
      portalCount++;
    }
  }

  console.log(`[Seed] Map config refreshed: ${spawnCount} spawns, ${portalCount} portals across ${mapIds.length} maps`);
}
