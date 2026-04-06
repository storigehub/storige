# Midnight Archive Design System

### 1. Overview & Creative North Star
**Creative North Star: The Modern Chronicler**
Midnight Archive is a design system built for the digital equivalent of a high-end physical journal. It rejects the "app-like" rigidity of standard Material Design in favor of an editorial, curated aesthetic. The system emphasizes intentional asymmetry, high-contrast typography, and a "living" archive feel where white space is treated as a premium material. By combining a stark monochrome foundation with deep cobalt accents, it bridges the gap between brutalist architecture and soft, personal reflection.

### 2. Colors
The palette is rooted in a high-fidelity neutral scale, utilizing deep blacks and varying shades of off-white to create a sophisticated, quiet environment.

*   **Primary (Archival Black):** Used for core branding and high-emphasis headlines.
*   **Secondary (Cobalt Reflection):** `#0061A5`. Reserved for interactive states, key highlights, and moments of discovery.
*   **Neutral (Parchment & Fog):** A tiered system of light grays (`#F9F9F9` to `#E2E2E2`) used to define the spatial environment.

**The "No-Line" Rule:**
Avoid 1px solid borders for sectioning. Use background shifts (e.g., transitioning from `surface_container_lowest` to `surface_container_low`) to define regions. Borders, when used, must be at 30% opacity or less and serve as subtle guides rather than hard dividers.

**Glass & Gradient Rule:**
Floating headers and navigation bars must utilize a `backdrop-blur` (20px+) with an 80% opacity fill to create a sense of persistent depth. Use subtle upward-fading gradients (Black to Transparent) over imagery to ensure text legibility.

### 3. Typography
The system uses a variable-width sans-serif scale that emphasizes vertical rhythm and character spacing.

*   **Display / Headline:** High weight (Extrabold), tracking-tight for impact.
*   **Body:** Regular weight, leading-relaxed for long-form readability.
*   **Label:** Uppercase, tracking-widest (0.2em), 10px-12px size for metadata.

**Font Scale Ground Truth:**
*   **Hero Headlines:** 2.25rem (36px) to 3rem (48px) - Extrabold.
*   **Section Headers:** 1.5rem (24px) to 1.875rem (30px).
*   **Body Text:** 1rem (16px) - Base.
*   **Small/UI Labels:** 10px to 14px.

### 4. Elevation & Depth
Depth is communicated through **Tonal Layering** and specific shadow classes.

*   **Surface Hierarchy:**
    *   `surface_container_lowest` (#FFFFFF): Used for the primary active content card.
    *   `surface_container_low` (#F3F3F3): Used for background secondary actions and list items.
*   **Elevation Scale:**
    *   **Level 1 (Shadow-sm):** Used for cards to provide a subtle "lift" from the page.
    *   **Level 2 (Shadow-lg):** Used for featured items and imagery.
    *   **Level 3 (Shadow-2xl):** Reserved for Floating Action Buttons (FAB) and modal overlays.
*   **The Ghost Border:** If a boundary is strictly required, use `outline_variant` at 0.125rem thickness with reduced opacity.

### 5. Components
*   **Buttons:** Rectangular with very subtle rounding (0.125rem). Primary buttons use high-contrast fills; secondary buttons use ghost styles with tonal hover states.
*   **Tabs:** Indicated by a 2px solid `secondary` underline and a shift to bold weight. No background boxing.
*   **Cards:** Two types—Minimal Text (tonal background) and Visual Media (full-bleed imagery with glass-morphic labels).
*   **FAB:** Large (16x16 / 64px), circular, high-elevation (`shadow-2xl`), utilizing the `secondary` cobalt color.
*   **Inputs:** Underlined or ghost-styled to maintain the "No-Line" rule. Focus states utilize a soft glow rather than a thick border.

### 6. Do's and Don'ts
**Do:**
*   Use asymmetric layouts (e.g., date on the left, content on the right with different margins).
*   Use uppercase tracking for all metadata labels.
*   Leverage wide gutters (spacing: 3) to allow content to "breathe".

**Don't:**
*   Use fully opaque headers; always apply backdrop blurs.
*   Use high-saturation primary colors; stick to the Cobalt and Neutral palette.
*   Apply heavy rounding to standard cards; keep the aesthetic architectural and sharp.