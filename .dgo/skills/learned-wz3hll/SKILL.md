---
name: learned-wz3hll
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
- Last updated: 2026-07-03T20:00:03.246Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
The user wants me to continue development. Let me follow the mandatory workflow:

1. Read PROJECT_STATUS.md
2. Read GAME_BUILD_PLAN.md
3. Read CHANGELOG.md
4. Determine current sprint and task

From the previous turns, Sprint 5 (Equipment & Craft) was being worked on. I need to check if it was completed or if there's remaining work.

Let me read the docs quickly to determine status.

From the anchored summary and previous turns:
- Sprint 4: ✅ Completed
- Sprint 5: Was being worked on in the last turn - I added shared types, equipment/craft modules, config seeds, frontend panels, route registration, and updated docs

But the budget ran out before I could commit. Let me check what state things are in by reading the docs.

Actually, looking at the last turn's tool results: I updated PROJECT_STATUS.md to mark Sprint 5 as completed, and I added Sprint 5 to CHANGELOG.md. But I didn't run the final build/typecheck/lint after all changes, and I didn't commit.

Let me read the docs to confirm the current state, run final checks, and either finish Sprint 5 or move to Sprint 6.

Let me be efficient - read PROJECT_STATUS.md and GAME_BUILD_PLAN.md to determine where we a
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
- tool-output/run_script-1783107374102-g3xem9.txt
- tool-output/read_file-1783106202722-gtfy4z.txt
- tool-output/read_file-1783105631343-h9wxre.txt
- tool-output/read_file-1783095915104-ufaiwj.txt
- docs/02_SYSTEM_BIBLE.md
- docs/03_DATABASE_DESIGN.md
- docs/04_BACKEND_ARCHITECTURE.md
- docs/05_API_SPEC.md
- docs/01_PROJECT_SPEC.md
- content/06_GAMECONTENT_WORLD.md
- content/06_GAMECONTENT_FACTIONS.md
- content/07_GU_BIBLE.md
- npx tsc --noEmit -p shared/tsconfig.json
- npx tsc --noEmit -p backend/tsconfig.json
- npx tsc --noEmit -p frontend/tsconfig.json
- @co-dao/shared@0.1.0
- @co-dao/backend@0.1.0
- @co-dao/frontend@0.1.0
- 35massets/index-Dwri7S6N.css
- 36massets/index-BLjFl5bf.js
- content/01_WORLD.md
- harness/tool-settlements.jsonl

## Useful Tools
- read_file
- grep
- run_terminal_command
- todo_write
- find_files
- codebase_search
- run_script
- replace_in_file
- write_file

## Pitfalls
- read_file: Error reading file "content/01_WORLD.md": Error: ENOENT: no such file or directory, open 'd:\Game\Gu\content\01_WORLD.md'

## Verification
- read_file: <file path="GAME_BUILD_PLAN.md">
- run_terminal_command: <terminal command="npx tsc --noEmit -p shared/tsconfig.json 2&gt;&amp;1 &amp;&amp; echo &quot;SHARED OK&quot; &amp;&amp; npx tsc --noEmit -p backend/tsconfig.json 2
[truncated]
- run_terminal_command: <terminal command="npm run lint 2&gt;&amp;1" cwd="." exitCode="0" durationMs="1965">
- run_terminal_command: <terminal command="npm run build 2&gt;&amp;1" cwd="." exitCode="0" durationMs="17231">
- codebase_search: <codebase_search query="chapter story_flag cultivation breakthrough save table schema database" hits="10">
- read_file: <file path="backend/src/database/schema/index.ts">
