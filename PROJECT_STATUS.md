# PROJECT_STATUS.md

# Gu World - Project Status

**Project:** CỔ ĐẠO
**Version:** Pre-Alpha
**Status:** 🚧 In Development

---

# Current Sprint

**Sprint:** 12 — Quest Flow Manual Turn-In & Visual Polish

**Status:** ✅ Completed

**Started:** 2026-07-05

---

# Overall Progress

| Sprint | Name | Status |
|---------|------|--------|
| Sprint 0 | Foundation | ✅ Completed |
| Sprint 1 | Core Infrastructure | ✅ Completed |
| Sprint 2 | NPC & Quest | ✅ Completed |
| Sprint 3 | Combat Core | ✅ Completed |
| Sprint 4 | Gu System | ✅ Completed |
| Sprint 5 | Equipment & Craft | ✅ Completed |
| Sprint 6 | Chapter 1 Complete | ✅ Completed |
| Sprint 7 | Polish & Stabilize | ✅ Completed |
| Sprint 8 | Critical Bug Fixes | ✅ Completed |
| Sprint 9 | H5 UI & Active Skills | ✅ Completed |
| Sprint 10 | Maintenance & Combat Balance | ✅ Completed |
| Sprint 11 | Quest System Improvement | ✅ Completed |
| Sprint 12 | Quest Flow Manual Turn-In & Visual Polish | ✅ Completed |

---

# Current Task

Current Module: ✅ Sprint 12 — Quest Flow Manual Turn-In & Visual Polish

# Sprint 12 Checklist

## Quest Flow Manual Turn-In & Visual Polish (S12.1)
- [x] Disable automatic quest completion in `updateQuestProgress`
- [x] Add manual quest complete endpoint `/api/quest/complete` on the backend
- [x] Create `Nhiệm Vụ` (Quest) tab in `CharacterPanel.tsx` with quest list and "Claim Reward" buttons
- [x] Remove duplicate floating `Chế tạo` button from `CraftPanel.tsx`
- [x] Always render 3 skill hotkey slots on GameHUD (with locks/placeholders for empty ones)
- [x] Remove instruction guide text from center bottom of the Phaser scene
- [x] Add Phaser monster disintegration death animation (spin, shrink, and fade)
- [x] Fix server-side monster drop roll bugs (matching item names to templates) and display floating green drop details
- [x] Polish hit effects: hit flashes red, camera shakes, X-slash on critical hits, and particle sparks
- [x] Slower monster attacks (2.5s cooldown) and slower chasing speed (scaled down 50%)
- [x] Implement collision separation steering forces on the server to prevent monsters from overlapping with players and each other
- [x] Typecheck + build + lint all pass

---

# Sprint 11 Checklist

## Quest Flow (S11.1)
- [x] Filter QuestTracker to only show active quests (not completed)
- [x] Backend auto-accept next quests when a quest is completed (flag-based)
- [x] Fix bug: `quest:updated` not emitted on quest completion (emit moved before return)
- [x] Remove 3 `console.log` debug lines from quest.service.ts
- [x] Typecheck + build + lint all pass

---

# Sprint 10 Checklist

## Maintenance Pass (S10.1)
- [x] Remove all `console.log/warn/error` from frontend (GamePage, useSocket, DialoguePanel, PreloadScene, GameScene)
- [x] Remove dead code: health check block in GamePage, stub methods in UIScene, diagnostic fetch in PreloadScene
- [x] Remove unused file: `assets/test-game.html`
- [x] Fix unused variable `flagJson` in DialoguePanel.tsx

## Combat Balance (S10.2)
- [x] Rebalance `monsterSeeds`: Quái Thú Hoang Dã (HP 80→45, ATK 12→8, DEF 5→2), Sói Bắc Nguyên (HP 120→70, ATK 18→12, DEF 8→4), Hỏa Hồ Yêu (HP 200→130, ATK 25→18, DEF 12→8), Thiết Bì Cự Hùng (HP 400→220, ATK 25→22, DEF 15→12)
- [x] Rebalance `bacNguyenMonsterSeeds`: Sói Tuyết (HP 100→55, ATK 15→10, DEF 6→3), Gấu Trắng (HP 200→140, ATK 22→18, DEF 12→10), Thỏ Tuyết unchanged, Ưng Bắc Nguyên (HP 150→140, ATK 25→20, DEF 8→9)
- [x] Verify: fresh realm=1 player now deals 8 dmg/hit (6 hits to kill Quái Thú) vs 3 dmg/hit received (34 hits to die)

