---
description: How to build and verify the project
---

## Build & Verify

// turbo-all

1. Run the build command in the background:
```
npx vite build
```
- Cwd: `d:\MAHMOUD\برمجة\موقع توليد برومبتات`
- WaitMsBeforeAsync: 500 (send to background immediately)
- SafeToAutoRun: true

2. Check build status with `command_status` tool (WaitDurationSeconds: 30)

3. If build succeeds, continue with next task. If it fails, fix the errors.

## Important Notes
- **NEVER use `&&` in PowerShell** — use `;` instead
- **NEVER block on terminal commands** — always use WaitMsBeforeAsync: 500
- **Continue working** while commands run in background
