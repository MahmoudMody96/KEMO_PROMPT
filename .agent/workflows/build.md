---
description: How to build and verify the project
---

## Build & Verify

Run from the project root (`D:\MAHMOUD\projects\prompt_gen`). These are the same
steps CI runs (`.github/workflows/ci.yml`), so passing them locally means green CI.

1. **Lint** — frontend and server:
```
npx eslint src server/src
```

2. **Tests** — node's built-in runner, no extra deps:
```
npm test
```

3. **Build** — the production frontend bundle:
```
npm run build
```

4. **Server syntax** — the build never touches server code, so check it separately:
```
cd server; Get-ChildItem -Recurse src -Filter *.js | ForEach-Object { node --check $_.FullName }
```

If any step fails, fix the errors before moving on.

## Run locally

- API + DB-backed server (serves `dist/` too): `cd server; npm start` → `:3001`
  in dev, `:3000` in the container. Migrations apply automatically on boot.
- Frontend with HMR: `npm run dev` → `:5173`, proxies `/api` to the server.
- First admin: `cd server; $env:ADMIN_EMAIL='you@example.com'; npm run make-admin`

## Notes

- Windows PowerShell: use `;` to chain, not `&&`.
- The model is set in `server/.env` (`OPENROUTER_MODEL` / `OPENROUTER_VISION_MODEL`);
  the frontend never sends one.
