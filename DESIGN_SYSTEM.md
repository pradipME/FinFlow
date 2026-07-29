# FinFlow — Design System Architecture

**Document Classification:** Confidential — Design & Engineering Review
**Version:** 1.0.0
**Status:** Draft for Review
**Last Updated:** July 2026
**Design Language:** FinFlow Design Language (FDL)

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Brand Personality](#2-brand-personality)
3. [Visual Identity](#3-visual-identity)
4. [Design Principles](#4-design-principles)
5. [Design Tokens](#5-design-tokens)
6. [Color System](#6-color-system)
7. [Typography](#7-typography)
8. [Layout System](#8-layout-system)
9. [Component Standards](#9-component-standards)
10. [Motion System](#10-motion-system)
11. [Iconography](#11-iconography)
12. [Accessibility Standards](#12-accessibility-standards)
13. [Responsive Design Standards](#13-responsive-design-standards)
14. [Theme Engine](#14-theme-engine)
15. [Design Governance](#15-design-governance)

---

## 1. Design Philosophy

### 1.1 What is FinFlow Design Language?

The FinFlow Design Language (FDL) is an original enterprise fintech design system built on a single conviction: **money is personal, and the design of financial tools must honor that truth.**

FDL is not derived from any existing design system. It is not a reskinned Material Design, a recolored Bootstrap, or a restyled Ant Design. It is an original design language conceived from first principles — designed specifically for the unique demands of a digital banking platform where trust, clarity, and precision are not aesthetic preferences but functional requirements.

### 1.2 The Design Gap

Every existing design system was born from a general-purpose context:

- **Material Design** was designed for Google's ecosystem — search, maps, YouTube. Its depth metaphors (elevation, shadows) suit content consumption, not financial management.
- **Ant Design** was designed for enterprise data-heavy applications — admin panels, CRUD interfaces. Its density suits operational tools, not consumer banking.
- **Bootstrap** was designed for web pages. Its grid-first approach predates the component-driven era.
- **Apple's HIG** is proprietary and device-specific. Its patterns are optimized for native iOS/macOS, not cross-platform web banking.

None of these systems were designed with the specific cognitive demands of financial decision-making in mind: the anxiety of a transfer, the precision of a balance, the urgency of a fraud alert, the satisfaction of a savings milestone.

**FDL was designed for these moments.**

### 1.3 Three Pillars

FDL rests on three pillars:

#### Clarity Over Decoration

Every visual element serves a purpose. If a shadow exists, it communicates depth hierarchy. If a color exists, it communicates status or action. If animation exists, it communicates state change or provides spatial context. Decoration for its own sake — gradients without meaning, shadows without hierarchy, animation without feedback — is prohibited.

#### Trust Through Consistency

Financial trust is built through repeated, predictable experiences. Every button behaves the same way. Every error looks the same way. Every success feels the same way. Consistency is not monotony — it is the foundation of user confidence. When a user learns how one part of FinFlow works, they have learned how all of it works.

#### Precision in Every Pixel

A balance of $12,345.67 is not just a number — it is a fact that someone depends on. The design system treats financial data with the same precision the backend treats it: no rounding, no approximation, no ambiguity. Typography, spacing, and alignment are engineered to make financial data unmistakable.

### 1.4 What FDL Is Not

| FDL Is | FDL Is Not |
|---|---|
| A system for financial precision | A general-purpose UI kit |
| Original and purpose-built | A reskin of Material/Ant/Bootstrap |
| Trust-centered | Attention-maximizing |
| Calm and precise | Loud and promotional |
| Accessible by default | Accessible as an afterthought |
| Dark-mode-first | Light-mode-with-dark-option |

---

## 2. Brand Personality

### 2.1 Personality Spectrum

FinFlow's design personality sits at a specific intersection:

```
Calm ━━━━━━━━━━━━━━●━━━━━━━━━━━━ Energetic
Precise ━━━━━━━━━━━●━━━━━━━━━━━━ Expressive
Warm ━━━━━━━━━━━━━━●━━━━━━━━━━━━ Technical
Minimal ━━━━━━━━●━━━━━━━━━━━━━━━ Rich
Premium ━━━━━━━━●━━━━━━━━━━━━━━━ Accessible
```

### 2.2 Personality Attributes

**Calm** — FinFlow does not shout. It does not use urgency colors for non-urgent actions. It does not flash notifications aggressively. It presents information calmly, allowing the user to process financial data without anxiety.

**Precise** — Every element is exact. Numbers are right-aligned. Decimal points align. Currency symbols are consistent. Spacing follows a mathematical scale. Precision communicates competence.

**Warm** — Despite the precision, FinFlow is not cold. Warm neutrals, generous whitespace, and human-centered microcopy create a feeling of care. The app feels like it was designed by people who understand that money is emotional.

**Minimal** — Every element earns its place. If removing an element does not reduce clarity, it should be removed. Density is avoided unless the context demands it (admin dashboards, data tables).

**Premium** — FinFlow feels expensive without being exclusive. The design communicates quality through restraint, not through opulence. Think: a well-designed watch, not a diamond-encrusted one.

### 2.3 Voice in Design

| Context | Design Voice |
|---|---|
| **Success** | Quiet satisfaction — green checkmark, subtle animation, brief confirmation |
| **Error** | Clear and calm — red indicator, plain language, specific recovery action |
| **Warning** | Attentive — amber highlight, contextual explanation, suggested action |
| **Loading** | Patient — skeleton screens, not spinners; content shape visible during load |
| **Empty** | Encouraging — helpful illustration, clear call to action, no blame |
| **Financial data** | Authoritative — right-aligned, monospaced digits, no ambiguity |

---

## 3. Visual Identity

### 3.1 Logo Principles

The FinFlow wordmark is the primary brand identifier. It uses a custom geometric sans-serif typeface with a distinctive ligature between the "n" and "F" that creates a visual flow — representing the seamless movement of money.

**Logo usage rules:**
- Minimum clear space: 1.5x the height of the "F" on all sides
- Minimum size: 24px height for digital, 12mm for print
- Never recolored beyond the defined color variants
- Never placed on busy backgrounds without sufficient contrast
- Never animated, rotated, or distorted

### 3.2 Color Associations

| Brand Color | Hex (Light) | Hex (Dark) | Usage |
|---|---|---|---|
| **FinFlow Primary** | `#0052FF` | `#4D8AFF` | Primary actions, links, active states |
| **FinFlow Secondary** | `#7C3AED` | `#A78BFA` | Accent, highlights, premium indicators |
| **FinFlow Tertiary** | `#0EA5E9` | `#38BDF8` | Informational, data visualization |

### 3.3 Photography Style

Photography, when used (marketing, onboarding), follows:
- Natural lighting, warm tones
- Diverse, authentic people in real contexts
- No stock-photo aesthetics (no handshakes, no glass buildings)
- Shallow depth of field, soft backgrounds
- Color-graded to match the design system's warm neutral palette

### 3.4 Illustration Style

Illustrations are used for empty states, onboarding, and error pages:
- Geometric, abstract style (not cartoonish)
- Limited color palette (brand colors + neutrals)
- Simple shapes, generous whitespace
- Consistent stroke width (2px at standard size)
- Accessible: all illustrations have meaningful alt text

---

## 4. Design Principles

### Principle 1: Financial Data is Sacred

**Statement:** Financial numbers are treated with the same respect as the user's trust. They are never truncated, never approximated, never displayed ambiguously.

**Application:**
- Balances always show exact cents ($1,234.56, never $1,234.5 or ~$1,235)
- Numbers are right-aligned so decimal points align in columns
- Large numbers use comma separators (1,234,567.89)
- Currency symbols are consistently positioned (before the number, no space: $1,234.56)
- Negative amounts use a minus sign and danger color, not parentheses or red alone

### Principle 2: Progressive Disclosure

**Statement:** Show only what the user needs right now. Reveal complexity on demand.

**Application:**
- Dashboard shows summary, not detail. Detail is one tap away.
- Transaction rows show amount, merchant, and date. Full metadata is behind a tap.
- Transfer form starts simple. Advanced options (FX, recurring) are behind "More options."
- Settings pages group related options with collapsible sections.

### Principle 3: Feedback is Immediate

**Statement:** Every user action receives visual feedback within 100ms. Every system response is communicated within 1 second.

**Application:**
- Button press: visual state change within 50ms (scale, color)
- Form submission: loading state within 100ms
- API response: data or error displayed within the response time
- Transfer success: confirmation animation within 200ms of server confirmation

### Principle 4: Errors are Teachers

**Statement:** Error messages explain what happened and what to do next. They never blame the user. They never expose system internals.

**Application:**
- "Insufficient balance" not "Error: BALANCE_LOW"
- "This card is frozen. Unfreeze it in Card Settings." not "Card declined"
- "Please enter a valid email address" not "Invalid input"
- Every error has a recovery action (button, link, or instruction)

### Principle 5: Motion Communicates Meaning

**Statement:** Animation is not decoration. It communicates state change, spatial relationships, and causality.

**Application:**
- A success animation confirms a completed transfer (causality)
- A skeleton screen shows content shape before it loads (spatial context)
- A card flip reveals card details (progressive disclosure)
- Number counting animation communicates calculation (process transparency)

### Principle 6: Dark Mode is Primary

**Statement:** The dark theme is not an afterthought — it is designed first. Light mode is the alternative, not the default.

**Application:**
- Dark theme designed first for every component
- Light theme adapted from dark (not the reverse)
- AMOLED theme available for battery optimization
- System preference respected, user override respected

### Principle 7: Every Interaction is Tested

**Statement:** If a user cannot complete an interaction using only a keyboard and screen reader, the interaction is incomplete.

**Application:**
- All interactive elements are keyboard-reachable
- Focus indicators are always visible (never `outline: none`)
- ARIA labels on all non-text interactive elements
- Color is never the sole indicator of state or meaning

---

## 5. Design Tokens

### 5.1 Token Architecture

Design tokens are the atomic building blocks of the visual language. Every visual decision is expressed as a token, never as a raw value.

**Three-tier token hierarchy:**

```
Primitive Tokens → Semantic Tokens → Component Tokens

Example:
  blue-600 (#2563EB) → color-primary (#2563EB) → button-primary-bg (#2563EB)
  gray-900 (#111827) → color-bg-primary (#111827) → sidebar-bg (#111827)
```

**Primitive tokens** are raw values (exact colors, exact sizes). They are never used directly by components.

**Semantic tokens** express intent (primary, danger, muted). Components reference semantic tokens.

**Component tokens** are component-specific aliases. They provide a final layer of indirection for component-level overrides.

### 5.2 Color Tokens

#### Primitives — Gray Scale

| Token | Value | Usage |
|---|---|---|
| `gray-25` | `#FCFCFD` | Lightest background tint |
| `gray-50` | `#F9FAFB` | Light background |
| `gray-100` | `#F3F4F6` | Subtle background, hover states |
| `gray-200` | `#E5E7EB` | Borders, dividers |
| `gray-300` | `#D1D5DB` | Disabled text, placeholder |
| `gray-400` | `#9CA3AF` | Placeholder text, icons |
| `gray-500` | `#6B7280` | Secondary text, labels |
| `gray-600` | `#4B5563` | Body text (secondary) |
| `gray-700` | `#374151` | Body text (primary on light) |
| `gray-800` | `#1F2937` | Headings (on light) |
| `gray-900` | `#111827` | Primary text (on light) |
| `gray-950` | `#030712` | Deepest black |

#### Primitives — Blue Scale

| Token | Value | Usage |
|---|---|---|
| `blue-50` | `#EFF6FF` | Light blue tint |
| `blue-100` | `#DBEAFE` | Light blue background |
| `blue-200` | `#BFDBFE` | Light blue border |
| `blue-300` | `#93C5FD` | Light blue text |
| `blue-400` | `#60A5FA` | Medium blue |
| `blue-500` | `#3B82F6` | Default blue |
| `blue-600` | `#2563EB` | **Primary (Light)** |
| `blue-700` | `#1D4ED8` | Primary hover (Light) |
| `blue-800` | `#1E40AF` | Primary active (Light) |
| `blue-900` | `#1E3A8A` | Deep blue |

#### Primitives — Green Scale

| Token | Value | Usage |
|---|---|---|
| `green-50` | `#F0FDF4` | Light green tint |
| `green-100` | `#DCFCE7` | Light green background |
| `green-200` | `#BBF7D0` | Light green border |
| `green-300` | `#86EFAC` | Light green |
| `green-400` | `#4ADE80` | Medium green |
| `green-500` | `#22C55E` | Default green |
| `green-600` | `#16A34A` | **Success (Light)** |
| `green-700` | `#15803D` | Success hover (Light) |
| `green-800` | `#166534` | Deep green |
| `green-900` | `#14532D` | Deepest green |

#### Primitives — Amber Scale

| Token | Value | Usage |
|---|---|---|
| `amber-50` | `#FFFBEB` | Light amber tint |
| `amber-100` | `#FEF3C7` | Light amber background |
| `amber-200` | `#FDE68A` | Light amber border |
| `amber-300` | `#FCD34D` | Light amber |
| `amber-400` | `#FBBF24` | Medium amber |
| `amber-500` | `#F59E0B` | Default amber |
| `amber-600` | `#D97706` | **Warning (Light)** |
| `amber-700` | `#B45309` | Warning hover (Light) |
| `amber-800` | `#92400E` | Deep amber |
| `amber-900` | `#78350F` | Deepest amber |

#### Primitives — Red Scale

| Token | Value | Usage |
|---|---|---|
| `red-50` | `#FEF2F2` | Light red tint |
| `red-100` | `#FEE2E2` | Light red background |
| `red-200` | `#FECACA` | Light red border |
| `red-300` | `#FCA5A5` | Light red |
| `red-400` | `#F87171` | Medium red |
| `red-500` | `#EF4444` | Default red |
| `red-600` | `#DC2626` | **Danger (Light)** |
| `red-700` | `#B91C1C` | Danger hover (Light) |
| `red-800` | `#991B1B` | Deep red |
| `red-900` | `#7F1D1D` | Deepest red |

#### Primitives — Purple Scale

| Token | Value | Usage |
|---|---|---|
| `purple-50` | `#FAF5FF` | Light purple tint |
| `purple-100` | `#F3E8FF` | Light purple background |
| `purple-200` | `#E9D5FF` | Light purple border |
| `purple-300` | `#D8B4FE` | Light purple |
| `purple-400` | `#C084FC` | Medium purple |
| `purple-500` | `#A855F7` | Default purple |
| `purple-600` | `#9333EA` | **Secondary (Light)** |
| `purple-700` | `#7E22CE` | Secondary hover (Light) |
| `purple-800` | `#6B21A8` | Deep purple |
| `purple-900` | `#581C87` | Deepest purple |

#### Primitives — Cyan Scale

| Token | Value | Usage |
|---|---|---|
| `cyan-50` | `#ECFEFF` | Light cyan tint |
| `cyan-100` | `#CFFAFE` | Light cyan background |
| `cyan-200` | `#A5F3FC` | Light cyan border |
| `cyan-300` | `#67E8F9` | Light cyan |
| `cyan-400` | `#22D3EE` | Medium cyan |
| `cyan-500` | `#06B6D4` | Default cyan |
| `cyan-600` | `#0891B2` | **Tertiary (Light)** |
| `cyan-700` | `#0E7490` | Tertiary hover (Light) |
| `cyan-800` | `#155E75` | Deep cyan |
| `cyan-900` | `#164E63` | Deepest cyan |

### 5.3 Spacing Scale

Based on a 4px base unit:

| Token | Value | Usage |
|---|---|---|
| `space-0` | `0px` | No spacing |
| `space-px` | `1px` | Hairline borders |
| `space-0.5` | `2px` | Tight internal padding |
| `space-1` | `4px` | Minimal gap |
| `space-1.5` | `6px` | Small internal padding |
| `space-2` | `8px` | Default small gap |
| `space-2.5` | `10px` | Default internal padding |
| `space-3` | `12px` | Standard internal padding |
| `space-3.5` | `14px` | Medium internal padding |
| `space-4` | `16px` | Standard gap, card padding |
| `space-5` | `20px` | Medium gap |
| `space-6` | `24px` | Section padding, card gap |
| `space-7` | `28px` | Large gap |
| `space-8` | `32px` | Section spacing |
| `space-9` | `36px` | Large section spacing |
| `space-10` | `40px` | Extra large gap |
| `space-12` | `48px` | Major section spacing |
| `space-14` | `56px` | Page-level spacing |
| `space-16` | `64px` | Hero spacing |
| `space-20` | `80px` | Maximum spacing |
| `space-24` | `96px` | Page margins (large screens) |

### 5.4 Border Radius Scale

| Token | Value | Usage |
|---|---|---|
| `radius-none` | `0px` | No rounding |
| `radius-xs` | `2px` | Subtle rounding (tags, badges) |
| `radius-sm` | `4px` | Small elements (inputs, buttons) |
| `radius-md` | `6px` | Medium elements (cards, dropdowns) |
| `radius-lg` | `8px` | Large elements (modals, panels) |
| `radius-xl` | `12px` | Extra large (feature cards, hero sections) |
| `radius-2xl` | `16px` | Maximum rounding for rectangular elements |
| `radius-3xl` | `24px` | Avatars, circular elements |
| `radius-full` | `9999px` | Pills, circles |

### 5.5 Elevation Scale

| Token | Value | Usage |
|---|---|---|
| `elevation-none` | none | Flat elements |
| `elevation-xs` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift (cards at rest) |
| `elevation-sm` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Card hover |
| `elevation-md` | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)` | Dropdowns, popovers |
| `elevation-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Modals, drawers |
| `elevation-xl` | `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)` | Floating panels |
| `elevation-2xl` | `0 25px 50px rgba(0,0,0,0.25)` | Top-level overlays |

### 5.6 Shadow Scale

| Token | Value | Usage |
|---|---|---|
| `shadow-sm` | See elevation-xs | Subtle definition |
| `shadow-md` | See elevation-md | Component lift |
| `shadow-lg` | See elevation-lg | Panel float |
| `shadow-inner` | `inset 0 2px 4px rgba(0,0,0,0.06)` | Input focus, inset states |
| `shadow-glow-primary` | `0 0 20px rgba(37,99,235,0.3)` | Primary action focus ring |
| `shadow-glow-success` | `0 0 20px rgba(22,163,74,0.3)` | Success confirmation |
| `shadow-glow-danger` | `0 0 20px rgba(220,38,38,0.3)` | Error emphasis |

### 5.7 Opacity Scale

| Token | Value | Usage |
|---|---|---|
| `opacity-0` | `0` | Fully hidden |
| `opacity-5` | `0.05` | Subtle overlay |
| `opacity-10` | `0.10` | Background tint |
| `opacity-20` | `0.20` | Disabled state overlay |
| `opacity-40` | `0.40` | Disabled text |
| `opacity-50` | `0.50` | Half opacity (skeleton) |
| `opacity-60` | `0.60` | Secondary text |
| `opacity-80` | `0.80` | Primary text on dark |
| `opacity-90` | `0.90` | Near-full opacity |
| `opacity-100` | `1.00` | Full opacity |

### 5.8 Blur Scale

| Token | Value | Usage |
|---|---|---|
| `blur-none` | `0` | No blur |
| `blur-sm` | `4px` | Subtle frosted effect |
| `blur-md` | `8px` | Glass morphism background |
| `blur-lg` | `16px` | Modal backdrop, drawer backdrop |
| `blur-xl` | `24px` | Heavy frosted glass |
| `blur-2xl` | `40px` | Full backdrop blur |

### 5.9 Motion Tokens

#### Duration Scale

| Token | Value | Usage |
|---|---|---|
| `duration-instant` | `0ms` | Immediate state changes |
| `duration-fastest` | `50ms` | Micro-interactions (button press) |
| `duration-faster` | `100ms` | Hover transitions, focus rings |
| `duration-fast` | `150ms` | Small element transitions |
| `duration-normal` | `200ms` | Standard transitions (color, opacity) |
| `duration-moderate` | `300ms` | Medium transitions (slide, expand) |
| `duration-slow` | `400ms` | Large transitions (modal, drawer) |
| `duration-slower` | `500ms` | Page transitions, complex animations |
| `duration-slowest` | `700ms` | Maximum duration (celebration animations) |

#### Easing Curves

| Token | Value | Usage |
|---|---|---|
| `ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General transitions |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exiting elements |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Entering elements |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Element position changes |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy, playful feedback |
| `ease-spring-soft` | `cubic-bezier(0.22, 1.0, 0.36, 1.0)` | Subtle spring |
| `ease-sharp` | `cubic-bezier(0.4, 0, 0.6, 1)` | Quick, precise movements |

### 5.10 Z-Index Scale

| Token | Value | Usage |
|---|---|---|
| `z-base` | `0` | Default stacking |
| `z-raised` | `1` | Slightly above siblings |
| `z-dropdown` | `10` | Dropdowns, popovers |
| `z-sticky` | `20` | Sticky headers, navigation |
| `z-overlay` | `30` | Modal backdrops, drawer backdrops |
| `z-modal` | `40` | Modals, dialogs |
| `z-popover` | `50` | Tooltips, popovers on modals |
| `z-toast` | `60` | Toast notifications |
| `z-tooltip` | `70` | Tooltips (highest) |
| `z-max` | `9999` | Maximum (debug only) |

### 5.11 Breakpoints

| Token | Value | Target |
|---|---|---|
| `bp-xs` | `0px` | Small phones |
| `bp-sm` | `640px` | Large phones / small tablets |
| `bp-md` | `768px` | Tablets (portrait) |
| `bp-lg` | `1024px` | Tablets (landscape) / small laptops |
| `bp-xl` | `1280px` | Laptops / desktops |
| `bp-2xl` | `1536px` | Large desktops |
| `bp-3xl` | `1920px` | Ultra-wide displays |

### 5.12 Container Widths

| Token | Value | Usage |
|---|---|---|
| `container-sm` | `640px` | Single-column content |
| `container-md` | `768px` | Narrow content (settings) |
| `container-lg` | `1024px` | Standard content |
| `container-xl` | `1280px` | Wide content (dashboards) |
| `container-2xl` | `1440px` | Maximum content width |
| `container-full` | `100%` | Full-width (admin tables) |

### 5.13 Component Size Tokens

#### Icon Sizes

| Token | Value | Usage |
|---|---|---|
| `icon-xs` | `12px` | Inline indicators, badges |
| `icon-sm` | `16px` | Button icons (small), inline text icons |
| `icon-md` | `20px` | Button icons (default), navigation icons |
| `icon-lg` | `24px` | Feature icons, section headers |
| `icon-xl` | `32px` | Dashboard widgets, empty states |
| `icon-2xl` | `48px` | Hero icons, onboarding |

#### Avatar Sizes

| Token | Value | Usage |
|---|---|---|
| `avatar-xs` | `24px` | Inline mentions, compact lists |
| `avatar-sm` | `32px` | Comment authors, list items |
| `avatar-md` | `40px` | User cards, settings |
| `avatar-lg` | `48px` | Profile pages, member lists |
| `avatar-xl` | `64px` | Profile headers, hero sections |
| `avatar-2xl` | `96px` | Profile settings, account pages |
| `avatar-3xl` | `128px` | Avatar upload preview |

#### Button Sizes

| Token | Height | Padding | Font Size | Usage |
|---|---|---|---|---|
| `btn-xs` | `24px` | `0 8px` | `12px` | Inline actions, tight spaces |
| `btn-sm` | `32px` | `0 12px` | `13px` | Secondary actions, table rows |
| `btn-md` | `40px` | `0 16px` | `14px` | **Default** — standard actions |
| `btn-lg` | `48px` | `0 24px` | `16px` | Primary actions, form submissions |
| `btn-xl` | `56px` | `0 32px` | `18px` | Hero CTAs, onboarding |

#### Input Sizes

| Token | Height | Padding | Font Size | Usage |
|---|---|---|---|---|
| `input-xs` | `28px` | `0 8px` | `12px` | Inline editing |
| `input-sm` | `32px` | `0 10px` | `13px` | Compact forms (admin) |
| `input-md` | `40px` | `0 12px` | `14px` | **Default** — standard forms |
| `input-lg` | `48px` | `0 16px` | `16px` | Prominent inputs (login, search) |

### 5.14 Chart Colors

For data visualization, a 12-color palette designed for maximum distinguishability:

| Token | Hex | Usage |
|---|---|---|
| `chart-1` | `#2563EB` | Primary series (blue) |
| `chart-2` | `#7C3AED` | Secondary series (purple) |
| `chart-3` | `#059669` | Tertiary series (green) |
| `chart-4` | `#D97706` | Quaternary series (amber) |
| `chart-5` | `#DC2626` | Fifth series (red) |
| `chart-6` | `#0891B2` | Sixth series (cyan) |
| `chart-7` | `#DB2777` | Seventh series (pink) |
| `chart-8` | `#4F46E5` | Eighth series (indigo) |
| `chart-9` | `#059669` | Ninth series (emerald) |
| `chart-10` | `#EA580C` | Tenth series (orange) |
| `chart-11` | `#7C2D12` | Eleventh series (brown) |
| `chart-12` | `#64748B` | Twelfth series (slate) |

**Chart color rules:**
- Colors are ordered by data importance (most important = chart-1)
- Sequential data uses a single-hue gradient (chart-1 lightness scale)
- Categorical data uses the full palette
- Colors are distinguishable in both light and dark themes
- Colorblind-safe: verify against deuteranopia, protanopia, and tritanopia simulators

### 5.15 Financial Status Colors

| Status | Light | Dark | Usage |
|---|---|---|---|
| **Credit (Money In)** | `#16A34A` | `#4ADE80` | Deposits, refunds, credits |
| **Debit (Money Out)** | `#DC2626` | `#F87171` | Payments, transfers out, fees |
| **Pending** | `#D97706` | `#FBBF24` | Processing transactions |
| **Held** | `#9333EA` | `#C084FC` | Funds on hold |
| **Failed** | `#DC2626` | `#F87171` | Failed transactions |
| **Reversed** | `#6B7280` | `#9CA3AF` | Reversed/refunded |
| **Scheduled** | `#0891B2` | `#22D3EE` | Future-dated transfers |
| **Settled** | `#16A34A` | `#4ADE80` | Completed settlements |

---

## 6. Color System

### 6.1 Light Theme

The light theme uses a warm white background with subtle gray surfaces:

| Token | Hex | Usage |
|---|---|---|
| `bg-primary` | `#FFFFFF` | Main background |
| `bg-secondary` | `#F9FAFB` | Secondary background |
| `bg-tertiary` | `#F3F4F6` | Tertiary background |
| `bg-inverse` | `#111827` | Inverted background |
| `surface-primary` | `#FFFFFF` | Card background |
| `surface-secondary` | `#F9FAFB` | Raised surface |
| `surface-tertiary` | `#F3F4F6` | Inset surface |
| `surface-hover` | `#F3F4F6` | Hover background |
| `surface-active` | `#E5E7EB` | Active/pressed background |
| `border-default` | `#E5E7EB` | Standard borders |
| `border-subtle` | `#F3F4F6` | Subtle dividers |
| `border-strong` | `#D1D5DB` | Emphasized borders |
| `text-primary` | `#111827` | Primary text |
| `text-secondary` | `#4B5563` | Secondary text |
| `text-tertiary` | `#6B7280` | Tertiary text |
| `text-inverse` | `#FFFFFF` | Text on dark backgrounds |
| `text-disabled` | `#9CA3AF` | Disabled text |
| `color-primary` | `#2563EB` | Primary actions |
| `color-primary-hover` | `#1D4ED8` | Primary hover |
| `color-primary-active` | `#1E40AF` | Primary active |
| `color-primary-subtle` | `#EFF6FF` | Primary tint background |
| `color-success` | `#16A34A` | Success states |
| `color-warning` | `#D97706` | Warning states |
| `color-danger` | `#DC2626` | Error states |
| `color-info` | `#0891B2` | Informational states |

### 6.2 Dark Theme

The dark theme uses deep charcoal backgrounds with elevated surfaces:

| Token | Hex | Usage |
|---|---|---|
| `bg-primary` | `#0A0A0B` | Main background |
| `bg-secondary` | `#111113` | Secondary background |
| `bg-tertiary` | `#1A1A1E` | Tertiary background |
| `bg-inverse` | `#FFFFFF` | Inverted background |
| `surface-primary` | `#141416` | Card background |
| `surface-secondary` | `#1C1C20` | Raised surface |
| `surface-tertiary` | `#232328` | Inset surface |
| `surface-hover` | `#1E1E22` | Hover background |
| `surface-active` | `#2A2A30` | Active/pressed background |
| `border-default` | `#2A2A30` | Standard borders |
| `border-subtle` | `#1E1E22` | Subtle dividers |
| `border-strong` | `#3A3A42` | Emphasized borders |
| `text-primary` | `#F0F0F3` | Primary text |
| `text-secondary` | `#A0A0AB` | Secondary text |
| `text-tertiary` | `#6E6E7A` | Tertiary text |
| `text-inverse` | `#111827` | Text on light backgrounds |
| `text-disabled` | `#4A4A55` | Disabled text |
| `color-primary` | `#4D8AFF` | Primary actions (brightened for dark) |
| `color-primary-hover` | `#6BA1FF` | Primary hover |
| `color-primary-active` | `#3D7AEE` | Primary active |
| `color-primary-subtle` | `rgba(77,138,255,0.12)` | Primary tint background |
| `color-success` | `#4ADE80` | Success states (brightened) |
| `color-warning` | `#FBBF24` | Warning states (brightened) |
| `color-danger` | `#F87171` | Error states (brightened) |
| `color-info` | `#22D3EE` | Informational states (brightened) |

### 6.3 AMOLED Theme

The AMOLED theme uses true black for OLED power savings:

| Token | Hex | Usage |
|---|---|---|
| `bg-primary` | `#000000` | Main background (true black) |
| `bg-secondary` | `#0A0A0A` | Secondary background |
| `bg-tertiary` | `#141414` | Tertiary background |
| `surface-primary` | `#0D0D0D` | Card background |
| `surface-secondary` | `#161616` | Raised surface |
| `surface-tertiary` | `#1E1E1E` | Inset surface |
| `border-default` | `#222222` | Standard borders |
| `border-subtle` | `#181818` | Subtle dividers |
| `border-strong` | `#333333` | Emphasized borders |
| `text-primary` | `#F5F5F7` | Primary text (brighter for contrast) |
| `text-secondary` | `#A0A0AA` | Secondary text |
| `text-tertiary` | `#666670` | Tertiary text |

**AMOLED rules:**
- True black (#000000) used only for `bg-primary`
- Elevated surfaces use dark grays (not black) to maintain visual hierarchy
- Border contrast slightly increased for visibility against true black
- All other tokens (success, warning, danger, etc.) identical to dark theme

### 6.4 Semantic Color Mapping

| Semantic | Light | Dark | AMOLED |
|---|---|---|---|
| `color-success` | `#16A34A` | `#4ADE80` | `#4ADE80` |
| `color-success-subtle` | `#F0FDF4` | `rgba(74,222,128,0.12)` | `rgba(74,222,128,0.10)` |
| `color-warning` | `#D97706` | `#FBBF24` | `#FBBF24` |
| `color-warning-subtle` | `#FFFBEB` | `rgba(251,191,36,0.12)` | `rgba(251,191,36,0.10)` |
| `color-danger` | `#DC2626` | `#F87171` | `#F87171` |
| `color-danger-subtle` | `#FEF2F2` | `rgba(248,113,113,0.12)` | `rgba(248,113,113,0.10)` |
| `color-info` | `#0891B2` | `#22D3EE` | `#22D3EE` |
| `color-info-subtle` | `#ECFEFF` | `rgba(34,211,238,0.12)` | `rgba(34,211,238,0.10)` |

### 6.5 Glass Morphism Tokens

| Token | Light | Dark | AMOLED |
|---|---|---|---|
| `glass-bg` | `rgba(255,255,255,0.72)` | `rgba(20,20,22,0.72)` | `rgba(10,10,10,0.80)` |
| `glass-border` | `rgba(255,255,255,0.20)` | `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.06)` |
| `glass-blur` | `blur(16px)` | `blur(16px)` | `blur(20px)` |
| `glass-shadow` | `0 8px 32px rgba(0,0,0,0.08)` | `0 8px 32px rgba(0,0,0,0.40)` | `0 8px 32px rgba(0,0,0,0.60)` |

### 6.6 Gradient Tokens

| Token | Value | Usage |
|---|---|---|
| `gradient-primary` | `linear-gradient(135deg, #2563EB, #7C3AED)` | Primary buttons, hero backgrounds |
| `gradient-success` | `linear-gradient(135deg, #059669, #22C55E)` | Success states, positive indicators |
| `gradient-warm` | `linear-gradient(135deg, #F59E0B, #EF4444)` | Warning states, premium badges |
| `gradient-cool` | `linear-gradient(135deg, #06B6D4, #3B82F6)` | Informational, analytics widgets |
| `gradient-surface` | `linear-gradient(180deg, transparent, rgba(0,0,0,0.02))` | Subtle card depth |
| `gradient-glass` | `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))` | Glass morphism highlight |

### 6.7 Aurora (Premium Accent)

The Aurora palette is reserved for premium features, achievements, and celebration moments:

| Token | Value | Usage |
|---|---|---|
| `aurora-1` | `#7C3AED` | Premium badge background |
| `aurora-2` | `#A78BFA` | Premium text, borders |
| `aurora-3` | `#C4B5FD` | Premium subtle background |
| `aurora-gradient` | `linear-gradient(135deg, #7C3AED, #06B6D4, #22C55E)` | Achievement celebration, goal completion |
| `aurora-glow` | `0 0 40px rgba(124,58,237,0.3)` | Premium card glow effect |

### 6.8 Neon Accent (Future)

Reserved for future gamification and engagement features:

| Token | Value | Usage |
|---|---|---|
| `neon-blue` | `#00D4FF` | Achievement unlocked |
| `neon-green` | `#00FF94` | Streak indicator |
| `neon-purple` | `#BF5AF2` | Level-up animation |
| `neon-pink` | `#FF375F` | Special offer highlight |

---

## 7. Typography

### 7.1 Font Family

**Primary:** Inter (variable weight)
- Clean, modern, highly legible at all sizes
- Tabular figures (monospaced numbers) for financial data
- Extensive language support
- Variable font for performance (single file, all weights)

**Monospace:** JetBrains Mono
- Used for: account numbers, card numbers, API keys, code snippets
- Distinguished zero (with dot) and one (with serif) for readability
- Tabular figures by default

**Fallback stack:** `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif`

### 7.2 Heading Scale

| Token | Size | Line Height | Letter Spacing | Weight | Usage |
|---|---|---|---|---|---|
| `text-display-lg` | `48px` | `56px` | `-0.025em` | `700` | Hero headings, marketing |
| `text-display-md` | `40px` | `48px` | `-0.02em` | `700` | Section heroes |
| `text-display-sm` | `32px` | `40px` | `-0.015em` | `700` | Page titles |
| `text-heading-xl` | `28px` | `36px` | `-0.01em` | `600` | Major section headings |
| `text-heading-lg` | `24px` | `32px` | `-0.005em` | `600` | Section headings |
| `text-heading-md` | `20px` | `28px` | `0` | `600` | Subsection headings |
| `text-heading-sm` | `16px` | `24px` | `0` | `600` | Card titles, small headings |
| `text-heading-xs` | `14px` | `20px` | `0` | `600` | Label headings, table headers |

### 7.3 Body Scale

| Token | Size | Line Height | Letter Spacing | Weight | Usage |
|---|---|---|---|---|---|
| `text-body-xl` | `18px` | `28px` | `0` | `400` | Large body text |
| `text-body-lg` | `16px` | `24px` | `0` | `400` | Default body text |
| `text-body-md` | `14px` | `20px` | `0` | `400` | Secondary body text |
| `text-body-sm` | `13px` | `18px` | `0.005em` | `400` | Small body text, captions |
| `text-body-xs` | `12px` | `16px` | `0.01em` | `400` | Fine print, timestamps |

### 7.4 Financial Number Scale

| Token | Size | Font | Weight | Usage |
|---|---|---|---|---|
| `text-amount-2xl` | `32px` | Inter | `600` | Dashboard total balance |
| `text-amount-xl` | `24px` | Inter | `600` | Account balance, large amounts |
| `text-amount-lg` | `20px` | Inter | `600` | Card balance, transfer amounts |
| `text-amount-md` | `16px` | Inter | `600` | Transaction amounts |
| `text-amount-sm` | `14px` | Inter | `600` | Inline amounts, table cells |
| `text-amount-xs` | `12px` | Inter | `500` | Small amounts, fee displays |
| `text-mono-md` | `14px` | JetBrains Mono | `400` | Account numbers, card numbers |
| `text-mono-sm` | `12px` | JetBrains Mono | `400` | Masked card numbers, PAN |

### 7.5 Line Height Scale

| Token | Value | Usage |
|---|---|---|
| `leading-none` | `1` | Display numbers, single-line elements |
| `leading-tight` | `1.25` | Headings |
| `leading-snug` | `1.375` | Subheadings |
| `leading-normal` | `1.5` | Body text (default) |
| `leading-relaxed` | `1.625` | Long-form reading |
| `leading-loose` | `2` | Spacious layouts |

### 7.6 Letter Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `tracking-tighter` | `-0.025em` | Display headings |
| `tracking-tight` | `-0.015em` | Headings |
| `tracking-normal` | `0` | Body text (default) |
| `tracking-wide` | `0.01em` | Small text, captions |
| `tracking-wider` | `0.02em` | Labels, uppercase text |
| `tracking-widest` | `0.05em` | All-caps labels |

### 7.7 Font Weight Scale

| Token | Value | Usage |
|---|---|---|
| `font-regular` | `400` | Body text |
| `font-medium` | `500` | Labels, emphasis |
| `font-semibold` | `600` | Headings, strong emphasis |
| `font-bold` | `700` | Display headings, critical emphasis |

### 7.8 Financial Number Formatting Rules

**Alignment:**
- All financial numbers are right-aligned in their container
- Decimal points align vertically in columns
- Currency symbols are left-aligned to the number (no gap: $1,234.56)

**Precision:**
- Cents always shown: $1,234.56 (never $1,234.5 or ~$1,235)
- No abbreviations for financial amounts: $1,234,567.89 (never $1.2M)

**Negative:**
- Minus sign before currency symbol: -$1,234.56
- Negative amounts use danger color in addition to minus sign

**Zero:**
- Displayed as $0.00 (never blank, never "zero")

**Large numbers:**
- Comma separators: 1,234,567.89
- No space between currency symbol and number

---

## 8. Layout System

### 8.1 Grid System

**12-column grid** at all breakpoints:

| Breakpoint | Columns | Gutter | Margin |
|---|---|---|---|
| `xs` (< 640px) | 4 | 16px | 16px |
| `sm` (640px+) | 8 | 16px | 24px |
| `md` (768px+) | 12 | 16px | 24px |
| `lg` (1024px+) | 12 | 20px | 32px |
| `xl` (1280px+) | 12 | 24px | 48px |
| `2xl` (1536px+) | 12 | 24px | auto (max-width) |

### 8.2 Container Rules

- Maximum content width: `1440px`
- Centered at larger breakpoints
- Full-width on mobile (with padding)
- Content within containers never touches edges

### 8.3 Section Structure

A page is composed of sections:

```
┌─────────────────────────────────────────────┐
│  Section Header                              │
│  (Title + Description + Action)              │
├─────────────────────────────────────────────┤
│                                              │
│  Section Content                             │
│  (Grid of cards, tables, forms, etc.)        │
│                                              │
├─────────────────────────────────────────────┤
│  Section Footer (optional)                   │
│  (Pagination, "View all" link, etc.)         │
└─────────────────────────────────────────────┘
```

**Section spacing:**
- Between sections: `48px` (desktop) / `32px` (mobile)
- Section header to content: `24px`
- Section content to footer: `16px`

### 8.4 Card Layout

Cards are the primary content containers:

| Card Type | Min Width | Max Width | Padding | Gap Between Cards |
|---|---|---|---|---|
| **Stat card** | `200px` | `320px` | `20px` | `16px` |
| **Content card** | `300px` | `480px` | `24px` | `16px` |
| **Feature card** | `280px` | `400px` | `24px` | `20px` |
| **Transaction card** | `100%` | `100%` | `16px` | `1px` (border-separated) |

**Card responsive rules:**
- Below 640px: cards stack vertically (full width)
- 640px - 1024px: 2 columns
- 1024px+: 3 or 4 columns (depending on card type)

### 8.5 Sidebar + Content Layout

```
┌──────────┬────────────────────────────────────────┐
│          │  Page Header                           │
│ Sidebar  │  (Title + Actions)                     │
│ 240px    │                                        │
│          │  Page Content                          │
│          │  (Cards, Tables, Forms)                │
│          │                                        │
│          │  Page Footer (optional)                │
└──────────┴────────────────────────────────────────┘
```

**Sidebar rules:**
- Width: `240px` (expanded) / `64px` (collapsed)
- Background: `surface-primary`
- Right border: `border-default`
- Collapsible on screens < 1280px
- Always visible on screens >= 1280px

---

## 9. Component Standards

### 9.1 Buttons

**Variants:**

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| **Primary** | `color-primary` | `text-inverse` | none | Main actions (Submit, Pay, Confirm) |
| **Secondary** | transparent | `color-primary` | `color-primary` | Secondary actions (Cancel, Back) |
| **Ghost** | transparent | `text-secondary` | none | Tertiary actions (Close, Skip) |
| **Danger** | `color-danger` | `text-inverse` | none | Destructive actions (Delete, Close account) |
| **Danger Secondary** | transparent | `color-danger` | `color-danger` | Destructive secondary (Remove, Revoke) |
| **Success** | `color-success` | `text-inverse` | none | Positive actions (Approve, Accept) |

**States:**

| State | Visual Change |
|---|---|
| **Default** | Standard styling |
| **Hover** | Background darkens 5%, cursor pointer |
| **Active/Pressed** | Background darkens 10%, scale 0.98 |
| **Focus** | Focus ring (2px offset, primary color) |
| **Disabled** | Opacity 50%, cursor not-allowed |
| **Loading** | Spinner replaces label, button disabled |

**Button behavior rules:**
- Primary button: maximum 1 per view (clear CTA hierarchy)
- Button label: verb + noun ("Transfer money", not "Submit")
- Destructive actions: always require confirmation dialog
- Loading state: spinner replaces text, button width maintained

### 9.2 Inputs

**Variants:**

| Variant | Usage |
|---|---|
| **Default** | Standard text inputs |
| **Filled** | Dark background inputs (search, header) |
| **Outlined** | Bordered inputs (forms) |

**States:**

| State | Visual |
|---|---|
| **Default** | Border `border-default`, background `surface-primary` |
| **Hover** | Border `border-strong` |
| **Focus** | Border `color-primary`, focus ring |
| **Error** | Border `color-danger`, error message below |
| **Disabled** | Background `bg-tertiary`, text `text-disabled` |
| **Success** | Border `color-success` (after validation passes) |

**Input rules:**
- Label always visible (not floating, not placeholder-only)
- Placeholder text: `text-tertiary`, not `text-secondary`
- Helper text below input: `text-body-xs`, `text-tertiary`
- Error text below input: `text-body-xs`, `color-danger`
- Required indicator: red asterisk after label
- Maximum width: never exceeds `480px` (readability)

### 9.3 Dropdowns

- Background: `surface-primary`
- Border: `border-default`
- Shadow: `elevation-md`
- Maximum height: `320px` (scrollable)
- Option hover: `surface-hover`
- Option selected: `color-primary-subtle`, checkmark icon
- Option padding: `8px 12px`
- Divider between groups: `border-subtle`

### 9.4 Cards

**Standard card:**
- Background: `surface-primary`
- Border: `border-default` (1px)
- Border radius: `radius-lg` (8px)
- Padding: `24px`
- Shadow: `elevation-xs` (rest) → `elevation-sm` (hover)

**Card anatomy:**
```
┌─────────────────────────────────┐
│  Header (optional)              │
│  Title + Description + Actions  │
├─────────────────────────────────┤
│                                  │
│  Content                        │
│                                  │
├─────────────────────────────────┤
│  Footer (optional)              │
│  Actions + Meta                 │
└─────────────────────────────────┘
```

### 9.5 Tables

- Header: `surface-secondary`, `text-heading-xs`, `font-medium`
- Row: `surface-primary`, `border-subtle` bottom border
- Row hover: `surface-hover`
- Row selected: `color-primary-subtle`
- Cell padding: `12px 16px` (default) / `8px 12px` (compact)
- Financial columns: right-aligned, monospace font
- Text columns: left-aligned
- Status columns: center-aligned
- Sticky header on scroll
- Sticky first column on horizontal scroll (if applicable)

### 9.6 Charts

- Background: transparent (inherits card background)
- Grid lines: `border-subtle`
- Axis labels: `text-body-xs`, `text-tertiary`
- Tooltip: `surface-primary`, `elevation-md`, `border-default`
- Legend: below chart, `text-body-sm`
- Data points: `6px` radius (default), `8px` on hover
- Line thickness: `2px` (default), `3px` on hover
- Animation: draw-in effect on initial render (600ms)

### 9.7 Modals

- Backdrop: `rgba(0,0,0,0.5)` with `blur(4px)`
- Background: `surface-primary`
- Border radius: `radius-xl` (12px)
- Shadow: `elevation-xl`
- Maximum width: `520px` (default) / `720px` (wide) / `960px` (full)
- Maximum height: `85vh`
- Padding: `32px` (header) + `24px` (body) + `24px` (footer)
- Close button: top-right, ghost variant
- Focus trapped within modal
- ESC key closes modal
- Click outside closes modal (optional per modal)

### 9.8 Drawers

- Background: `surface-primary`
- Shadow: `elevation-xl`
- Width: `400px` (default) / `560px` (wide)
- Maximum width: `100vw - 64px` (sidebar width)
- Backdrop: same as modal
- Slide in from right (default) or left
- Header with title + close button
- Scrollable body
- Footer with actions (optional)

### 9.9 Sidebar

- Width: `240px` (expanded) / `64px` (collapsed)
- Background: `surface-primary`
- Right border: `border-default`
- Navigation items: `40px` height, `12px 16px` padding
- Active item: `color-primary-subtle` background, `color-primary` text + icon
- Hover item: `surface-hover`
- Section dividers: `border-subtle`, `16px` vertical margin
- Logo at top: `20px` top padding
- User info at bottom: `16px` bottom padding

### 9.10 Navigation

**Top navigation bar:**
- Height: `64px`
- Background: `surface-primary`
- Bottom border: `border-default`
- Items: `text-body-md`, `font-medium`
- Active: `color-primary`, bottom border indicator
- Hover: `surface-hover`

**Breadcrumb:**
- Separator: `ChevronRight` icon, `16px`
- Current page: `text-primary`, `font-medium`
- Previous pages: `text-secondary`, link
- Maximum visible: 4 items (collapse with "..." for deeper)

### 9.11 Tabs

**Variants:**

| Variant | Style | Usage |
|---|---|---|
| **Underline** | Bottom border indicator | Content tabs, settings tabs |
| **Pill** | Background pill indicator | Filter tabs, view toggles |
| **Enclosed** | Bordered tab panels | Admin sections |

**Tab rules:**
- Maximum visible tabs: 6 (scroll or dropdown for more)
- Tab label: verb or noun ("Transactions", "Settings")
- Active: primary color indicator
- Inactive: `text-secondary`
- Disabled: `text-disabled`, cursor not-allowed

### 9.12 Badges

| Variant | Background | Text | Usage |
|---|---|---|---|
| **Default** | `bg-tertiary` | `text-secondary` | Neutral status |
| **Primary** | `color-primary-subtle` | `color-primary` | Active, in progress |
| **Success** | `color-success-subtle` | `color-success` | Completed, active |
| **Warning** | `color-warning-subtle` | `color-warning` | Pending, attention |
| **Danger** | `color-danger-subtle` | `color-danger` | Failed, error |
| **Info** | `color-info-subtle` | `color-info` | Informational |

**Badge rules:**
- Height: `20px` (default), `24px` (large)
- Padding: `0 8px`
- Border radius: `radius-full` (pill)
- Font size: `text-body-xs`
- Font weight: `font-medium`
- Dot variant: `6px` circle before text

### 9.13 Tooltips

- Background: `bg-inverse` (dark on light, light on dark)
- Text: `text-inverse`, `text-body-sm`
- Padding: `6px 10px`
- Border radius: `radius-sm` (4px)
- Maximum width: `280px`
- Arrow: `6px` triangle
- Delay: `300ms` before showing
- No delay on hiding
- Not dismissible (disappear on hover away)
- Never used for essential information (supplementary only)

### 9.14 Avatars

**Shape:** Circle (default), rounded square (optional for organizations)

**Content:** User initials (fallback), profile image, or icon

**Sizes:** See Section 5.13 (Avatar Sizes)

**Avatar group:** Overlapping circles, maximum 4 visible, "+N" badge for overflow

### 9.15 Timeline

- Vertical line: `border-default`, `2px` width
- Node: `12px` circle, color matches status
- Content: left-aligned, `16px` from line
- Timestamp: `text-body-xs`, `text-tertiary`
- Spacing between entries: `24px`

### 9.16 Transaction Cards

```
┌─────────────────────────────────────────────┐
│  [Icon]  Merchant Name              -$45.23  │
│          Category • Today 2:30 PM           │
└─────────────────────────────────────────────┘
```

- Left: category icon (32px, color-coded)
- Center: merchant name (primary text), category + timestamp (secondary text)
- Right: amount (primary text, right-aligned), credit=green, debit=red
- Height: `64px`
- Padding: `12px 16px`
- Border bottom: `border-subtle`
- Hover: `surface-hover` background
- Click: navigates to transaction detail

### 9.17 Statistic Cards

```
┌─────────────────────────────────┐
│  Total Balance                  │
│  $12,345.67                     │
│  ↑ 2.3% from last month         │
└─────────────────────────────────┘
```

- Label: `text-body-sm`, `text-secondary`
- Value: `text-amount-xl`, `text-primary`
- Trend: `text-body-xs`, green (up) or red (down) with arrow icon
- Padding: `20px`
- Background: `surface-primary`
- Border: `border-default`
- Border radius: `radius-lg`

### 9.18 Analytics Widgets

- Title: `text-heading-sm`
- Subtitle: `text-body-sm`, `text-secondary`
- Content: chart or data visualization
- Period selector: tabs or dropdown in header
- Padding: `24px`
- Minimum height: `240px`
- Background: `surface-primary`
- Border: `border-default`

### 9.19 Quick Actions

```
┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
│ Send │  │ Pay  │  │ Add  │  │ More │
│ Money│  │ Bill │  │Money │  │      │
└──────┘  └──────┘  └──────┘  └──────┘
```

- Grid of 4 actions (responsive: 2x2 on mobile)
- Icon above label
- Icon: `icon-lg` (24px), primary color
- Label: `text-body-sm`, `font-medium`
- Background: `surface-primary`
- Border: `border-default`
- Border radius: `radius-lg`
- Hover: `surface-hover`, slight lift (`elevation-sm`)

### 9.20 Search

- Width: `100%` (container), maximum `480px` (standalone)
- Height: `40px` (default), `48px` (prominent)
- Icon: search icon on left, `text-tertiary`
- Clear button on right (when input has value)
- Background: `surface-tertiary`
- Border: none (default), `border-default` (focus)
- Border radius: `radius-md`
- Placeholder: "Search transactions, accounts..."
- Keyboard shortcut: `⌘K` / `Ctrl+K` to focus

### 9.21 Notification Panel

- Width: `400px` (drawer) or `320px` (dropdown)
- Header: "Notifications" + unread count badge + "Mark all read" link
- Items: icon + title + description + timestamp
- Unread: `color-primary-subtle` background
- Read: `surface-primary` background
- Empty: illustration + "No notifications yet"
- Footer: "View all notifications" link

---

## 10. Motion System

### 10.1 Animation Philosophy

Motion in FinFlow serves four purposes:

1. **Feedback** — Confirming that an action was received and processed
2. **Direction** — Showing where content came from or where it is going
3. **State** — Communicating what the system is doing (loading, processing, complete)
4. **Delight** — Creating moments of emotional connection (goal achievement, milestone)

Motion is never used for:
- Decoration
- Distraction
- Drawing attention to promotional content
- Masking slow loading

### 10.2 Core Transitions

| Transition | Duration | Easing | Properties |
|---|---|---|---|
| **Color change** | `150ms` | `ease-default` | background-color, color, border-color |
| **Opacity change** | `200ms` | `ease-default` | opacity |
| **Scale** | `150ms` | `ease-spring-soft` | transform: scale |
| **Position** | `300ms` | `ease-out` | transform: translate |
| **Size** | `300ms` | `ease-default` | width, height |
| **Border radius** | `200ms` | `ease-default` | border-radius |
| **Shadow** | `200ms` | `ease-default` | box-shadow |

### 10.3 Hover States

| Element | Transition | Effect |
|---|---|---|
| **Button** | `150ms ease-default` | Background darkens, shadow increases |
| **Card** | `200ms ease-default` | Shadow increases (`elevation-xs` → `elevation-sm`) |
| **Link** | `150ms ease-default` | Color changes, underline appears |
| **Table row** | `100ms ease-default` | Background changes to `surface-hover` |
| **Icon button** | `150ms ease-default` | Background changes, scale 1.05 |
| **Navigation item** | `150ms ease-default` | Background changes, text color changes |

### 10.4 Press/Active States

| Element | Transition | Effect |
|---|---|---|
| **Button** | `75ms ease-in-out` | Scale 0.98, background darkens |
| **Card** | `75ms ease-in-out` | Scale 0.99 |
| **Interactive element** | `75ms ease-in-out` | Scale 0.98 |

### 10.5 Focus States

| Element | Transition | Effect |
|---|---|---|
| **All interactive** | `100ms ease-default` | Focus ring appears (2px offset, primary color) |
| **Button** | `100ms ease-default` | Focus ring + slight shadow |
| **Input** | `100ms ease-default` | Border changes to primary, focus ring |
| **Link** | `100ms ease-default` | Focus ring appears |

### 10.6 Success Animations

| Trigger | Animation | Duration |
|---|---|---|
| **Form submission** | Checkmark draws in + green flash | `400ms` |
| **Transfer complete** | Confetti micro-burst (subtle) + status badge update | `600ms` |
| **Card freeze** | Ice crystal overlay (brief) + status update | `500ms` |
| **Goal achieved** | Aurora gradient celebration + number count-up | `1000ms` |
| **Profile saved** | Checkmark + green border pulse | `400ms` |

### 10.7 Loading States

**Skeleton screens:**
- Background: `surface-tertiary`
- Animation: shimmer effect (left-to-right gradient sweep)
- Duration: `1.5s` per cycle, infinite
- Shape: matches the content it replaces (card skeleton, row skeleton, text skeleton)

**Spinner:**
- Size: `20px` (small), `32px` (default), `48px` (large)
- Color: `color-primary`
- Animation: rotate, `800ms` linear infinite
- Usage: inline actions, button loading, data fetching (no skeleton available)

**Progress bar:**
- Height: `4px` (default), `8px` (thick)
- Background: `surface-tertiary`
- Fill: `color-primary`
- Animation: width transition, `300ms ease-default`
- Indeterminate: width oscillates, `1500ms ease-in-out` infinite

### 10.8 Transfer Success Animation

A multi-stage animation for completed transfers:

1. **Processing** (during API call): Spinner with "Transferring..." text
2. **Confirmation** (on success): Spinner → checkmark morph (200ms)
3. **Celebration** (100ms after confirmation): Subtle confetti burst from the confirm button location (5-8 particles, brand colors, fade out over 600ms)
4. **Status update** (simultaneous): Amount animates from current balance to new balance (number count, 400ms)
5. **Completion** (after celebration): Status badge transitions to "Completed" (green, 200ms)

Total animation sequence: ~1000ms

### 10.9 Chart Animations

| Animation | Duration | Easing |
|---|---|---|
| **Bar chart draw** | `600ms` | `ease-out` (bars grow from bottom) |
| **Line chart draw** | `800ms` | `ease-in-out` (path traces left to right) |
| **Pie chart reveal** | `500ms` | `ease-spring-soft` (segments expand from center) |
| **Data point hover** | `150ms` | `ease-default` (dot scales up, tooltip fades in) |
| **Chart period change** | `300ms` | `ease-default` (crossfade between datasets) |
| **Number counter** | `400ms` | `ease-out` (digits roll to new value) |

### 10.10 Card Animations

| Animation | Duration | Easing |
|---|---|---|
| **Card enter** | `300ms` | `ease-out` (fade in + translate up 8px) |
| **Card exit** | `200ms` | `ease-in` (fade out) |
| **Card expand** | `300ms` | `ease-default` (height transition) |
| **Card reorder** | `300ms` | `ease-spring-soft` (layout animation) |
| **Card flip** | `400ms` | `ease-in-out` (3D rotate, front to back) |

### 10.11 Sidebar Animations

| Animation | Duration | Easing |
|---|---|---|
| **Collapse** | `200ms` | `ease-default` (width shrinks, labels fade) |
| **Expand** | `200ms` | `ease-default` (width grows, labels appear) |
| **Item hover** | `100ms` | `ease-default` (background change) |
| **Active item** | `200ms` | `ease-default` (indicator slides to position) |
| **Section expand** | `200ms` | `ease-default` (height + opacity) |

### 10.12 Modal Animations

| Animation | Duration | Easing |
|---|---|---|
| **Backdrop enter** | `200ms` | `ease-default` (opacity 0 → 0.5) |
| **Backdrop exit** | `150ms` | `ease-in` (opacity 0.5 → 0) |
| **Modal enter** | `300ms` | `ease-spring-soft` (scale 0.95 → 1 + opacity 0 → 1) |
| **Modal exit** | `200ms` | `ease-in` (scale 1 → 0.95 + opacity 1 → 0) |
| **Drawer enter** | `300ms` | `ease-out` (translate from right: 100% → 0) |
| **Drawer exit** | `200ms` | `ease-in` (translate from right: 0 → 100%) |

### 10.13 Number Animation

| Animation | Duration | Easing |
|---|---|---|
| **Balance update** | `400ms` | `ease-out` (digits count from old to new) |
| **Counter increment** | `300ms` | `ease-out` (count up) |
| **Percentage change** | `300ms` | `ease-default` (fade + count) |
| **Currency conversion** | `400ms` | `ease-default` (crossfade between values) |

**Number animation rules:**
- Only animate significant changes (> 1% difference)
- Digits appear to "roll" from old to new value
- Decimal places maintain alignment during animation
- Animation is skipped if user has `prefers-reduced-motion`

### 10.14 Page Transitions

| Transition | Duration | Easing |
|---|---|---|
| **Route change (same section)** | `200ms` | `ease-default` (crossfade) |
| **Route change (different section)** | `300ms` | `ease-out` (fade + translate up 12px) |
| **Back navigation** | `250ms` | `ease-in` (fade + translate down 8px) |
| **Tab switch** | `200ms` | `ease-default` (crossfade) |

### 10.15 Micro-Interactions

| Interaction | Animation |
|---|---|
| **Toggle switch** | Knob slides, background color changes, `200ms ease-spring` |
| **Checkbox** | Checkmark draws in, `200ms ease-out` |
| **Radio button** | Dot scales in, `150ms ease-spring` |
| **Copy to clipboard** | Icon morphs: copy → check → copy, `400ms each` |
| **Like/save** | Heart/star scales up with bounce, `300ms ease-spring` |
| **Refresh pull** | Loading indicator rotates in, `200ms ease-out` |
| **Swipe to delete** | Reveal red background + trash icon, `200ms ease-out` |

---

## 11. Iconography

### 11.1 Icon Style

**Style:** Outlined (stroke-based, not filled)
**Stroke width:** `1.5px` (consistent across all icons)
**Corner radius:** `1px` (slightly rounded corners on strokes)
**Optical size:** `24px` (viewBox), designed on a `24x24` grid
**Cap style:** Round (stroke-linecap: round)
**Join style:** Round (stroke-linejoin: round)

### 11.2 Icon Grid

All icons are designed on a `24x24` pixel grid with `2px` padding on all sides. The effective design area is `20x20`.

```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │                      │  │
│  │    Design Area       │  │
│  │    20x20             │  │
│  │                      │  │
│  └──────────────────────┘  │
│                            │
└────────────────────────────┘
 24x24 grid, 2px padding
```

### 11.3 Icon Categories

| Category | Examples | Color |
|---|---|---|
| **Navigation** | Home, Settings, Bell, User | `text-secondary` (default) |
| **Financial** | DollarSign, TrendingUp, TrendingDown, Wallet | `text-primary` |
| **Actions** | Plus, Edit, Trash, Copy, Download | `text-secondary` |
| **Status** | CheckCircle, AlertCircle, XCircle, Info | Status colors |
| **Card** | CreditCard, Snowflake, RotateCcw, Shield | `text-secondary` |
| **Transfer** | Send, ArrowUpRight, ArrowDownLeft, Repeat | Status colors |
| **Social** | Share, Heart, Star | Context-dependent |

### 11.4 Illustration Style

Illustrations are used for empty states, onboarding, and error pages:

**Style characteristics:**
- Geometric, abstract (not cartoonish or realistic)
- Limited color palette: 2-3 brand colors + 1-2 neutrals
- Simple shapes: circles, rectangles, rounded forms
- Generous whitespace within the illustration
- Consistent stroke width matching icon system (1.5px or 2px)
- No gradients within illustrations (flat color only)

**Size:** Minimum `120px` width, maximum `320px` width

### 11.5 Empty State Pattern

```
┌─────────────────────────────────────────┐
│                                          │
│            [Illustration]                │
│            (120-200px)                   │
│                                          │
│         No transactions yet              │
│    Your transaction history will         │
│    appear here after your first          │
│    payment or transfer.                  │
│                                          │
│         [ Get Started ]                  │
│                                          │
└─────────────────────────────────────────┘
```

**Empty state rules:**
- Illustration: relevant to the empty context (e.g., empty transaction list shows a wallet icon)
- Title: describes the state ("No transactions yet")
- Description: explains why and what to expect
- Action: primary button to take the next step
- Maximum text: 2 lines for description

### 11.6 Loading State Pattern

**Skeleton screens** replace content during loading:

| Content Type | Skeleton Shape |
|---|---|
| Text line | Rectangle, 60-80% width, 16px height |
| Heading | Rectangle, 40-60% width, 24px height |
| Avatar | Circle, matching avatar size |
| Button | Rounded rectangle, matching button size |
| Card | Rectangle with rounded corners, matching card size |
| Table row | Rectangle, full width, 48px height |
| Chart | Rectangle, full width, 200px height |

**Skeleton animation:** Shimmer effect — a translucent gradient sweeps from left to right every 1.5 seconds.

### 11.7 Error State Pattern

```
┌─────────────────────────────────────────┐
│                                          │
│            [Illustration]                │
│         (error-specific icon)            │
│                                          │
│         Something went wrong             │
│    We couldn't load your transactions.   │
│    Please try again or contact support   │
│    if the problem persists.              │
│                                          │
│    [ Try Again ]    [ Contact Support ]  │
│                                          │
└─────────────────────────────────────────┘
```

**Error state rules:**
- Illustration: relevant error icon (warning triangle, broken link, server down)
- Title: plain language ("Something went wrong", not "Error 500")
- Description: what happened + what to do
- Actions: primary retry + secondary support contact
- Never show: error codes, stack traces, internal details

### 11.8 Success State Pattern

```
┌─────────────────────────────────────────┐
│                                          │
│            ✓  (animated checkmark)       │
│                                          │
│         Transfer Successful              │
│    $250.00 has been sent to              │
│    john@example.com                      │
│                                          │
│    [ Done ]    [ Send Another ]          │
│                                          │
└─────────────────────────────────────────┘
```

**Success state rules:**
- Animation: checkmark draws in (400ms)
- Title: confirms the action ("Transfer Successful")
- Description: summarizes what happened
- Actions: primary close/done + secondary related action
- Optional: confetti micro-burst for major milestones (goal achievement)

---

## 12. Accessibility Standards

### 12.1 WCAG 2.1 Level AA Compliance

All components and interactions must meet WCAG 2.1 Level AA. Specific requirements:

**Perceivable:**
- Color contrast: minimum 4.5:1 for normal text, 3:1 for large text (18px+) and UI components
- Non-text contrast: 3:1 for focus indicators, form field borders, custom components
- Text resizable: functional at 200% zoom without horizontal scrolling
- Images: meaningful alt text, decorative images marked as such
- Color: never the sole indicator of meaning (always paired with icon, text, or pattern)

**Operable:**
- Keyboard accessible: all interactive elements reachable via Tab
- No keyboard traps: focus can always move away from any element
- Skip navigation: "Skip to main content" link at the top of every page
- Focus order: logical, matches visual order
- Focus indicators: visible on all interactive elements (2px outline, primary color, 2px offset)
- Target size: minimum 44x44px for all interactive elements
- Timing: no time limits on user input (except session timeout with warning)

**Understandable:**
- Language: `lang` attribute on HTML element
- Labels: all form inputs have visible, associated labels
- Error identification: errors described in text, not color alone
- Error suggestions: when possible, suggest how to fix the error
- Consistent navigation: same navigation order across pages
- Consistent identification: same component, same name everywhere

**Robust:**
- Valid HTML: semantic elements used correctly
- ARIA: used only when native HTML semantics are insufficient
- Name, role, value: all custom components expose correct ARIA attributes
- Status messages: use `aria-live` for dynamic content updates

### 12.2 Component Accessibility Requirements

| Component | Requirements |
|---|---|
| **Button** | Accessible name, disabled state, loading state announced |
| **Input** | Label association, required state, error association, described-by for helper text |
| **Modal** | Focus trap, ESC to close, return focus on close, `aria-modal`, `aria-labelledby` |
| **Toast** | `aria-live="polite"`, auto-dismiss with warning, dismiss button |
| **Table** | `scope` on headers, `aria-sort` on sorted column, caption or `aria-label` |
| **Tab** | `role="tablist"`, `role="tab"`, `role="tabpanel"`, arrow key navigation |
| **Dropdown** | `aria-expanded`, `aria-haspopup`, keyboard navigation, active descendant |
| **Tooltip** | `aria-describedby`, not the sole means of conveying information |
| **Avatar** | `alt` text with user name, decorative avatars in groups have `alt=""` |
| **Chart** | Data table alternative, `aria-label` on SVG, described-by for summary |
| **Toast** | `role="status"` or `role="alert"`, `aria-live` region |

### 12.3 Focus Management Rules

- **Route change:** Focus moves to page title (`h1`)
- **Modal open:** Focus moves to first interactive element in modal
- **Modal close:** Focus returns to the element that triggered the modal
- **Toast notification:** Focus does not move (aria-live announcement)
- **Tab switch:** Focus moves to the new tab panel
- **Error:** Focus moves to the first error or error summary

### 12.4 Reduced Motion

All animations respect `prefers-reduced-motion`:

| Standard | Reduced |
|---|---|
| Scale animations | Instant (no scale) |
| Slide animations | Instant (no slide) |
| Fade animations | Instant (no fade, content appears) |
| Number counting | Instant (final value displayed) |
| Chart animations | Instant (final state displayed) |
| Skeleton shimmer | Static skeleton (no animation) |
| Celebration animations | Suppressed entirely |

### 12.5 Screen Reader Announcements

| Event | Announcement |
|---|---|
| Page load | Page title + brief description |
| Form submission (success) | "Success: [action] completed" |
| Form submission (error) | "Error: [count] validation errors. [first error description]" |
| Toast notification | Full toast message |
| Data loading | "Loading [content type]..." |
| Data loaded | "[count] [items] loaded" |
| Transfer processing | "Transfer processing" |
| Transfer complete | "Transfer of [amount] to [recipient] completed" |

---

## 13. Responsive Design Standards

### 13.1 Breakpoint Behavior

| Breakpoint | Sidebar | Content | Cards/Row | Navigation |
|---|---|---|---|---|
| **xs** (< 640px) | Hidden (drawer) | 1 column | 1 column | Bottom tab bar |
| **sm** (640-767px) | Hidden (drawer) | 1 column | 1 column | Bottom tab bar |
| **md** (768-1023px) | Hidden (drawer) | 1-2 columns | 2 columns | Top nav |
| **lg** (1024-1279px) | Collapsed (64px) | 2-3 columns | 2-3 columns | Top nav + sidebar |
| **xl** (1280-1535px) | Expanded (240px) | 3-4 columns | 3-4 columns | Top nav + sidebar |
| **2xl** (1536px+) | Expanded (240px) | 4 columns | 4 columns | Top nav + sidebar |

### 13.2 Mobile-Specific Patterns

**Bottom navigation bar** (replaces sidebar on mobile):
- Fixed to bottom of viewport
- Height: `64px`
- 4-5 items maximum
- Active item: primary color icon + label
- Inactive items: secondary color icon + label
- Items: Home, Accounts, Transfer, Cards, More

**Pull to refresh:**
- Available on all list views
- Loading indicator appears at top of list
- Content refreshes on release

**Swipe gestures:**
- Transaction cards: swipe left to reveal quick actions (categorize, hide)
- No destructive swipe actions without confirmation

### 13.3 Typography Scaling

| Element | Mobile | Tablet | Desktop |
|---|---|---|---|
| Page title | `text-heading-lg` (24px) | `text-heading-xl` (28px) | `text-display-sm` (32px) |
| Section heading | `text-heading-md` (20px) | `text-heading-lg` (24px) | `text-heading-xl` (28px) |
| Card title | `text-heading-sm` (16px) | `text-heading-md` (20px) | `text-heading-lg` (24px) |
| Body text | `text-body-md` (14px) | `text-body-md` (14px) | `text-body-lg` (16px) |
| Amount (large) | `text-amount-lg` (20px) | `text-amount-xl` (24px) | `text-amount-2xl` (32px) |

### 13.4 Touch Target Minimums

All interactive elements on touch devices must meet minimum touch target sizes:

| Element | Minimum Size |
|---|---|
| Buttons | 44x44px |
| Links in text | 44px height |
| Form inputs | 44px height |
| List items | 44px height |
| Icon buttons | 44x44px |
| Tab items | 44x44px |
| Toggle switches | 44x24px (hit area extends beyond visual) |

### 13.5 Responsive Table Strategy

| Breakpoint | Table Behavior |
|---|---|
| **Desktop** (1024px+) | Full table, all columns visible |
| **Tablet** (768-1023px) | Horizontal scroll, sticky first column |
| **Mobile** (< 768px) | Card layout (each row becomes a card) |

---

## 14. Theme Engine

### 14.1 Theme Architecture

Themes are defined as complete sets of semantic tokens. Switching themes swaps the entire token set, not individual values.

**Theme structure:**
- Every theme defines ALL semantic tokens
- No theme references tokens from another theme
- Theme switching is instant (CSS custom property swap)
- User preference persisted in localStorage
- System preference detected and offered as default

### 14.2 Dark Theme (Default)

**Design priority:** Dark theme is designed first. All components are designed for dark backgrounds.

**Key characteristics:**
- True dark backgrounds (not gray)
- Elevated surfaces use lighter shades (not shadows) for hierarchy
- Text uses bright neutrals (`#F0F0F3`) for readability
- Brand colors are brightened for dark backgrounds
- Shadows are more pronounced (darker, more spread)
- Borders are subtle (low contrast against dark backgrounds)

### 14.3 Light Theme

**Design priority:** Light theme is adapted from dark.

**Key characteristics:**
- Pure white backgrounds with gray secondary surfaces
- Text uses dark neutrals (`#111827`)
- Brand colors use original (darker) values
- Shadows are subtle (light gray)
- Borders are visible (medium contrast against white)
- More traditional banking aesthetic

### 14.4 AMOLED Theme

**Design priority:** Power savings on OLED displays.

**Key characteristics:**
- True black (#000000) for `bg-primary` (OLED pixels turn off)
- All other surfaces are dark grays (not black) to maintain hierarchy
- Text is slightly brighter for contrast against true black
- Same accent colors as dark theme
- Border contrast slightly increased

### 14.5 Future Themes

| Theme | Status | Usage |
|---|---|---|
| **High Contrast** | Planned | WCAG AAA compliance, maximized contrast |
| **Sepia** | Planned | Reduced blue light, reading-focused |
| **Brand** | Planned | White-label theming for partner deployments |
| **Seasonal** | Optional | Limited-time visual variations (not functional changes) |

### 14.6 Theme Switching UX

- Theme toggle in Settings > Display
- System preference option: "Follow system" / "Light" / "Dark" / "AMOLED"
- Transition: all properties transition over `200ms ease-default`
- No flash of unstyled content on page load (theme loaded before render)

---

## 15. Design Governance

### 15.1 Naming Convention

**Components:** PascalCase (`Button`, `TransactionCard`, `BalanceDisplay`)

**Tokens:** kebab-case with category prefix:
- Colors: `color-primary`, `color-danger`, `bg-primary`
- Spacing: `space-4`, `space-8`
- Typography: `text-heading-lg`, `text-body-md`
- Radius: `radius-md`, `radius-lg`
- Shadows: `shadow-sm`, `shadow-lg`
- Z-index: `z-modal`, `z-toast`

**CSS classes:** kebab-case (`button-primary`, `card-elevated`, `input-error`)

**Files:** kebab-case (`button.tsx`, `transaction-card.tsx`)

### 15.2 Component Versioning

Components follow semantic versioning:

| Change | Version Bump | Example |
|---|---|---|
| **New component** | Minor (0.x.0) | v1.0.0 → v1.1.0 (added `DatePicker`) |
| **Bug fix** | Patch (0.0.x) | v1.1.0 → v1.1.1 (fixed `Button` focus ring) |
| **Breaking change** | Major (x.0.0) | v1.1.1 → v2.0.0 (removed `LegacyButton`) |
| **Token change (non-breaking)** | Patch | v2.0.0 → v2.0.1 (adjusted spacing) |
| **Token change (breaking)** | Minor | v2.0.1 → v2.1.0 (renamed token) |

### 15.3 Contribution Rules

**Adding a new component:**
1. Propose in Design System RFC
2. Design review (visual, interaction, accessibility)
3. Engineering review (performance, API design, testability)
4. Implementation with full test coverage
5. Storybook documentation (all variants, states, sizes)
6. Accessibility audit (automated + manual)
7. Documentation in design system docs
8. Release notes

**Modifying an existing component:**
1. Check for breaking changes
2. Update all consuming code if breaking
3. Update Storybook stories
4. Update documentation
5. Bump version

**Deprecating a component:**
1. Mark as deprecated in code (JSDoc) and Storybook
2. Add deprecation warning in development mode
3. Document migration path
4. Minimum 2 minor versions before removal
5. Remove after deprecation period

### 15.4 Documentation Standards

Every component must document:

| Section | Content |
|---|---|
| **Description** | What it does, when to use it |
| **Import** | Exact import path |
| **Props** | All props with types, defaults, and descriptions |
| **Variants** | All visual variants with examples |
| **States** | All interactive states (default, hover, focus, active, disabled, loading) |
| **Sizes** | All size options with dimensions |
| **Examples** | Common usage patterns |
| **Do/Don't** | Usage guidelines with visual examples |
| **Accessibility** | ARIA attributes, keyboard behavior, screen reader announcements |
| **Related** | Links to similar or complementary components |

### 15.5 Design Review Checklist

Every new component or significant change must pass:

- [ ] Visual consistency with existing components
- [ ] All design tokens used (no raw values)
- [ ] All themes supported (light, dark, AMOLED)
- [ ] Responsive behavior verified at all breakpoints
- [ ] Keyboard navigation works correctly
- [ ] Screen reader announces correctly
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets meet minimum size (44x44px)
- [ ] Reduced motion preference respected
- [ ] RTL layout tested (if applicable)
- [ ] Bundle size impact assessed
- [ ] Storybook stories cover all variants and states
- [ ] Documentation complete
- [ ] Version bumped and changelog updated

### 15.6 Design Token Governance

**Adding a new token:**
1. Must fill a gap (no duplicate semantics)
2. Must be used by at least one component immediately
3. Must be added to all three tiers (primitive → semantic → component)
4. Must be documented with usage guidelines
5. Must be added to the Figma token library

**Modifying a token:**
1. Impact analysis (all components using this token)
2. Migration plan for consuming code
3. Backward-compatible alias during transition period

**Removing a token:**
1. Confirm no active usage
2. Deprecation notice (2 minor versions minimum)
3. Remove from all theme definitions

---

## Appendix A: Token Quick Reference

### Spacing
```
0 → 2 → 4 → 6 → 8 → 10 → 12 → 14 → 16 → 20 → 24 → 32 → 40 → 48 → 64 → 80 → 96
```

### Border Radius
```
none → xs(2) → sm(4) → md(6) → lg(8) → xl(12) → 2xl(16) → 3xl(24) → full(9999)
```

### Elevation
```
none → xs → sm → md → lg → xl → 2xl
```

### Duration
```
instant(0) → fastest(50) → faster(100) → fast(150) → normal(200) → moderate(300) → slow(400) → slower(500) → slowest(700)
```

### Z-Index
```
base(0) → raised(1) → dropdown(10) → sticky(20) → overlay(30) → modal(40) → popover(50) → toast(60) → tooltip(70)
```

## Appendix B: Color Quick Reference

### Light Theme Primary Colors
| Name | Hex | RGB |
|---|---|---|
| Primary | `#2563EB` | 37, 99, 235 |
| Success | `#16A34A` | 22, 163, 74 |
| Warning | `#D97706` | 217, 119, 6 |
| Danger | `#DC2626` | 220, 38, 38 |
| Info | `#0891B2` | 8, 145, 178 |

### Dark Theme Primary Colors
| Name | Hex | RGB |
|---|---|---|
| Primary | `#4D8AFF` | 77, 138, 255 |
| Success | `#4ADE80` | 74, 222, 128 |
| Warning | `#FBBF24` | 251, 191, 36 |
| Danger | `#F87171` | 248, 113, 113 |
| Info | `#22D3EE` | 34, 211, 238 |

---

*This document is the source of truth for the FinFlow Design Language. All visual decisions, component behaviors, and interaction patterns reference this document. Design and engineering teams must follow the governance process for any additions or modifications.*
