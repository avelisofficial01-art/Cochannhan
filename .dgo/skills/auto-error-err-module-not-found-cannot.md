---
name: auto-error-err-module-not-found-cannot
description: Auto-learned playbook — Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/opt/render/project/src/shared/src/stat-calculator.js' imported from /opt/render/project/s
category: auto-learned
---

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/opt/render/project/src/shared/src/stat-calculator.js' imported from /opt/render/project/src/shared/src/index.ts

> Auto-generated from a successful agent session. Review and edit freely — delete this file if it is not useful.

## Steps that worked

1. Read `shared/package.json`
2. Read `shared/src/index.ts`
3. Read `backend/tsconfig.json`
4. Read `backend/package.json`
5. Read `tsconfig.base.json`
6. Read `backend/package.json`
7. Edit `backend/package.json`
8. Read `backend/package.json`
9. Edit `backend/package.json`
10. Run `npm run build`
11. Run `git add backend/package.json && git commit -m "Fix: use tsx src/index.ts for start — shared package imports need TS runt`

## Files involved

- backend/package.json

## Verification

```bash
git add backend/package.json && git commit -m "Fix: use tsx src/index.ts for start — shared package imports need TS runtime" && git push origin main
```
