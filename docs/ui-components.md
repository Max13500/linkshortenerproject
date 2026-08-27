# UI Components

## shadcn/ui only

All UI elements in this app must use [shadcn/ui](https://ui.shadcn.com) components. Do not hand-write custom components (buttons, inputs, dialogs, cards, etc.) when a shadcn/ui equivalent exists.

- Add new primitives via the shadcn CLI so they land in [components/ui](../components/ui) with the project's configured style, base color, and aliases (see [components.json](../components.json)).
- Import shared UI from `@/components/ui/*` (e.g. `@/components/ui/button`), not from ad-hoc local components.
- Compose screens/features out of shadcn/ui primitives rather than building parallel one-off styled elements.
- If a needed primitive isn't installed yet, add it via the shadcn CLI before writing custom markup for it.
- Use the `lucide` icon library (already configured) for icons, consistent with shadcn/ui conventions.
