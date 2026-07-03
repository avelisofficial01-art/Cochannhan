# GAME_BUILD_PLAN.md — 《CỔ ĐẠO》

> Version: 1.0
> Ngày lập: 2026-07-03
> Dựa trên toàn bộ tài liệu: docs/ + content/ + AGENTS.md

---

## MỤC LỤC

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Phân tích tài liệu hiện có](#2-phân-tích-tài-liệu-hiện-có)
3. [Mâu thuẫn & Thiếu sót](#3-mâu-thuẫn--thiếu-sót)
4. [Đề xuất cải tiến](#4-đề-xuất-cải-tiến)
5. [Nguyên tắc phát triển](#5-nguyên-tắc-phát-triển)
6. [Kế hoạch Sprint](#6-kế-hoạch-sprint)
7. [Phụ lục: Thứ tự ưu tiên tài liệu](#7-phụ-lục-thứ-tự-ưu-tiên-tài-liệu)

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1 Định danh

| Mục | Giá trị |
|-----|---------|
| Tên dự án | 《CỔ ĐẠO》(tạm) |
| Thể loại | Story RPG × Cultivation RPG × Single Player Online |
| Nền tảng | Web (→ Electron Desktop, → PWA Mobile) |
| Cảm hứng | Cổ Chân Nhân (Reverend Insanity) |
| Triết lý | **Story First, Data Driven, Modular, Server Authority** |

### 1.2 Vision

Xây dựng một **Story-driven RPG** trong đó:

- Cốt truyện là trung tâm — mọi hệ thống phục vụ cốt truyện.
- Người chơi phát triển qua hệ thống **tu luyện (9 Chuyển)** và **Cổ Trùng (Gu)**.
- Mỗi lựa chọn ảnh hưởng đến diễn biến về sau.
- Thế giới có tính liên tục, có thể mở rộng trong nhiều năm.
- Kiến trúc chuẩn, phát triển từ Alpha → Production không cần thiết kế lại.

### 1.3 Tech Stack

| Tầng | Công nghệ |
|------|-----------|
| Frontend | React + TypeScript + PhaserJS + Vite + TailwindCSS + Zustand + TanStack Query |
| Backend | NodeJS + ExpressJS + TypeScript + Socket.IO |
| Database | PostgreSQL 17 |
| Cache | Redis |
| ORM | **Drizzle ORM** |
| Deploy | Docker + Nginx + PM2 |

### 1.4 Source of Truth (Thứ tự ưu tiên)

```
1. docs/02_SYSTEM_BIBLE.md        ← CAO NHẤT
2. docs/03_DATABASE_DESIGN.md
3. docs/04_BACKEND_ARCHITECTURE.md
4. docs/05_API_SPEC.md
5. content/
```

---

## 2. PHÂN TÍCH TÀI LIỆU HIỆN CÓ

### 2.1 docs/01_PROJECT_SPEC.md — Đặc tả dự án

**Trạng thái**: Đầy đủ về mặt ý tưởng.

**Điểm mạnh**:
- Vision rõ ràng: Story First, Gameplay before Graphics, Data Driven, Modular.
- Định nghĩa đầy đủ Core Gameplay Loop (Đăng nhập → Story → NPC → Quest → Khám phá → Combat → Luyện chế → Đột phá → Boss → Chapter).
- Xác định 5 đại vực với bản sắc riêng.
- Hệ thống 9 Chuyển thay vì Level truyền thống.
- Stat Calculator tập trung — chỉ số tính từ một nơi duy nhất.
- 5 lớp sức mạnh độc lập: Story Progress → Cultivation → Gu Build → Equipment → Player Skill.

**Điểm cần lưu ý**:
- Gameplay Loop khác với SYSTEM_BIBLE (xem mục 3.2).

### 2.2 docs/02_SYSTEM_BIBLE.md — Kinh thánh hệ thống

**Trạng thái**: Đầy đủ nhất, là Source of Truth cao nhất.

**Điểm mạnh**:
- Định nghĩa toàn bộ 19 hệ thống gameplay.
- Có Design Rules bất biến (không Gu vô dụng, không Build tuyệt đối, không Pay To Win).
- Combat real-time kiểu Diablo/PoE/Hades.
- Damage Formula rõ ràng.
- Phân loại Damage Type: Physical / Element / Status Effect.
- Event Driven Architecture được nhấn mạnh.
- Có Expansion Rules cho tương lai.

### 2.3 docs/03_DATABASE_DESIGN.md — Thiết kế Database

**Trạng thái**: Chi tiết, đầy đủ schema.

**Điểm mạnh**:
- 7 nhóm module: Account, Player, World, Story, Combat, Economy, System.
- Template vs Player Data được tách biệt rõ.
- immortal_gu_registry cho tính duy nhất Tiên Cổ.
- Transaction Rules cho các thao tác quan trọng.
- Index Strategy và Foreign Key Rules.
- Soft Delete, Audit Log, Game Config table.
- Data Import/Export cho Designer.

**Điểm cần lưu ý**:
- Ghi **Prisma ORM** — mâu thuẫn với Backend Architecture ghi Drizzle.

### 2.4 docs/04_BACKEND_ARCHITECTURE.md — Kiến trúc Backend

**Trạng thái**: Đầy đủ cấu trúc module.

**Điểm mạnh**:
- Modular Clean Architecture (Route → Controller → Service → Repository).
- 16 module độc lập: auth, player, combat, gu, equipment, npc, story, quest, world, shop, inventory, crafting, socket, middleware, database, utils, config, shared.
- Event Bus cho giao tiếp giữa module.
- Server Tick 20 tick/s.
- Combat Engine riêng biệt.
- Anti-Cheat (Server Authority).
- Redis cache strategy.
- Logging toàn diện.
- Admin Panel cho Designer.

### 2.5 docs/05_API_SPEC.md — Đặc tả API

**Trạng thái**: Đầy đủ endpoints.

**Điểm mạnh**:
- REST cho dữ liệu, Socket.IO cho real-time.
- Response format thống nhất {success, data} / {success, code, message}.
- 14 Error Codes chuẩn.
- Security: JWT, Refresh Token, Rate Limit, Server Validation.

### 2.6 content/06_GAMECONTENT_WORLD.md — Thế giới

**Trạng thái**: Đầy đủ mô tả 5 đại vực.

**Điểm mạnh**:
- Tiến trình mở khóa theo Realm rõ ràng.
- Mỗi đại vực có chủ đề, monster, boss, NPC, tài nguyên riêng.
- Bí Cảnh có cấu trúc Puzzle → Monster → Mini Boss → Treasure → Boss.
- Thiên Kiếp từ 6 Chuyển.
- Đề xuất bổ sung: Regional Reputation, World State.

### 2.7 content/06_GAMECONTENT_FACTIONS.md — Phe phái

**Trạng thái**: Đầy đủ.

**Điểm mạnh**:
- Tam đại thế lực: Chính Đạo, Ma Đạo, Tán Tu.
- 15 Tông Môn phân bổ theo 5 đại vực.
- Hệ thống Danh Vọng (-1000 → 1000).
- Faction War định kỳ.
- Phản bội, Truy nã.
- Đề xuất bổ sung: Truyền Thừa.

### 2.8 content/07_GU_BIBLE.md — Kinh thánh Cổ Trùng

**Trạng thái**: Đầy đủ thiết kế.

**Điểm mạnh**:
- Phân loại theo Chuyển, Vai trò (7 loại), Thuộc tính (15 loại).
- Cấu trúc Gu hoàn chỉnh: ID, Tên, Chuyển, Loại, Thuộc tính, Vai trò, HP, ATK, DEF, Tốc độ, Kỹ năng, Passive, Lore, Nguồn gốc, Điều kiện luyện, Điều kiện tiến hóa.
- Slot theo Chuyển (1→9).
- Tiên Cổ: duy nhất toàn server, chỉ luyện chế.
- Cường hóa +0→+20 với các mốc đặc biệt.
- Tiến hóa: thay đổi tên, sprite, kỹ năng, chỉ số.
- Synergy: cấu hình bằng dữ liệu.
- Mastery 1→100.
- **Đề xuất quan trọng**: 30 Phàm Cổ + 10 Tiên Cổ, chất lượng > số lượng.

---

## 3. MÂU THUẪN & THIẾU SÓT

### 3.1 🔴 ORM MÂU THUẪN (CRITICAL)

| Tài liệu | ORM |
|----------|-----|
| `docs/03_DATABASE_DESIGN.md` (dòng 6) | **Prisma ORM** |
| `docs/04_BACKEND_ARCHITECTURE.md` (dòng 19) | **Drizzle ORM** |

**Ảnh hưởng**: Quyết định toàn bộ cách thiết kế schema, migration, query. Không thể bắt đầu code Database khi chưa thống nhất.

**Đề xuất**: Cần quyết định DỨT KHOÁT trước Sprint 0. Drizzle ORM phù hợp hơn với triết lý "không hardcode" và Data Driven vì:
- Không yêu cầu code generation như Prisma.
- Schema defined in TypeScript — dễ tái sử dụng type.
- Performance tốt hơn ở edge cases.
- Phù hợp hơn với modular architecture.

### 3.2 🟡 GAMEPLAY LOOP KHÔNG ĐỒNG NHẤT

| Tài liệu | Gameplay Loop |
|----------|---------------|
| `01_PROJECT_SPEC.md` | Khám phá → Hội thoại → Nhận nhiệm vụ → Chiến đấu → **Nhận thưởng** → Tu luyện → Mở chương truyện |
| `02_SYSTEM_BIBLE.md` | Story → Dialogue → Quest → Explore → Combat → **Loot → Craft** → Cultivation → Unlock Story |

**Đánh giá**: SYSTEM_BIBLE có Loot → Craft trước Cultivation, SPEC có Nhận thưởng rồi Tu luyện. **Theo Source of Truth, SYSTEM_BIBLE (02) được ưu tiên.**

**Đề xuất**: Giữ nguyên SYSTEM_BIBLE. Cập nhật 01_PROJECT_SPEC.md cho khớp.

### 3.3 🟡 TÊN FILE CONTENT KHÔNG KHỚP AGENTS.MD

| AGENTS.md tham chiếu | File thực tế |
|---------------------|--------------|
| `content/01_WORLD.md` | `content/06_GAMECONTENT_WORLD.md` |
| `content/02_FACTIONS.md` | `content/06_GAMECONTENT_FACTIONS.md` |

**Đề xuất**: Cập nhật AGENTS.md cho khớp với tên file thực tế, hoặc đổi tên file theo convention.

### 3.4 🟢 THIẾU TÀI LIỆU

| # | Tài liệu thiếu | Mức độ | Ghi chú |
|---|---------------|--------|---------|
| 1 | UI/UX Design / Wireframe | TRUNG BÌNH | Không ảnh hưởng backend, cần trước khi làm Frontend Sprint 2+ |
| 2 | Test Strategy | TRUNG BÌNH | Cần trước Sprint 1 |
| 3 | Chỉ số cụ thể cho Monster, Boss, Gu | CAO | Cần cho Sprint 2-3 |
| 4 | Bảng Synergy đầy đủ | TRUNG BÌNH | Cần cho Sprint 4 |
| 5 | Đường tiến hóa Gu chi tiết | TRUNG BÌNH | Cần cho Sprint 4 |
| 6 | Dialogue/Story content mẫu | THẤP | Cần cho Sprint 5 |
| 7 | CI/CD Pipeline Doc | THẤP | Cần trước khi deploy |

---

## 4. ĐỀ XUẤT CẢI TIẾN

> ⚠️ **LƯU Ý**: Đây chỉ là ĐỀ XUẤT. Không tự ý thay đổi thiết kế khi chưa được chấp thuận.

### 4.1 Cần quyết định ngay

| STT | Vấn đề | Đề xuất | Lý do |
|-----|--------|---------|-------|
| 1 | ORM | **Drizzle ORM** | Phù hợp Data Driven, schema = TypeScript, không codegen |
| 2 | Gameplay Loop | Giữ **SYSTEM_BIBLE** | Source of Truth cao nhất |
| 3 | Tên file content | Đổi tên file theo convention `01_`, `02_` | Dễ quản lý, khớp AGENTS.md |

### 4.2 Cải tiến kiến trúc (tham khảo)

| STT | Đề xuất | Mô tả | Ưu tiên |
|-----|---------|-------|---------|
| 1 | **Validation Layer** | Thêm một tầng validation giữa Controller và Service để tái sử dụng logic kiểm tra (đủ mana, đủ tiền, hồi chiêu...) | THẤP |
| 2 | **Config Service** | Tập trung toàn bộ game config vào một service, cache Redis, auto-reload khi config thay đổi | TRUNG BÌNH |
| 3 | **Seed Data System** | Hệ thống seed data cho Developer và Test, tách biệt với Production data | TRUNG BÌNH |
| 4 | **API Versioning** | `/api/v1/...` ngay từ đầu để dễ nâng cấp API sau này | THẤP |
| 5 | **i18n Foundation** | Chuẩn bị cấu trúc đa ngôn ngữ từ đầu (ít nhất EN + VI), lưu text trong database/config | THẤP |

---

## 5. NGUYÊN TẮC PHÁT TRIỂN

### 5.1 Quy tắc bắt buộc (từ AGENTS.md)

- ✅ TypeScript Strict Mode
- ✅ Clean Architecture — SOLID, DRY, KISS
- ✅ Server Authority — server là nguồn dữ liệu duy nhất
- ✅ Data Driven — mọi gameplay từ Database/Config
- ✅ Không hardcode
- ✅ Không `any`, không `TODO`, không `console.log`
- ✅ Luôn xử lý Error
- ✅ Mỗi commit chỉ MỘT chức năng
- ✅ Không sửa trực tiếp Schema — chỉ tạo Migration
- ✅ Không sửa ID, không xóa dữ liệu
- ✅ Không đổi Request/Response của API

### 5.2 Quy tắc cho từng lĩnh vực

| Lĩnh vực | Tài liệu bắt buộc đọc |
|----------|----------------------|
| Backend | SYSTEM_BIBLE + DATABASE_DESIGN + BACKEND_ARCHITECTURE + API_SPEC |
| Combat | SYSTEM_BIBLE + GU_BIBLE |
| Database | DATABASE_DESIGN + API_SPEC |
| Story | GAMECONTENT_WORLD + GAMECONTENT_FACTIONS |

### 5.3 Khi thiếu thông tin

> KHÔNG ĐƯỢC ĐOÁN. KHÔNG TỰ THIẾT KẾ.
> Dừng lại và yêu cầu người dùng bổ sung.

---

## 6. KẾ HOẠCH SPRINT

### Nguyên tắc phân chia Sprint

- Mỗi Sprint ~2 tuần (có thể điều chỉnh theo team size).
- Mỗi Sprint tập trung vào MỘT nhóm chức năng.
- Hoàn thành Sprint hiện tại (bao gồm test + docs) mới chuyển sang Sprint tiếp theo.
- Backend trước, Frontend sau.
- Mỗi module phải độc lập, giao tiếp qua Event/Service.

---

### SPRINT 0: FOUNDATION (Tuần 1-2) ✅ HOÀN THÀNH (2026-07-03)

**Mục tiêu**: Setup dự án, quyết định kiến trúc, tạo skeleton chạy được.

| ID | Nhiệm vụ | Module | Trạng thái | Mô tả |
|----|----------|--------|-----------|-------|
| S0.1 | Khởi tạo monorepo | Root | ✅ | Cấu trúc `backend/` + `frontend/` + `shared/`, package.json, tsconfig strict |
| S0.2 | **Quyết định ORM** | Database | ✅ | Chọn **Drizzle ORM** — đã đồng bộ docs/03_DATABASE_DESIGN.md |
| S0.3 | Docker Compose | Infra | ✅ | PostgreSQL 17 + Redis 7 + backend + frontend |
| S0.4 | Database schema | Database | ✅ | Schema accounts, account_sessions, players (Drizzle) |
| S0.5 | Backend skeleton | Backend | ✅ | Express + TypeScript, Modular Clean Architecture |
| S0.6 | Auth module | Auth | ✅ | Register, Login, Refresh Token, Logout — JWT + bcryptjs |
| S0.7 | Frontend skeleton | Frontend | ✅ | React 19 + Vite 6 + TailwindCSS + Zustand + TanStack Query |
| S0.8 | CI/CD Pipeline | DevOps | ✅ | GitHub Actions: lint + typecheck trên push/PR |

**Đầu ra Sprint 0**:
- Backend chạy được trên localhost, có Auth API hoạt động.
- Frontend hiển thị trang Login/Register cơ bản.
- Database schema đầu tiên được migration.

→ Xem CHANGELOG.md để biết chi tiết từng file đã tạo.

---

### SPRINT 1: PLAYER & WORLD (Tuần 3-4)

**Mục tiêu**: Người chơi có nhân vật, có thể di chuyển trên bản đồ.

| ID | Nhiệm vụ | Module | Mô tả |
|----|----------|--------|-------|
| S1.1 | Player module | Player | CRUD player, stats, profile, realm, position |
| S1.2 | Stat Calculator | Shared | Engine tính chỉ số cuối cùng từ Base + Equipment + Gu + Passive + Buff + Story Bonus |
| S1.3 | World module | World | Map CRUD, Portal, Dungeon skeleton |
| S1.4 | Map rendering | Frontend | PhaserJS map renderer, tilemap |
| S1.5 | Player movement | Socket | Socket.IO: player:move → sync client, 20 tick/s |
| S1.6 | Redis cache layer | Infra | Cache Player Profile, Config, NPC Dialogue |
| S1.7 | Game Config table | Database | Seed data: MAX_REALM, MAX_GU_SLOT, MAX_ENHANCE, PLAYER_SPEED... |
| S1.8 | Error handling middleware | Backend | Format lỗi thống nhất {success, code, message} |

**Đầu ra Sprint 1**:
- Người chơi có thể tạo nhân vật, xem profile, stats.
- Map đầu tiên (Bắc Nguyên) hiển thị được.
- Di chuyển real-time qua Socket.IO.

---

### SPRINT 2: NPC & QUEST (Tuần 5-6)

**Mục tiêu**: NPC xuất hiện, người chơi nhận và hoàn thành quest.

| ID | Nhiệm vụ | Module | Mô tả |
|----|----------|--------|-------|
| S2.1 | NPC module | NPC | Template, hội thoại, lịch trình, hảo cảm, shop |
| S2.2 | NPC rendering | Frontend | Hiển thị NPC trên map, interaction |
| S2.3 | Dialogue system | Story | Hiển thị hội thoại, choices, story flag |
| S2.4 | Quest module | Quest | Accept, Progress, Complete, Reward |
| S2.5 | Quest UI | Frontend | Quest log, tracker |
| S2.6 | Story Flag system | Story | Lưu và kiểm tra story flag |
| S2.7 | Inventory module | Inventory | Add/Remove Item, Move Slot, Sort, Stack |

**Đầu ra Sprint 2**:
- NPC xuất hiện trên bản đồ Bắc Nguyên: Trưởng làng, Thợ rèn, Thương nhân, Trưởng lão.
- Người chơi trò chuyện, nhận quest, hoàn thành quest, nhận thưởng.
- Túi đồ hoạt động cơ bản.

---

### SPRINT 3: COMBAT CORE (Tuần 7-8)

**Mục tiêu**: Hệ thống chiến đấu real-time hoạt động.

| ID | Nhiệm vụ | Module | Mô tả |
|----|----------|--------|-------|
| S3.1 | Combat Engine | Combat | Damage Calculator, Critical, Status System, Cooldown, Projectile, Death |
| S3.2 | Monster module | Combat | Monster template, spawn, AI, drop table |
| S3.3 | Monster spawning | Socket | monster:spawn, monster:update, monster:dead |
| S3.4 | Player attack flow | Socket | player:attack → Server validate → Sync |
| S3.5 | Combat UI | Frontend | HP bar, damage numbers, cooldown indicators |
| S3.6 | Drop system | Economy | Drop table, item:drop event, auto-pickup |
| S3.7 | Combat log | Database | combat_logs table — ghi log combat để phân tích |

**Đầu ra Sprint 3**:
- Người chơi có thể đánh quái trên bản đồ Bắc Nguyên.
- Sát thương tính đúng công thức SYSTEM_BIBLE.
- Quái chết rơi đồ.

---

### SPRINT 4: GU SYSTEM (Tuần 9-10)

**Mục tiêu**: Hệ thống Cổ Trùng — trái tim của game.

| ID | Nhiệm vụ | Module | Mô tả |
|----|----------|--------|-------|
| S4.1 | Gu module | Gu | Template, Player Gu, Equip/Unequip, Stats |
| S4.2 | Gu Enhancement | Gu | Cường hóa +0→+20, các mốc đặc biệt (+5, +10, +15, +20) |
| S4.3 | Gu Skills | Gu | Active Skill, Passive Skill, Aura, Trigger Skill |
| S4.4 | Gu Synergy | Gu | Kiểm tra synergy khi equip, áp dụng bonus |
| S4.5 | Gu Craft | Craft | Luyện chế Phàm Cổ, công thức, nguyên liệu |
| S4.6 | Gu UI | Frontend | Danh sách Gu, equip slot (Không Khiếu), enhancement panel |
| S4.7 | Seed 5 Gu mẫu | Content | 5 Phàm Cổ (Hỏa, Phong, Thạch, Huyết, Độc) — mỗi con có đầy đủ stats, skill, lore |

**Đầu ra Sprint 4**:
- Người chơi có thể sở hữu, equip, cường hóa Cổ Trùng.
- Synergy hoạt động (VD: Hỏa + Phong = Hỏa Phong Bạo).
- Combat sử dụng Gu Skill thay vì đánh thường.
- 5 Cổ Trùng đầu tiên có thể chơi được.

---

### SPRINT 5: EQUIPMENT & CRAFT (Tuần 11-12)

**Mục tiêu**: Hệ thống trang bị và luyện chế.

| ID | Nhiệm vụ | Module | Mô tả |
|----|----------|--------|-------|
| S5.1 | Equipment module | Equipment | Template, Player Equipment, Equip/Unequip, Random Stat |
| S5.2 | Equipment Enhancement | Equipment | Cường hóa +0→+20 |
| S5.3 | Craft module | Craft | Equipment + Potion + Gu crafting, Recipe, Material |
| S5.4 | Equipment UI | Frontend | Trang bị slot, enhancement, craft panel |
| S5.5 | Shop system | Shop | NPC Shop, Buy/Sell, Refresh, Stock |

**Đầu ra Sprint 5**:
- Người chơi có thể trang bị vũ khí/áo/trang sức.
- Cường hóa trang bị hoạt động.
- Luyện chế trang bị và vật phẩm.
- Mua bán với NPC Shop.

---

### SPRINT 6: STORY CHAPTER 1 — BẮC NGUYÊN (Tuần 13-14)

**Mục tiêu**: Chapter đầu tiên hoàn chỉnh, có thể chơi từ đầu đến cuối.

| ID | Nhiệm vụ | Module | Mô tả |
|----|----------|--------|-------|
| S6.1 | Story engine | Story | Chapter → Act → Quest → Dialogue → Cutscene, Story Flag điều khiển tiến trình |
| S6.2 | Chapter 1: Người Phàm | Content | Toàn bộ dialogue, quest chain, cutscene |
| S6.3 | Boss Bạch Lang Vương | Combat | Boss AI, phase, story flag khi đánh bại |
| S6.4 | Đột phá 1→2 Chuyển | Cultivation | Breakthrough: kiểm tra điều kiện, boss, tiêu hao tài nguyên |
| S6.5 | Save system | Player | Auto Save + Manual Save, lưu Player + Story Flag + Quest + Inventory + Equipment + Gu + Map |
| S6.6 | Map mở rộng Bắc Nguyên | World | 5 bản đồ Bắc Nguyên với NPC, monster, portal |

**Đầu ra Sprint 6**:
- **MVP hoàn chỉnh**: Người chơi tạo nhân vật → trải nghiệm Chapter 1 → đột phá 2 Chuyển.
- Có thể chơi từ đầu đến cuối Chapter 1.

---

### SPRINT 7: POLISH & STABILIZE (Tuần 15-16)

**Mục tiêu**: Ổn định MVP, fix bug, cải thiện UX.

| ID | Nhiệm vụ | Module | Mô tả |
|----|----------|--------|-------|
| S7.1 | Bug fixing | All | Fix tất cả bug phát hiện trong quá trình test MVP |
| S7.2 | Performance optimization | All | Tối ưu socket sync, map rendering, database query |
| S7.3 | UI/UX polish | Frontend | Animation cơ bản, transition, loading state |
| S7.4 | Error recovery | Backend | Xử lý disconnect, reconnect, data consistency |
| S7.5 | Admin Panel MVP | Admin | Quản lý người chơi, NPC, Quest cơ bản |
| S7.6 | Documentation | Docs | Cập nhật tất cả tài liệu sau MVP |
| S7.7 | Playtest | QA | Internal playtest, thu thập feedback |

**Đầu ra Sprint 7**:
- **Phiên bản Alpha** có thể playtest nội bộ.
- Tài liệu đồng bộ với code.

---

### SPRINT 8+: POST-MVP (Dự kiến)

| Sprint | Mục tiêu | Nội dung chính |
|--------|----------|----------------|
| 8 | Chapter 2: Nam Cương | Map mới, NPC mới, Boss Vạn Độc Cổ Vương, 3 Chuyển |
| 9 | Gu Evolution | Tiến hóa Cổ Trùng, mở rộng Gu lên 15 con |
| 10 | Bí Cảnh & Dungeon | Puzzle, Mini Boss, Treasure |
| 11 | Chapter 3: Tây Mạc | Sa mạc, Sa Hoàng, 4-5 Chuyển |
| 12 | Faction System | Gia nhập Tông Môn, Danh Vọng, Faction War |
| 13 | Tiên Cổ & Immortal Craft | Luyện Tiên Cổ, unique check, World Event |
| 14 | Chapter 4-5: Đông Hải & Trung Châu | Hoàn thiện cốt truyện chính |
| 15 | PvP & Guild | Đấu trường, Guild system |
| 16 | Endgame & Raid | Boss raid, Thiên Kiếp, 7-9 Chuyển |

---

## 7. PHỤ LỤC: THỨ TỰ ƯU TIÊN TÀI LIỆU

Khi có mâu thuẫn giữa code và tài liệu, ưu tiên theo thứ tự:

| Ưu tiên | Tài liệu |
|---------|----------|
| 1 (CAO NHẤT) | `docs/02_SYSTEM_BIBLE.md` |
| 2 | `docs/03_DATABASE_DESIGN.md` |
| 3 | `docs/04_BACKEND_ARCHITECTURE.md` |
| 4 | `docs/05_API_SPEC.md` |
| 5 | `content/` |

### Danh sách đầy đủ tài liệu

| File | Vai trò | Trạng thái |
|------|---------|------------|
| `AGENTS.md` | Quy tắc phát triển | ✅ Đầy đủ |
| `docs/01_PROJECT_SPEC.md` | Đặc tả dự án | ✅ Đầy đủ |
| `docs/02_SYSTEM_BIBLE.md` | Kinh thánh hệ thống | ✅ Đầy đủ |
| `docs/03_DATABASE_DESIGN.md` | Thiết kế DB | ✅ Đầy đủ (cần sửa ORM) |
| `docs/04_BACKEND_ARCHITECTURE.md` | Kiến trúc Backend | ✅ Đầy đủ (cần sửa ORM) |
| `docs/05_API_SPEC.md` | Đặc tả API | ✅ Đầy đủ |
| `content/06_GAMECONTENT_WORLD.md` | Thế giới | ✅ Đầy đủ |
| `content/06_GAMECONTENT_FACTIONS.md` | Phe phái | ✅ Đầy đủ |
| `content/07_GU_BIBLE.md` | Kinh thánh Cổ Trùng | ✅ Đầy đủ |
| `GAME_BUILD_PLAN.md` | Kế hoạch phát triển | ✅ Vừa tạo |

---

> **Kết luận**: Dự án có nền tảng tài liệu rất vững chắc. Các hệ thống được thiết kế kỹ lưỡng, có triết lý rõ ràng và nhất quán (trừ 3 mâu thuẫn đã nêu). Với kế hoạch 7 Sprint đến MVP (~14 tuần), dự án hoàn toàn khả thi để đạt được phiên bản chơi được đầu tiên.