---

# Sprint 9 Checklist

## H5 Mobile UI Optimization & Active Combat Skills (S9.1)
- [x] Consolidate individual `GuPanel` and `EquipmentPanel` into a single unified **CharacterPanel.tsx** tabbed overlay
- [x] Implement server-authoritative **Active Skills** execution in `combat.service.ts` with custom damage multipliers and elements
- [x] Add **GameHUD.tsx** featuring active skill buttons (keys 1, 2, 3), cooldown circular sweep animations, and modern bottom navigation dock
- [x] Integrate loopable **Background Music (BGM)** in `GameScene.ts` (handling autoplay interaction constraints)
- [x] Implement custom neon-colored **elemental slash visual effects** in Phaser based on the damage element type casted
- [x] Enforce clean TypeScript strict mode types (no `any`) and verify lint/typecheck passes

---

# Sprint 8 Checklist

## Critical Bug Fixes (S8.1)
- [x] Fix **delta-time bug** — `delta` (ms) not divided by 1000, caused `moveSpeed×16` instead of `moveSpeed×0.016` per frame → teleport movement
- [x] Fix **player spawn position** — `handleMapInit` now resets `playerX/Y` to map center (or server-provided spawn) instead of leaving player stuck at `(400,300)`
- [x] Fix **race condition** — Socket `map:init/npcs/portals` emitted before `GameScene.create()` registered listeners. Fixed with `emitToGameScene()` retry helper (100ms interval, max 30 retries)
- [x] Fix **GameScene late join** — Added `delayedCall(300ms)` in `create()` to re-emit `map:join` ensuring server resends all map state after scene is ready
- [x] Fix **setPlayers Zustand bug** — `setPlayers` returned plain object instead of calling `set()`, so multiplayer positions never updated in store
- [x] Fix **401 global redirect** — `api/client.ts` now clears localStorage and redirects to `/login` on any 401 response
- [x] Fix **map lookup fallback** — `app.ts` falls back to 'Làng Cổ Thảo' then first available map when `'bac_nguyen_village'` not found in DB
- [x] Fix **missing player auto-creation** — Auto-create character for accounts without a player record on login, socket connection, and frontend mount
- [x] Fix **Express routing 404** — Reordered routes in `quest.route.ts` so specific `/player/active` and `/flags` endpoints are registered before wildcard `/:id` route
- [x] Fix **missing resolvePlayer 401s** — Added `resolvePlayer` middleware to `gu.route.ts` and `equipment.route.ts` to correctly populate `req.playerId`
- [x] Fix **database diagnostics** — Extended `/api/health` to return table counts, allowing immediate verification of seeding status in production
- [x] Fix **NPC interaction click bounds** — replaced custom offset Geom.Circle hit area with standard centered hit area for Image sprites (scales correctly with display size) and fixed hitArea for fallback shape objects
- [x] Add **NPC proximity checks** — player must be within 120px to talk, displaying floating warning text if too far
- [x] Fix **dialogue selection starting node resolution** — resolved start-node bug where returning players saw the intro again or could not progress by fetching active story flags and selecting flag-based start nodes
- [x] Fix **request body mismatch in setStoryFlag** — backend now accepts both `{ key, value }` and `{ flagKey, flagValue }` payloads to stay compatible with the client
- [x] Fix **opening cutscene re-triggering** — saved the opening cutscene played state to `localStorage` under `ch1_intro_cutscene_played` to prevent it from re-playing when transitioning back to Làng Cổ Thảo
- [x] Implement **monster respawn system** — server automatically schedules a respawn timer using template `respawn_time` when defeated, broadcasting updated list
- [x] Implement **in-memory map initialization cache** — prevents reloading and duplicate monster spawning from seeds on every player join
- [x] Implement **monster kill quest progress sync** — server now updates quest objectives automatically on combat defeats
- [x] Optimize **quest progression push** — added a backend event bus and player rooms to push quest updates in real-time, allowing QuestTracker to reduce API polling from 4s to 30s
- [x] Optimize **player movement bandwidth** — removed redundant loopback position update packets back to the client
- [x] Implement **server game loop** — introduced a 20 ticks/sec (50ms interval) main loop to process combat ticks and monster status effects
- [x] Implement **monster AI chase and target tracking** — monsters now automatically select players within a 200px aggro range, move towards them, and attack once they are within a 50px range
- [x] Implement **player damage and death mechanics** — monsters inflict damage on the player, updating health in the database and showing floating damage numbers
- [x] Implement **teleport respawning** — when a player's health drops to 0, they are automatically teleported back to Làng Cổ Thảo ('bac_nguyen_village') with their HP restored
- [x] Implement **client HUD HP bar** — the player's current health ratio is rendered dynamically as an HP bar directly above their sprite

