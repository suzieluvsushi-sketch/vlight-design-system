---
version: alpha
name: "VLight Design System"
description: "A token-driven documentation site for the VLight Figma design system."
colors:
  background: "#FFFFFF"
  foreground: "#020117"
  primary: "#694BFA"
  primary-foreground: "#FFFFFF"
  secondary: "#EFF0F5"
  muted: "#EFF0F5"
  muted-foreground: "#71788D"
  destructive: "#E11133"
  border: "#DDDFE8"
  ring: "#9F8CFF"
typography:
  sans:
    fontFamily: "Inter, sans-serif"
  display:
    fontFamily: "Poppins, sans-serif"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
rounded:
  DEFAULT: "8px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "20px"
  3xl: "24px"
spacing:
  0: "0px"
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
  10: "40px"
  12: "48px"
  16: "64px"
---

# VLight Design System

## Overview

### Creative North Star

This is a quiet, token-driven documentation site: a focused left navigation and a generous reading column frame the system with the precision of a specimen tray rather than a generic developer tool. VLight purple supplies the primary emphasis while neutral surfaces keep component states legible.

### Product context and register

- **Audience and primary job:** Designers and frontend developers preview, compare, and maintain reusable UI components.
- **Target market and evidence:** Not yet specified; no market-specific behavior is assumed.
- **Locale and language policy:** The scaffold uses English sample copy only. Product locale policy will be defined with the imported design system.
- **Usage scene:** Desktop-first component authoring, with responsive previews required for every component.
- **Register:** Product tooling.
- **Memorable signature:** Dense token specimens remain calm and readable inside a precise VLight documentation shell.
- **Restraint:** Navigation and preview chrome remain quiet so they do not compete with components under review.
- **Anti-references:** Avoid decorative dashboard styling, arbitrary gradients, and one-off values that obscure token ownership.
- **Token ownership/runtime mapping:** `tokens/design-tokens.json` is the canonical source. `npm run tokens:css` deterministically generates `src/globals.css`, preserving Basic → Semantic → Component references as CSS `var(...)` aliases. The shadcn variables are an adapter over the Semantic layer, not a second source of truth.

## Colors

Components consume shadcn semantic variables such as `--primary`, `--muted`, `--destructive`, and `--ring`; each points to a VLight Semantic token, which in turn points to a Color Base token. Raw colors should not be introduced in component code. Only the light mode is defined; add a dark mapping only when the Figma source provides one.

### Token responsibility boundaries

Use **Design System Storybook website styles** for the documentation shell and presentation layer: navigation, documentation headings and copy, taxonomy labels, preview canvases, tables, and other explanatory UI. These styles may consume design tokens, but they are not component-token mappings unless the token source explicitly defines them as such.

Use **design-system token and component mappings** for the product-component chain: `Color Base → Color Semantic → Component Token → Component`. A change to an alias in this chain should propagate naturally to existing consumers through CSS variables. Do not retarget Storybook website styles, component consumers, or unrelated semantic roles when only an alias mapping changes, unless the request explicitly includes those usage sites.

## Typography

Inter is the body and interface face. Poppins is reserved for display typography. Use the exported weight, size, and line-height variables instead of introducing one-off type values. Technical values may use the documented system monospace stack.

Documentation page titles use the shared `32px / 40px` Poppins Semibold treatment, while major section headings use Poppins Semibold at `20px / 28px`. These shared levels apply across every Foundation and Component page; route-specific styles must not change their size, line height, or weight.

Foundation typography documentation reads the complete `styles.text` collection from `tokens/design-tokens.json`. Text Style specimens must preserve each style's bound family, size, weight, line height, and Figma tracking value; do not maintain a second handwritten type scale in page code.

Typography documentation uses the shared `DocumentationLabel` for its `Font 1` / `Font 2` taxonomy and the Semantic `brand/purple` token for every Text Style name, making canonical identifiers visually distinct from descriptive metadata.

## Layout

