<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project docs

**CRITICAL: Before generating or modifying ANY code, ALWAYS read every relevant individual instruction file in `/docs`. These files contain mandatory project requirements and take precedence over assumptions or default patterns.**

- [Authentication](docs/authentication.md) — Clerk-only auth, protected `/dashboard` route, home page redirect, modal sign-in/sign-up.
- [UI Components](docs/ui-components.md) — shadcn/ui only, no custom components.
- [Data Mutations](docs/data-mutations.md) — server actions only, colocated `actions.ts`, typed inputs, zod validation, auth check, `/data` helper functions for Drizzle queries.
