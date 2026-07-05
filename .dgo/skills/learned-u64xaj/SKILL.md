---
name: learned-u64xaj
description: Learned DGOCoder workflow for "bạn cho tôi test local thử, dữ liệu ảo gì gì đó miễn sao xem giao diện game là dc"
version: 1.0.0
metadata:
  dgo:
    kind: success
    generated: true
    source: learning-memory
    reason: "complex multi-tool task"
---

# bạn cho tôi test local thử, dữ liệu ảo gì gì đó miễn sao xem giao diện game là dc

## When to Use
bạn cho tôi test local thử, dữ liệu ảo gì gì đó miễn sao xem giao diện game là dc

## Quick Reference
- Provider/model used when learned: custom/deepseek-v4-pro[1m]
- Learned from session: session-mr550ml6-7kwmvk8u
- Last updated: 2026-07-03T21:09:05.155Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
Người dùng muốn test local để xem giao diện game. Từ auto_context, tôi thấy CHANGELOG.md line 307 có "Sprint 7: POLISH & STABILIZE", GAME_BUILD_PLAN.md có plan, và README.md có hướng dẫn deploy.

Yêu cầu: chạy local dev để người dùng có thể xem game với dữ liệu ảo. Cần:
1. Start backend (mock data nếu cần)
2. Start frontend dev server
3. Đảm bảo assets load được

Từ workspace memory, tôi biết:
- Dự án dùng monorepo với workspaces
- Backend: Express + Socket.IO trên port 3000
- Frontend: Vite + React + PhaserJS trên port 5173
- Database: PostgreSQL (nhưng có thể dùng mock/in-memory cho local test)
- Assets nằm ở `assets/`, Vite config có `publicDir: '../assets'`

Tôi cần kiểm tra:
1. Backend có cần database không? Có fallback mock data không?
2. Frontend dev server config
3. Cách chạy cả hai

Đọc nhanh các file cần thiết: backend/src/app.ts (đã có trong memory), frontend/vite.config.ts (đã biết có proxy), README.md (có hướng dẫn local dev).

Từ anchored_summary, tôi biết backend dùng PostgreSQL + Redis fallback. Nhưng để test local nhanh, có thể cần mock data hoặc chạy với SQLite/in-memory.

Thực tế, backend đã được config để chạy trên Render với PostgreSQL.
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
- README.md
- cp backend/.env.example
- src/index.ts
- config/index.ts
- frontend/vite.config.ts
- backend/src/config/index.ts
- assets/test-game.html
- Created assets/test-game.html
- npm/phaser@3.80.1
- dist/phaser.min.js
- 5174/test-game.html

## Useful Tools
- read_file
- todo_write
- write_file
- run_terminal_command

## Pitfalls
- run_terminal_command: <terminal command="cd frontend &amp;&amp; npx vite --host 0.0.0.0 2&gt;&amp;1" cwd="." exitCode="1" signal="SIGTERM" timedOut="true" durationMs="15015">

## Verification
- read_file: <file path="README.md">
- write_file: Created assets/test-game.html (+231/-0). Change is applied; user can Reject in chat to roll back.
- run_terminal_command: <terminal command="cd frontend &amp;&amp; npx vite --host 0.0.0.0 2&gt;&amp;1" cwd="." exitCode="1" signal="SIGTERM" timedOut="true" durationMs="15015">
- run_terminal_command: <terminal command="start /b cmd /c &quot;cd frontend &amp;&amp; npx vite --host 0.0.0.0&quot; 2&gt;&amp;1" cwd="." exitCode="0" durationMs="5022">
- run_terminal_command: <terminal command="curl -s -o NUL -w &quot;%{http_code}&quot; http://localhost:5174/test-game.html 2&gt;&amp;1" cwd="." exitCode="0" durationMs="325">