The documentation shell uses a 56px sticky glass Header above a fixed `menu/surface/width` navigation column and a fluid reading surface. Above the smallest breakpoint, the Header uses `layout/padding/lg` (`24px`) on the left and `layout/spacing/10` (`40px`) on the right; below `512px`, its right padding remains at the established `24px` compact value. The VLight lockup never flex-shrinks: at `550px` and wider it uses the complete wordmark at `28px` canvas height, while below `550px` it switches to the approved standalone brand mark at `35px` canvas height. The narrow source's larger canvas compensates for its transparent padding, so both versions preserve their intrinsic aspect ratio and present an approximately `30px × 23px` visible brand mark. Above `550px`, the top navigation begins `40px` after the VLight lockup; at `550px` and below, that separation becomes `layout/spacing/2` (`8px`). Its text links use symmetric `8px` inline padding. Above `550px`, their inter-item container gap is `4px`, producing a `20px` visual gap between adjacent labels; at `550px` and below, the two link hit areas meet with a `0px` container gap. Top-navigation links use `text/tertiary` by default and move to `text/primary` on hover, keyboard focus, and the current-page state without introducing a background change. It owns the VLight lockup, a Regular-weight Design System identity, token download, and future theme control; the `Token.json` download reuses the shared Primary Neutral Small Button with its `button/m` label rather than a Header-specific button recipe. The Header uses `glass/fill` for its surface, `blur/background-sm` (`8px`) for both standard and WebKit backdrop filtering, and a `1px` `border/subtle` bottom stroke. On desktop, the navigation remains pinned below the Header and owns its vertical overflow while the reading surface scrolls with the document. Below the width required for the menu and minimum reading surface to coexist, navigation returns to document flow and occupies the full row. Every page with a Hero uses `layout/spacing/8` (`32px`) between the Header and the Hero while preserving the shell's inline and bottom padding. Foundation pages retain their established main padding. Component documentation should use predictable token-based padding and avoid route-level constraints that leak into examples.

Component preview headings and card grids share a centered `1096px` maximum-width rail. As the available component-page width contracts from `1192px` to `1136px`, preserve the rail width and reduce its outer margins from `48px` to `20px`; below `1136px`, retain `20px` margins and let the rail become fluid. This order of adaptation keeps component specimens stable for as long as the viewport allows.

### Component preview page scope

The Button page is the visual baseline for Component Preview pages, but it is not a source of component-specific copy, variants, API documentation, examples, or Figma content. The shared specification governs page width and alignment, section rhythm, Hero composition, preview cards, and responsive behavior. Preserve undecided content slots rather than inventing their contents.

Before revising a Component Preview page, inspect `src/app.css`, the shared documentation shell, and one current component page. Reuse the existing shell and Semantic/Layout CSS variables; do not create a second shell or a screen-local token scale. Give each component page a business-named page class while keeping its visual values aligned with this specification. Do not edit Figma unless a request explicitly includes a Figma change.

Documentation pages and composite components must consume shared UI components through their published props, variants, sizes, and tokens. They must not override a shared component's internal elements, private CSS variables, dimensions, spacing, radius, or state styling. If the component library does not expose a suitable configuration, stop and treat that as an explicit component API/design-system change instead of patching the consumer.

### Component preview page frame

| Element | Token rule | Current pixel result |
|---|---|---:|
| Preview-page main padding | Top `layout/spacing/8`; inline `layout/spacing/10`; bottom `layout/padding/xl` | `32px 40px 32px` |
| Component page maximum | Documentation layout variable `--docs-component-page-width` | `1192px` |
| Section vertical padding | `layout/padding/3xl` | `48px` |
| Desktop section content inset | `layout/padding/3xl` | `48px` each side |
| Section divider | `stroke/width/1` + `border/divider` | `1px` |

The main keeps a shared `32px` block-start inset between the Header and every Hero on desktop and after the flow sidebar on narrow layouts. Apply this inset through the shared preview-page main state, never through negative margins or page-specific Hero offsets. The Hero occupies the full component-page width; ordinary section content uses the documented inset. Use section padding and layout gaps rather than arbitrary child margins. Documentation layout widths are owned by the centralized `--docs-*` variables in `src/app.css`; never derive page, rail, copy, table, or unrelated component widths from a component token such as `alert/default-width`.

### Preview module

Every visible direct child of a standard page section uses the same horizontal content rail as the Hero text. Screen-reader-only live regions remain visually hidden and are excluded from sizing rules. This includes `When to use`, Examples headings and grids, Props content, tables, notes, and any later documentation modules. The Examples section uses `48px` block padding, with the heading/status row followed by the card grid after `32px`; the heading and grid must share this universal rail. Do not create route-specific rail widths or let a section become wider or narrower than the Hero text region at any responsive state.

