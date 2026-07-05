---
name: learned-nitxtc
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

1. Read AGENTS.md.
2. Read PROJECT_STATUS.md.
3. Read GAME_BUILD_PLAN.md.
4. Read CHANGELOG.md.
5. Read DECISIONS.md.

Determine the current sprint and current task.

Continue ONLY the current sprint.

Follow AGENTS.md exactly.

Before writing any code, report:

- Current Sprint
- Current Task
- Planned files to modify
- Why these files are required

Do NOT modify files outside the current sprint unless absolutely necessary.

After implementation:

1. Build the project.
2. Run lint.
3. Run type check.
4. Run tests (if available).
5. Fix all detected issues.
6. Update PROJECT_STATUS.md.
7. Update CHANGELOG.md.

If the current sprint is completed:

- Mark it as completed.
- Move to the next sprint in PROJECT_STATUS.md.
- DO NOT start the next sprint.

Stop and wait for user confirmation.

## Quick Reference
- Provider/model used when learned: custom/deepseek-v4-pro[1m]
- Learned from session: session-mr550ml6-7kwmvk8u
- Last updated: 2026-07-03T17:09:11.967Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
The user wants me to continue development. Let me first read the mandatory documents, then determine where we are.

From the previous turn, I was in the middle of an asset management task (creating AssetManager, updating GameScene). I also needed to fix the Vite config to serve assets properly. Let me check what's been done vs what's pending.

From the anchored summary and workspace memory:
- Sprint 1: PLAYER & WORLD was marked as in progress
- The user then asked for asset management tasks (ASSET_MANIFEST.md, AssetConfig, AssetManager)
- I created ASSET_MANIFEST.md, AssetConfig.ts, AssetManager.ts, and updated GameScene.ts
- But I DIDN'T finish: need to verify typecheck, lint, update docs, and fix the Vite config for asset serving

Let me read the current state of files to understand what remains.
</think>

Đọc tài liệu bắt buộc:

Từ các lượt trước, tôi đã:
- ✅ Tạo ASSET_MANIFEST.md (phân loại 72 assets)
- ✅ Tạo AssetConfig.ts
- ✅ Tạo AssetManager.ts
- ✅ Cập nhật GameScene.ts tích hợp AssetManager
- ❌ Chưa sửa Vite config để phục vụ assets/
- ❌ Chưa chạy typecheck + lint
- ❌ Chưa cập nhật PROJECT_STATUS.md, CHANGELOG.md

**Báo cáo:**
- **Current Sprint:** S
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
- PROJECT_STATUS.md
- CHANGELOG.md
- shared/tsconfig.json
- backend/tsconfig.json
- frontend/tsconfig.json
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
- @co-dao/shared@0.1.0
- @co-dao/backend@0.1.0
- @co-dao/frontend@0.1.0
- game/AssetManager.ts
- npm error workspace @co-dao/frontend@0.1.0
- frontend/src/game/AssetManager.ts

## Useful Tools
- read_file
- replace_in_file
- run_terminal_command
- diagnostics

## Pitfalls
- run_terminal_command: <terminal command="npm run typecheck -w shared &amp;&amp; npm run typecheck -w backend &amp;&amp; npm run typecheck -w frontend" cwd="." exitCode="2" durationMs="4826">

## Verification
- read_file: <file path="CHANGELOG.md">
- run_terminal_command: <terminal command="npm run typecheck -w shared &amp;&amp; npm run typecheck -w backend &amp;&amp; npm run typecheck -w frontend" cwd="." exitCode="2" durationMs="4826">
- replace_in_file: Updated frontend/src/game/AssetManager.ts (+0/-1). Change is applied; user can Reject in chat to roll back.
- run_terminal_command: <terminal command="npm run typecheck -w shared &amp;&amp; npm run typecheck -w backend &amp;&amp; npm run typecheck -w frontend" cwd="." exitCode="0" durationMs="4807">
- run_terminal_command: <terminal command="npm run lint" cwd="." exitCode="0" durationMs="1471">
- diagnostics: <diagnostics severity="error" total="0">
