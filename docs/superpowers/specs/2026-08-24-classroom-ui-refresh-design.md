# Rational Numbers Classroom V2 — Classroom Workspace UI Refresh

## Intent

Refresh the visual interface without changing the proven classroom workflow:

1. Select one of four lessons.
2. Set the relevant question options.
3. Ask a randomly generated question.
4. Reveal its answer.
5. Move to the next question.

The result should read as a calm, high-contrast classroom workspace for a 16:9 Seewo display, not as an electronic textbook, dashboard, or game.

## Visual direction

The chosen direction is **Calm Classroom Workspace**:

- A deep navy lesson rail creates a stable orientation edge.
- A cool, very light blue-gray canvas lets the classroom stage dominate.
- One saturated blue is the primary interaction color; teal is reserved for selected settings and positive mathematical cues; amber is reserved for the answer reveal action; red remains exclusive to the zero/origin signal on the number line.
- The main stage is a large, white presentation surface with a modest border and soft shadow. It must be visually stronger than its title, navigation, and controls.
- Typography stays system-native for dependable offline and school-computer rendering: `Segoe UI`, `Microsoft YaHei`, and available system fallbacks. Chinese and English labels remain bilingual.
- Motion is limited to short button feedback and respects `prefers-reduced-motion`; no decorative animation is introduced.

No generated imagery, remote font, icon library, or new framework is needed. These are deliberately excluded because the product is an operational classroom tool and must remain reliable offline.

## Page hierarchy

The desktop composition remains a two-column CSS Grid:

1. **Lesson rail**: the existing responsive width `clamp(220px, 18vw, 280px)` is retained. A compact course mark sits above four lesson buttons. The current lesson receives a clearly visible active treatment.
2. **Workspace header**: a restrained breadcrumb-like line identifies the tool, followed by the large bilingual lesson title.
3. **Classroom stage**: this receives the majority of available height. It contains a small `Quick Check` marker, one centered question area, an optional SVG number-line board, and a permanently reserved answer well.
4. **Teacher command dock**: settings and actions are visually grouped, but remain below rather than inside the answer well. It is never a footer and never competes with the question stage.

Ordinary content uses Grid and Flexbox. Question text, SVG, answer feedback, settings, and actions remain independent flow containers. There is no general-content absolute positioning.

## Controls

Controls are restyled but their state model, labels, and event contracts are preserved.

- Number Line retains `Number → Point`, `Point → Number`, `Easy`, and `Challenge` as selected-state controls.
- All lessons retain difficulty selection currently implemented by the application.
- `New Question` is the primary blue action.
- `Reveal Answer` is amber and becomes visibly unavailable after use.
- `Next` is a neutral dark action.
- All buttons retain a minimum 52px touch target, a clear focus ring, and a tactile pressed state.

The implementation may add non-interactive grouping labels and CSS classes to clarify settings versus actions, but it must not add lesson modes, scoring, inputs, timers, or other new behavior.

## Stage and answer behavior

The question stage remains the highest-priority visual object. The question is the largest text on screen, with responsive sizing based on available large-screen width and height rather than shrinking all content to fit.

The answer panel always reserves its own space. Before reveal, it provides one quiet prompt with no answer leakage. After reveal, it switches to a solid, teal-tinted answer treatment. Its size and layout must avoid moving the controls into a collision.

The Number Line stays in its own lightly tinted board. Existing exact value-to-coordinate mapping, the positive-direction arrow, origin-zero emphasis, tick labels, and letter bands remain intact. The refresh may alter only its enclosing visual treatment, not SVG math or label-placement logic.

## Responsive large-screen behavior

The target viewports are 1920×1080, 1366×768, and 1280×720.

- The lesson rail never grows beyond `280px` or consumes the main stage.
- At shorter desktop heights, secondary header information and nonessential answer explanation may reduce before question, SVG, or touch-target size is compromised.
- Controls may wrap into separate rows, but must not overlap, clip, or cause horizontal scroll.
- The existing narrow-screen fallback remains a functional safety net; it is not the design target and no mobile-first rewrite is part of this work.

## Non-goals and invariants

Do not modify:

- lesson IDs, question templates, randomization, recent-question avoidance, or exact rational-number logic;
- reveal timing or the answer content;
- SVG number-line coordinate mapping or collision-prevention behavior;
- Vite, Vitest, Playwright, GitHub Pages configuration, or production asset paths;
- the four-lesson Quick Check-only product scope.

## Files expected to change

- `src/styles.css`: design tokens, layout refinement, button system, stage, answer well, and viewport adjustments.
- `src/main.js`: at most semantic grouping markup/classes needed for the command dock and visual hierarchy. State transitions and generator calls stay unchanged.
- `src/styles.test.js`, `src/main.test.js`, and `tests/visual-layout.spec.js`: focused expectations for the revised semantic structure and responsive visual checks, only when necessary.

`src/questions.js`, `src/rational.js`, `src/number-line-svg.js`, and their tests are out of scope unless a test proves a visual integration issue.

## Verification

Run after implementation:

1. `npm test -- --run`
2. `npm run build`
3. Browser checks at 1920×1080, 1366×768, and 1280×720 for all four lessons, both difficulty states where available, Reveal, New Question, and Next.

For each viewport, verify no overlap, clipping, button collision, resource failure, or horizontal scrolling. Verify the Number Line remains readable and the answer is absent until Reveal.
