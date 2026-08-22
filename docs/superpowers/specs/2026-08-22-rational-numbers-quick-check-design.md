# Rational Numbers Classroom V2 — Quick Check Redesign

## Goal

Transform Rational Numbers Classroom V2 into a lightweight, touch-friendly classroom questioning tool. PPT owns teaching and worked examples; this site owns only a random question, teacher-led oral response, reveal, and next question. Explore mode and all electronic-textbook presentation are removed.

## Scope

The sidebar remains with four lessons: Number Line, Opposite, Absolute Value, and Comparing Rational Numbers. Selecting a lesson opens its Quick Check directly. The workspace contains only the bilingual lesson title, a large question region, an answer region that is empty until reveal, and a small lesson-specific control region.

There is no Explore/Quick Check switcher, score, leaderboard, timer, typed answer system, game mechanic, authentication, or AI-generated question content.

## Shared Quick Check shell

One application state owns `lessonId`, `question`, `revealed`, and a recent-question fingerprint history. `New Question` and `Next` generate a new lesson-appropriate question and reset `revealed` to false. `Reveal Answer` changes only `revealed`. The shell does not rebuild unrelated controls during reveal.

Question and answer text use independent flow containers. The question stage is the largest visual region. The answer region occupies a reserved, stable space so reveal does not cause button collisions or a disruptive layout shift.

## Number Line

Number Line has two question directions:

- **Number → Point:** display a target value and ask which labelled point represents it.
- **Point → Number:** display a target letter and ask for its value.

It also has **Easy** and **Challenge** difficulty controls. Easy uses integers and half-steps. Challenge uses quarter-steps as well. Values are selected from −5 through 5. A generator selects 4–7 labelled points from A through G with a minimum distance of one available step between displayed points, then selects a target point from that set. The target result is never included in the pre-reveal text.

Use SVG as the default number-line renderer. The SVG is a self-contained visual container with an accessible title and a deterministic value-to-x mapping. Tick labels, point letters, and fractional labels receive separate vertical bands; collision checks choose a lower point-label band or reject a generated point set before rendering. A separately verified existing Canvas `NumberLineEngine` may replace this SVG renderer later only if it preserves the same mapping and question interface.

The only Number Line controls are `Number → Point`, `Point → Number`, `Easy`, `Challenge`, `New Question`, `Reveal Answer`, and `Next`.

## Opposite

Opposite has one template family: simplify nested sign and parenthesis expressions. Parameters vary a signed integer, simple decimal, or simple fraction; the sign sequence; and parenthesis depth. The evaluator uses exact signed rational values, never floating-point formatting. Reveal presents only a concise final result. Its only controls are `New Question`, `Reveal Answer`, and `Next`.

## Absolute Value

Absolute Value has one template family: simplify an absolute-value expression mixed with outer signs. The generator creates one- or two-step classroom-friendly expressions, evaluates inside the absolute-value bars first, takes the non-negative absolute value, then applies the outer sign. Reveal presents a concise result. Its only controls are `New Question`, `Reveal Answer`, and `Next`.

## Comparing Rational Numbers

Comparing Rational Numbers has one template family: simplify and compare two rational values or simple expressions. Each side needs at most one or two mental steps. Reveal shows each simplified side and the final relation (`<`, `>`, or `=`). Its only controls are `New Question`, `Reveal Answer`, and `Next`.

## Generators and mathematical correctness

All questions come from local JavaScript templates with randomized, bounded parameters; no runtime AI call occurs. A shared rational-number utility represents a value as normalized integer numerator and positive denominator, and provides exact negation, absolute value, comparison, equality, and display formatting. Decimal inputs are generated only when they have an exact finite rational representation.

Each generator returns a `Question` object containing public prompt data, exact answer data, a renderable answer explanation, and a stable fingerprint. The central generator retries bounded random parameter choices when its fingerprint occurs in the recent history, avoiding immediate exact repetition without making question selection non-terminating.

## Large-screen layout and acceptance

Use Grid and Flexbox for all ordinary layout. The SVG number line, question, answer, and controls remain distinct containers. Keep large question and formula type, at least 52px touch targets, and ample whitespace. Do not use ordinary-content absolute positioning.

Validate 1920×1080, 1366×768, and 1280×720 through browser interaction and screenshots. For every lesson and control state, verify no overlap, clipping, button collision, horizontal scroll, or stage crowding. Verify Reveal hides every answer before activation and that all randomly generated mathematical answers are exact.