| Rail property | Token rule | Current pixel result |
|---|---|---:|
| Maximum width | Component page maximum − `layout/padding/3xl × 2` | `1096px` |
| Fluid width | `100% − layout/padding/3xl × 2` | Parent width minus `96px` |
| Alignment | `margin-inline: auto` | Centered |
| Desktop/fixed-sidebar inset | `layout/padding/3xl` | `48px` each side |
| Compact inset below `784px` | `layout/padding/lg` | `24px` each side |

Equivalent rail behavior:

```css
width: calc(100% - var(--layout-padding-3xl) * 2);
max-width: none;
margin-inline: auto;
```

The section heading is a wrapping flex row aligned to the end and spaced with `16px` between the heading group and an optional status or control. Use `8px` between the title and description. Its standard `32px` bottom margin separates it from a following module; remove that margin when the heading is the section's final content block so it does not compound with the section's own bottom padding. A passive status uses `8px 12px` padding, `8px` radius, and a stable `20px` minimum line box.

The preview grid uses two equal `minmax(0, 1fr)` columns with a `24px` gap in both axes. A wide card spans all columns; paired cards stretch to align; every card uses `min-width: 0`. Below `1152px`, collapse to one column without reordering the content.

Each preview card uses the surface background, a `1px` subtle border, `16px` radius, clipped overflow, and `grid-template-rows: auto 1fr`. Its metadata header always comes first with `layout/padding/md` block padding and `layout/padding/base` inline padding (`12px 16px`), subtle background, and a `1px` bottom divider. This Example-card chrome is a locked documentation-wide contract: every Component Preview card and every Foundation specimen board that uses this card anatomy must share it, and no individual route or card may override it. Example card headers contain the title only; do not add subtitles, descriptions, helper copy, or reserved blank description space on any page. Titles use Poppins Medium at `14px / 22px`. The preview surface uses `32px` padding and may vertically center specimens when appropriate. Do not place headings below previews or replace the header with a floating label.

When one Example card presents multiple variants or states whose differences are not immediately self-evident, place a concise variant name beneath each specimen using the shared specimen-label treatment. Label only the distinguishing dimensions, such as `Default`, `Hover`, `Focus`, or `Stopped · Actions on`. Do not repeat the component name, card title, or attributes shared by every specimen; move shared context to the card title or a single group heading. A card with one unambiguous specimen does not need an additional variant label. This keeps state comparisons identifiable without turning the preview into repetitive documentation copy.

Use the spacing scale according to relationship inside preview surfaces:

- `12px` for compact controls in one action row or label-to-sample spacing;
- `16px` as the minimum wrapped row gap;
- `20px` for evenly distributed size-series specimens;
- `24px` between peer rows or comparison groups;
- `32px` between distinct subgroups such as states, icon modes, or split-button groups.

Prefer `gap` on the owning Grid or Flex layout. Avoid compensating negative margins and per-child spacing overrides. Preview surfaces should grow naturally; add a minimum height only to align paired cards or reserve stable space. Use real component instances when examples are in scope, and use placeholders only while their content is explicitly undecided.

### Component preview Hero

This Hero contract is locked and shared by every component preview page. Every component page must join the same grouped CSS selectors as Button for the container, copy rail, title, supporting text, and responsive typography. Do not add page-specific typography, spacing, color, radius, background, or breakpoint overrides. Only an explicitly approved artwork asset and its approved crop behavior may differ. Change this contract only when the design system owner explicitly revises the shared Hero specification; when that happens, update every component preview Hero and this document in the same change.

| Property | Token rule | Current pixel result |
|---|---|---:|
| Width | Full component-page width | up to `1192px` |
| Height | Shared fixed Hero height | `200px` |
| Padding | `spacing/10` top; fixed copy baseline inset; `padding/3xl` inline | `40px 48px 36px` |
| Radius | `layout/radius/xl` | `20px` |
| Background | `background/subtle` | Semantic neutral subtle |
| Overflow | Hidden | Preserves rounded crop |

