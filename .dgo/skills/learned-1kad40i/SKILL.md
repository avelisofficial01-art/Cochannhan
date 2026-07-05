---
name: learned-1kad40i
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
- Last updated: 2026-07-03T20:22:51.377Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
Người dùng muốn tiếp tục phát triển. Tôi cần đọc các tài liệu bắt buộc, xác định sprint hiện tại và task hiện tại, sau đó tiếp tục.

Từ phiên trước, Sprint 6 đã hoàn thành 5/6 tasks. Còn S6.2 (Chapter 1 Content) bị deferred sang Sprint 7. 

Hãy đọc PROJECT_STATUS.md và CHANGELOG.md để xác nhận trạng thái.

Nhưng từ workspace memory, PROJECT_STATUS.md đã được cập nhật với "Defer S6.2" - có thể Sprint 7 là sprint tiếp theo.

Tôi cần kiểm tra GAME_BUILD_PLAN.md xem có Sprint 7 không.
</think>



:::tool read_file
{
  "path": "PROJECT_STATUS.md",
  "startLine": 1,
  "endLine": 120
}
:::



:::tool read_file
{
  "path": "GAME_BUILD_PLAN.md",
  "startLine": 1,
  "endLine": 120
}
:::



:::tool read_file
{
  "path": "CHANGELOG.md",
  "startLine": 633,
  "endLine": 750
}
:::

<think>
Sprint 6 đang ở trạng thái 🚧 In Progress (5/6 tasks done). S6.2 (Chapter 1 Content - dialogue/quest) đã bị deferred sang Sprint 7.

Tuy nhiên, theo GAME_BUILD_PLAN.md, Sprint 7 là "Polish & Stabilize". Không có Sprint 8+ trong plan.

Câu hỏi: Tôi nên làm gì tiếp theo? Có 2 lựa chọn:
1. Tiếp tục Sprint 6 với S6.2 (Chapter 1 dialogue/quest content) - đây là công việc viết content data
2.
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
- CHANGELOG.md
- combat/boss-ai.ts
- database/redis.ts
- src/index.ts
- backend/src/database/schema/index.ts
- schema/index.ts
- backend/src/config/index.ts
- config/index.ts
- npx tsc --noEmit -p backend/tsconfig.json
- npx tsc --noEmit -p shared/tsconfig.json
- @co-dao/backend@0.1.0
- npx tsc --noEmit -p frontend/tsconfig.json
- @co-dao/shared@0.1.0
- @co-dao/frontend@0.1.0
- 35massets/index-Dwri7S6N.css
- 36massets/index-BLjFl5bf.js

## Useful Tools
- read_file
- todo_write
- replace_in_file
- run_terminal_command

## Pitfalls
- run_terminal_command: <terminal command="npx tsc --noEmit -p backend/tsconfig.json 2&gt;&amp;1 &amp;&amp; echo &quot;BACKEND OK&quot; &amp;&amp; npx tsc --noEmit -p shared/tsconfig.json
[truncated]
- run_terminal_command: <terminal command="npm run lint 2&gt;&amp;1" cwd="." exitCode="1" durationMs="2038">

## Verification
- read_file: <file path="PROJECT_STATUS.md">
- read_file: <file path="CHANGELOG.md">
- replace_in_file: Updated backend/src/config/index.ts (+258/-0). Change is applied; user can Reject in chat to roll back.
- run_terminal_command: <terminal command="npx tsc --noEmit -p backend/tsconfig.json 2&gt;&amp;1 &amp;&amp; echo &quot;BACKEND OK&quot; &amp;&amp; npx tsc --noEmit -p shared/tsconfig.json
[truncated]
- replace_in_file: Updated backend/src/config/index.ts (+1/-2). Change is applied; user can Reject in chat to roll back.
- run_terminal_command: <terminal command="npx tsc --noEmit -p backend/tsconfig.json 2&gt;&amp;1 &amp;&amp; echo &quot;BACKEND OK&quot; &amp;&amp; npm run build -w backend 2&gt;&amp;1" cwd
[truncated]