## H5 RPG Story Implementation (S8.2)
- [x] Implement **cinematic opening cutscene** — black canvas overlay with atmospheric scrolling lore and text prompt to start journey upon spawning in Làng Cổ Thảo
- [x] Expand **lore-rich dialogue trees** — replaced placeholder lines with sequential choice-driven conversations for Trưởng làng, Trưởng lão, Thợ rèn, Bia Đá Cổ, and Bạch Lang Vương NPCs
- [x] Configure **5-quest sequence chain** — implemented "Tỉnh Giấc Mộng" -> "Mối Đe Dọa Sói Tuyết" -> "Lời Tiên Tri Cổ" -> "Vượt Qua Rừng Tuyết" -> "Bạch Lang Vương"
- [x] Implement **quest reward resolution** — player exp, gold, and items are now correctly awarded to db stats and inventory on quest completion
- [x] Support **exploration map reach checking** — entering Rừng Tuyết and Đỉnh Băng Phong triggers real-time quest checks for target location arrival
- [x] Support **cutscene input locking** — freezes movement controls and action buttons during story conversations and dramatic sequences
- [x] Integrate **pre-fight boss proximity trigger** — approaching Bạch Lang Vương triggers a dialogue sequence, locking controls before the fight starts
- [x] Implement **Chapter 1 breakthrough ending cutscene** — boss death opens a dramatic screen describing Nhị Chuyển breakthrough and resets state to ready chapter 2 portal

---

# Sprint 7 Checklist

## Bug Fixing (S7.1)
- [x] Socket URL — Từ `localhost:3000` cứng → dynamic origin (production-ready)
- [x] Socket `player:attack` — Gọi `executePlayerAttack()` server-side (combat server-authoritative)
- [x] Socket JWT verification — Token được verify bằng `jwt.verify()` khi connect
- [x] Socket disconnect — Broadcast `player:left` cho các player trong map
- [x] Frontend `player:left` handler — Xóa player khỏi store khi disconnect
- [x] Rendering Architecture — Player: Image thay Rectangle, dùng `char_1.png` sprite
- [x] Rendering Architecture — Monster: dùng monster sprite thay Rectangle màu đỏ
- [x] Rendering Architecture — Map: luôn dùng map image, grid chỉ fallback
- [x] Rendering Architecture — Vite `publicDir: '../assets'` để serve assets
- [x] Rendering Architecture — Tạo BootScene + PreloadScene + UIScene
- [x] Helmet configuration — Thêm CSP directive cho `blob:` và `ws:`, tắt COEP để không chặn asset loader
- [x] Fix missing gameplay — Tự động nạp cơ sở dữ liệu (seeding) khi khởi động
- [x] Fix missing gameplay — Đồng bộ và dựng hình NPC, Portal trực tiếp trong Phaser H5
- [x] Fix missing gameplay — Điều hướng và truyền tống mượt mà giữa các bản đồ qua cổng dịch chuyển

## Performance Optimization (S7.2)
- [x] Tối ưu socket sync, map rendering, database query (Giới hạn di chuyển 20Hz, Phaser dynamic camera follow)

## UI/UX Polish (S7.3)
- [x] Hội thoại (Dialogue box) và Bảng theo dõi nhiệm vụ (Quest Tracker) dạng kính mờ (glassmorphism)

## Error Recovery (S7.4)
- [x] Tự động khởi tạo quái vật và NPC khi tham gia map phòng tránh mất đồng bộ trạng thái

## Admin Panel MVP (S7.5)
- [x] Hoàn thành tích hợp tính năng cốt lõi

## Documentation (S7.6)
- [x] Cập nhật tất cả tài liệu sau MVP (PROJECT_STATUS, CHANGELOG, walkthrough)

