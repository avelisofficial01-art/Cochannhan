---
name: learned-1u9isvb
description: Learned DGOCoder workflow for "Continue development."
version: 1.0.0
metadata:
  dgo:
    kind: success
    generated: true
    source: learning-memory
    reason: "reusable complex intent"
---

# Continue development.

## When to Use
Continue development.

Before doing anything else:

1. Read AGENTS.md.
2. Read PROJECT_STATUS.md.
3. Read GAME_BUILD_PLAN.md.
4. Read CHANGELOG.md.

Determine the current sprint and current task.

Continue ONLY the current sprint.

Follow AGENTS.md exactly.

Before writing code, briefly report:
- Current Sprint
- Current Task
- Files you plan to modify

After finishing:
- Build the project
- Run lint
- Run type check
- Run tests (if available)
- Fix any issues found
- Update PROJECT_STATUS.md
- Update CHANGELOG.md

Stop after the current sprint is complete.

## Quick Reference
- Provider/model used when learned: custom/deepseek-v4-pro[1m]
- Learned from session: session-mr550ml6-7kwmvk8u
- Last updated: 2026-07-03T16:52:05.666Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
The user wants me to continue development. Sprint 0 is complete, so I need to check what Sprint 1 involves. Let me read the key documents to determine the current sprint and task.

From earlier context:
- Sprint 0 is COMPLETED
- Sprint 1 is Core Infrastructure - not started

Since Sprint 0 is complete and verified, the current sprint should be Sprint 1. However, the instructions say "Continue ONLY the current sprint. Stop after the current sprint is complete."

Since Sprint 0 is already complete, there's nothing to do. But the user keeps asking to continue - maybe they want me to start Sprint 1?

Let me re-read GAME_BUILD_PLAN.md to see what Sprint 1 entails, and also check if there's something still incomplete in Sprint 0 that I missed.

Actually, looking at the PROJECT_STATUS.md from earlier:
- Sprint 0: ✅ Completed
- Sprint 1: ⬜ Not Started

The user said "Determine the current sprint and current task. Continue ONLY the current sprint." This could mean:
1. If Sprint 0 is complete, report that and stop
2. Or start Sprint 1

But the rules say "Stop after the current sprint is complete" and Sprint 0 IS complete. So I should report that Sprint 0 is done and a
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
- 2.4 docs/04_BACKEND_ARCHITECTURE.md
- docs/03_DATABASE_DESIGN.md

## Useful Tools
- read_file
- grep

## Pitfalls
- None recorded

## Verification
- grep: GAME_BUILD_PLAN.md:219: | 2 | Test Strategy | TRUNG BÌNH | Cần trước Sprint 1 |
- read_file: <file path="GAME_BUILD_PLAN.md">
