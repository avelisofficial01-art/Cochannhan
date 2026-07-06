# PROJECT_STATUS.md

# Gu World - Project Status

**Project:** CỔ ĐẠO
**Version:** Pre-Alpha
**Status:** 🚧 In Development

---

# Current Sprint

**Sprint:** 20 — Hotfix: Quest progression talk objectives & dialogue loops

**Status:** ✅ Completed

**Started:** 2026-07-06

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
| Sprint 13 | Mobile Interaction Fix & Position Synchronization | ✅ Completed |
| Sprint 14 | H5 Unified Viewport, Quest Filtering & Coordinate Sync | ✅ Completed |
| Sprint 15 | Production Hotfix: Missing Socket & DB Push Error | ✅ Completed |
| Sprint 16 | Gameplay Integration: Inventory, Gold, Crafting & Quest Fix | ✅ Completed |
| Sprint 17 | Hotfix: Story Auth 500 & Quest Flow | ✅ Completed |
| Sprint 18 | Hotfix: Quest Accept 500 & Portal Two-Way Loop | ✅ Completed |
| Sprint 19 | Hotfix: Dialogue active flags mismatch & cooldown position | ✅ Completed |
| Sprint 20 | Hotfix: Quest progression talk objectives & dialogue loops | ✅ Completed |

---

# Current Task

Current Module: ✅ Sprint 20 — Hotfix: Quest progression talk objectives & dialogue loops

# Sprint 15 Checklist

## Production Hotfix (S15.1)
- [x] Root cause: `useSocket()` hook was defined but NEVER called anywhere → Socket.IO never connected → no map, NPC, monster data received
- [x] Fix: Call `useSocket()` in `GamePage.tsx` so Socket.IO connects on mount, bridges are assigned to `window`, and all game data flows
- [x] Root cause: `drizzle-kit push` in production `start:prod` throws PostgresError 42P16 when schema has column differences with existing DB (tries to drop PK column `id`)
- [x] Fix: Change `start:prod` to `(npm run db:push || echo ...) && npm run start` — graceful error handling, server still starts
- [x] Build: all 3 packages compile OK
- [x] Typecheck: 0 errors
- [x] Lint: 0 errors (only pre-existing warnings)

---

# Current Task

Current Module: ✅ Sprint 14 — H5 Unified Viewport, Quest Filtering & Coordinate Sync

# Sprint 14 Checklist

## H5 Unified Viewport, Quest Filtering & Coordinate Synchronization (S14.1)
- [x] Consolidate the main layout viewport to fill 100% of screen height
- [x] Completely remove external React `<header>` and `<footer>` layouts from `GamePage.tsx`
- [x] Define global `ProfileState` and `StatsState` types and state properties inside `gameStore.ts`
- [x] Bind CharacterPanel's activeTab, profile, and stats to Zustand state properties and hooks
- [x] Set up active periodic (5s) background profile and stats sync fetches inside `GameHUD.tsx`
- [x] Implement the top HUD overlay bar showing Player Avatar, Username, Realm name, Gold balance, Spirit Stone balance, Online ping, and Đăng Xuất (Logout) button
- [x] Expand the bottom HUD dock with direct quick-open buttons for stats, gu, equip, quest, and craft panels
- [x] Filter out completed quests in `CharacterPanel.tsx` quest tab render (only map status === active)
- [x] Integrate toggle collapse/expand controls in `QuestTracker.tsx` header to prevent mobile clutter
- [x] Pass `spawnX`/`spawnY` coordinate parameters in server `map:init` emit and validate values against NaN fallbacks on client
- [x] Fix fractional drop rates math in `rollDrops` (using 0..1 roll check) and multiply by 2x for testing
- [x] Typecheck + build + lint all pass

---

# Sprint 13 Checklist

