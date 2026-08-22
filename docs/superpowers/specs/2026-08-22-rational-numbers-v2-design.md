# Rational Numbers Classroom V2 — Design

## Goal and scope

Build a new, stable classroom-site framework for Grade 7 bilingual rational-number lessons. It is intended for 16:9 Seewo touch displays. This iteration delivers only the shell, navigation, state switching, placeholder stages, teacher-control areas, and responsive layout validation. It does not implement lesson animations, random question banks, authentication, scoring, or other product features.

The existing site is not a structural source for this project. A future lesson may selectively import proven mathematical utilities (for example number-line coordinate mapping, opposite-number calculation, absolute-value calculation, comparison, and fraction formatting) without changing their verified behavior.

## Technology and file boundaries

Use Vite with plain HTML, CSS, and JavaScript. The framework stays intentionally dependency-free.

- `index.html` provides the semantic application shell.
- `src/main.js` owns the lesson-by-mode UI state, rendering, and event handling.
- `src/styles.css` owns the classroom layout, responsive sizing, and visual states.
- `src/lessons.js` holds four small, declarative placeholder definitions. Later lesson-specific view or engine modules can attach here without altering shell layout.

## Application model

There are four lessons: Number Line, Opposite, Absolute Value, and Comparing Rational Numbers. The selected lesson and the selected mode (`explore` or `quick-check`) form the complete screen state.

The sidebar dispatches a lesson selection; the segmented mode control dispatches a mode selection. Both update the same state object and rerender only the title, active controls, stage content, and teacher-control description. No route, account, or persistence is required in this iteration.

## Classroom layout

The root is a two-column CSS Grid:

- A left sidebar with width `clamp(220px, 18vw, 280px)`.
- A right classroom workspace with `minmax(0, 1fr)` so the stage can shrink without horizontal overflow.

The workspace uses rows for a compact title header, the Explore/Quick Check switcher, a dominant flexible Main Classroom Stage, and a short Teacher Controls region. The stage receives the remaining vertical height and has a minimum constrained through responsive rules; headings, helper copy, and controls compact before its space is reduced. The switcher and teacher controls are outside the stage, never in a footer containing quiz content.

Ordinary layout uses Grid and Flexbox only. Formula/instruction cards, stage placeholders, and teacher controls each have their own flow containers; no absolute positioning is used to place normal text or buttons.

## Visual and touch rules

- Use a calm high-contrast classroom palette, large bilingual labels, and readable cards.
- All primary interactive targets are at least 52px tall, with generous gaps.
- The selected lesson and selected mode are visible through text, color, and a non-color treatment.
- The main stage has the strongest contrast, largest area, and most whitespace. It is reserved for future number lines and dynamic visuals.
- At 1280×720 and larger, the app fits the viewport without horizontal scrolling. When vertical space is limited, secondary helper text is hidden or reduced before primary type and stage height are compromised.

## Placeholder contents

Every `lesson × mode` pair displays simple, lesson-specific placeholder copy only:

- Explore: a concise bilingual learning focus and a clearly reserved visual/formula zone.
- Quick Check: a concise bilingual prompt indicating where an eventual random classroom question will appear.

No randomization, lesson engine, Canvas drawing, or animations are included.

## Validation

Run the local Vite site and inspect rendered screenshots at 1920×1080, 1366×768, and 1280×720. For all four lessons and both modes, verify:

- no overlap, clipping, horizontal overflow, or button collisions;
- sidebar does not crowd the stage;
- Explore/Quick Check switching remains visually stable;
- touch controls meet the minimum target size;
- stage remains the visually dominant region.

Address discovered layout issues before reporting completion.
