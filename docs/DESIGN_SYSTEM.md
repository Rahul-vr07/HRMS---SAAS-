# Nexus HR — Design System

## Brand Identity

**Name:** Nexus HR  
**Tagline:** Intelligent Workforce Platform  
**Personality:** Professional, precise, approachable, forward-thinking

## Color Palette

### Light Mode
| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#FAFBFC` | Page background |
| `--foreground` | `#0F172A` | Primary text |
| `--card` | `#FFFFFF` | Card surfaces |
| `--primary` | `#6366F1` | Primary actions (Indigo) |
| `--primary-foreground` | `#FFFFFF` | On primary |
| `--secondary` | `#F1F5F9` | Secondary surfaces |
| `--muted` | `#64748B` | Muted text |
| `--accent` | `#8B5CF6` | Accent (Violet) |
| `--success` | `#10B981` | Success states |
| `--warning` | `#F59E0B` | Warnings |
| `--destructive` | `#EF4444` | Errors/delete |
| `--border` | `#E2E8F0` | Borders |
| `--ring` | `#6366F1` | Focus rings |

### Dark Mode
| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#0B0F19` | Page background |
| `--foreground` | `#F8FAFC` | Primary text |
| `--card` | `#111827` | Card surfaces |
| `--primary` | `#818CF8` | Primary actions |
| `--border` | `#1E293B` | Borders |

## Typography

- **Display / Headings:** Inter (600–700)
- **Body:** Inter (400–500)
- **Mono / Data:** JetBrains Mono

| Scale | Size | Weight | Use |
|-------|------|--------|-----|
| `text-xs` | 12px | 400 | Labels, captions |
| `text-sm` | 14px | 400–500 | Body, table cells |
| `text-base` | 16px | 400 | Default body |
| `text-lg` | 18px | 500 | Section titles |
| `text-xl` | 20px | 600 | Card titles |
| `text-2xl` | 24px | 600 | Page subtitles |
| `text-3xl` | 30px | 700 | Page titles |

## Spacing Scale

Base unit: 4px — `1=4px, 2=8px, 3=12px, 4=16px, 6=24px, 8=32px, 12=48px`

## Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `rounded-sm` | 6px | Inputs, badges |
| `rounded-md` | 8px | Buttons |
| `rounded-lg` | 12px | Cards |
| `rounded-xl` | 16px | Modals, panels |
| `rounded-2xl` | 20px | Hero cards |
| `rounded-full` | 9999px | Avatars, pills |

## Shadows

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05);
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05);
--shadow-glass: 0 8px 32px rgba(0,0,0,0.12);
```

## Glassmorphism

```css
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.dark .glass {
  background: rgba(17, 24, 39, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

## Component Patterns

### Cards
- White/dark card with `rounded-xl`, `shadow-sm`, `border`
- Hover: subtle lift (`shadow-md`, `translate-y-[-1px]`)
- KPI cards: icon + metric + trend indicator

### Tables
- Sticky header, zebra optional
- Row hover highlight
- Virtualized for 1000+ rows
- Bulk action bar on selection

### Forms
- Label above input
- Inline validation with Zod
- Section grouping with dividers

### Empty States
- Illustration + headline + CTA
- Contextual help link

### Loading
- Skeleton placeholders matching layout
- Shimmer animation

## Motion

- **Duration:** 150ms (micro), 250ms (standard), 400ms (emphasis)
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`
- Page transitions: fade + slide up 8px
- Modals: scale 0.95 → 1 + fade

## Accessibility

- Minimum contrast ratio 4.5:1 (AA)
- Focus visible on all interactive elements
- Skip to main content link
- ARIA labels on icon-only buttons
- Reduced motion media query support