## Playtest (S7.7)
- [x] Internal playtest thành công, các nhiệm vụ và quái vật hoạt động ổn định

---

# Sprint 6 Checklist

## Story Engine (S6.1)
- [x] story_flags table — Story progression flags per player
- [x] Story module — repository, service, controller, route
- [x] REST: GET/PUT /api/story/flags, GET /api/story/flags/:key

## Boss Bạch Lang Vương (S6.3)
- [x] Boss AI — Phase-based combat behavior (3 phases: 100-70%, 70-40%, 40-0%)
- [x] Boss config — Bạch Lang Vương stats, phase multipliers, story flag
- [x] Story flag integration — boss_wolf_king_defeated flag on defeat
- [x] Integration into combat service — auto-detect boss by name, phase transitions

## Chapter 1 Content (S6.2)
- [x] Dialogue data — 17 dialogues for 4 NPCs (Trưởng làng, Trưởng lão, Thợ rèn, Thương nhân)
- [x] Quest chain — 5 main quests (Tỉnh Giấc Mộng → Săn Sói → Lời Tiên Tri → Hành Trình → Bạch Lang Vương)
- [x] Quest-dialogue integration — Flag-based progression: ch1_awakened → ch1_wolves_hunted → ch1_prophecy_heard → ch1_reached_peak → ch1_complete

## Cultivation Breakthrough (S6.4)
- [x] cultivation_realms table — Realm definitions (1-9 Chuyển)
- [x] player_cultivation table — Per-player cultivation progress
- [x] breakthrough_logs table — Breakthrough attempt history
- [x] Cultivation module — repository, service, controller, route
- [x] Breakthrough logic — Gold cost, item requirement, success roll
- [x] REST: GET /api/cultivation/realms, GET /api/cultivation/player, POST /api/cultivation/breakthrough

## Save System (S6.5)
- [x] player_saves table — Auto + manual save slots
- [x] Save module — repository, service, controller, route
- [x] Auto-save + manual save logic
- [x] REST: GET /api/save, POST /api/save, GET /api/save/:id, DELETE /api/save/:id
- [x] Save data snapshot — Player + flags + inventory + equipment + cultivation + Gu

## Bắc Nguyên Maps (S6.6)
- [x] world_maps table — Map definitions with region/realm
- [x] map_portals table — Inter-map teleport links
- [x] map_npcs table — NPC positions per map
- [x] map_monsters table — Monster spawns per map
- [x] Map seed data — 5 Bắc Nguyên maps (Làng Cổ Thảo, Đồng Cỏ Hoang, Rừng Tuyết, Đỉnh Băng Phong, Cánh Đồng Tuyết)
- [x] NPC spawn data per map (4 NPCs: Trưởng làng, Thợ rèn, Thương nhân, Trưởng lão)
- [x] Monster spawn data per map (Sói Tuyết, Gấu Trắng, Thỏ Tuyết, Ưng Bắc Nguyên + Boss Bạch Lang Vương)
- [x] Portal links between maps (4 two-way portals)
- [x] Monster templates — 4 Bắc Nguyên monsters + Boss template

---

---

# Sprint 3 Checklist

## Shared Combat Engine
- [x] Combat types — CombatResult, DamageInput, MonsterInstance, CombatStats
- [x] Damage Calculator — damage formula from SYSTEM_BIBLE
- [x] Status Effect system — 10 status effects with stacking logic

## Database Schema
- [x] monster_templates — Monster definitions (name, realm, stats, element, drop_table, map, respawn)
- [x] combat_logs — Combat log table for analysis

## Backend
- [x] Monster module — repository, service, controller, routes
- [x] Combat module — repository, service, controller, routes
- [x] Socket.IO combat events — player:attack, monster:spawn, monster:dead, monster:update, item:drop
- [x] Combat Engine integration — in-memory monster instances, tick system, death/drop handling
- [x] Player service: added getPlayerById + getPlayerStats methods
- [x] Seed data: 3 monster templates for Bắc Nguyên

## Frontend
- [x] Combat UI — HP bar, damage numbers, cooldown indicators (S3.5 ✅)

## Monsters for Bắc Nguyên

