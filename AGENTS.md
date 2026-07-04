# AGENTS.md

# Gu World Development Rules

## Project

Đây là dự án game RPG Web lấy cảm hứng từ Cổ Chân Nhân.

Mục tiêu là xây dựng một game có kiến trúc rõ ràng, dễ mở rộng và toàn bộ gameplay được điều khiển bằng dữ liệu (Data Driven).

---

# Source of Truth

When making any implementation, always use the following priority:

1. AGENTS.md
2. PROJECT_STATUS.md
3. GAME_BUILD_PLAN.md
4. docs/01_PROJECT_SPEC.md
5. docs/02_SYSTEM_BIBLE.md
6. docs/03_DATABASE_DESIGN.md
7. docs/04_BACKEND_ARCHITECTURE.md
8. docs/05_API_SPEC.md
9. content/01_WORLD.md
10. content/02_FACTIONS.md
11. content/04_MAIN_STORY.md
12. content/07_GU_BIBLE.md

If implementation conflicts with documentation:

- Never silently change the documentation.
- Implement according to the documentation.
- If documentation is outdated, update it together with the implementation.

---

# AI Rules

Không tự ý:

- thay đổi gameplay
- thay đổi lore
- thay đổi cốt truyện
- đổi database schema
- đổi API
- đổi tên file
- đổi tên thư mục

Nếu phát hiện bất hợp lý phải báo lại thay vì tự sửa.

---

# Coding Principles

- TypeScript Strict Mode
- Clean Architecture
- SOLID
- DRY
- KISS
- Server Authority
- Data Driven Design

Không Hardcode gameplay.

Gameplay phải lấy từ Database hoặc Config.

---

# Database

Không sửa trực tiếp Schema.

Chỉ tạo Migration.

Không xóa dữ liệu.

Không sửa ID.

---

# API

Không đổi Request hoặc Response.

Nếu cần thay đổi phải cập nhật API_SPEC trước.

---

# Combat

Combat phải tuân theo:

docs/02_SYSTEM_BIBLE.md

content/07_GU_BIBLE.md

Không tự thêm skill.

Không tự thêm hiệu ứng.

---

# Story

Story phải tuân theo:

content/01_WORLD.md

content/02_FACTIONS.md

Không tự thêm NPC.

Không tự thêm Boss.

Không tự viết lore mới.

---

# Before coding

Nếu làm Backend

đọc:

docs/02_SYSTEM_BIBLE.md

docs/03_DATABASE_DESIGN.md

docs/04_BACKEND_ARCHITECTURE.md

docs/05_API_SPEC.md

---

Nếu làm Combat

đọc:

docs/02_SYSTEM_BIBLE.md

content/07_GU_BIBLE.md

---

Nếu làm Database

đọc:

docs/03_DATABASE_DESIGN.md

docs/05_API_SPEC.md

---

Nếu làm Story

đọc:

content/01_WORLD.md

content/02_FACTIONS.md

---

# Commit Rules

Mỗi lần chỉ thực hiện MỘT chức năng.

Ví dụ:

✔ Inventory

✔ Combat

✔ Quest

Không sửa nhiều module trong cùng một lần nếu không được yêu cầu.

---

# Khi thiếu thông tin

Không được đoán.

Không tự thiết kế.

Hãy dừng và yêu cầu người dùng bổ sung.

---

# Code Quality

Không dùng any.

Không để TODO.

Không để console.log.

Không để code chết.

Luôn xử lý Error.

Viết code dễ đọc.

Ưu tiên maintainability hơn tối ưu sớm.

---

# Goal

Mục tiêu cuối cùng là xây dựng một game có kiến trúc ổn định, dễ mở rộng và bám sát toàn bộ tài liệu trong thư mục docs và content.

# Mandatory Workflow

Every session MUST follow this order:

