---
name: learned-1nlujrv
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

checksprint 26 đã xong chưa, xong rồi thì cho chạy local để tôi test

## Quick Reference
- Provider/model used when learned: openai/openai/gpt-5.5
- Learned from session: session-mr7z5ptc-i1l0oo9o
- Last updated: 2026-07-07T02:57:30.464Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. :::tool todo_write
{
  "todos": [
    {
      "content": "Đọc quy trình và tài liệu bắt buộc",
      "activeForm": "Đang đọc quy trình và tài liệu bắt buộc",
      "status": "in_progress"
    },
    {
      "content": "Kiểm tra trạng thái Sprint 26",
      "activeForm": "Đang kiểm tra trạng thái Sprint 26",
      "status": "pending"
    },
    {
      "content": "Chạy local nếu Sprint 26 đã hoàn tất",
      "activeForm": "Đang chạy local để test",
      "status": "pending"
    }
  ]
}
:::



:::tool read_file
{
  "path": "AGENTS.md",
  "startLine": 1,
  "endLine": 220
}
:::



:::tool read_file
{
  "path": "docs/00_GAME_VISION.md",
  "startLine": 1,
  "endLine": 220
}
:::



:::tool read_file
{
  "path": "PROJECT_STATUS.md",
  "startLine": 1,
  "endLine": 260
}
:::



:::tool read_file
{
  "path": "GAME_BUILD_PLAN.md",
  "startLine": 1,
  "endLine": 340
}
:::



:::tool read_file
{
  "path": "CHANGELOG.md",
  "startLine": 1,
  "endLine": 220
}
:::

Tôi đã đọc các tài liệu bắt buộc. Theo `PROJECT_STATUS.md`, Sprint 26 đang được đánh dấu hoàn tất; tôi sẽ đối chiếu thêm trong `CHANGELOG.md`/kế hoạch rồi nếu đúng sẽ chạy local.

:::tool todo_write
{
  "todos": [
    {
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
- AGENTS.md
- 2. docs/GAME_VISION.md
- 5. docs/01_PROJECT_SPEC.md
- 6. docs/02_SYSTEM_BIBLE.md
- 7. docs/03_DATABASE_DESIGN.md
- 8. docs/04_BACKEND_ARCHITECTURE.md
- 9. docs/05_API_SPEC.md
- 10. content/01_WORLD.md
- 11. content/02_FACTIONS.md
- 12. content/04_MAIN_STORY.md
- 13. content/07_GU_BIBLE.md
- docs/00_GAME_VISION.md
- PROJECT_STATUS.md
- gu/gu.controller.ts
- gu/gu.service.ts
- src/stat-calculator.ts
- player/player.service.ts
- Separate seed data from backend config/index.ts into a dedicated seedData.ts
- assets/test-game.html
- api/client.ts
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

## Useful Tools
- todo_write
- read_file
- grep
- find_files

## Pitfalls
- None recorded

## Verification
- read_file: <file path="PROJECT_STATUS.md">
- read_file: <file path="GAME_BUILD_PLAN.md">
- read_file: <file path="CHANGELOG.md">
- read_file: <file path="package.json">