The Hero flows directly into its next section without a divider; later sections may retain normal dividers. The complete copy block is bottom-aligned with a fixed `36px` distance from the Hero's bottom edge; do not vertically center it. Keep copy above artwork with relative positioning and a higher stacking level. Its maximum width is the documentation copy variable `--docs-copy-width` (`544px`). Use Poppins at `48px / 56px`, `-2%` tracking, with the established `primary/400 → primary/300 at 62% → blue/500 at 110%` horizontal gradient for the title. Give the gradient text a `4px` bottom paint allowance offset by a `-4px` bottom margin so Poppins descenders remain visible without changing the title-to-copy rhythm. Supporting copy uses Inter Regular (`400`) at `16px / 24px` in `text/tertiary`, separated from the title by `12px`. Preserve this readable copy width when artwork is hidden.

The Hero background is always the single `background/subtle` surface used by Button. Do not add decorative gradients, radial glows, pseudo-element ornaments, glass panels, live components, or placeholder UI to fill unused Hero space. A component without an approved Hero illustration must render a copy-only Hero and leave the remaining area empty. Never invent, generate, or repurpose a component specimen as Hero artwork.

When an approved decorative Hero asset exists, scale its complete desktop artwork composition proportionally by `200 / 226` (`0.8849557522`) from the former Hero canvas, with `transform-origin: top right`. A typical `459px × 226px` artwork canvas therefore renders at approximately `406px × 200px`. Preserve every page's existing top/right anchor, internal crop, opacity, blend mode, and pointer-event behavior; window-width adaptation may crop the artwork but must not apply any further scaling. Use `alt=""` when it conveys no unique information. Supply matching 1× and 2× sources through `srcSet`; never upscale the 1× bitmap for high-density displays. A component without approved artwork changes only to the shared `200px` Hero height.

### Component preview responsive behavior

| Viewport | Required transformation |
|---|---|
| `≥ 1280px` | Show the right-side Hero illustration at its fixed `200 / 226` scaled logical size; page-width adaptation may crop it but must not resize it further. Use desktop Hero and grid rules. |
| `< 1280px` | Hide the Hero illustration completely while preserving the Hero container and copy width. This applies to every page; do not retain a page-specific illustration exception below this breakpoint. |
| `< 1152px` | Collapse the preview grid to one column; wide cards return to normal single-column flow. |
| `< 784px` | Sidebar returns to document flow; main padding becomes `32px 24px 24px`; Hero remains `200px` high with the copy still `36px` from the bottom, horizontal padding becomes `24px`, and title becomes `32px / 40px`; every section content rail switches with the Hero text gutter to `24px` on both sides. |
| `< 512px` | The Header may collapse secondary labels; the token download becomes a neutral Ghost icon button matching the adjacent Menu button's `32px × 32px` control with a `16px` icon, and reveals the below-button `Download Design token.json` tooltip on hover or keyboard focus. Retain the `< 784px` component-page rules. |

Do not squeeze Hero artwork behind text or progressively shrink it at intermediate widths. Keep the approved `200 / 226` desktop scale unchanged through `1280px`; below `1280px`, switch every Hero directly to the copy-only composition.

### Component preview visual QA

When changing the shared pattern, inspect at least `1512px`, `1280px`, `1279px`, both sides of `1152px`, both sides of `784px`, and `390px`. Confirm:

- no horizontal scrolling, clipped controls, or text–image collisions;
- a stable `32px` Header-to-Hero gap at every viewport;
- card headings remain above their previews;
- the heading and grid share the centered rail;
- every section rail remains aligned to the Hero text gutter: `48px` on desktop/fixed-sidebar layouts and `24px` below `784px`;
- wide cards span only while multiple columns exist;
- card padding remains stable when content wraps;
- high-density screens receive the 2× Hero asset when approved artwork exists;
- component controls remain visible and interactive.

Run lint and build after implementation, regenerate tokens only when token sources change, and visually inspect the rendered page in the browser.

## Elevation & Depth

Use borders and tonal surfaces first. A small shadow may separate an interactive preview panel from its canvas; component stories should not add decorative elevation that is absent from the source component.

## Shapes

The radius scale is `4 / 8 / 12 / 16 / 20 / 24px`, with an `8px` base radius. Tailwind radius utilities are mapped to these Layout tokens in `src/globals.css`; documentation-site styles should use those variables or utilities rather than hardcoded corner values.

## Documentation page patterns

### Button and Icon pages

