---
name: auto-health-api-status-maps-5-npcs
description: Auto-learned playbook — Health] 🏥 API status: maps=5 npcs=4 monsters=4 quests=5
category: auto-learned
---

# Health] 🏥 API status: maps=5 npcs=4 monsters=4 quests=5

> Auto-generated from a successful agent session. Review and edit freely — delete this file if it is not useful.

## Steps that worked

1. Read `backend/src/app.ts`
2. Multi-edit `backend/src/app.ts`
3. Read `frontend/src/hooks/useSocket.ts`
4. Edit `frontend/src/hooks/useSocket.ts`
5. Run `npm run typecheck 2>&1 && npm run build 2>&1 && git add -A && git commit -m "Sprint 7: Add map:join ACK + error event fo`

## Files involved

- backend/src/app.ts
- frontend/src/hooks/useSocket.ts

## Verification

```bash
npm run typecheck 2>&1 && npm run build 2>&1 && git add -A && git commit -m "Sprint 7: Add map:join ACK + error event for client visibility

- Server emits 'map:join:ack' immediately on receiving map:join
- Server emits 'error' event on map join failure (catch block)
- Client listens for 'map:join:a
```
