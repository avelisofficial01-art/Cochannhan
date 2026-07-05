---
name: learned-qub5hy
description: Learned DGOCoder workflow for "node:internal/process/promises:394"
version: 1.0.0
metadata:
  dgo:
    kind: success
    generated: true
    source: learning-memory
    reason: "complex multi-tool task"
---

# node:internal/process/promises:394

## When to Use
node:internal/process/promises:394
    triggerUncaughtException(err, true /* fromPromise */);
    ^
PostgresError: invalid input syntax for type uuid: "Lông Thú"
    at ErrorResponse (file:///opt/render/project/src/node_modules/postgres/src/connection.js:815:30)
    at handle (file:///opt/render/project/src/node_modules/postgres/src/connection.js:489:6)
    at Socket.data (file:///opt/render/project/src/node_modules/postgres/src/connection.js:324:9)
    at Socket.emit (node:events:508:28)
    at addChunk (node:internal/streams/readable:563:12)
    at readableAddChunkPushByteMode (node:internal/streams/readable:514:3)
    at Readable.push (node:internal/streams/readable:394:5)
    at TCP.onStreamRead (node:internal/stream_base_commons:189:23) {
  severity_local: 'ERROR',
  severity: 'ERROR',
  code: '22P02',
  where: "unnamed portal parameter $2 = '...'",
[truncated]

## Quick Reference
- Provider/model used when learned: custom/deepseek-v4-pro[1m]
- Learned from session: session-mr7z5ptc-i1l0oo9o
- Last updated: 2026-07-05T17:11:00.017Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
The error is now clear: `PostgresError: invalid input syntax for type uuid: "Lông Thú"`. 

This is a VERY specific error - someone is passing the string `"Lông Thú"` (a Vietnamese phrase meaning "Animal Fur") as a UUID value. This is clearly a data issue where an item name or similar text is being used where a UUID is expected.

"Lông Thú" is likely a monster drop item - animal fur. When a monster is killed, the system tries to add this item to the player's inventory, and somewhere in that flow, the item name "Lông Thú" is being passed to a UUID column.

Key insight: `triggerUncaughtException` means this error is NOT caught by any try-catch. It's happening in an async context (Promise) that doesn't have error handling.

This is not a startup error - the error says `triggerUncaughtException(err, true /* fromPromise */)` which means it's an unhandled promise rejection. This happens at RUNTIME, probably when the user kills a monster and the kill handler tries to grant drops.

Let me trace the combat kill → item grant flow:
1. Combat service kills monster
2. Line 257-265: `inventoryService.addItem(playerId, { itemId: drop.itemId, quantity: drop.quantity })`
3. T
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
- backend/src/combat/combat.service.ts
- combat/combat.service.ts
- monster/monster.schema.ts
- schema/index.ts
- database/seed.ts
- ./connection.js
- schema/index.js
- docs/03_DATABASE_DESIGN.md
- ./combat.repository.js
- player/player.service.js
- story/story.repository.js
- quest/quest.service.js
- database/connection.js
- tool-output/read_file-1783267803839-1ewfgb.txt
- config/index.ts
- combat/types.ts
- backend/src/inventory/inventory.service.ts
- inventory/inventory.service.ts
- ./inventory.repository.js
- ./inventory.schema.js
- inventory/inventory.service.js
- @co-dao/backend@0.1.0
- avelisofficial01-art/Cochannhan.git

## Useful Tools
- read_file
- codebase_search
- grep
- multi_edit
- replace_in_file
- run_terminal_command

## Pitfalls
- multi_edit: Error: Edit #1: oldText not found in current file content.

## Verification
- replace_in_file: Updated backend/src/combat/combat.service.ts (+1/-1). Change is applied; user can Reject in chat to roll back.
- run_terminal_command: <terminal command="npm run build" cwd="backend" exitCode="0" durationMs="4203">
- run_terminal_command: <terminal command="git add backend/src/combat/combat.service.ts &amp;&amp; git commit -m &quot;Fix: PostgreSQL UUID error 22P02 — remove UUID comparison from item d
[truncated]
