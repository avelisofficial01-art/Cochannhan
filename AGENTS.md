# AGENTS.md

# Gu World Development Rules

---

# Project

This project is a long-term online RPG inspired by Reverend Insanity (Cổ Chân Nhân).

The objective is to build a scalable, maintainable, data-driven MMORPG that can continue expanding for years.

Every implementation should support the long-term vision instead of only satisfying the current sprint.

---

# Source of Truth

When making any implementation, always follow this priority:

1. AGENTS.md
2. docs/GAME_VISION.md
3. PROJECT_STATUS.md
4. GAME_BUILD_PLAN.md
5. docs/01_PROJECT_SPEC.md
6. docs/02_SYSTEM_BIBLE.md
7. docs/03_DATABASE_DESIGN.md
8. docs/04_BACKEND_ARCHITECTURE.md
9. docs/05_API_SPEC.md
10. content/01_WORLD.md
11. content/02_FACTIONS.md
12. content/04_MAIN_STORY.md
13. content/07_GU_BIBLE.md

If implementation conflicts with documentation:

- Never silently change documentation.
- Implement according to the documentation.
- If documentation becomes outdated, update it together with the implementation.

GAME_VISION.md defines the long-term direction of the project.

Never implement features that contradict GAME_VISION.md.

---

# AI Rules

Never:

- change gameplay rules
- change lore
- change story
- change database schema directly
- change APIs without updating API_SPEC
- rename files
- rename folders
- rewrite architecture without instruction

If something appears inconsistent:

Stop and report it instead of making assumptions.

---

# Design Philosophy

The project must always favor:

- scalability
- maintainability
- modularity
- multiplayer compatibility
- server authority
- data-driven design

Avoid temporary shortcuts whenever possible.

When multiple implementations are possible, choose the one that best supports future expansion.

---

# Coding Principles

- TypeScript Strict Mode
- SOLID
- Clean Architecture
- DRY
- KISS
- Dependency Injection
- Data Driven Design
- Server Authority

Never hardcode gameplay.

Code executes rules.

Database and configuration define rules.

---

# Architecture Rules

Reuse existing systems whenever possible.

Prefer extending existing modules instead of creating parallel systems.

Do not duplicate logic.

Keep modules cohesive.

Keep public APIs stable.

Never rewrite architecture without explicit instruction.

---

# Gameplay Architecture

Gameplay systems must be generic.

Never write one-off systems for:

- quests
- NPCs
- monsters
- bosses
- maps
- Gu
- equipment
- crafting
- dungeons

Adding new content should require new data instead of engine changes.

---

# Database Rules

Never modify schema directly.

Always create migrations.

Never modify IDs.

Never delete production data.

Game balance must come from database or configuration.

---

# API Rules

Do not change Request/Response contracts.

If an API changes:

Update API_SPEC first.

---

# Asset Rules

Assets are located inside:

assets/

Rules:

- Always use existing assets first.
- Never rename asset files.
- Never move assets unless requested.
- Never hardcode asset paths.
- Asset paths belong inside AssetConfig.
- Gameplay accesses assets only through AssetManager.

If assets are missing:

- use configured placeholders
- continue development
- never stop the sprint
- never generate replacement artwork

---

# Rendering Rules

Gameplay is rendered only with Phaser (or the future official game renderer).

React (or future launcher UI) is responsible only for:

- Login
- Launcher
- Menus
- Settings
- Inventory UI
- Shop UI
- Modals
- Outside-game UI

Never render gameplay using:

- HTML positioning
- CSS Grid
- Placeholder divs
- Colored rectangles

Gameplay must use real assets whenever available.

Every playable build should display:

- maps
- player
- NPCs
- monsters
- portals
- effects
- UI

---

# Combat Rules

Combat follows:

docs/02_SYSTEM_BIBLE.md

content/07_GU_BIBLE.md

Never invent:

- skills
- buffs
- debuffs
- combat mechanics

without updating documentation.

---

# Story Rules

Story follows:

content/01_WORLD.md

content/02_FACTIONS.md

content/04_MAIN_STORY.md

Never contradict established lore.

Never shorten story progression.

Never replace story with placeholder dialogue.

Each story chapter should include:

- Opening cutscene
- Exploration
- NPC interactions
- Multi-step dialogue
- Main quests
- Optional side content
- Combat encounters
- Boss battle
- Ending cutscene
- Transition to the next chapter

Story should adapt to gameplay.

Gameplay should never reduce story quality.

---

# Game Design Rules

All gameplay systems must align with GAME_VISION.md.

Never introduce systems that:

- reduce build diversity
- create mandatory meta builds
- bypass Gu progression
- bypass equipment progression
- trivialize PvP
- trivialize economy
- invalidate previous progression

New systems should increase player choice rather than simply increasing player power.

---

# Documentation Rules

Whenever project behaviour changes:

Update:

- PROJECT_STATUS.md
- CHANGELOG.md

If architecture changes:

Update corresponding documentation.

If gameplay changes:

Update SYSTEM_BIBLE.

If story changes:

Update MAIN_STORY.

Documentation must remain synchronized with code.

---

# Sprint Rules

Work on only ONE task.

Do not partially implement multiple systems.

Complete the current objective before starting another.

---

# Debug Rules

Never guess.

Debugging workflow:

1. Identify root cause.
2. Verify root cause.
3. Apply minimal fix.
4. Build.
5. Test.
6. Verify fix.

Never rewrite unrelated systems while debugging.

---

# Performance Rules

Keep the project maintainable.

Remove:

- dead code
- duplicate logic
- unused imports
- obsolete files

Avoid unnecessary complexity.

Optimize only after correctness.

---

# Code Quality

Never:

- use any
- leave TODO
- leave FIXME
- leave console.log
- leave dead code

Always:

- handle errors
- write readable code
- keep modules small
- prefer maintainability

---

# Mandatory Workflow

Every session:

1. Read AGENTS.md.
2. Read GAME_VISION.md.
3. Read PROJECT_STATUS.md.
4. Read GAME_BUILD_PLAN.md.
5. Read CHANGELOG.md.
6. Read required documentation.
7. Determine current sprint.
8. Determine current objective.
9. Complete ONLY the current objective.
10. Build.
11. Run lint.
12. Run typecheck.
13. Run tests.
14. Fix issues.
15. Update PROJECT_STATUS.md.
16. Update CHANGELOG.md.
17. Stop.

---

# Definition of Done

A task is complete only if:

- Build succeeds.
- TypeScript passes.
- Lint passes.
- Tests pass.
- Deployment pipeline succeeds.
- APIs function correctly.
- Documentation is updated.
- PROJECT_STATUS.md updated.
- CHANGELOG.md updated.

Otherwise:

DO NOT mark the task as completed.

---

# Final Rule

When uncertain:

Read the documentation again.

Never invent requirements.

Never assume missing information.

Ask the user instead.