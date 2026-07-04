---
name: learned-1dfncn9
description: Learned DGOCoder workflow for "tiếp đi"
version: 1.0.0
metadata:
  dgo:
    kind: success
    generated: true
    source: learning-memory
    reason: "edit workflow with verification"
---

# tiếp đi

## When to Use
tiếp đi

## Quick Reference
- Provider/model used when learned: custom/deepseek-v4-pro[1m]
- Learned from session: session-mr550ml6-7kwmvk8u
- Last updated: 2026-07-04T00:16:52.888Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
Lỗi đã xác định: `invalid input syntax for type uuid: "bac_nguyen_village"`. 

`targetMapId` là `"bac_nguyen_village"` — một string thường, không phải UUID. Nhưng query dùng `eq(worldMaps.id, targetMapId)` trong `or()` khiến PostgreSQL cố cast string này thành UUID → fail.

**Fix:** Trước khi query, kiểm tra xem `targetMapId` có phải UUID không. Nếu không phải, chỉ query theo `name`. Nếu là UUID, query theo `id`.

Tôi cần đọc đoạn code query map hiện tại rồi sửa.

Đọc dòng 265-280 của backend/src/app.ts.
</think>



:::tool read_file
{
  "endLine": 295,
  "path": "backend/src/app.ts",
  "startLine": 230
}
:::

<think>
Lỗi rõ ràng ở dòng 272-276: `or(eq(worldMaps.id, targetMapId), eq(worldMaps.name, targetMapId))`. PostgreSQL không thể cast `"bac_nguyen_village"` thành UUID, nên throw error TRƯỚC KHI fallback được thực thi (dòng 280-286).

Fix đơn giản: thêm UUID validation trước khi query. Nếu `targetMapId` không phải UUID hợp lệ, chỉ query theo `name`. Nếu là UUID, query theo `id`.

Tôi sẽ thêm helper function `isUUID` hoặc dùng regex để kiểm tra.

Sửa dòng 268-278 thành:
```typescript
// Check if targetMapId is a valid UUID
const uuidRegex = /^[0-9a-f]{8}-
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
- backend/src/app.ts
- src/app.ts
- @co-dao/shared@0.1.0
- @co-dao/backend@0.1.0
- @co-dao/frontend@0.1.0
- 35massets/index-B7o1Xjs4.css
- 36massets/index-CXy1YA-H.js
- skills/auto-health-api-status-maps-5-npcs.md
- learned-1i9mfdo/SKILL.md
- avelisofficial01-art/Cochannhan.git
- harness/tool-settlements.jsonl
- memory/learning.json

## Useful Tools
- read_file
- replace_in_file
- run_terminal_command

## Pitfalls
- run_terminal_command: Error: cwd "d:\Game\Gu" is not accessible: Error: ENOENT: no such file or directory, stat 'd:\Game\Gu\d:\Game\Gu'

## Verification
- replace_in_file: Updated backend/src/app.ts (+6/-4). Change is applied; user can Reject in chat to roll back.
- run_terminal_command: Error: cwd "d:\Game\Gu" is not accessible: Error: ENOENT: no such file or directory, stat 'd:\Game\Gu\d:\Game\Gu'
- run_terminal_command: <terminal command="npm run typecheck 2&gt;&amp;1 &amp;&amp; npm run build 2&gt;&amp;1 &amp;&amp; git add -A &amp;&amp; git commit -m &quot;Fix: UUID cast error in m
[truncated]
