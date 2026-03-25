# Brand Guidelines

AI Gateway follows a dark-first design system with vibrant accent colors. Sharp corners, uppercase headings, and technical precision define the visual language. The site supports both dark and light modes, with the light mode inspired by Notion's warm, readable aesthetic.

## Logo

The AI Gateway logo is the Material Design `transit-connection-variant` icon — a network of connected nodes representing unified model routing and connectivity.

### Logo Usage Rules

| Rule | Details |
|------|---------|
| Minimum size | 24px x 24px (icon only), 120px width (lockup) |
| Clear space | Minimum 50% of icon width on all sides |
| Dark backgrounds | White icon (#ffffff) |
| Light backgrounds | Black icon (#000000) |
| Do not | Rotate, distort, add drop shadows, change colors, place on busy backgrounds |
| Source | Material Design Icons: `transit-connection-variant` |
| Favicon | Use icon-only at 32px x 32px with transparent background |

## Color Palette

### Dark Mode (Default)

| Color | Value | Usage |
|-------|-------|-------|
| Black | `#000000` | Backgrounds |
| Dark | `#111111` | Surfaces |
| Card | `#1a1a1a` | Cards, panels |
| White | `#ffffff` | Primary text |
| White 80% | `rgba(255,255,255,0.8)` | Body text |
| Gray | `#9c9c9c` | Muted, labels |
| Border | `rgba(255,255,255,0.12)` | Borders |

### Accent Colors

| Color | Dark Mode | Light Mode | Usage |
|-------|-----------|------------|-------|
| Violet (Primary) | `#a78bfa` | `#9065B0` | Links, featured borders, brand chip, active tabs |
| Violet Soft | `rgba(167,139,250,0.15)` | `#F6F3F8` | Hover fills, feature box backgrounds |
| Violet Strong | `#c4b5fd` | `#8A67AB` | Active states, emphasis |
| Cyan (Secondary) | `#22d3ee` | `#337EA9` | Secondary highlights, stat accents |
| Cyan Soft | `rgba(34,211,238,0.12)` | `#E9F3F7` | Subtle fills |
| Amber (Tertiary) | `#fbbf24` | `#D87620` | Warm accents, enterprise tier |
| Amber Soft | `rgba(251,191,36,0.12)` | `#F8ECDF` | Subtle fills |

### Status Colors

| Color | Dark Mode | Light Mode | Usage |
|-------|-----------|------------|-------|
| Success | `#22c55e` | `#448361` | Status, positive |
| Success Soft | `rgba(34,197,94,0.15)` | `#EEF3ED` | Tag/chip background |
| Warning | `#eab308` | `#CB912F` | Alerts |
| Warning Soft | `rgba(250,204,21,0.15)` | `#FAF3DD` | Tag/chip background |
| Error / Danger | `#ef4444` | `#D44C47` | Destructive |
| Danger Soft | `rgba(239,68,68,0.2)` | `#FAECEC` | Tag/chip background |
| Info | `#3b82f6` | `#337EA9` | Informational |
| Info Soft | `rgba(59,130,246,0.12)` | `#E9F3F7` | Tag/chip background |

### Light Mode (Notion-Inspired)

| Color | Value | Usage |
|-------|-------|-------|
| Background | `#ffffff` | Page background |
| Subtle Background | `#f7f6f3` | Warm gray surfaces, header, cards |
| Card Background | `#ffffff` | Card surfaces with subtle border |
| Text | `#373530` | Primary body text |
| Text Muted | `#787774` | Labels, captions, secondary text |
| Border | `rgba(55,53,48,0.09)` | Subtle warm borders |

### Semantic Tag Classes

| Tag Class | Light BG | Light Text | Dark BG | Dark Text |
|-----------|----------|------------|---------|-----------|
| `.tag-threat-critical` | `#FAECEC` | `#D44C47` | `rgba(239,68,68,0.2)` | `#fca5a5` |
| `.tag-threat-high` | `#F8ECDF` | `#CC782F` | `rgba(234,179,8,0.15)` | `#fde68a` |
| `.tag-threat-medium` | `#FAF3DD` | `#C29343` | `rgba(250,204,21,0.15)` | `#fde68a` |
| `.tag-threat-low` | `#EEF3ED` | `#448361` | `rgba(34,197,94,0.15)` | `#86efac` |

## Typography

| Element | Spec |
|---------|------|
| Heading Level 1 | Space Grotesk · 2.4rem · 700 · uppercase · -0.02em |
| Heading Level 2 | Space Grotesk · 1.5rem · 700 · uppercase · 0.01em |
| Heading Level 3 | Space Grotesk · 1.15rem · 700 · uppercase · 0.02em |
| Label / Caption | Space Grotesk · 0.85rem · 600 · uppercase · 0.08em · Gray |
| Body | Space Grotesk · 0.95rem · 400 · rgba(255,255,255,0.8) · line-height 1.65 |
| Code | Roboto Mono · 0.82rem · 400 |

## Component Patterns

| Pattern | Properties | Usage |
|---------|-----------|-------|
| Card | bg: var(--ig-bg-card), border: 1px var(--ig-border), colored top border via accent, padding: 1.5rem, radius: 0 | Content containers, stats, pricing |
| Featured Card | border: 2px var(--ig-accent), box-shadow with accent glow | Highlighted items, popular tier |
| Feature Box | border-left: 3px var(--ig-accent), bg: var(--ig-accent-soft) | Callouts, feature highlights |
| Table Header | bg: var(--ig-bg-card), border-bottom: 2px var(--ig-accent), font: 0.75rem uppercase 0.06em | All data tables |
| Hover State | translateY(-2px), box-shadow: 0 4px 16px rgba(0,0,0,0.3), transition: 0.2s | All interactive cards |
| Grid | auto-fit minmax, gap: 1.25rem | Responsive layouts |

## Spacing & Layout

| Element | Value |
|---------|-------|
| Card padding | 1.5rem |
| Grid gap | 1.25rem |
| Section margin | 2.5rem |
| Border width | 1px (standard), 2px (featured) |
| Border radius | 0 (always) |
| Content max-width | 1100px |
| Sidebar width | 260px |

## Brand Voice

Enterprise, technical, precise. Uppercase headings convey authority. Concise descriptions respect the reader's time. Monospace for all technical content. Dark-first design signals professional-grade tooling.
