---
name: auto-node-82-module-typeless-package-json
description: Auto-learned playbook — (node:82) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///opt/render/project/src/shared/src/index.ts is not specified and it 
category: auto-learned
---

# (node:82) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///opt/render/project/src/shared/src/index.ts is not specified and it doesn't parse as CommonJS.

> Auto-generated from a successful agent session. Review and edit freely — delete this file if it is not useful.

## Steps that worked

1. Read `shared/src/index.ts`
2. Read `shared/package.json`
3. Read `shared/src/stat-calculator.ts`
4. Read `backend/tsconfig.json`
5. Read `render.yaml`
6. Read `shared/tsconfig.json`
7. Read `package.json`
8. Multi-edit `shared/package.json`
9. Edit `backend/package.json`
10. Edit `package.json`
11. Run `git add shared/package.json backend/package.json package.json && git commit -m "Fix production: add type:module to share`

## Files involved

- shared/package.json
- backend/package.json
- package.json

## Verification

```bash
git add shared/package.json backend/package.json package.json && git commit -m "Fix production: add type:module to shared, use tsx for backend start to handle .ts imports" && git push
```