The Button documentation page uses a full-width `200px` subtle Hero with a gradient display title, Regular-weight tertiary supporting copy, and the exact exported Figma line-art asset. Keep the complete copy block fixed `36px` from the bottom edge. The illustration provides 1× and 2× sources, scales proportionally from its `459px × 226px` source to an approximately `406px × 200px` logical footprint, and remains anchored at `top: 0; right: 0` without shifting or changing crop direction. The Hero background remains the plain subtle surface without a grid texture. The Hero flows directly into When to use without a divider; later sections retain their dividers. Its Examples region follows the Figma editorial grid: one full-width Color & variant card, then paired Sizes/States and Icons/Split button cards; headings stay above every interactive preview. Ghost Neutral exposes both `button/neutral/ghost/content`, which aliases `text/tertiary`, and the one-step darker `button/neutral/ghost/content-strong`, which aliases `text/secondary`. Existing component states remain bound to the default content token until an explicit component-binding change is approved.

The Icon documentation page applies the same component-preview frame to Figma node `1915:4737`: a full-width `200px` subtle Hero, 48px desktop inset, gradient `Icon` title, 544px copy block, and the exact right-cropped `409px × 226px` line-art asset with local 1×/2× sources. Scale the complete artwork composition by the shared `200 / 226` factor and apply `0.56` opacity directly to the image layer. The resulting illustration stays fixed while visible at `1280px` and above; it does not scale further with the page. Below `1280px` it disappears and the Hero retains its copy-only composition. The Hero flows directly into Basic Icons without a divider. Basic, Product, Social, and size specimens share the canonical centered preview rail; paired icon boards collapse to one column at the established preview breakpoint. Icon example boards use the compact card rhythm: `12px 16px` metadata headers, `16px` preview padding, `4px` grid gaps, and `40px` interactive cells around the unchanged `24px` icons. Paired boards use a `16px` gap; the size board uses `24px` padding and a `24px` item gap without changing any documented icon size.

### Navigation and data display

The React documentation shell uses `Foundation` and `Component` as permanent navigation groups. `Color`, `Typography`, and `Icon` are Foundation pages; each moves directly from its page introduction into foundation content without a repeated inline table of contents. The Component group begins with `Prompt` and `Message`, followed by the remaining component pages. Later pages should follow the same content structure and consume `tokens/design-tokens.json` through shared token utilities rather than duplicating values. Component previews should preserve meaningful states and interactions inside the same token-governed reading surface.

The History Log uses a borderless four-column ledger with Date, Category, Reason, and Detail sharing one grid definition. Date remains stable, Category is the most compact descriptive column, Reason is slightly wider than its minimum readable measure, and Detail receives the largest flexible share so before/after values wrap less. Category uses compact `12px` metadata and summary copy around a `16px / 24px` title. Each Detail change uses one natural inline text flow in `before → after` order: the red removed value is followed immediately by the arrow and green replacement value, and the complete sequence wraps like ordinary text when needed. All three parts use the compact `12px / 18px` treatment. Existing records use concise property names and short before/after values rather than implementation prose. On narrow screens, each record stacks with visible column labels and retains full values.

Transient feedback owned by the documentation website uses the shared `DocumentationAlert` wrapper and renders the production VLight `Alert` component. It appears at the bottom-right with the Alert component's published tone, icon, padding, border, typography, and `390px` action-free width, then dismisses after `1800ms`; compact viewports use a `12px` edge inset. An Alert with an action uses hug sizing: its total desktop width is the `390px` base plus the `12px` body-to-action gap and the action's intrinsic width, while `max-width: 100%` preserves responsive shrinkage. Success and copy confirmations use `success`, neutral selections use `info`, and failures use `error` with a useful recovery description. Do not introduce a separate inverse toast recipe. Passive Example-heading status text remains the compact documentation status treatment because it reports persistent specimen state rather than an alert event.

The Typography Foundation page implements Figma node `1915:4754` using the shared full-width `1192px × 200px` Hero geometry and the `1096px` centered content rail. Its gradient title and supporting copy follow the shared Hero type treatment, while the exact transparent “Aa” artwork starts from its `459px × 226px` right-side crop and scales as one composition by `200 / 226`. Apply `0.56` opacity and `luminosity` blending to the complete artwork frame—not only the nested PNG—so it retains the Figma silver-glass appearance against `background/subtle`. The artwork remains fixed-size while visible and disappears below `1280px`; the Hero then flows directly into Font family without a divider. Typography remains a Foundation page in information architecture even though its Hero and reading rail use the established wide documentation frame. Its example boards inherit the locked documentation-wide Example-card chrome: title-only metadata headers use Poppins Medium at `14px / 22px` with `12px 16px` padding; contextual explanation belongs in the section heading, not the card header. Specimen rows use `20px 24px` padding with `12px` internal gaps, adjacent boards use a `24px` gap, and sample cards do not reserve unused minimum height. These container reductions must not alter the bound specimen font family, size, weight, line height, or tracking.

