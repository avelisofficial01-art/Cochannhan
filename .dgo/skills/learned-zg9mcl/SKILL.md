---
name: learned-zg9mcl
description: Learned DGOCoder workflow for "Project Maintenance Pass"
version: 1.0.0
metadata:
  dgo:
    kind: success
    generated: true
    source: learning-memory
    reason: "complex multi-tool task"
---

# Project Maintenance Pass

## When to Use
Project Maintenance Pass

Read AGENTS.md first.

Do NOT implement new features.

Objective:

Improve the overall health of the project.

Tasks:

- Remove dead code.
- Remove unused imports.
- Remove unused files.
- Remove duplicated logic.
- Remove obsolete assets that are no longer referenced.
- Remove commented-out code.
- Remove console.log/debug code.
- Remove TODO/FIXME placeholders.
- Simplify overly complex functions where safe.
- Keep public APIs unchanged.
- Keep gameplay unchanged.
- Keep database schema unchanged.
- Keep story unchanged.

After finishing:

- Build.
- Run lint.
- Run type check.
- Run tests.
- Fix all issues found.
- Update PROJECT_STATUS.md.
- Update CHANGELOG.md.

Stop after maintenance is complete.

## Quick Reference
- Provider/model used when learned: custom/deepseek-v4-pro[1m]
- Learned from session: session-mr7ez1wx-d9erotrw
- Last updated: 2026-07-05T06:37:52.719Z

## Procedure
1. Start from the files and areas listed below instead of rediscovering the workspace from scratch.
2. Reuse the same tool sequence when it still matches the current request.
3. <think>
Let me analyze what I've found so far and continue the maintenance pass. From the previous turn's tool results, I found:

1. **console.log** in `frontend/src/pages/GamePage.tsx` (health check logging - lines 47, 49, 51, 55)
2. **console.log/warn/error** in `frontend/src/hooks/useSocket.ts` (socket debug logging)
3. `assets/test-game.html` - potentially an unused test file

I need to:
1. Continue scanning files for more issues
2. Check for dead code, unused imports, commented-out code
3. Clean everything up
4. Build, lint, typecheck, run tests
5. Update documentation

Let me continue scanning the remaining source files. I need to read more files to find all issues. Let me identify what files I haven't read yet and scan them systematically.

Files I've already read (from workspace memory and this turn):
- frontend/src/App.tsx
- frontend/src/pages/GamePage.tsx
- frontend/src/main.tsx
- frontend/src/api/client.ts
- frontend/src/hooks/useSocket.ts

Files I still need to check:
- frontend/src/components/CharacterPanel.tsx
- frontend/src/components/CraftPanel.tsx
- frontend/src/components/DialoguePanel.tsx
- frontend/src/components/EquipmentPanel.tsx
- frontend/src
[truncated]
4. After code edits, run the same verification style recorded in this skill or the nearest project-level compile/test command.

## Files and Areas
- frontend/src/components/CharacterPanel.tsx
- components/CharacterPanel.tsx
- store/gameStore.js
- frontend/src/components/GameHUD.tsx
- components/GameHUD.tsx
- self-center mb-28 bg-gu-dark/90 border border-gu-accent text-gu-accent text-xs font-semibold px-3 py-1.5
- flex gap-2 bg-gu-dark/80 backdrop-blur border border-gu-border rounded-full p-1.5
- 60 backdrop-blur-sm border border-gu-border/40 rounded-2xl p-2.5
- (cd.remaining / cd.total
- frontend/src/components/CraftPanel.tsx
- components/CraftPanel.tsx
- frontend/src/components/DialoguePanel.tsx
- components/DialoguePanel.tsx
- frontend/src/components/QuestTracker.tsx
- components/QuestTracker.tsx
- frontend/src/components/EquipmentPanel.tsx
- components/EquipmentPanel.tsx
- flex justify-between items-center rounded border border-gray-700 bg-gray-900/30 px-3 py-1.5
- frontend/src/components/GuPanel.tsx
- components/GuPanel.tsx
- frontend/src/pages/GamePage.tsx
- pages/GamePage.tsx
- frontend/src/hooks/useSocket.ts
- hooks/useSocket.ts
- 2 -translate-x-1/2 z-40 bg-gu-accent text-gu-dark font-bold text-xs px-3 py-1.5
- frontend/src/pages/LoginPage.tsx
- pages/LoginPage.tsx
- api/client.js
- store/auth.js
- frontend/src/pages/RegisterPage.tsx
- pages/RegisterPage.tsx
- frontend/src/store/auth.ts

## Useful Tools
- read_file
- grep
- run_script
- todo_write
- replace_in_file
- run_terminal_command
- multi_edit

## Pitfalls
- run_terminal_command: <terminal command="rm assets/test-game.html" cwd="." exitCode="1" durationMs="34">
- run_terminal_command: <terminal command="Remove-Item -Path &quot;assets/test-game.html&quot; -Force" cwd="." exitCode="1" durationMs="34">
- multi_edit: Error: Edit #11: oldText not found in current file content.

## Verification
- read_file: <file path="frontend/src/components/CharacterPanel.tsx">
- read_file: <file path="frontend/src/components/CraftPanel.tsx">
- read_file: <file path="frontend/src/components/DialoguePanel.tsx">
- read_file: <file path="frontend/src/components/QuestTracker.tsx">
- read_file: <file path="frontend/src/pages/RegisterPage.tsx">
