---
name: learned-kb5uib
description: Learned DGOCoder workflow for "Game không load map, nhiệm vụ, quái hay bất kì npc nào. Kiểm tra và duyệt thật kĩ toàn bộ dự án"
version: 1.0.0
metadata:
  dgo:
    kind: success
    generated: true
    source: learning-memory
    reason: "complex multi-tool task"
---

# Game không load map, nhiệm vụ, quái hay bất kì npc nào. Kiểm tra và duyệt thật kĩ toàn bộ dự án

## When to Use
Game không load map, nhiệm vụ, quái hay bất kì npc nào. Kiểm tra và duyệt thật kĩ toàn bộ dự án 

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
- Last updated: 2026-07-03T23:03:44.856Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
Người dùng nói "Game không load map, nhiệm vụ, quái hay bất kì npc nào" - nghĩa là sau khi vào game (đã fix texture), họ thấy game trống rỗng: không có map, không có quái, không có NPC, không có quest gì cả.

Đây là vấn đề về gameplay logic, không phải về asset loading nữa. Tôi cần audit toàn bộ flow từ backend (API, socket) đến frontend (GameScene) xem game đang khởi tạo như thế nào.

Nhưng trước hết, theo yêu cầu của user, tôi cần đọc các tài liệu bắt buộc: AGENTS.md, PROJECT_STATUS.md, GAME_BUILD_PLAN.md, CHANGELOG.md.

Sau đó xác định sprint hiện tại và task hiện tại.

Từ anchored summary, Sprint 7 là "Polish & Stabilize" và đang ở S7.1 (bug fixing). Vấn đề texture loading vừa được fix. Giờ cần chuyển sang vấn đề gameplay không hoạt động.

Nhưng tôi đã đọc AGENTS.md, PROJECT_STATUS.md, CHANGELOG.md từ workspace memory. Tôi cần đọc GAME_BUILD_PLAN.md.

Sau đó audit toàn bộ flow game: backend API, socket events, frontend GameScene.

Bắt đầu bằng đọc GAME_BUILD_PLAN.md, sau đó audit code.
</think>

Tôi sẽ đọc tài liệu bắt buộc, xác định sprint hiện tại, rồi audit toàn bộ flow game để tìm ra tại sao game không load bất cứ thứ gì.

:::tool read_file
{
  "path
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
- GAME_BUILD_PLAN.md
- + content/ + AGENTS.md
- 1. docs/02_SYSTEM_BIBLE.md
- 2. docs/03_DATABASE_DESIGN.md
- 3. docs/04_BACKEND_ARCHITECTURE.md
- 4. docs/05_API_SPEC.md
- PROJECT_STATUS.md
- api/client.ts
- UI/UX Polish (S7.3
- CHANGELOG.md
- hooks/useSocket.ts
- src/app.ts
- world/world.route.ts
- game/GameScene.ts
- frontend/vite.config.ts
- game/BootScene.ts
- game/UIScene.ts
- pages/GamePage.tsx
- game/PreloadScene.ts
- frontend/src/game/GameScene.ts
- ./AssetManager.js
- store/gameStore.js
- frontend/src/pages/GamePage.tsx
- game/BootScene.js
- game/PreloadScene.js
- game/GameScene.js
- game/UIScene.js
- hooks/useSocket.js
- store/auth.js
- api/client.js
- components/GuPanel.js
- components/EquipmentPanel.js

## Useful Tools
- read_file
- grep
- find_files

## Pitfalls
- None recorded

## Verification
- read_file: <file path="PROJECT_STATUS.md">
- read_file: <file path="CHANGELOG.md">
- read_file: <file path="backend/src/app.ts">
- read_file: <file path="backend/src/index.ts">
