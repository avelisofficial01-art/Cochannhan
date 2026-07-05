---
name: learned-mvka43
description: Learned DGOCoder workflow for "Resume the project."
version: 1.0.0
metadata:
  dgo:
    kind: success
    generated: true
    source: learning-memory
    reason: "complex multi-tool task"
---

# Resume the project.

## When to Use
Resume the project.

Before doing anything else:

1. Read AGENTS.md.
2. Read PROJECT_STATUS.md.
3. Read GAME_BUILD_PLAN.md.
4. Read CHANGELOG.md.

Determine the current sprint, current task, and project state.

Follow AGENTS.md exactly.

Current Objective:

Cải thiện, xây dựng hệ thống quest, quest nhận xong, làm xong chỉ gạch đi, ko thấy đổi sang quest khác, quest giết 5 thỏ thì phải hiện đang giết dc bao nhiêu /5,...

Requirements:

- Complete ONLY this objective.
- Do not modify unrelated systems.
- Do not change gameplay, lore, story, database schema, APIs, or architecture unless required by this objective.
- Reuse existing systems whenever possible.
- Keep the project data-driven.
- Use existing assets only.
- Never hardcode gameplay values or asset paths.
- If information is missing, stop and report instead of guessing.

Before writing co
[truncated]

## Quick Reference
- Provider/model used when learned: custom/deepseek-v4-pro[1m]
- Learned from session: session-mr7ez1wx-d9erotrw
- Last updated: 2026-07-05T07:04:47.805Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
The user wants me to resume the project and follow the AGENTS.md workflow. Let me:

1. Read AGENTS.md
2. Read PROJECT_STATUS.md
3. Read GAME_BUILD_PLAN.md
4. Read CHANGELOG.md
5. Determine current sprint and task

The objective is: "Cải thiện, xây dựng hệ thống quest, quest nhận xong, làm xong chỉ gạch đi, ko thấy đổi sang quest khác, quest giết 5 thỏ thì phải hiện đang giết dc bao nhiêu /5,..."

This means: Improve/build the quest system. After accepting a quest and completing it, it only gets crossed out but doesn't switch to the next quest. For kill quests (kill 5 rabbits), should show progress (e.g., 3/5 killed).

This is about the quest tracker/quest system UI and logic.

Let me read the required files first.
</think>



:::tool read_file
{
  "path": "AGENTS.md",
  "startLine": 1,
  "endLine": 50
}
:::



:::tool read_file
{
  "path": "PROJECT_STATUS.md",
  "startLine": 1,
  "endLine": 60
}
:::



:::tool read_file
{
  "path": "GAME_BUILD_PLAN.md",
  "startLine": 1,
  "endLine": 60
}
:::



:::tool read_file
{
  "path": "CHANGELOG.md",
  "startLine": 760,
  "endLine": 830
}
:::

<think>
Sprint 10 đã hoàn thành, tất cả 10 sprint đều done. Người dùng đưa
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
- AGENTS.md
- 4. docs/01_PROJECT_SPEC.md
- 5. docs/02_SYSTEM_BIBLE.md
- 6. docs/03_DATABASE_DESIGN.md
- 7. docs/04_BACKEND_ARCHITECTURE.md
- 8. docs/05_API_SPEC.md
- 9. content/01_WORLD.md
- 10. content/02_FACTIONS.md
- 11. content/04_MAIN_STORY.md
- 12. content/07_GU_BIBLE.md
- PROJECT_STATUS.md
- assets/test-game.html
- GAME_BUILD_PLAN.md
- + content/ + AGENTS.md
- 1. docs/02_SYSTEM_BIBLE.md
- 2. docs/03_DATABASE_DESIGN.md
- 3. docs/04_BACKEND_ARCHITECTURE.md
- 4. docs/05_API_SPEC.md
- CHANGELOG.md
- combat/boss-ai.ts
- pages/GamePage.tsx
- api/health + console.log
- hooks/useSocket.ts
- components/DialoguePanel.tsx
- game/PreloadScene.ts
- game/GameScene.ts
- game/UIScene.ts
- config/index.ts
- frontend/src/components/QuestTracker.tsx
- components/QuestTracker.tsx
- store/gameStore.js
- frontend/src/components/DialoguePanel.tsx

## Useful Tools
- read_file
- todo_write
- run_script
- multi_edit

## Pitfalls
- multi_edit: Error: Edit #1: oldText not found in current file content.
- multi_edit: Error: Edit #2: oldText not found in current file content.

## Verification
- read_file: <file path="PROJECT_STATUS.md">
- read_file: <file path="CHANGELOG.md">
- read_file: <file path="frontend/src/components/QuestTracker.tsx">
- read_file: <file path="frontend/src/components/DialoguePanel.tsx">
- read_file: <file path="frontend/src/store/gameStore.ts">
- run_script: <run_script tool_calls="2">
