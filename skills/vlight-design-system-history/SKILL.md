---
name: vlight-design-system-history
description: Record approved VLight Design System asset changes in history-log.json whenever Foundation tokens, icons, or reusable UI components are changed; exclude documentation-shell-only work.
---

# VLight Design System History

Use this workflow in the same task that implements a qualifying Design System change.

1. Read `registry.json` to identify the affected asset ID and classification.
2. Inspect the implementation diff to capture the exact previous and new references or values.
3. Append one event to `history-log.json` for the user-requested change. Group multiple related property changes into that event's `changes` array.
4. Record the date, changed object, concise summary, user-provided reason, exact before and after states, and every affected registry asset ID.
5. Run `npm run registry:generate` only when inventory, paths, names, exports, or Foundation dependencies changed.
6. Run `npm run history:validate` before completing the task.

Use the change kinds defined by `history-log.schema.json`. Set `before` to `null` only for additions and `after` to `null` only for removals. Preserve token references and resolved values together when both are known.

Only record changes that alter a published asset's user-visible design or design specification: Foundation token values, aliases or names; Icon inventory or drawings; and reusable Component variants, visual states, dimensions, visual design, design-facing APIs, token dependencies, or published design guidance.

`history-log.json` is append-only historical data. Correct a malformed entry created in the current task, but do not rewrite or delete earlier approved events unless the user explicitly requests a historical correction.

Do not log implementation-only refactors, file or CSS-runtime reorganization, TypeScript-only restrictions, private ownership boundaries, documentation-shell dependencies, changes limited to `src/App.tsx`, `src/app.css`, `src/pages/**`, `src/components/docs/**`, routing, navigation, preview layouts, documentation tooling, or the History Log feature itself. A token or private variable rename that preserves the same rendered design is not a design change. Do not generate entries from Git or registry diffs without confirming the intended change and reason from the current request.