| Monster | Realm | HP | ATK | DEF | Element | Respawn |
|---------|-------|----|-----|-----|---------|---------|
| Quái Thú Hoang Dã | Phàm Nhân | 80 | 12 | 5 | Physical | 30s |
| Sói Bắc Nguyên | Phàm Nhân | 120 | 18 | 8 | Physical | 45s |
| Hỏa Hồ Yêu | Luyện Khí | 200 | 25 | 12 | Fire | 60s |

---

# Sprint 2 Checklist

## Database Schema
- [x] npc_templates — NPC definitions (name, sprite, faction, occupation, map, position, schedule)
- [x] npc_dialogues — Dialogue trees (text, choices, story flags, affection conditions)
- [x] quest_templates — Quest definitions (type, objectives, rewards, prerequisites, story flags)
- [x] player_quests — Player quest progress tracking
- [x] story_flags — Player story flags (key-value store)
- [x] item_templates — Item definitions (name, type, stackable, price)
- [x] player_inventory — Player inventory slots

## Backend
- [x] NPC module — repository, service, controller, routes
- [x] Quest module — repository, service, controller, routes
- [x] Inventory module — repository, service, controller, routes
- [x] Auth middleware: added resolvePlayer to attach playerId
- [x] Routes mounted: /api/npc, /api/quest, /api/inventory
- [x] CamelCase ↔ snake_case mapping in all repositories

## Shared Types
- [x] NpcInfo, NpcDialogue, DialogueChoice, DialogueNode
- [x] QuestInfo, QuestObjective, QuestReward, QuestPrerequisite, PlayerQuest
- [x] ObjectiveProgress, StoryFlag
- [x] ItemInfo, InventorySlot

## Seed Data
- [x] 4 NPCs: Trưởng làng, Thợ rèn, Thương nhân, Trưởng lão
- [x] 2 Sample quests: main + side quest
- [x] 4 Items: potions, materials, quest items

---

# Sprint 1 Checklist

## Backend
- [x] Schema mới: game_config, maps, portals
- [x] Player module — CRUD player, stats, profile
- [x] Player schema (Zod validation)
- [x] Player repository (Drizzle queries)
- [x] Player service (business logic)
- [x] Player controller (REST endpoints)
- [x] Player routes: GET /profile, GET /stats, POST /create
- [x] World module — Map CRUD, Portal, Dungeon skeleton
- [x] World repository, service, controller, routes
- [x] Stat Calculator (shared) — Base + Equipment + Gu + Passive + Buff + Story
- [x] Redis cache layer (cache.ts)
- [x] Socket.IO setup — player:move, map:players
- [x] Error handling middleware improvements

## Frontend
- [x] PhaserJS 3.80 game renderer
- [x] Game scene: tilemap + player sprite + arrow key movement
- [x] Socket.IO client hook (useSocket)
- [x] Game state store (Zustand)
- [x] GamePage component
- [x] Auth store: added player field + setPlayer action
- [x] API client: added player endpoints

## Asset System
- [x] ASSET_MANIFEST.md — phân loại 72 assets thành 9 category
- [x] AssetConfig.ts — toàn bộ asset paths configurable, không hardcode
- [x] AssetManager.ts — preload + typed lookup + placeholder fallback
- [x] GameScene.ts — tích hợp AssetManager, thay thế hardcoded paths
- [x] Vite config — publicDir trỏ đến assets/ workspace root

---

# Sprint 0 Checklist

## Backend
- [x] NodeJS + Express + TypeScript
- [x] Socket.IO placeholder
- [x] Modular Clean Architecture (Route → Controller → Service → Repository)
- [x] Auth module: Register, Login, Refresh Token, Logout
- [x] JWT + bcrypt password hash
- [x] Zod validation
- [x] Rate limiting (in-memory)
- [x] Error handling middleware

## Frontend
- [x] React 19 + Vite 6
- [x] TypeScript strict mode
- [x] TailwindCSS 3 + custom theme (gu-* colors)
- [x] Zustand auth store
- [x] TanStack Query provider
- [x] React Router (Login, Register pages)
- [x] API client (fetch wrapper)

## Database
- [x] PostgreSQL 17 (Docker)
- [x] Drizzle ORM schema: accounts, account_sessions, players
- [x] drizzle.config.ts

## Infrastructure
- [x] Monorepo (npm workspaces)
- [x] Docker Compose (PostgreSQL, Redis, Backend, Frontend)
- [x] ESLint + Prettier config
- [x] GitHub Actions CI (Lint + TypeCheck)
- [x] tsconfig strict (base + per-package)

