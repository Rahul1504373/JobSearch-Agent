---
name: Autonomous Mobility
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-xs:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers an executive, mission-critical workspace for global IT professionals navigating cross-border relocation and legal visa sponsorship. The interface balances high-density utility with effortless clarity, projecting technological sophistication, absolute regulatory precision, and unwavering reliability.

The aesthetic fuses **Corporate/Modern SaaS precision** with **subtle analytical glass accents**. It avoids frivolous visual clutter, anchoring the experience on structural discipline, high data density, clear semantic hierarchy, and deterministic visual states. The UI must feel like a specialized mission control center: calm, highly capable, and transparent about algorithmic confidence levels and regulatory checks.

## Colors

The palette establishes a hierarchy governed by functional intent and strict WCAG AA contrast compliance:

- **Primary (`#4F46E5` - Deep Indigo):** The focal anchor for primary actions, active navigation states, high-priority discovery triggers, and interactive elements.
- **Secondary (`#3B82F6` - Blue):** Utilized for secondary calls-to-action, active agent workflows, and the semantic status tag *Sponsorship stated*.
- **Tertiary (`#10B981` - Emerald):** Reserved strictly for positive outcomes, successful system verifications, and the official *Verified sponsor* indicator.
- **Warning (`#F59E0B` - Amber):** Highlights non-blocking alerts, manual review flags, and the semantic badge *Unclear sponsorship*.
- **Error / Danger (`#EF4444` - Rose):** Designated for hard pipeline failures, blocked visa criteria, critical discrepancies, and system errors.
- **Slate Neutrals:**
  - `#0F172A` (Slate 900): Deep canvas text, maximum contrast headers, active icons.
  - `#334155` (Slate 700): Subheadings, primary labels, secondary interactive items.
  - `#64748B` (Slate 500): Placeholder text, metadata timestamps, de-emphasized structural borders.
  - `#E2E8F0` (Slate 200): Default hairline borders, dividers, card perimeters.
  - `#F1F5F9` (Slate 100): Input background fields, table header rows, neutral chip fills.
  - `#F8FAFC` (Slate 50): Global workspace canvas and low-contrast surface wrappers.
  - `#FFFFFF` (White): Foreground cards, elevated flyouts, modals, segmented controls.

All interactive elements must feature distinct focus indicators: an offset ring of `2px` using `#4F46E5` with `2px` of white separation space.

## Typography

Inter serves as the foundational typeface across headlines, running copy, and administrative tabular data. Inter's tall x-height and open apertures ensure instantaneous readability within high-density metric widgets, multi-column diff panels, and complex agent logs.

- **Headlines:** Use tightened negative letter-spacing (`-0.01em` to `-0.025em`) to retain visual compactness across numeric readouts and job role titles.
- **Labels & Statuses:** Micro-copy, badge tags, and categorical column caps leverage medium or semi-bold weights with slight positive tracking (`+0.02em` to `+0.04em`) to safeguard legibility at small sizes.
- **Monospaced Data:** For algorithmic diff blocks, applicant tracking identifiers, and passport/visa subclass codes, rely on native tabular numerals (`font-feature-settings: 'tnum' 1, 'cv05' 1`) to preserve vertical baseline and tabular alignment.

## Layout & Spacing

The system is constructed upon a strict **8px baseline grid** (`0.5rem`), supporting seamless horizontal alignment across multi-agent logs and job discovery split-views.

- **Desktop (>= 1280px):** 12-column fluid grid within a maximum 1600px container. Outer canvas margins are `2rem` (`32px`), with column gutters of `1.5rem` (`24px`). Common distributions: 3-column filter rail + 9-column dynamic pipeline, or equal split 6-column diff panels.
- **Tablet (768px – 1279px):** 8-column layout with `1.5rem` gutters and `1.5rem` outer margins. Collapsible secondary sidebar and stacked action ribbons.
- **Mobile (< 768px):** 4-column layout with `1rem` (`16px`) gutters and margins. Full-width cards, off-canvas drawers for agent parameters, and sticky bottom bars for critical actions.

Component interiors follow strict internal padding ratios:
- Compact items (badges, chips, toggle items): `space-xs` vertical, `space-sm` horizontal.
- Controls (buttons, form inputs): `space-sm` vertical, `space-md` horizontal.
- Surface cards: `space-lg` uniform internal padding.

## Elevation & Depth

Visual hierarchy uses a refined combination of flat surface segmentation, crisp hairline borders, and subtle ambient shadows tinted with Slate:

