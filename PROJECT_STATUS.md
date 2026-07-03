# PROJECT_STATUS.md

# Gu World - Project Status

**Project:** CỔ ĐẠO
**Version:** Pre-Alpha
**Status:** 🚧 In Development

---

# Current Sprint

**Sprint:** 7 — Polish & Stabilize

**Status:** 🚧 In Progress (4/7 tasks)

**Started:** 2026-07-04

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
| Sprint 7 | Polish & Stabilize | 🚧 In Progress |

---

# Current Task

Current Module: 🚧 Sprint 7 — Polish & Stabilize

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

## Performance Optimization (S7.2)
- [ ] Tối ưu socket sync, map rendering, database query

## UI/UX Polish (S7.3)
- [ ] Animation cơ bản, transition, loading state

## Error Recovery (S7.4)
- [ ] Xử lý disconnect, reconnect, data consistency

## Admin Panel MVP (S7.5)
- [ ] Quản lý người chơi, NPC, Quest cơ bản

## Documentation (S7.6)
- [ ] Cập nhật tất cả tài liệu sau MVP

## Playtest (S7.7)
- [ ] Internal playtest, thu thập feedback

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

---

# Next Task

→ **Sprint 4 — Gu System** (Gu template, equip/unequip, enhancement, synergy, skills, crafting)

---

# Last Completed Task

**2026-07-04**: Sprint 3 — Combat Core completed & verified.
- Shared Combat Engine: Damage Calculator (SYSTEM_BIBLE formula), Status Effects (10 types)
- Backend: Monster CRUD + Combat Engine (in-memory) + Socket.IO real-time combat
- Database: monster_templates + combat_logs tables
- Frontend: Monster sprites, HP bars, damage numbers (floating text), attack cooldown (spacebar)
- Seed data: 3 monsters for Bắc Nguyên (Quái Thú Hoang Dã, Sói Bắc Nguyên, Hỏa Hồ Yêu)
- Typecheck: 0 errors (shared + backend + frontend)
- Lint: 0 errors, 52 warnings (pre-existing)

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
