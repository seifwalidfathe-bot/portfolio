# Global Development & Design Rules

## Mandatory Frontend & Web Development Standard

Whenever creating, modifying, designing, or reviewing ANY website, landing page, web application, portfolio, or UI frontend, you MUST automatically apply the following three specialized skills and standards:

---

### 1. `taste-skill` / `design-taste-frontend` (Frontend Craft & Anti-Slop Standard)
- **Zero AI Slop**: Absolutely no generic AI aesthetic tropes (e.g. purple/neon gradient soups on generic dark backgrounds, blurry ambient blobs without structure, low-contrast text, fake generic metrics strips).
- **Art Direction & Personality**: Choose a clear, intentional design direction suited to the product (e.g. brutalist, minimalist, high-density telemetry, warm editorial, tactile paper).
- **Typography Craft**: Pair deliberate typefaces (e.g. high-readability grotesque/sans paired with monospace telemetry or an editorial serif). Avoid unconsidered default fonts.
- **Micro-Interactions & Motion**: Implement measured entrance animations (e.g. staggered hero entrance) and genuine, working interactive elements (e.g. live simulators, interactive shell terminals, command palettes `Cmd+K`), never fake non-functional mockups.
- **Responsive Finish Gate**: Every page must have clean mobile navigation (drawer/sheet), touch targets $\ge 44\text{px}$, and zero horizontal overflow.
- **Automated Verification**: Run `node ~/.agents/skills/design-taste-frontend/scripts/copy-lint.mjs <file>` before finalizing to ensure 0 errors and 0 warnings.

---

### 2. `awesome-design-md` (World-Class Design Systems)
- **Concrete Design System**: Never invent arbitrary colors or layout tokens from scratch. Always adopt or reference an established spec from the 84 world-class design systems catalog (`~/.agents/skills/awesome-design-md/specs/` or project `DESIGN.md`), such as:
  - **Linear** (High-craft dark theme, `#010102` canvas, `#5e6ad2` accents, hairline `#23252a` borders)
  - **Apple** (Fluid typography, subtle frosted blurs, clean spatial rhythm)
  - **Stripe** (Refined financial clarity, vivid gradients with crisp borders, tabular data)
  - **Notion** (Tactile monochrome, paper feel, serif accents)
  - **Vercel / Raycast / Supabase** (Precision monochrome, high density, dark craft)
- Match the exact tokens: background canvas, surface elevation, hairline border weights, and border-radius hierarchy.

---

### 3. `humanizer` (Anti-AI Copywriting & Tone)
- **Human Voice**: Write all copy so it sounds like an authentic human practitioner wrote it.
- **Zero AI Cliches**: Ban all AI tells and corporate buzzwords:
  - Banned words: *passionate, seamless, elevate, cutting-edge, revolutionize, game-changer, unleash, delve, robust, holistic, beacon*.
  - Banned patterns: "It's not X, it's Y" reveals; forced three-part lists; one-line dramatic closures; hollow corporate claims.
- **Grounded Facts**: Replace vague assertions with concrete specifics, verified metrics, tools used, and architecture details.
- **Arabic Localization Standard**:
  - When writing Arabic web copy, use authentic, smart Egyptian tech colloquial ("عامية مصرية تقنية") by default, unless the user explicitly requests Classical Arabic ("فصحى").
  - Technical terms, framework names, and stack technologies remain in English.
  - Page footers remain strictly in English (`dir="ltr"`) unless explicitly requested otherwise.