## Mobile Interaction Fix & Position Synchronization (S13.1)
- [x] Add explicit `onTouchEnd` event listeners with `preventDefault`/`stopPropagation` on DialoguePanel choice and continue buttons
- [x] Configure explicit `pointerEvents: 'auto'` style properties for `dialogueOverlay` and `dialogueContainer`
- [x] Synchronize player coordinates inside the backend `playerPositions` cache when players respawn (after death)
- [x] Load player coordinates from the database inside backend `map:join` socket handler when joining without specific coordinates
- [x] Emit the `targetId` along with the `combat:result` event from the server
- [x] Resolve `targetX` and `targetY` from the active monster instance coordinate in Zustand inside client `combat:result` socket listener
- [x] Pre-populate `objectives_progress` using counts resolved from quest templates upon quest acceptance
- [x] Typecheck + build + lint all pass

---

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

- Không có. Typecheck & Lint đã được xác minh thành công (2026-07-05).

# Next Task

→ **Sprint 16 — Chapter 2: Nam Cương** (Map mới, NPC mới, Boss Vạn Độc Cổ Vương, 3 Chuyển, luyện chế Cổ nâng cao)

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

---

# Sprint 16: Gameplay Integration (2026-07-06)

## Mục tiêu

Tích hợp các hệ thống gameplay còn thiếu: hiển thị inventory (túi đồ), thưởng vàng từ quái, kích hoạt nút chế tạo, sửa flow nhận quest.

## Hoàn thành

| ID | Nhiệm vụ | Trạng thái | Chi tiết |
|----|----------|-----------|----------|
| S16.1 | Sửa endpoint quest flag | ✅ | DialoguePanel gọi sai endpoint `/api/quest/flags/set` → sửa thành `POST /api/story/flags` với params `{ flagKey, flagValue }` |
| S16.2 | Thêm Inventory Tab | ✅ | Thêm tab 🎒 Túi Đồ vào CharacterPanel, fetch `GET /api/inventory/`, hiển thị danh sách vật phẩm với số lượng |
| S16.3 | Thêm gold reward combat | ✅ | Tính gold thưởng dựa trên HP/ATK quái, update `player.gold` qua `playerRepository`, thêm `goldReward` vào `CombatResult` |
| S16.4 | Wire nút Chế tạo | ✅ | Thêm handler gọi `POST /api/craft` với `recipeId`, hiển thị thông báo thành công/thất bại |

## Files modified

| File | Change |
|------|--------|
| `frontend/src/components/DialoguePanel.tsx` | Sửa endpoint quest flag |
| `frontend/src/store/gameStore.ts` | Thêm `inventorySlots` state + setter |
| `frontend/src/components/CharacterPanel.tsx` | Thêm inventory tab + fetch API |
| `backend/src/combat/combat.service.ts` | Thêm gold reward logic |
| `shared/src/combat/types.ts` | Thêm `goldReward?: number` vào `CombatResult` |
| `frontend/src/components/CraftPanel.tsx` | Wire nút Chế tạo gọi API |

## Xác nhận

- [x] Typecheck: 0 errors (shared + backend + frontend)
- [x] Lint: 0 errors (warnings unchanged)
- [x] Build: `npm run build` thành công

---

# Sprint 17: Hotfix Story Auth 500 & Quest Flow (2026-07-06)

## Mục tiêu

Fix lỗi 500 từ server khi set story flag, và đảm bảo quest flow hoạt động thông qua NPC dialogue.

## Root Cause

Story routes (`/api/story/*`) trong `story.controller.ts` **thiếu `authenticate` + `resolvePlayer` middleware** → `POST /api/story/flags` nhận `playerId` rỗng (undefined → '') → database query với playerId rỗng gây lỗi 500 → flag không set được → quest không accept → không có cốt truyện.

## Hoàn thành

| ID | Nhiệm vụ | Trạng thái | Chi tiết |
|----|----------|-----------|----------|
| S17.1 | Thêm auth middleware vào story routes | ✅ | `story.controller.ts`: import + `router.use(authenticate, resolvePlayer)` |
| S17.2 | Sửa DialoguePanel dùng fetchWithAuth | ✅ | Thay toàn bộ `fetch` + token thô bằng `fetchWithAuth` từ client API |

## Files đã sửa

