---
name: learned-yr6w7i
description: Learned DGOCoder workflow for "Đọc toàn bộ tài liệu trong project:"
version: 1.0.0
metadata:
  dgo:
    kind: success
    generated: true
    source: learning-memory
    reason: "complex multi-tool task"
---

# Đọc toàn bộ tài liệu trong project:

## When to Use
Đọc toàn bộ tài liệu trong project:

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

Đọc AGENTS.md và tuân thủ tuyệt đối mọi quy tắc.

Sau khi đọc xong:

1. Phân tích toàn bộ dự án.
2. Kiểm tra xem các tài liệu có mâu thuẫn hoặc thiếu sót không.
3. Đề xuất các cải tiến nếu cần nhưng KHÔNG tự ý thay đổi thiết kế.
4. Lập kế hoạch phát triển theo Sprint từ MVP đến phiên bản đầu tiên có thể chơi được.
5. Chưa viết code.

Chỉ tạo file GAME_BUILD_PLAN.md.

## Quick Reference
- Provider/model used when learned: custom/deepseek-v4-pro[1m]
- Learned from session: session-mr550ml6-7kwmvk8u
- Last updated: 2026-07-03T16:21:43.718Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
Người dùng yêu cầu tôi đọc toàn bộ tài liệu trong project, phân tích, kiểm tra mâu thuẫn, đề xuất cải tiến, lập kế hoạch phát triển theo Sprint, và cuối cùng tạo file GAME_BUILD_PLAN.md. Tôi cần đọc tất cả các file được liệt kê trước.

Hãy bắt đầu bằng việc đọc tất cả các file cần thiết. Tôi sẽ đọc song song các file này trong cùng một lượt.

Files cần đọc:
1. AGENTS.md (đã có trong system prompt nhưng tôi sẽ đọc lại để chắc chắn)
2. docs/01_PROJECT_SPEC.md
3. docs/02_SYSTEM_BIBLE.md
4. docs/03_DATABASE_DESIGN.md
5. docs/04_BACKEND_ARCHITECTURE.md
6. docs/05_API_SPEC.md
7. content/01_WORLD.md
8. content/02_FACTIONS.md
9. content/07_GU_BIBLE.md

Hãy đọc tất cả song song.
</think>

Bắt đầu đọc toàn bộ tài liệu dự án. Đây là bước nền tảng để phân tích chính xác.

:::tool read_file
{
  "path": "AGENTS.md"
}
:::



:::tool read_file
{
  "path": "docs/01_PROJECT_SPEC.md"
}
:::



:::tool read_file
{
  "path": "docs/02_SYSTEM_BIBLE.md"
}
:::



:::tool read_file
{
  "path": "docs/03_DATABASE_DESIGN.md"
}
:::



:::tool read_file
{
  "path": "docs/04_BACKEND_ARCHITECTURE.md"
}
:::



:::tool read_file
{
  "path": "docs/05_API_SPEC.md"
}
:::



:::tool read_file
{
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
- AGENTS.md
- 1. docs/02_SYSTEM_BIBLE.md
- 2. docs/03_DATABASE_DESIGN.md
- 3. docs/04_BACKEND_ARCHITECTURE.md
- 4. docs/05_API_SPEC.md
- docs/02_SYSTEM_BIBLE.md
- content/07_GU_BIBLE.md
- content/01_WORLD.md
- content/02_FACTIONS.md
- docs/03_DATABASE_DESIGN.md
- docs/04_BACKEND_ARCHITECTURE.md
- docs/05_API_SPEC.md
- docs/01_PROJECT_SPEC.md
- content/06_GAMECONTENT_FACTIONS.md
- content/06_GAMECONTENT_WORLD.md
- GAME_BUILD_PLAN.md
- + content/ + AGENTS.md
- n1. docs/02_SYSTEM_BIBLE.md
- n2. docs/03_DATABASE_DESIGN.md
- n3. docs/04_BACKEND_ARCHITECTURE.md
- n4. docs/05_API_SPEC.md
- 2.1 docs/01_PROJECT_SPEC.md
- 2.2 docs/02_SYSTEM_BIBLE.md
- 2.3 docs/03_DATABASE_DESIGN.md
- 2.4 docs/04_BACKEND_ARCHITECTURE.md
- 2.5 docs/05_API_SPEC.md
- 2.6 content/06_GAMECONTENT_WORLD.md
- 2.7 content/06_GAMECONTENT_FACTIONS.md
- 2.8 content/07_GU_BIBLE.md

## Useful Tools
- read_file
- find_files
- write_file

## Pitfalls
- read_file: Error reading file "content/01_WORLD.md": Error: ENOENT: no such file or directory, open 'd:\Game\Gu\content\01_WORLD.md'
- read_file: Error reading file "content/02_FACTIONS.md": Error: ENOENT: no such file or directory, open 'd:\Game\Gu\content\02_FACTIONS.md'

## Verification
- read_file: <file path="docs/05_API_SPEC.md">
- read_file: <file path="docs/04_BACKEND_ARCHITECTURE.md">
- read_file: <file path="docs/03_DATABASE_DESIGN.md">
