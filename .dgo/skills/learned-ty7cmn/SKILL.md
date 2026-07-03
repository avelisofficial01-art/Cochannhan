---
name: learned-ty7cmn
description: Learned DGOCoder workflow for "Continue development."
version: 1.0.0
metadata:
  dgo:
    kind: success
    generated: true
    source: learning-memory
    reason: "complex multi-tool task"
---

# Continue development.

## When to Use
Continue development.

Before doing anything else:

Read AGENTS.md.
Read PROJECT_STATUS.md.
Read GAME_BUILD_PLAN.md.
Read CHANGELOG.md.
Determine the current sprint and current task.

Continue ONLY the current sprint.

Follow AGENTS.md exactly.

Before writing code, briefly report:

Current Sprint
Current Task
Files you plan to modify
After finishing:

Build the project
Run lint
Run type check
Run tests (if available)
Fix any issues found
Update PROJECT_STATUS.md
Update CHANGELOG.md
Stop after the current sprint is complete.

## Quick Reference
- Provider/model used when learned: custom/deepseek-v4-pro[1m]
- Learned from session: session-mr550ml6-7kwmvk8u
- Last updated: 2026-07-03T19:11:27.993Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
The user wants me to continue development. Let me follow the AGENTS.md mandatory workflow:

1. Read AGENTS.md
2. Read PROJECT_STATUS.md
3. Read GAME_BUILD_PLAN.md
4. Read CHANGELOG.md
5. Determine current sprint and task
6. Continue ONLY the current sprint

I already have AGENTS.md, PROJECT_STATUS.md, GAME_BUILD_PLAN.md, and CHANGELOG.md in context from earlier turns. But let me re-read them to get the current status since things may have changed with the Render deployment fixes.

I need to read:
- PROJECT_STATUS.md (to see current sprint/task)
- GAME_BUILD_PLAN.md (to see the sprint plan)
- CHANGELOG.md (to see latest changes)

Let me read all three at once.
</think>

Đọc các tài liệu bắt buộc để xác định sprint hiện tại:

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



:::tool read_file
{
  "path": "AGENTS.md"
}
:::

<think>
Based on my reading, the current state is:

- **Sprint 2**: NPC & QUEST — ✅ COMPLETED
- **Next**: Sprint 3 — Combat Core

According to AGENTS.md:
- Nếu làm Combat → đọc docs/02_SYSTEM_BIBLE.md và content/07_GU_BI
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
- PROJECT_STATUS.md
- docs/03_DATABASE_DESIGN.md
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
- api/client.ts
- store/auth.ts
- shared/tsconfig.json
- backend/tsconfig.json

## Useful Tools
- read_file
- grep
- todo_write
- find_files
- write_file
- replace_in_file
- multi_edit

## Pitfalls
- read_file: Error reading file "backend/src/socket/socket.controller.ts": Error: ENOENT: no such file or directory, open 'd:\Game\Gu\backend\src\socket\socket.controller.ts'

## Verification
- read_file: <file path="PROJECT_STATUS.md">
- read_file: <file path="GAME_BUILD_PLAN.md">
- read_file: <file path="CHANGELOG.md">
- read_file: <file path="AGENTS.md">
- read_file: <file path="docs/05_API_SPEC.md">