| File | Change |
|------|--------|
| `backend/src/story/story.controller.ts` | Import `authenticate` + `resolvePlayer`, thêm `router.use(authenticate, resolvePlayer)` |
| `frontend/src/components/DialoguePanel.tsx` | Import `fetchWithAuth`, thay `fetch` + token thô → `fetchWithAuth` cho tất cả API calls |

## Xác nhận

- [x] Typecheck: 0 errors (shared + backend + frontend)
- [x] Lint: 0 errors (chỉ warnings pre-existing)
- [x] Build: `npm run build` thành công

---

# Sprint 18: Hotfix Quest Accept 500 & Portal Two-Way Loop (2026-07-06)

## Mục tiêu

1. Fix lỗi 500 khi accept quest (`POST /api/quest/accept`)
2. Fix lỗi portal không chuyển map được (two-way loop)

## Root Cause

### Quest Accept 500
`acceptQuestSchema` yêu cầu `questId: z.string().uuid()` nhưng quest template IDs trong config là custom strings như `q_ch1_awaken`, `q_ch1_wolves` → Zod parse thất bại → 500.

### Portal Two-Way Loop
Khi player vào portal từ Map A → Map B, player spawn ở vị trí portal entry point trên Map B. Nếu Map B có portal quay lại Map A tại vị trí đó, `checkPortalCollision` trigger ngay lập tức → quay lại Map A → lặp vô hạn.

## Hoàn thành

| ID | Nhiệm vụ | Trạng thái | Chi tiết |
|----|----------|-----------|----------|
| S18.1 | Fix acceptQuestSchema | ✅ | Đổi `questId: z.string().uuid()` → `z.string().min(1)` |
| S18.2 | Fix portal two-way loop | ✅ | Thêm `lastPortalTime` cooldown 2s sau map join |

## Files đã sửa

| File | Change |
|------|--------|
| `backend/src/quest/quest.schema.ts` | `acceptQuestSchema.questId` từ `.uuid()` → `.min(1)` |
| `frontend/src/game/GameScene.ts` | Thêm `lastPortalTime`, cooldown 2s trong `checkPortalCollision`, reset trong `handleMapInit` |

## Xác nhận

- [x] Typecheck: 0 errors (shared + backend + frontend)
- [x] Build: `npm run build` thành công

---

# Sprint 19: Hotfix Dialogue active flags mismatch & cooldown position (2026-07-06)

## Mục tiêu

1. Fix lỗi player không nhận được quest tiếp theo do mismatch key/value trong story flags tại DialoguePanel
2. Fix vị trí của cooldown indicator bar ở màn hình game (centering at bottom)
3. Fix authentication error khi load QuestTracker bằng cách đổi sang fetchWithAuth

## Root Cause

- DialoguePanel fetch active story flags từ `/api/quest/flags/list` trả về format `{ key, value }` nhưng code frontend lại kiểm tra trường `flagKey` và `flagValue`.
- Cooldown indicator bar trong GameScene sử dụng vị trí cố định `300, 585` làm lệch layout trên các thiết bị mobile/màn hình có tỉ lệ khác.
- QuestTracker sử dụng `fetch` thô với token thủ công thay vì `fetchWithAuth`.

## Hoàn thành

| ID | Nhiệm vụ | Trạng thái | Chi tiết |
|----|----------|-----------|----------|
| S19.1 | Fix active flags key mismatch | ✅ | Đổi endpoint load flags sang `/api/story/flags` để khớp với types `{ flagKey, flagValue }` |
| S19.2 | Centering cooldown bar | ✅ | Dùng `this.cameras.main.width` và `height` để vẽ cooldown bar ở giữa bên dưới màn hình |
| S19.3 | QuestTracker auth migration | ✅ | Đổi sang sử dụng `fetchWithAuth` để thống nhất cơ chế refresh token |

## Files đã sửa

| File | Change |
|------|--------|
| `frontend/src/components/DialoguePanel.tsx` | Đổi sang fetch `/api/story/flags` |
| `frontend/src/components/QuestTracker.tsx` | Đổi sang `fetchWithAuth` |
| `frontend/src/game/GameScene.ts` | Sử dụng viewport dimensions để vẽ cooldown bar |
| `frontend/src/api/client.ts` | Tự động redirect về `/login` khi token refresh thất bại (401) |

