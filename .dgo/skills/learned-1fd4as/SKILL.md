---
name: learned-1fd4as
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

Read AGENTS.md before doing anything else.

Determine the current sprint and current task.

Follow AGENTS.md exactly.

Current Objective:

Quest đầu tiên có monster thỏ tuyết nhưng không thấy

Requirements:

- Complete this objective only.
- Do not modify unrelated systems.
- Build successfully.
- Run lint.
- Run type check.
- Run tests (if available).
- Update PROJECT_STATUS.md.
- Update CHANGELOG.md.

Stop after this objective is fully completed.

## Quick Reference
- Provider/model used when learned: custom/deepseek-v4-pro[1m]
- Learned from session: session-mr550ml6-7kwmvk8u
- Last updated: 2026-07-05T03:52:39.016Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
Người dùng muốn tôi tiếp tục dự án. Tôi cần:

1. Đọc AGENTS.md (đã có trong rules)
2. Đọc PROJECT_STATUS.md
3. Đọc GAME_BUILD_PLAN.md
4. Đọc CHANGELOG.md
5. Xác định sprint và task hiện tại
6. Mục tiêu hiện tại: "Quest đầu tiên có monster thỏ tuyết nhưng không thấy"

Từ anchored summary, tôi biết:
- Sprint 7/8 đang được thực hiện
- Monsters không spawn là vấn đề đã biết
- "Thỏ Tuyết" là monster được định nghĩa trong config

Tôi cần:
1. Đọc các file bắt buộc
2. Debug tại sao Thỏ Tuyết không spawn
3. Fix

Hãy bắt đầu bằng cách đọc các file bắt buộc.
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
  "endLine": 60
}
:::



:::tool read_file
{
  "path": "CHANGELOG.md",
  "startLine": 1,
  "endLine": 60
}
:::

<think>
Sprint 9 đã completed. Người dùng nói "Quest đầu tiên có monster thỏ tuyết nhưng không thấy" — đây là bug cụ thể.

Tôi cần debug tại sao "Thỏ Tuyết" không spawn. Theo GAME_BUILD_PLAN.md, không có sprint 10 được định nghĩa. Tất cả 9 sprint đều completed. Đây có vẻ là bug fix trong sprint hiện tại.

Từ PROJECT_STATUS.md, Sprin
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
- PROJECT_STATUS.md
- api/client.ts
- GAME_BUILD_PLAN.md
- + content/ + AGENTS.md
- 1. docs/02_SYSTEM_BIBLE.md
- 2. docs/03_DATABASE_DESIGN.md
- 3. docs/04_BACKEND_ARCHITECTURE.md
- 4. docs/05_API_SPEC.md
- CHANGELOG.md
- docs/03_DATABASE_DESIGN.md
- workflows/ci.yml
- src/index.ts
- .env / .env.example
- config/index.ts
- schema/index.ts
- src/app.ts
- auth/auth.controller.ts
- auth/auth.repository.ts
- auth/auth.route.ts
- auth/auth.service.ts
- combat/boss-ai.ts
- combat/combat.controller.ts
- combat/combat.repository.ts
- combat/combat.route.ts
- combat/combat.service.ts
- config/config.repository.ts
- craft/craft.controller.ts
- craft/craft.repository.ts
- craft/craft.route.ts
- craft/craft.service.ts
- cultivation/cultivation.controller.ts
- cultivation/cultivation.repository.ts

## Useful Tools
- read_file
- todo_write
- run_script
- grep
- find_files

## Pitfalls
- grep: Exploration guard: grep has already searched scope "backend/src/config/index.ts" 5 times this turn. Avoid more selector/string variants; use the previous matches, r
[truncated]
- read_file: Exploration guard: backend/src/config/index.ts has already been read 6 times this turn. Stop sweeping ranges. Use the file context already available, run one exact
[truncated]
- grep: Exploration guard: grep has already searched scope "backend/src/config/index.ts" 6 times this turn. Avoid more selector/string variants; use the previous matches, r
[truncated]

## Verification
- read_file: <file path="PROJECT_STATUS.md">
- read_file: <file path="CHANGELOG.md">
- read_file: <file path="backend/src/app.ts">
- grep: CHANGELOG.md:913: | Bản đồ reset quái vô tội vạ | Mỗi khi map trống và có người chơi join, toàn bộ quái lại bị spawn lại từ đầu | Thêm `initializedMaps` cache trạng
[truncated]
