# VLight Design System Agent Rules

## Scope

These instructions apply to the Design System website repository. `registry.json` indexes the current published assets; `history-log.json` records approved changes to those assets over time.

## Shared Component Encapsulation

Consumer code must treat every reusable component as an encapsulated owner of its internal structure, styles, dimensions, states, and private CSS variables. A consumer includes documentation pages, product pages, examples, feature components, and any other code that imports or renders the reusable component.

- Consumers must use only the component's published props, variants, sizes, slots, and tokens.
- Consumers may control outer placement and surrounding layout, but must not reach into the component with descendant selectors, override its internal classes or elements, change private CSS variables, use `!important` to defeat component styles, or patch internal geometry from page-level CSS.
- Documentation examples must render the real component through its public API. They must not recreate, fork, or locally restyle the component merely to match a preview.
- If the public API cannot produce the required result, do not add a consumer-side workaround. Change the canonical component through its owning source and complete the Mandatory History Workflow, or stop and ask for approval when that component-library change is outside the requested scope.
- A feature-specific private component is allowed only when it has genuinely different semantics or behavior and clear ownership. It must not be introduced as a duplicate substitute for a missing shared-component variant.

Any task that violates these rules is incomplete even if the rendered result appears visually correct.

## Mandatory History Workflow

When a task changes a Design System asset listed in `registry.json`, read and follow [the project History Log skill](skills/vlight-design-system-history/SKILL.md).

The workflow applies to:

- Foundation token values, aliases, names, or published guidelines.
- Icon additions, removals, renames, or visual changes.
- Reusable UI component APIs, variants, states, dimensions, behaviors, visuals, token dependencies, or published guidelines.

Do not write History Log entries for documentation-shell work such as navigation, routes, page layout, preview canvases, the History page, or other presentation-only code.

Every qualifying implementation task is incomplete until the asset change and its History Log entry are both written and `npm run history:validate` passes. Use the actual implementation diff and the user's stated rationale; never invent a reason or a previous value. If either is unavailable, ask the user before finalizing the change.

## Registry Workflow

Run `npm run registry:generate` after adding, removing, renaming, or relocating a Design System asset, or after changing a reusable component's Foundation dependencies. A value-only change that leaves the asset inventory and dependency list unchanged does not require a registry change.

Do not edit `registry.json` manually. Do not derive History Log entries from registry diffs alone.