The persistent menu uses `menu/surface/container` without a separating right border. Adjacent items use `layout/spacing/0`, adjacent navigation groups use `layout/spacing/5`, and items are text-led so the navigation reads as a compact list. Every row, including the active route, uses the `layout/control-height/medium` (`36px`) control height. Every menu-item label uses the shared `14px / 20px` body treatment. Prompt and Message append a compact `32px × 20px` NEW tag after the label with the row's existing `8px` gap. Build this tag as live HTML text and CSS rather than a raster cutout so it remains sharp at every display density. It uses `color/base/violet/50`, `4px` horizontal and `5px` vertical padding, a `6px` radius, and `10px / 10px` semibold text in `text/secondary`. The prior AI-tag asset is retained only for rollback and must not render. The NEW tag is present in default and hover states and disappears when its route is selected. Default and hover menu labels use `text/primary` at Regular weight; the active route alone uses `text/brand` at Medium weight for emphasis. Menu-item hover changes only the container to `menu/item/hover/container`; it does not change content color or add a leading stroke. The active route uses the updated artwork from Figma node `2154:1691` while retaining the established exact `192px × 36px` desktop row, `8px` radius, horizontal `primary/50 → background/surface` container gradient, and `text/brand` label positioned by `12px` inline padding and centered `14px / 20px` line box. Its label remains live route text rather than baked artwork. Export the transparent artwork frame at `3×` (`294px × 138px`) and render it at the unchanged `97.75px × 46px`, aligned flush to the row's right and bottom edges; it therefore bleeds `10px` above the selected container. The single frame export owns the revised character crop, chest mark, and right-side sparkle composition. The active link keeps overflow visible and sits above adjacent rows while the artwork frame owns its internal crop. Never use an export containing an opaque or baked menu background. `aria-current` remains the semantic current-page indicator.

Compact raster UI cutouts, including decorative menu, badge, control, and state artwork, must be exported from the approved outer Figma Frame at a minimum of 3× the intended CSS logical dimensions. Keep the CSS width and height at the 1× design size so the browser downsamples the higher-density source; never enlarge a 1× or 2× cutout to satisfy a 3× display requirement. Preserve transparency and the outer Frame bounds, bake internal transforms and crops into the export, and align only the exported outer rectangle in code. This compact-cutout rule is separate from the established responsive Hero `srcSet` contract.

Until a new navigation-icon policy is explicitly approved, both permanent navigation groups render every menu item as text-only. Do not retain hidden icon configuration, import, draw, generate, or adapt an icon merely for the sidebar.

Short taxonomy labels in documentation content use the shared `DocumentationLabel` primitive and mirror Figma node `216:236`: uppercase Inter Semibold, `badge/violet/container`, and `text/primary`. The Figma-local `10px` type size, `10px` line height, `5px` block padding, and `6px` radius are not exported as direct Variables or Text Styles in `tokens/design-tokens.json`; the runtime adapter composes existing typography, spacing, stroke, and radius tokens to reproduce those values without introducing independent literals.

### Component documentation pages

The Input documentation page uses the shared component-preview Hero contract with the approved artwork from Figma node `1968:6598`. Its exact transparent image is stored locally at `343px × 343px`, with a matching `686px × 686px` 2× source for high-density screens. The artwork sits inside the original `459px × 226px` right-side crop at `left: 78px` and `top: -38px`; scale that complete crop by the shared `200 / 226` factor so its internal placement remains proportional. It uses the node's `0.6` opacity, remains decorative with empty alternative text, and never changes the current Input-specific supporting copy. The artwork stays fixed-size while visible at desktop widths and is hidden below `1280px` with every other component Hero illustration. Input Example cards use title-only `12px 16px` metadata headers and natural content height instead of stretching paired cards to the tallest sibling. Their preview padding remains the shared `32px`; size-series rows use `20px` gaps and state groups use `24px` gaps, while every actual Input control retains its documented height and internal spacing.

