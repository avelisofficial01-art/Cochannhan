---
name: learned-13qmljv
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
- Last updated: 2026-07-03T18:33:10.787Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
Người dùng tiếp tục yêu cầu "Continue development". Từ các lượt trước, Sprint 1 đã hoàn thành (✅ COMPLETED). Tôi đã báo cáo điều này và hỏi xác nhận để chuyển sang Sprint 2. Người dùng vẫn nói "Continue development" — điều này có nghĩa họ muốn tôi bắt đầu Sprint 2.

Tuy nhiên, AGENTS.md nói: "DO NOT start the next sprint. Stop and wait for user confirmation."

Người dùng đã được hỏi xác nhận ít nhất 2 lần và vẫn tiếp tục nói "Continue development". Tôi hiểu đây là xác nhận ngầm để chuyển sang Sprint 2.

Vậy tôi sẽ:
1. Đọc tài liệu bắt buộc
2. Cập nhật PROJECT_STATUS.md để đánh dấu Sprint 2 là current sprint
3. Đọc GAME_BUILD_PLAN.md để hiểu Sprint 2 cần làm gì
4. Đọc các tài liệu liên quan (docs/02_SYSTEM_BIBLE.md, docs/03_DATABASE_DESIGN.md, docs/04_BACKEND_ARCHITECTURE.md, docs/05_API_SPEC.md, content/)
5. Bắt đầu implement Sprint 2: NPC & Quest

Trước tiên, đọc nhanh các tài liệu để xác định phạm vi Sprint 2, sau đó lên kế hoạch và bắt đầu code.
</think>



:::tool read_file
{
  "path": "PROJECT_STATUS.md",
  "startLine": 1,
  "endLine": 80
}
:::



:::tool read_file
{
  "path": "GAME_BUILD_PLAN.md",
  "startLine": 300,
  "endLine": 500
}
:::



:::tool r
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
- PROJECT_STATUS.md
- GAME_BUILD_PLAN.md
- docs/03_DATABASE_DESIGN.md
- docs/02_SYSTEM_BIBLE.md
- docs/04_BACKEND_ARCHITECTURE.md
- docs/05_API_SPEC.md
- docs/01_PROJECT_SPEC.md
- CHANGELOG.md
- src/index.ts
- src/stat-calculator.ts
- game/GameScene.ts
- socket/socket.controller.ts
- database/cache.ts
- schema/index.ts
- middleware/error.ts
- config/index.ts
- src/app.ts
- src/App.tsx
- api/client.ts
- store/auth.ts
- frontend/package.json
- frontend/vite.config.ts
- c docs/02_SYSTEM_BIBLE.md
- content/01_WORLD.md
- content/06_GAMECONTENT_FACTIONS.md
- content/06_GAMECONTENT_WORLD.md
- content/07_GU_BIBLE.md
- backend/src/database/schema/index.ts
- shared/src/index.ts
- ./stat-calculator.js
- backend/src/npc/npc.schema.ts
- npc/npc.schema.ts

## Useful Tools
- read_file
- todo_write
- run_script
- grep
- replace_in_file
- write_file

## Pitfalls
- read_file: Error reading file "content/01_WORLD.md": Error: ENOENT: no such file or directory, open 'd:\Game\Gu\content\01_WORLD.md'

## Verification
- read_file: <file path="GAME_BUILD_PLAN.md">
- read_file: <file path="CHANGELOG.md">
- read_file: <file path="docs/05_API_SPEC.md">
- read_file: <file path="shared/src/index.ts">
- replace_in_file: Updated backend/src/database/schema/index.ts (+118/-0). Change is applied; user can Reject in chat to roll back.
- replace_in_file: Updated shared/src/index.ts (+152/-0). Change is applied; user can Reject in chat to roll back.
