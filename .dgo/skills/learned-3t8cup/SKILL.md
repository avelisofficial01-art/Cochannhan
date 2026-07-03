---
name: learned-3t8cup
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
- Last updated: 2026-07-03T18:22:29.427Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
Người dùng nói "Continue development." với các hướng dẫn chuẩn. Từ các lượt trước, tôi biết:

- Sprint 0: ✅ Completed
- Sprint 1: ✅ Completed (đã đánh dấu trong PROJECT_STATUS.md)
- Sprint 2: ⬜ Not Started

Theo AGENTS.md: "If the current sprint is completed: Mark it as completed. Move to the next sprint in PROJECT_STATUS.md. DO NOT start the next sprint. Stop and wait for user confirmation."

Nhưng Sprint 1 đã được đánh dấu completed rồi. Tôi cần báo cáo rằng Sprint 1 đã hoàn thành và hỏi người dùng có muốn bắt đầu Sprint 2 không.

Tuy nhiên, trước khi báo cáo, tôi nên đọc lại các tài liệu để xác nhận trạng thái hiện tại, và chạy typecheck + lint để đảm bảo mọi thứ vẫn sạch.

Hãy đọc nhanh PROJECT_STATUS.md và CHANGELOG.md để xác nhận, rồi báo cáo.
</think>

Đọc tài liệu bắt buộc:

Từ các lượt trước, tôi đã biết đầy đủ trạng thái. Đọc nhanh để xác nhận:

**Báo cáo:**
- **Current Sprint:** Sprint 1 — PLAYER & WORLD
- **Current Status:** ✅ COMPLETED (2026-07-04)
- **Next Sprint:** Sprint 2 — NPC & Quest (⬜ Not Started)

Theo AGENTS.md: *"If the current sprint is completed: Mark it as completed. Move to the next sprint in PROJECT_STATUS.md. DO NOT start the ne
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
- PROJECT_STATUS.md
- GAME_BUILD_PLAN.md
- 2.5 docs/05_API_SPEC.md
- 2.6 content/06_GAMECONTENT_WORLD.md
- 2.7 content/06_GAMECONTENT_FACTIONS.md
- 2.8 content/07_GU_BIBLE.md
- docs/03_DATABASE_DESIGN.md
- docs/04_BACKEND_ARCHITECTURE.md
- content/01_WORLD.md
- content/06_GAMECONTENT_WORLD.md
- content/02_FACTIONS.md
- content/06_GAMECONTENT_FACTIONS.md

## Useful Tools
- todo_write
- read_file
- run_terminal_command
- diagnostics

## Pitfalls
- run_terminal_command: Permission denied: Run terminal command: npm run typecheck -w shared && npm run typecheck -w backend && npm run typecheck -w frontend

## Verification
- read_file: <file path="GAME_BUILD_PLAN.md">
- run_terminal_command: Permission denied: Run terminal command: npm run typecheck -w shared && npm run typecheck -w backend && npm run typecheck -w frontend
- diagnostics: <diagnostics severity="error" total="0">