The Select documentation page uses the shared `200px` Hero with the updated artwork composition from Figma node `2067:6385`. Its exact existing `1024px × 1024px` transparent source remains valid. Place it inside a right-anchored `406.195px × 200px` crop with `0.8` outer opacity; inside that crop, use a `263.556px × 273.081px` centering frame at `left: 92.92px; top: -15.87px`. Render the source at `263.717px × 263.878px`, `0.6` opacity, `2deg` rotation, and `2deg` horizontal skew. This page-specific composition already matches the shared 200px Hero and must not receive the generic `200 / 226` artwork scale again. Hide the complete art crop below `1280px`. Seven orthogonal specimens across Live selection, Size scale, and State boundaries cards replace the full variant matrix. Its navigation entry is text-only under the current Component-group icon policy.

The Prompt documentation page uses the approved `200px` Hero from Figma node `2068:6411` while preserving the existing Prompt-specific supporting copy and all component behavior. Retain its exact `1254px × 1254px` transparent source and serve matching `306px` 1× and `612px` 2× derivatives through `srcSet`. The artwork renders inside a right-anchored `406.195px × 200px` crop with `0.6` outer opacity. Inside that crop, use a `305.581px × 322.015px` centering frame at `left: 76.67px; top: -11.92px`; render the source at `306px × 306px` with `3deg` rotation, `3deg` horizontal skew, and `object-fit: cover`. This composition already matches the shared 200px Hero and must not receive the generic `200 / 226` scale again. Hide the complete artwork below `1280px`. The page follows the shared component-documentation order: Hero, When to use, Examples, then Props. The Hero flows directly into When to use without a divider; Examples and later sections retain their dividers. The Examples heading aligns the passive live status on the same wrapping heading row before documenting every Composer, attachment, attachment-list, and private textarea variant with real component instances.

The Message documentation page follows the shared component-documentation order: Hero, When to use, Examples, then Props. The Hero flows directly into When to use without a divider; Examples and later sections retain their dividers. User Message specimens remain in one Example card with AI Message below it; the two modules stay vertically stacked at every viewport width. Concise specimen labels identify only the state differences. Every Message action consumes the unmodified shared Small icon-only Button: a `32px × 32px` hit area with the component-owned `16px × 16px` icon size and centering behavior. Message styles must not override Button internals or its private sizing variables. The page uses the shared component-preview Hero contract with the approved Figma artwork from node `1964:6588`: its original `459px × 226px` right-anchored canvas contains the exact local glass-message image at the approved `320px` scale, rotation, skew, and crop, then the complete composition scales by `200 / 226`. Matching 1×/2× sources preserve high-density clarity; the artwork remains fixed-size while visible and disappears below `1280px`. Its Example cards contain title-only metadata headers as required by the shared preview rule. The Message navigation item is text-only, following the current rule for newly added component menu items.

### Icon page presentation

The Figma library defines Tabler as the canonical source for Basic and Product icon masters. The Icon Foundation page uses `@tabler/icons-react`, exact Figma names, and only the `12 / 16 / 20 / 24 / 32` Layout size tokens. Outline specimens, Filled specimens, and the Icon Sizes scale use `icon/secondary`; Filled was intentionally deepened one semantic step from `icon/muted` for clearer visual weight. Activating a Basic or Product specimen copies its SVG markup, and hover uses a tokenized tonal background without a visible border. Filled variants use the Tabler Filled exports; the Figma aliases `Layers` and `Glasses` map to `Stack 2` and `Eyeglass`. Social brand-color and inverse icons preserve their dedicated approved assets under `public/icon-assets/social` rather than receiving a blanket opacity adjustment. Lucide remains limited to the documentation shell and existing utility controls.

### Content and data visualization

Use direct labels that describe the action or state. Data-visualization rules will be defined after the Figma chart tokens and component specifications are available.

## Do's and Don'ts

- **Do:** Route documentation-site visual choices through semantic CSS variables and shared page patterns.
- **Do:** Document meaningful component states and responsive behavior.
- **Don't:** Copy Figma values directly into route-level page styles.
- **Don't:** Edit generated values in `src/globals.css`; update `tokens/design-tokens.json` or the generator and rebuild the CSS.