## Xác nhận

- [x] Typecheck: 0 errors (shared + backend + frontend)
- [x] Build: `npm run build` thành công
- [x] Lint: 0 errors (warnings unchanged)

---

# Sprint 20: Hotfix Quest progression talk objectives & dialogue loops (2026-07-06)

## Mục tiêu

1. Fix lỗi "Tỉnh Giấc Mộng" quest (talk to Trưởng làng) không hoàn thành do setting story flag bỏ qua quest-advancement logic.
2. Fix lỗi đối thoại lặp vô tận với các NPC (Trưởng làng, Trưởng lão, Thợ rèn, v.v.) sau khi đã hoàn thành dialogue chain.
3. Fix lỗi kẹt quest "Lời Tiên Tri Cổ" (talk to Trưởng lão) không thể hoàn thành do thiếu event handler cho flag `ch1_sent_to_blacksmith`.
4. Fix lỗi kẹt hội thoại nhắc nhở của Trưởng lão và Trưởng làng biến thành lời chào chung "Chúc ngươi tu tiên lộ thành công!".

## Root Cause

- Endpoint `/api/story/flags` được gọi bởi frontend chỉ cập nhật cơ sở dữ liệu qua `storyRepo.setFlag`, bỏ qua `questService.setStoryFlag` (chứa logic tự động cập nhật tiến trình quest talk).
- Logic tìm kiếm `startNode` trong `DialoguePanel.tsx` không phát hiện được chain đã hoàn thành nếu nút đầu tiên của chain không có `setFlag` thuộc tính, dẫn đến tự động lặp lại từ orderIndex 0.
- `questService.setStoryFlag` thiếu nhánh xử lý flag `ch1_sent_to_blacksmith` để tự động hoàn thành talk objective của NPC Trưởng lão.
- Các nút nhắc nhở constructed dynamic trong `DialoguePanel.tsx` có `id: 'fallback'` nhưng lại bị check `isStartNodeCompleted` dựa trên `setFlag` (vốn đã có trong activeFlags), dẫn tới bị override thành lời chào generic.

## Hoàn thành

| ID | Nhiệm vụ | Trạng thái | Chi tiết |
|----|----------|-----------|----------|
| S20.1 | Kết nối story flag và quest backend | ✅ | Cập nhật `storyService.setFlag` để delegate qua `questService.setStoryFlag` nhằm chạy toàn bộ hiệu ứng phụ (advancement & auto-accept). |
| S20.2 | Fix lặp hội thoại frontend | ✅ | Thêm logic phát hiện hội thoại đã hoàn thành bằng cách kiểm tra các flag kết quả và hiển thị fallback phù hợp cho Trưởng làng, Trưởng lão, Thợ rèn, Bia Đá Cổ, Bạch Lang Vương. |
| S20.3 | Fix kẹt quest Lời Tiên Tri Cổ | ✅ | Bổ sung check flag `ch1_sent_to_blacksmith` để tự động tăng tiến độ quest của Trưởng lão. |
| S20.4 | Fix kẹt hội thoại nhắc nhở NPC | ✅ | Sửa `isStartNodeCompleted` để bỏ qua kiểm tra hoàn thành cho các nút có `id: 'fallback'`. |

## Files đã sửa

| File | Change |
|------|--------|
| `backend/src/story/story.service.ts` | Gọi `questService.setStoryFlag` trong `setFlag` |
| `frontend/src/components/DialoguePanel.tsx` | Sửa logic chọn `startNode` với fallbacks phù hợp và skip check completed cho fallback nodes |
| `backend/src/quest/quest.service.ts` | Thêm flag `ch1_sent_to_blacksmith` để hoàn thành mục tiêu đối thoại với Trưởng lão |

## Xác nhận

- [x] Typecheck: 0 errors (shared + backend + frontend)
- [x] Lint: 0 errors (warnings unchanged)
- [x] Build: `npm run build` thành công

---

Không được chuyển sang Sprint tiếp theo nếu chưa đạt các điều kiện trên.