1. Read PROJECT_STATUS.md
2. Read GAME_BUILD_PLAN.md
3. Read CHANGELOG.md
4. Read required docs
5. Complete current sprint
6. Build
7. Run lint
8. Run typecheck
9. Run tests
10. Update documentation
11. Stop


# Definition of Done

Một task chỉ được coi là hoàn thành khi:

- Code compile thành công
- Không có TypeScript Error
- Không có ESLint Error
- Test pass
- Build pass
- Docker pass
- API hoạt động
- Documentation được cập nhật
- PROJECT_STATUS.md được cập nhật
- CHANGELOG.md được cập nhật

Nếu chưa đạt đủ điều kiện thì KHÔNG được đánh dấu Completed.

# Asset Rules

Assets are located in:

assets/

Rules:

- Always use existing assets first.
- Never rename asset files.
- Never move assets unless requested.
- Never hardcode asset paths.
- Asset paths must be defined in AssetConfig.
- Gameplay code must access assets only through AssetManager.

If an asset is missing:

- use the configured placeholder
- continue implementing gameplay
- never stop the sprint

# Asset Policy

The current project uses placeholder assets.

Never stop development because an asset is missing.

If an asset is unavailable:

- use placeholder assets
- keep filenames configurable
- never hardcode asset paths
- never generate replacement art
- continue implementing gameplay

## Rendering Architecture (Mandatory)

This is a browser H5 RPG built with PhaserJS.

React is only responsible for:
- Login
- Menus
- Settings
- Modals
- Outside-game UI

All gameplay must be rendered by PhaserJS.

Never implement gameplay using:
- HTML div
- CSS Grid
- DOM positioning
- Colored placeholder squares

If game assets exist, they MUST be loaded and rendered through Phaser Loader.

The documentation is always the source of truth.

If existing code conflicts with the documentation, refactor the code instead of modifying the documentation.

Every sprint must end with a playable game.

The game must always display:
- A real map
- A real player sprite
- Real assets from the assets folder

A sprint is NOT considered complete if gameplay is rendered only with HTML placeholders.

# Architecture Rules

Never rewrite the project architecture without explicit instruction.

Reuse existing modules before creating new ones.

Prefer extending existing systems over creating parallel systems.

Do not duplicate logic.

Keep modules small and cohesive.

# Data Driven Rules

Game balancing must never be hardcoded.

Combat values, drops, NPCs, quests, maps, monsters, Gu, equipment and progression must come from configuration or database.

Code should only execute the rules, never define them.

# Documentation Rules

Whenever a completed task changes the project behaviour:

Update:

- PROJECT_STATUS.md
- CHANGELOG.md

If architecture changes:

Update the corresponding document inside docs/.

If story changes:

Update MAIN_STORY.md.

Documentation must stay synchronized with the code.

# Sprint Rules

Work on only ONE current task.

Do not start the next task before the current one is fully completed.

Do not partially implement multiple systems in one sprint.

# Debug Rules

Never guess the cause of a bug.

When fixing a bug:

1. Identify the root cause.
2. Verify the root cause.
3. Apply the minimal fix.
4. Build.
5. Verify the bug is fixed.

Do not rewrite unrelated systems while debugging.

# Story

Story must follow:

- content/01_WORLD.md
- content/02_FACTIONS.md
- content/04_MAIN_STORY.md

Never contradict the established story.

New NPCs, bosses, quests and locations must be consistent with MAIN_STORY.md.

# Final Rule

When in doubt:

Read the documentation again.

Never invent requirements.

Never assume missing information.

Ask the user instead.

# Story Implementation Rules

The game must implement the story as playable gameplay.

Never skip story progression.

Every story chapter must include:

- Opening cutscene
- Exploration
- NPC interactions
- Multi-step dialogue
- Story quests
- Side objectives where appropriate
- Combat encounters
- Boss battle
- Ending cutscene
- Transition to the next chapter

Dialogue must feel like a complete RPG, not placeholder text.

A chapter is NOT complete if it only contains one NPC conversation and one quest.