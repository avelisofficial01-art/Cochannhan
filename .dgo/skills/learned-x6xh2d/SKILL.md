---
name: learned-x6xh2d
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
- Last updated: 2026-07-03T19:29:06.415Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
The user wants me to continue development following the AGENTS.md workflow. Let me:

1. Read AGENTS.md (already in context via Project Rules)
2. Read PROJECT_STATUS.md
3. Read GAME_BUILD_PLAN.md
4. Read CHANGELOG.md

Then determine current sprint and task, report, and continue.

I already have AGENTS.md in context. Let me read the other docs now.
</think>



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
  "path": "CHANGELOG.md",
  "startLine": 350
}
:::

<think>
Now let me read the rest of GAME_BUILD_PLAN.md to find the Sprint 3 details and what Sprint 4 looks like.

Current state:
- Sprint 3: COMBAT CORE — 🔄 In Progress (backend done, frontend S3.5 pending)
- S3.5: Combat UI — Frontend HP bar, damage numbers, cooldown indicators

The current task is to complete Sprint 3 by implementing S3.5 (Frontend Combat UI).

Let me read the GAME_BUILD_PLAN.md Sprint 3 section to understand exactly what's required.
</think>



:::tool read_file
{
  "endLine": 350,
  "path": "GAME_BUILD_PLAN.md",
  "startLine": 260
}
:::

<think>
I need to see the Sprint 3 and Sprint 4 sections
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
- src/index.ts
- schema/index.ts
- config/index.ts
- player/player.service.ts
- src/app.ts
- auth/auth.controller.ts
- auth/auth.repository.ts
- auth/auth.route.ts
- auth/auth.service.ts
- combat/combat.controller.ts

## Useful Tools
- read_file
- todo_write
- find_files
- replace_in_file
- write_file
- run_terminal_command
- multi_edit

## Pitfalls
- run_terminal_command: <terminal command="npx tsc --noEmit -p frontend/tsconfig.json 2&gt;&amp;1" cwd="." exitCode="2" durationMs="1855">

## Verification
- read_file: <file path="PROJECT_STATUS.md">
- read_file: <file path="GAME_BUILD_PLAN.md">
- read_file: <file path="CHANGELOG.md">
- read_file: <file path="shared/src/index.ts">
- replace_in_file: Updated frontend/src/store/gameStore.ts (+26/-0). Change is applied; user can Reject in chat to roll back.
