---
name: learned-q7f4s3
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
- Last updated: 2026-07-03T19:34:34.556Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
The user wants me to continue development. Let me follow the mandatory workflow:

1. Read PROJECT_STATUS.md
2. Read GAME_BUILD_PLAN.md
3. Read CHANGELOG.md
4. Determine current sprint and task
5. Continue only the current sprint

From the previous turn, Sprint 3 was completed. Sprint 4 — Gu System is next.

Let me read the required docs to confirm and get Sprint 4 details.
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
  "startLine": 1,
  "endLine": 100
}
:::



:::tool read_file
{
  "path": "CHANGELOG.md",
  "startLine": 1,
  "endLine": 80
}
:::

<think>
Sprint 3 is completed. The next sprint is Sprint 4 — Gu System. Let me read the GAME_BUILD_PLAN.md to find the Sprint 4 section and the docs/02_SYSTEM_BIBLE.md for Gu system details.

Let me also read the content/07_GU_BIBLE.md if it exists.
</think>

Sprint 3 đã hoàn thành. Tiếp tục **Sprint 4 — Gu System**. Đọc GAME_BUILD_PLAN.md phần Sprint 4 và tài liệu Gu:

:::tool grep
{
  "pattern": "Sprint 4.*Gu",
  "include": "GAME_BUILD_PLAN.md"
}
:::



:::tool find_files
{
  "query": "07_GU_BIBLE"
}
:::
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
- PROJECT_STATUS.md
- GAME_BUILD_PLAN.md
- + content/ + AGENTS.md
- 1. docs/02_SYSTEM_BIBLE.md
- 2. docs/03_DATABASE_DESIGN.md
- 3. docs/04_BACKEND_ARCHITECTURE.md
- 4. docs/05_API_SPEC.md
- 2.1 docs/01_PROJECT_SPEC.md
- 2.2 docs/02_SYSTEM_BIBLE.md
- 2.3 docs/03_DATABASE_DESIGN.md
- CHANGELOG.md
- docs/03_DATABASE_DESIGN.md
- workflows/ci.yml
- src/index.ts
- .env / .env.example
- config/index.ts
- schema/index.ts
- utils/response.ts
- content/07_GU_BIBLE.md
- docs/02_SYSTEM_BIBLE.md
- docs/04_BACKEND_ARCHITECTURE.md
- docs/05_API_SPEC.md
- docs/01_PROJECT_SPEC.md
- content/06_GAMECONTENT_WORLD.md
- content/06_GAMECONTENT_FACTIONS.md
- backend/src/database/schema/index.ts
- shared/src/index.ts
- ./stat-calculator.js
- combat/index.js
- backend/src/app.ts
- src/app.ts
- auth/auth.route.js

## Useful Tools
- read_file
- grep
- find_files
- todo_write
- replace_in_file
- write_file
- run_terminal_command
- multi_edit

## Pitfalls
- replace_in_file: Error replacing text in backend/src/database/schema/index.ts: oldText matched 9 places. Include more surrounding context or set replaceAll=true if every match should change.
- run_terminal_command: <terminal command="npx tsc --noEmit -p backend/tsconfig.json 2&gt;&amp;1" cwd="." exitCode="2" durationMs="3672">
- multi_edit: Error: Edit #2: oldText matches 5 times — make it unique or set replaceAll=true.

## Verification
- read_file: <file path="CHANGELOG.md">
- read_file: <file path="GAME_BUILD_PLAN.md">
- read_file: <file path="shared/src/index.ts">
- read_file: <file path="backend/src/app.ts">
- replace_in_file: Updated backend/src/database/schema/index.ts (+93/-0). Change is applied; user can Reject in chat to roll back.
- replace_in_file: Updated shared/src/index.ts (+90/-0). Change is applied; user can Reject in chat to roll back.
