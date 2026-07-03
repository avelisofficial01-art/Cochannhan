---
name: auto-ok-dc-roi-fix-them-nhu
description: Auto-learned playbook — ok dc rồi, fix thêm như sau, kéo cái map thật to ra đi cho sướng(vỡ ảnh cũng dc, cân bằng lại kích cỡ nhân vật(nhỏ lại)
category: auto-learned
---

# ok dc rồi, fix thêm như sau, kéo cái map thật to ra đi cho sướng(vỡ ảnh cũng dc, cân bằng lại kích cỡ nhân vật(nhỏ lại)

> Auto-generated from a successful agent session. Review and edit freely — delete this file if it is not useful.

## Steps that worked

1. Read `frontend/src/game/GameScene.ts`
2. Search for `spawnMonsterSprite|setDisplaySize|monsterSize|camera`
3. Read `frontend/src/game/GameScene.ts`
4. Multi-edit `frontend/src/game/GameScene.ts`
5. Read `assets/test-game.html`
6. Multi-edit `assets/test-game.html`
7. Run `npm run typecheck 2>&1`
8. Run `npm run build 2>&1 && git add -A && git commit -m "Sprint 7: Scale map 1.2x, shrink player/monster to 24x24, expand clam`

## Files involved

- frontend/src/game/GameScene.ts
- assets/test-game.html

## Verification

```bash
npm run build 2>&1 && git add -A && git commit -m "Sprint 7: Scale map 1.2x, shrink player/monster to 24x24, expand clamp bounds" 2>&1 && git push origin main 2>&1
```
