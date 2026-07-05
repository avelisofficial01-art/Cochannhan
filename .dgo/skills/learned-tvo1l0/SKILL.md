---
name: learned-tvo1l0
description: Learned DGOCoder workflow for "đã thấy map, thấy npc, nhưng vẫn chưa thấy quái respon, cũng chưa tương tác dc npc, với lại map đi qua r\n[truncated]"
version: 1.0.0
metadata:
  dgo:
    kind: success
    generated: true
    source: learning-memory
    reason: "complex multi-tool task"
---

# đã thấy map, thấy npc, nhưng vẫn chưa thấy quái respon, cũng chưa tương tác dc npc, với lại map đi qua r
[truncated]

## When to Use
đã thấy map, thấy npc, nhưng vẫn chưa thấy quái respon, cũng chưa tương tác dc npc, với lại map đi qua rồi ko thấy đường để mà quay lại. QUAN TRỌNG nhất là làm thành game H5 để điện thoại chơi. Tối ưu lại toàn bộ giao diện.
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
- Last updated: 2026-07-04T00:28:58.691Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
Người dùng báo cáo:
1. ✅ Đã thấy map
2. ✅ Đã thấy NPC
3. ❌ Chưa thấy quái respawn
4. ❌ Chưa tương tác được NPC
5. ❌ Map đi qua rồi không thấy đường quay lại (portal)
6. QUAN TRỌNG: Làm thành game H5 để điện thoại chơi, tối ưu giao diện

Tôi cần:
1. Đọc AGENTS.md, PROJECT_STATUS.md, GAME_BUILD_PLAN.md, CHANGELOG.md
2. Xác định sprint hiện tại
3. Fix các vấn đề trên

Trước tiên đọc các file bắt buộc.
</think>



:::tool todo_write
{
  "todos": [
    {
      "content": "Đọc AGENTS.md, PROJECT_STATUS.md, GAME_BUILD_PLAN.md, CHANGELOG.md",
      "status": "in_progress",
      "activeForm": "Đọc tài liệu bắt buộc"
    },
    {
      "content": "Fix quái không respawn",
      "status": "pending",
      "activeForm": "Fix quái không respawn"
    },
    {
      "content": "Fix tương tác NPC",
      "status": "pending",
      "activeForm": "Fix tương tác NPC"
    },
    {
      "content": "Fix portal để quay lại map",
      "status": "pending",
      "activeForm": "Fix portal quay lại map"
    },
    {
      "content": "Tối ưu giao diện H5 mobile",
      "status": "pending",
      "activeForm": "Tối ưu giao diện H5 mobile"
    },
    {
      "content": "Build + typech
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
- PROJECT_STATUS.md
- api/client.ts
- UI/UX Polish (S7.3
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
- store/auth.ts
- shared/tsconfig.json

## Useful Tools
- todo_write
- read_file
- codebase_search
- grep
- repo_map_query
- apply_patch
- replace_in_file
- run_script
- multi_edit
- find_files

## Pitfalls
- apply_patch: Error applying patch:

## Verification
- read_file: <file path="PROJECT_STATUS.md">
- read_file: <file path="GAME_BUILD_PLAN.md">
- read_file: <file path="CHANGELOG.md">
- read_file: <file path="AGENTS.md">
- codebase_search: <codebase_search query="combatService spawnMonster getMonstersOnMap" hits="5">
- read_file: <file path="backend/src/database/schema/index.ts">
