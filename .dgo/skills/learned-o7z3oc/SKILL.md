---
name: learned-o7z3oc
description: Learned DGOCoder workflow for "Đọc trước khi thực hiện:"
version: 1.0.0
metadata:
  dgo:
    kind: success
    generated: true
    source: learning-memory
    reason: "complex multi-tool task"
---

# Đọc trước khi thực hiện:

## When to Use
Đọc trước khi thực hiện:

- AGENTS.md
- GAME_BUILD_PLAN.md

Đọc lại các tài liệu bắt buộc:

docs/
- 01_PROJECT_SPEC.md
- 02_SYSTEM_BIBLE.md
- 03_DATABASE_DESIGN.md
- 04_BACKEND_ARCHITECTURE.md
- 05_API_SPEC.md

content/
- 01_WORLD.md
- 02_FACTIONS.md
- 07_GU_BIBLE.md

==================================================

Bắt đầu thực hiện SPRINT 0 trong GAME_BUILD_PLAN.md.

Mục tiêu:

- Chỉ thực hiện Sprint 0.
- Không làm Sprint 1 trở đi.
- Không thêm gameplay.
- Không thêm content.
- Không tự thiết kế hệ thống mới.

==================================================

Yêu cầu kỹ thuật

Frontend

- React
- TypeScript
- Vite
- PhaserJS
- TailwindCSS
- Zustand
- TanStack Query

Backend

- NodeJS
- Express
- TypeScript
- Socket.IO

Database

- PostgreSQL 17
- Redis

ORM

- Chọn Drizzle ORM.
- Đồng thời cập nhật các tài
[truncated]

## Quick Reference
- Provider/model used when learned: custom/deepseek-v4-pro[1m]
- Learned from session: session-mr550ml6-7kwmvk8u
- Last updated: 2026-07-03T16:33:59.297Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
Người dùng muốn tôi thực hiện Sprint 0 theo GAME_BUILD_PLAN.md. Đây là sprint Foundation - thiết lập toàn bộ infrastructure của dự án.

Hãy đọc GAME_BUILD_PLAN.md trước để biết chi tiết Sprint 0, sau đó đọc các tài liệu bắt buộc (docs/ và content/) để tuân thủ AGENTS.md.

Từ workspace memory, tôi biết các file content thực tế là:
- content/06_GAMECONTENT_WORLD.md (thay vì 01_WORLD.md)
- content/06_GAMECONTENT_FACTIONS.md (thay vì 02_FACTIONS.md)
- content/07_GU_BIBLE.md

Và các file docs đã được đọc trước đó.

Hãy bắt đầu bằng việc đọc GAME_BUILD_PLAN.md để xem chi tiết Sprint 0, và đọc lại AGENTS.md.
</think>



:::tool read_file
{
  "path": "GAME_BUILD_PLAN.md"
}
:::

<think>
Tôi cần đọc phần còn lại của GAME_BUILD_PLAN.md để xem chi tiết Sprint 0.
</think>



:::tool read_file
{
  "path": "GAME_BUILD_PLAN.md",
  "startLine": 250
}
:::

<think>
Tôi đã đọc toàn bộ GAME_BUILD_PLAN.md. Bây giờ tôi cần thực hiện Sprint 0. Hãy lập kế hoạch chi tiết.

Sprint 0 tasks:
- S0.1: Khởi tạo monorepo (backend/ + frontend/ + shared/, package.json, tsconfig strict)
- S0.2: Quyết định ORM = Drizzle → cập nhật tài liệu
- S0.3: Docker Compose (PostgreSQL 17 + Redis + Adminer
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
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
- docs/03_DATABASE_DESIGN.md
- docs/04_BACKEND_ARCHITECTURE.md
- content/01_WORLD.md
- content/06_GAMECONTENT_WORLD.md
- content/02_FACTIONS.md
- content/06_GAMECONTENT_FACTIONS.md
- docs/02_SYSTEM_BIBLE.md
- docs/05_API_SPEC.md
- docs/01_PROJECT_SPEC.md
- content/07_GU_BIBLE.md
- package.json
- tsconfig.base.json
- .eslintrc.json
- .prettierrc
- .gitignore
- docker-compose.yml
- shared/package.json
- Created shared/package.json

## Useful Tools
- read_file
- todo_write
- run_script
- write_file
- replace_in_file
- run_terminal_command
- find_files

## Pitfalls
- run_terminal_command: Permission denied: Run terminal command: npm install 2>&1
- run_terminal_command: Permission denied: Run terminal command: npm install
- run_terminal_command: Permission denied: Run terminal command: dir /s /b /a:-d package.json tsconfig.json CHANGELOG.md GAME_BUILD_PLAN.md docker-compose.yml 2>nul

## Verification
- read_file: <file path="GAME_BUILD_PLAN.md">
- run_script: <run_script tool_calls="3">
- write_file: Created package.json (+25/-0). Change is applied; user can Reject in chat to roll back.
- write_file: Created tsconfig.base.json (+19/-0). Change is applied; user can Reject in chat to roll back.
- write_file: Created .eslintrc.json (+18/-0). Change is applied; user can Reject in chat to roll back.
