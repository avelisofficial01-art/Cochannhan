---
name: learned-1jjq0j3
description: Learned DGOCoder workflow for "Resume the project."
version: 1.0.0
metadata:
  dgo:
    kind: success
    generated: true
    source: learning-memory
    reason: "complex multi-tool task"
---

# Resume the project.

## When to Use
Resume the project.

Read AGENTS.md before doing anything else.

Determine the current sprint and current task.

Follow AGENTS.md exactly.

Current Objective:

Không thấy túi đồ chứa đồ quái rớt dc
Cho quái rớt cả tiền nữa
Phần luyện chế có thể lấy cả đồ quái rớt để chế thành cổ trùng hoặc nâng cổ trùng
Tiến trình quest không bắt đầu dc, không thể nhận quest
Game đặc biệt ưu tiên 2 thứ là cốt truyện và hệ thống nâng cấp nhân vật(cổ trùng kĩ năng,..)

Requirements:

- Complete this objective only.
- Do not modify unrelated systems.
- Build successfully.
- Run lint.
- Run type check.
- Run tests (if available).
- Update PROJECT_STATUS.md.
- Update CHANGELOG.md.

Stop after this objective is fully completed.

## Quick Reference
- Provider/model used when learned: custom/deepseek-v4-pro[1m]
- Learned from session: session-mr7z5ptc-i1l0oo9o
- Last updated: 2026-07-05T17:21:01.604Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
The user wants me to resume the project. Let me follow the AGENTS.md workflow:

1. Read AGENTS.md (already in context from auto_context)
2. Read PROJECT_STATUS.md
3. Read GAME_BUILD_PLAN.md
4. Read CHANGELOG.md
5. Determine current sprint and task

The user's objectives are:
1. Không thấy túi đồ chứa đồ quái rớt dc - No inventory to show monster drops
2. Cho quái rớt cả tiền nữa - Monsters should drop gold too
3. Phần luyện chế có thể lấy cả đồ quái rớt để chế thành cổ trùng hoặc nâng cổ trùng - Crafting system using monster drops to craft/upgrade Gu
4. Tiến trình quest không bắt đầu dc, không thể nhận quest - Quest progression not working, can't accept quests
5. Game đặc biệt ưu tiên 2 thứ là cốt truyện và hệ thống nâng cấp nhân vật(cổ trùng kĩ năng,..) - Priority: story and character upgrade system (Gu, skills)

Let me start by reading the required documents.
</think>

Theo workflow AGENTS.md, tôi cần đọc các tài liệu bắt buộc trước. Bắt đầu ngay.

:::tool read_file
{
  "path": "PROJECT_STATUS.md"
}
:::



:::tool read_file
{
  "path": "GAME_BUILD_PLAN.md"
}
:::



:::tool read_file
{
  "path": "CHANGELOG.md"
}
:::

<think>
Now I have the context. Let me a
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
- PROJECT_STATUS.md
- assets/test-game.html
- api/client.ts
- UI/UX Polish (S7.3
- GAME_BUILD_PLAN.md
- + content/ + AGENTS.md
- 1. docs/02_SYSTEM_BIBLE.md
- 2. docs/03_DATABASE_DESIGN.md
- 3. docs/04_BACKEND_ARCHITECTURE.md
- 4. docs/05_API_SPEC.md
- 2.1 docs/01_PROJECT_SPEC.md
- 2.2 docs/02_SYSTEM_BIBLE.md
- 2.3 docs/03_DATABASE_DESIGN.md
- 2.4 docs/04_BACKEND_ARCHITECTURE.md
- 2.5 docs/05_API_SPEC.md
- 2.6 content/06_GAMECONTENT_WORLD.md
- 2.7 content/06_GAMECONTENT_FACTIONS.md
- 2.8 content/07_GU_BIBLE.md
- docs/03_DATABASE_DESIGN.md
- docs/04_BACKEND_ARCHITECTURE.md
- content/01_WORLD.md
- content/06_GAMECONTENT_WORLD.md
- content/02_FACTIONS.md
- content/06_GAMECONTENT_FACTIONS.md
- CHANGELOG.md
- workflows/ci.yml
- src/index.ts
- .env / .env.example
- config/index.ts
- schema/index.ts
- utils/response.ts
- store/auth.ts

## Useful Tools
- read_file
- todo_write
- codebase_search

## Pitfalls
- None recorded

## Verification
- read_file: <file path="PROJECT_STATUS.md">
- read_file: <file path="GAME_BUILD_PLAN.md">
- read_file: <file path="CHANGELOG.md">
