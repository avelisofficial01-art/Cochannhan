---
name: learned-16nfxhd
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
- Last updated: 2026-07-03T19:44:58.120Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
The user wants me to continue development. Typecheck already passed on the last turn. Now I need to:

1. Read AGENTS.md, PROJECT_STATUS.md, GAME_BUILD_PLAN.md, CHANGELOG.md
2. Determine current sprint and task
3. Continue ONLY the current sprint (Sprint 4 - Gu System)

From the previous turns, Sprint 4 is in progress. The backend and frontend code has been created. Typecheck passed. Now I need to:
- Run lint
- Do a build test
- Update PROJECT_STATUS.md and CHANGELOG.md
- Mark Sprint 4 as complete

Let me first read the docs to confirm current state, then run final checks and update docs.
</think>

Typecheck đã pass turn trước. Giờ đọc docs xác nhận trạng thái, chạy build + lint, update docs để hoàn tất Sprint 4.

All 3 typechecks passed. Now run lint + build test, then update docs.

Chạy lint frontend + build backend:

Lint passed. Let me run a full build to confirm:

Frontend build passed. Let me also run lint on backend and shared:

All lint + build passed. Now I need to check the overall sprint completion status. Sprint 4 has 7 subtasks per GAME_BUILD_PLAN.md. Let me verify what's done:

S4.1: Gu module (templates, player gu, equip/unequip) ✅
S4.2: Gu enh
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
- PROJECT_STATUS.md
- GAME_BUILD_PLAN.md
- CHANGELOG.md
- docs/03_DATABASE_DESIGN.md
- workflows/ci.yml
- src/index.ts
- .env / .env.example
- config/index.ts
- schema/index.ts
- utils/response.ts
- npx tsc --noEmit -p shared/tsconfig.json
- npx tsc --noEmit -p backend/tsconfig.json
- npx tsc --noEmit -p frontend/tsconfig.json
- src/ --ext .ts
- backend/src/gu/gu.controller.ts
- gu/gu.controller.ts
- backend/src/gu/gu.repository.ts
- gu/gu.repository.ts
- database/connection.js
- schema/index.js
- gu/ --ext .ts
- npm error workspace @co-dao/shared@0.1.0
- @co-dao/shared@0.1.0
- shared/package.json
- Updated shared/package.json
- ./package.json
- package.json
- @co-dao/backend@0.1.0
- @co-dao/frontend@0.1.0
- 35massets/index-BvsdZDMe.css
- 36massets/index-CmGKts9J.js
- shared/tsconfig.json

## Useful Tools
- read_file
- run_terminal_command
- multi_edit
- replace_in_file

## Pitfalls
- run_terminal_command: <terminal command="npx eslint backend/src/ --ext .ts 2&gt;&amp;1 &amp;&amp; npx eslint frontend/src/ --ext .ts,.tsx 2&gt;&amp;1 &amp;&amp; echo &quot;LINT PASS&quot
[truncated]
- run_terminal_command: <terminal command="npm run build -w shared 2&gt;&amp;1 &amp;&amp; npm run build -w backend 2&gt;&amp;1 &amp;&amp; echo &quot;BUILD PASS&quot;" cwd="." exitCode="1"
[truncated]

## Verification
- read_file: <file path="CHANGELOG.md">
- run_terminal_command: <terminal command="npx tsc --noEmit -p shared/tsconfig.json 2&gt;&amp;1 &amp;&amp; npx tsc --noEmit -p backend/tsconfig.json 2&gt;&amp;1 &amp;&amp; npx tsc --noEmit
[truncated]
- run_terminal_command: <terminal command="npx eslint backend/src/ --ext .ts 2&gt;&amp;1 &amp;&amp; npx eslint frontend/src/ --ext .ts,.tsx 2&gt;&amp;1 &amp;&amp; echo &quot;LINT PASS&quot
[truncated]
- read_file: <file path="backend/src/gu/gu.controller.ts">