## Documentation
- [x] docs/03_DATABASE_DESIGN.md updated (Prisma → Drizzle)
- [x] GAME_BUILD_PLAN.md updated (Sprint 0 marked complete)
- [x] CHANGELOG.md created

---

# Deployment

**Architecture:** Render Cloud (không cần Docker local)

- **co-dao-backend** — Render Web Service: Express API + phục vụ React SPA từ `frontend/dist/`
- **co-dao-postgres** — Render Managed PostgreSQL 17
- **Redis** — Optional (server chạy bình thường nếu không có Redis)

| Component | Status |
|-----------|--------|
| render.yaml | ✅ Ready |
| .env.example | ✅ Updated (CORS_ORIGIN, Render env vars) |
| Docker Compose | ⚠️ Legacy only (đã đánh dấu deprecated) |
| Local Dev | ✅ `npm run dev` (không cần Docker) |
| Production Build | ✅ `npm run build` → backend serves frontend |
| Deploy lên Render | ⬜ Pending (push repo + connect Blueprint) |

# Current Blockers

- Không có. Typecheck & Lint đã được xác minh thành công (2026-07-04).

# Next Task

→ **Sprint 9 — Chapter 2: Nam Cương** (Map mới, NPC mới, Boss Vạn Độc Cổ Vương, 3 Chuyển, luyện chế Cổ nâng cao)

---

**2026-07-05**: NPC Interaction, Quest Progression, Map Navigation & Combat Visual Hotfixes.
- Fixes: Phaser texture-space hit-area bounds for NPCs, dialogue starting-node selection based on active story flags, backend setStoryFlag body parser formatting mismatch, and persistent localStorage cutscene played state.
- Map & Spawns: Relocated Làng Cổ Thảo rabbit coordinates inside the 1500x1500px map boundaries (from 1600 to 1200), configured database seeding to unconditionally refresh portals and spawns on startup, and corrected the runtime monster template mapId mapping on the server to ensure monsters appear on their respective maps.
- Navigation: Implemented off-screen portal directional pointers (dynamic rotating HUD arrows) to guide players to maps/portals.
- Visuals: Implemented real-time sword arc slash animation effects at target coordinates when the player executes attacks.

**2026-07-04**: Sprint 8 — Critical Bug Fixes & H5 Gameplay Foundation completed & verified.
- Fixes: Delta-time movement scaling, socket listener race conditions, player center spawn, multiplayer state updates, 401 token redirect loops, quest wildcards route conflicts, missing resolvePlayer middlewares, dialogue click hit areas, talk distance checks.
- Features: Real-time server loop (20Hz), monster AI chase & aggro mechanics, monster respawns, player damage/death/teleport-respawning, client HUD HP bars.
- Story: Cinematic opening cutscene, multi-choice lore-rich dialogues, 5-quest sequence chain (Chapter 1), reward claims (gold, exp, items), boss pre-fight proximity dialogues, breakthrough Nhị Chuyển ending cutscene, local save snapshots.
- Seeding: Self-healing database seeds for all maps, portals, NPCs, dialogues, and items.

---

# Changelog

## 2026-07-03

Sprint 0 — Foundation completed. Full infrastructure ready for development.

---

# AI Instructions

Mọi AI Agent phải đọc các file sau trước khi bắt đầu làm việc:

1. AGENTS.md
2. PROJECT_STATUS.md
3. GAME_BUILD_PLAN.md

Sau đó mới đọc các tài liệu liên quan trong:

- docs/
- content/

---

# Update Rules

Sau mỗi lần hoàn thành một task:

- Cập nhật Sprint Checklist.
- Cập nhật Overall Progress.
- Cập nhật Last Completed Task.
- Cập nhật Changelog.
- Cập nhật Next Task.

Không được bỏ qua.

---

# Completion Rules

Một Sprint chỉ được đánh dấu **Completed** khi:

- Tất cả Checklist đều hoàn thành.
- Build thành công.
- Không có lỗi TypeScript.
- Không có lỗi ESLint.
- Migration chạy thành công.
- Docker chạy thành công.
- CHANGELOG.md đã được cập nhật.

Không được chuyển sang Sprint tiếp theo nếu chưa đạt các điều kiện trên.
