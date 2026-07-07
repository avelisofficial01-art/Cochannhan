---
name: learned-7mn8o9
description: Learned DGOCoder workflow for "Resume development."
version: 1.0.0
metadata:
  dgo:
    kind: success
    generated: true
    source: learning-memory
    reason: "complex multi-tool task"
---

# Resume development.

## When to Use
Resume development.

Read AGENTS.md first and follow it exactly.

Read GAME_VISION.md, PROJECT_STATUS.md, GAME_BUILD_PLAN.md and CHANGELOG.md.

Determine the current sprint and the next unfinished task.

Implement only that task.

Keep every implementation aligned with GAME_VISION.md.

Build, lint, typecheck, run tests (if available), fix issues, update PROJECT_STATUS.md and CHANGELOG.md.

If the sprint is complete, continue with the next unfinished sprint unless user input is required.

Stop only when blocked or user input is needed.

Hoàn thiện sprint 26

## Quick Reference
- Provider/model used when learned: custom/claude-sonnet-4-6
- Learned from session: session-mr7z5ptc-i1l0oo9o
- Last updated: 2026-07-07T03:21:00.621Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. :::tool todo_write
{
  "todos": [
    {
      "status": "in_progress",
      "content": "Đọc tài liệu bắt buộc + xác định Sprint 26",
      "activeForm": "Đang đọc tài liệu"
    },
    {
      "status": "pending",
      "content": "Implement Chapter 2 seed data (maps, NPCs, monsters, quests, dialogues)",
      "activeForm": "Đang implement seed data Chapter 2"
    },
    {
      "content": "Cập nhật frontend GameScene nếu cần (portal Ch2, map transition)",
      "activeForm": "Đang cập nhật frontend",
      "status": "pending"
    },
    {
      "activeForm": "Đang build/lint/typecheck",
      "status": "pending",
      "content": "Build + lint + typecheck"
    },
    {
      "activeForm": "Đang cập nhật docs",
      "status": "pending",
      "content": "Cập nhật PROJECT_STATUS.md và CHANGELOG.md"
    },
    {
      "activeForm": "Đang khởi động local server",
      "status": "pending",
      "content": "Chạy local để test"
    }
  ]
}
:::



:::tool run_script
{
  "script": "\n// Read all required docs simultaneously\nconst parts = await Promise.all([\n  tool('read_file', {path: 'PROJECT_STATUS.md'}),\n  tool('read_file', {path: 'GAME_BUILD_PLAN.md', startLine: 1,
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
- gu/gu.controller.ts
- gu/gu.service.ts
- src/stat-calculator.ts
- player/player.service.ts
- Separate seed data from backend config/index.ts into a dedicated seedData.ts
- assets/test-game.html
- api/client.ts
- + content/ + AGENTS.md
- docs/00_GAME_VISION.md
- database/seedData.ts
- Moved from config/index.ts
- Read seedData.ts and config/index.ts
- config/index.ts
- Also read config/index.ts
- Read config/index.ts
- src/app.ts
- auth/auth.controller.ts
- database/seed.ts
- scripts/seed-admin.ts
- ./connection.js
- schema/index.js
- ./seedData.js
- backend/src/database/seed.ts
- backend/src/database/seedData.ts
- schema/index.ts
- inventory/inventory.schema.ts
- monster/monster.schema.ts
- npc/npc.schema.ts
- player/player.schema.ts
- game/GameScene.ts
- backend/src/database/schema/index.ts
- hooks/useSocket.ts

## Useful Tools
- todo_write
- run_script
- read_file
- run_terminal_command
- replace_in_file

## Pitfalls
- run_terminal_command: <terminal command="cd /d &quot;d:\Game\Cochannhan&quot; &amp;&amp; npm run lint 2&gt;&amp;1 | head -50" cwd="." exitCode="255" durationMs="59">

## Verification
- run_script: <run_script tool_calls="4">
- run_script: <run_script tool_calls="2">
- run_script: <run_script tool_calls="1">
- run_terminal_command: <terminal command="cd /d &quot;d:\Game\Cochannhan&quot; &amp;&amp; npx tsc --noEmit -p shared/tsconfig.json 2&gt;&amp;1 &amp;&amp; echo &quot;---SHARED_OK---&quot;
[truncated]
- read_file: <file path="frontend/src/store/gameStore.ts">