- **Level 0 (Base Canvas):** Background surface `#F8FAFC`. Zero elevation, non-interactive.
- **Level 1 (Cards, Workspaces):** Pure white background (`#FFFFFF`), anchored by a 1px border of `#E2E8F0` and an ambient shadow: `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`.
- **Level 2 (Hovered Cards, Dropdowns, Popovers):** Elevated surface with higher spatial prominence: `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`. Border shifts dynamically to `#CBD5E1`.
- **Level 3 (Modals, Diff Panels, Slide-overs):** System-critical dialogs: `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)`. Paired with an overlay backdrop of `rgba(15, 23, 42, 0.4)` enhanced by a `backdrop-blur(4px)` lens.

## Shapes

The design system embraces a **Rounded (Level 2)** shape identity tailored specifically for analytical dashboards:

- **Structural Cards & Panels:** Set explicitly to `border-radius: 12px` (`0.75rem` / `rounded-xl`). This delivers a modern, clean boundary that does not compromise edge space in data tables or multi-column diff views.
- **Input Fields & Buttons:** Configured to `border-radius: 8px` (`0.5rem`), standardizing touch targets with ergonomic geometric flow.
- **Pills, Badges & Chips:** Rendered at full radial caps (`border-radius: 9999px`) to immediately visually differentiate dynamic operational statuses and metadata tags from interactive rectilinear components.

## Components

### Buttons
- **Primary:** Background `#4F46E5`, text `#FFFFFF`, border none. Hover: `#4338CA`. Active: `#3730A3`. Height 40px (Desktop), font `label-md`. Focus-visible ring: `2px` `#4F46E5` with `2px` offset.
- **Secondary:** Background `#FFFFFF`, text `#334155`, border `1px` solid `#E2E8F0`. Hover: `#F8FAFC`, border `#CBD5E1`.
- **Ghost / Destructive:** Background transparent, text `#EF4444`. Hover: `#FEF2F2`.

### Status Badges & Chips
Status badges communicate visa certainty at a glance. They employ high-contrast pill styling (`border-radius: 9999px`) with a soft tinted background and an authoritative dot indicator:
- **Verified Sponsor:** Background `#ECFDF5`, text `#065F46`, border `1px` solid `#A7F3D0`. Active emerald dot (`#10B981`).
- **Sponsorship Stated:** Background `#EFF6FF`, text `#1E40AF`, border `1px` solid `#BFDBFE`. Active blue dot (`#3B82F6`).
- **Unclear Sponsorship:** Background `#FFFBEB`, text `#92400E`, border `1px` solid `#FDE68A`. Amber dot (`#F59E0B`).
- **Ineligible / Error:** Background `#FEF2F2`, text `#991B1B`, border `1px` solid `#FECACA`. Rose dot (`#EF4444`).

### Input Fields & Controls
- **Inputs & Selects:** Height 40px, background `#FFFFFF`, border `1px` solid `#CBD5E1`, text `#0F172A`, placeholder `#64748B`. Focused state: border `#4F46E5`, outline ring `2px` with `20%` Indigo opacity.
- **Checkboxes & Radios:** `16px` dimension, border `#CBD5E1`, rounded `4px` (checkbox) or `9999px` (radio). Checked state: `#4F46E5` with crisp white mark.
- **Segmented Controls:** Background `#F1F5F9`, internal padding `4px`, radius `8px`. Active segment: background `#FFFFFF`, shadow Level 1, text `#0F172A`, font `label-sm`.

### Cards
- **Base Card:** Radius `12px` (`rounded-xl`), background `#FFFFFF`, border `1px` solid `#E2E8F0`, padding `24px`.
- **Active / Processing Card (Agent running):** Same base parameters with a subtle primary top border (`2px` solid `#4F46E5`) and faint pulsing badge.

### Modal Diff Panels (Resume / Application Tailoring)
Split-pane revision viewers designed to compare original application details with AI-tailored outputs:
- **Structure:** Two equal `6-column` panels set in a modal with an elevation of Level 3.
- **Original Content Pane (Left):** Background `#F8FAFC`, text `#64748B`, highlighting removed or flagged terms with an overlay of `#FEF2F2` (text `#991B1B`, strike-through).
- **Copilot Optimized Pane (Right):** Background `#FFFFFF`, text `#0F172A`, highlighting AI additions with an overlay of `#ECFDF5` (text `#065F46`, font-weight medium).
- **Footer Controls:** Sticky bottom actions containing side-by-side revert buttons, granular acceptance checkmarks, and the primary "Deploy Application" Indigo trigger.