---
name: learned-1rrwk5k
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

1. Read AGENTS.md.
2. Read PROJECT_STATUS.md.
3. Read GAME_BUILD_PLAN.md.
4. Read CHANGELOG.md.

Then scan the entire assets/ directory and analyze every asset.

Tasks:

1. Create an asset registry for all existing assets.
2. Map every asset to its intended gameplay purpose.
3. Verify that all asset paths are configurable and not hardcoded.
4. Generate an AssetManager (or equivalent) for loading assets.
5. Prepare the project so assets can be replaced in the future without changing gameplay code.
6. If an asset type is missing, use placeholders instead of creating new assets.
7. Do NOT generate any images or sprite sheets.
8. Do NOT rename or move existing asset files.
9. Do NOT modify gameplay or story.

Create or update:

- assets/ASSET_MANIFEST.md
- Asset loading configuration
- Asset preloa
[truncated]

## Quick Reference
- Provider/model used when learned: custom/deepseek-v4-pro[1m]
- Learned from session: session-mr550ml6-7kwmvk8u
- Last updated: 2026-07-03T17:04:35.987Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
The user wants me to continue development, but they're giving me a very specific task about assets. Let me first read the required documents, then scan the assets directory.

Let me start by reading the mandatory docs and scanning the assets directory.
</think>

Đọc tài liệu bắt buộc trước, sau đó scan toàn bộ thư mục assets.

:::tool read_file
{
  "path": "AGENTS.md"
}
:::



:::tool read_file
{
  "path": "PROJECT_STATUS.md"
}
:::



:::tool read_file
{
  "path": "GAME_BUILD_PLAN.md"
}
:::



:::tool read_file
{
  "path": "CHANGELOG.md"
}
:::



:::tool read_file
{
  "path": "assets/ASSET_MANIFEST.md"
}
:::

<think>
Now I need to:
1. Scan the entire assets/ directory to inventory every asset file
2. Classify each asset
3. Create/update ASSET_MANIFEST.md
4. Create an asset loading configuration
5. Create an AssetManager module
6. Update the GameScene to use the AssetManager
7. Verify everything compiles

Let me scan the assets directory first.
</think>

Đã đọc đủ tài liệu. Giờ scan toàn bộ thư mục assets/ để lập danh mục.

:::tool find_files
{
  "query": "assets/",
  "maxResults": 200
}
:::

<think>
Now I have a comprehensive list of all assets. Let me class
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
- PROJECT_STATUS.md
- GAME_BUILD_PLAN.md
- + content/ + AGENTS.md
- 2.1 docs/01_PROJECT_SPEC.md
- 2.2 docs/02_SYSTEM_BIBLE.md
- 2.3 docs/03_DATABASE_DESIGN.md
- 2.4 docs/04_BACKEND_ARCHITECTURE.md
- 2.5 docs/05_API_SPEC.md
- 2.6 content/06_GAMECONTENT_WORLD.md
- 2.7 content/06_GAMECONTENT_FACTIONS.md
- 2.8 content/07_GU_BIBLE.md
- content/06_GAMECONTENT_WORLD.md
- content/06_GAMECONTENT_FACTIONS.md
- CHANGELOG.md
- workflows/ci.yml
- src/index.ts
- .env / .env.example
- config/index.ts
- schema/index.ts
- utils/response.ts

## Useful Tools
- read_file
- find_files
- todo_write
- write_file

## Pitfalls
- None recorded

## Verification
- read_file: <file path="AGENTS.md">
- read_file: <file path="PROJECT_STATUS.md">
- read_file: <file path="GAME_BUILD_PLAN.md">
- read_file: <file path="CHANGELOG.md">
- find_files: <files query="assets/">
- write_file: Created frontend/src/game/AssetConfig.ts (+155/-0). Change is applied; user can Reject in chat to roll back.
