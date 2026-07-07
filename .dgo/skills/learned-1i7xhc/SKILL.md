---
name: learned-1i7xhc
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

Read AGENTS.md first.

Read only the documents required for the current task.

Determine the current sprint from PROJECT_STATUS.md.

Complete ONLY the current task.

Follow GAME_VISION.md for long-term direction.

Requirements:

- Do not change unrelated systems.
- Keep gameplay data-driven.
- Keep Server Authority.
- Reuse existing architecture.
- Build successfully.
- Run lint.
- Run typecheck.
- Update PROJECT_STATUS.md.
- Update CHANGELOG.md.

Stop after the current task is fully completed.

## Quick Reference
- Provider/model used when learned: custom/claude-sonnet-4-6
- Learned from session: session-mr7z5ptc-i1l0oo9o
- Last updated: 2026-07-07T04:17:04.514Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. Đọc các file bắt buộc trước:

:::tool run_script
{
  "script": "\nconst [status, changelog, gamePage] = await Promise.all([\n  tool(\"read_file\", { path: \"PROJECT_STATUS.md\" }),\n  tool(\"read_file\", { path: \"CHANGELOG.md\", startLine: 1, endLine: 50 }),\n  tool(\"read_file\", { path: \"frontend/src/pages/GamePage.tsx\" }),\n]);\nprint(\"=== PROJECT_STATUS ===\\n\" + status);\nprint(\"=== CHANGELOG (top) ===\\n\" + changelog);\nprint(\"=== GamePage.tsx ===\\n\" + gamePage);\n"
}
:::



:::tool todo_write
{
  "todos": [
    {
      "content": "Đọc tài liệu bắt buộc",
      "activeForm": "Đọc tài liệu",
      "status": "completed"
    },
    {
      "status": "completed",
      "content": "Xác định sprint hiện tại",
      "activeForm": "Xác định sprint"
    },
    {
      "content": "Hoàn thành Sprint 27: Thập Tuyệt Thể System",
      "activeForm": "Implement Thập Tuyệt Thể",
      "status": "in_progress"
    },
    {
      "content": "Build + lint + typecheck",
      "activeForm": "Build & verify",
      "status": "pending"
    },
    {
      "content": "Cập nhật PROJECT_STATUS.md + CHANGELOG.md",
      "activeForm": "Cập nhật docs",
      "status": "pending"
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
- pages/GamePage.tsx
- frontend/src/pages/GamePage.tsx
- game/BootScene.js
- game/PreloadScene.js
- game/GameScene.js
- game/UIScene.js
- store/auth.js
- hooks/useSocket.js
- api/client.js
- components/CharacterPanel.js
- components/GameHUD.js
- components/CraftPanel.js
- components/DialoguePanel.js
- components/QuestTracker.js
- components/ShopPanel.js
- components/CharacterCreationPanel.js
- schema/index.ts
- database/seedData.ts
- Moved from config/index.ts
- components/CharacterCreationPanel.tsx
- constitution/constitution.repository.ts
- constitution/constitution.route.ts
- constitution/constitution.service.ts
- database/connection.js
- schema/index.js

## Useful Tools
- run_script
- todo_write
- read_file
- replace_in_file
- run_terminal_command
- multi_edit
- write_file
- apply_patch
- grep

## Pitfalls
- run_terminal_command: <terminal command="cd d:\Game\Cochannhan &amp;&amp; npx tsc --noEmit -p backend/tsconfig.json 2&gt;&amp;1 | head -50" cwd="." exitCode="255" durationMs="59">
- run_terminal_command: <terminal command="cd d:\Game\Cochannhan &amp;&amp; npx tsc --noEmit -p backend/tsconfig.json 2&gt;&amp;1" cwd="." exitCode="2" durationMs="4248">
- multi_edit: Error: Edit #1: oldText matches 2 times — make it unique or set replaceAll=true.
- run_terminal_command: <terminal command="cd d:\Game\Cochannhan &amp;&amp; git stash &amp;&amp; npx tsc --noEmit -p backend/tsconfig.json 2&gt;&amp;1" cwd="." exitCode="2" durationMs="5180">
- run_terminal_command: <terminal command="cd d:\Game\Cochannhan &amp;&amp; git stash pop 2&gt;&amp;1" cwd="." exitCode="1" durationMs="154">
- run_terminal_command: <terminal command="cd d:\Game\Cochannhan &amp;&amp; npx tsc --noEmit -p backend/tsconfig.json 2&gt;&amp;1 | findstr &quot;constitution&quot;" cwd="." exitCode="1" d
[truncated]
- apply_patch: Error applying patch:
- replace_in_file: Error replacing text in PROJECT_STATUS.md: oldText was not found. Read the target range again and include the exact current text.

## Verification
- run_script: <run_script tool_calls="3">
- run_script: <run_script tool_calls="4">
- run_script: <run_script tool_calls="6">
- replace_in_file: Updated frontend/src/pages/GamePage.tsx (+11/-0). Change is applied; user can Reject in chat to roll back.
- run_script: <run_script tool_calls="2">
- run_terminal_command: <terminal command="cd d:\Game\Cochannhan &amp;&amp; npx tsc --noEmit -p backend/tsconfig.json 2&gt;&amp;1 | head -50" cwd="." exitCode="255" durationMs="59">
