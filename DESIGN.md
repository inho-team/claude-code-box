# DESIGN.md — Claude Code Box "Hyper-Terminal" Design System

> Stitch Project: `projects/12011458282920314503` (claude-code-box)
> Version: v2 — Hyper-Terminal Redesign
> Screens: 4 (Browser+Terminal, Editor+Terminal, Settings, Quad Terminal)

---

## 1. Design Philosophy: "Hyper-Terminal"

Brutalist, cyber-industrial aesthetic. Sharp edges, high density, monochrome base with electric blue accent.
The UI feels like a military-grade command center — not a consumer app.

**Core Principles:**
- Zero border-radius (0px or 0.125rem max)
- Monochrome zinc palette + single accent color (#0099FF)
- Space Grotesk for headlines/labels, Inter for body, JetBrains Mono for code
- Ultra-thin borders (1px zinc-800), no shadows except ambient blue glow
- UPPERCASE text for all labels, nav items, and section headers
- 4px scrollbar width (ultra-thin)
- `code-glow` effect: `text-shadow: 0 0 8px rgba(0, 153, 255, 0.4)`

---

## 2. Color Tokens

### Surface Hierarchy
```
surface:                  #131313   (base background)
surface-dim:              #131313   (same as base)
surface-container-lowest: #0e0e0e   (editor background, deepest recessed)
surface-container-low:    #1c1b1b   (secondary panels)
surface-container:        #201f1f   (cards, settings panels)
surface-container-high:   #2a2a2a   (elevated cards, hover states)
surface-container-highest:#353534   (tooltips, overlays)
surface-bright:           #393939   (brightest surface)
surface-variant:          #353534   (alternate surface)
```

### Brand / Accent
```
primary-container:        #0099ff   (main accent — buttons, active borders, cursor, badges)
primary:                  #9fcaff   (light blue text, terminal cursor, links)
primary-fixed:            #d2e4ff   (very light blue)
primary-fixed-dim:        #9fcaff   (same as primary)
```

### Text
```
on-surface:               #e5e2e1   (primary text)
on-surface-variant:       #bfc7d5   (secondary text)
on-primary-container:     #002f54   (text on accent bg — dark blue)
zinc-300:                 ~#d4d4d8  (code text)
zinc-400:                 ~#a1a1aa  (muted interactive)
zinc-500:                 ~#71717a  (nav items, muted labels)
zinc-600:                 ~#52525b  (inactive sidebar icons)
zinc-700:                 ~#3f3f46  (line numbers, separators)
```

### Functional
```
outline:                  #89919e   (borders, strong)
outline-variant:          #3f4753   (subtle borders, ghost borders at 15% opacity)
zinc-800:                 ~#27272a  (panel borders — primary border color)
zinc-900:                 ~#18181b  (tab backgrounds, sidebar active)
error:                    #ffb4ab   (error text)
error-container:          #93000a   (error bg)
secondary:                #d3c878   (yellow/gold — strings in syntax, secondary accent)
tertiary:                 #b3c8e7   (light steel blue — function names)
```

### Syntax Highlighting
```
syntax-keyword:           #9fcaff   (primary — use, fn, let, const, import)
syntax-string:            #d3c878   (secondary — string literals)
syntax-comment:           #6F839F   (muted blue-gray)
syntax-fn:                #b3c8e7   (tertiary — function names)
syntax-type:              #0099ff   (primary-container — type names, classes)
```

### Special Effects
```
ambient-glow-top:         rgba(primary, 0.1) blur 120px   (top-right decorative)
ambient-glow-bottom:      rgba(blue-600, 0.05) blur 80px  (bottom-left decorative)
code-glow:                text-shadow: 0 0 8px rgba(0, 153, 255, 0.4)
selection:                bg primary-container, text white
```

---

## 3. Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Headline | Space Grotesk | 300-700 | Brand, section titles, labels |
| Body | Inter | 300-600 | Descriptions, body text |
| Label | Space Grotesk | 400-700 | Nav items, badges, status text |
| Mono | JetBrains Mono | 400-500 | Code, terminal, technical data |

### Text Sizes
```
Brand:          text-lg (18px), font-bold, tracking-tighter
Section title:  text-4xl~6xl, font-bold, tracking-tight, UPPERCASE
Nav items:      text-sm (14px), UPPERCASE, tracking-tight
Tab labels:     text-[11px], UPPERCASE, tracking-tighter (mono)
Sidebar icons:  text-[10px] or text-[8px], UPPERCASE, font-medium
Status/metadata:text-[10px], UPPERCASE, tracking-widest
Line numbers:   text-sm, zinc-700
Code:           text-sm, leading-6
Terminal prompt: text-sm, font-mono
```

---

## 4. Layout Structure

### TopNavBar (h-12, 48px)
- `bg-zinc-950` (#131313), `border-b border-zinc-800`
- Left: Brand "Claude Code Box" (text-blue-500, font-bold, tracking-tighter, font-headline)
- Center: Breadcrumb path (ROOT / SRC / CORE / v1.0.4) — UPPERCASE, separated by `/`
  - Active segment: `text-blue-400 font-bold border-b-2 border-blue-500 pb-1`
  - Inactive: `text-zinc-500`
- Right: Icon buttons (account_tree, terminal, settings) + "EXECUTE" button
  - EXECUTE: `bg-primary-container text-on-primary-container px-3 py-1 font-headline text-xs font-bold uppercase tracking-widest`

### SideNavBar (w-16, 64px)
- `bg-zinc-950`, `border-r border-zinc-800`, fixed left
- Items: Explorer, Search, Git, Debug, Market
  - Active: `bg-zinc-900 text-blue-400 border-l-2 border-blue-500`
  - Inactive: `text-zinc-600 hover:bg-zinc-900 hover:text-blue-300`
  - Labels: `font-['Space_Grotesk'] text-[10px] font-medium uppercase`
- Bottom: "+" button (`bg-blue-500/10 text-blue-500 border border-blue-500/30`) + user avatar

### Editor Panel
- Background: `#0e0e0e` (surface-container-lowest)
- File tab bar: h-8, `bg-zinc-900`, `border-b border-zinc-800`
  - File icon (Material Symbols, text-blue-400) + filename (font-mono 11px UPPERCASE) + "Modified" badge
  - Right: UTF-8 / Language labels (text-[10px] zinc-500)
- Line numbers: `w-12, bg-[#0e0e0e], text-zinc-700, border-r border-zinc-900`
- Active line: `bg-blue-500/5, border-l-2 border-blue-500`
- Code area: `p-4 bg-[#0e0e0e] text-zinc-300 font-mono text-sm leading-6`

### Terminal Panel
- Background: `bg-zinc-950` (#131313)
- Terminal tab bar: h-8, `bg-zinc-900/50`, `border-b border-zinc-800`
  - Active tab: terminal icon (text-primary) + "ZSH" (font-headline 11px bold UPPERCASE tracking-widest)
  - Inactive tabs: opacity-40
  - Status dots: green (active), zinc-700 (inactive)
- Prompt style:
  - Arrow: `➜` in `text-primary-container font-bold`
  - Path: `text-zinc-400`
  - Command: `text-zinc-200`
  - Output headers: `text-primary-container font-bold` (e.g., [CLAUDE-CORE v1.0.4-alpha])
  - Output body: `text-zinc-500 italic` (compiler output)
  - Result: `text-on-surface font-bold` (success messages)
- Cursor: `w-2 h-5 bg-primary-container animate-pulse`
- Stats overlay (optional): Grid with CPU LOAD / MEM USAGE — `font-label text-[10px] zinc-600`, values in `text-blue-400 font-mono text-lg`
- Footer: h-10, `border-t border-zinc-900`, LN/COL info + "Ready" status + branch name

### Settings Page
- Hero header: `text-4xl~6xl font-headline font-bold uppercase tracking-tight`
- Badge: `bg-surface-container-high text-[10px] font-label uppercase tracking-widest border border-outline-variant/15`
- Bento grid layout: `grid-cols-12`, cards with `bg-surface-container p-6`
- Active card accent: `border-l-2 border-primary` or `border-t-2 border-secondary`
- Range inputs: custom styled, 4px height, #0099ff thumb
- Toggle: `bg-primary-container` when on, square (no border-radius)
- Code preview: colored dots (red/yellow/blue) + syntax-highlighted code
- Chroma profiles: color swatches with hover glow effect
- Footer: `font-mono text-[10px] uppercase tracking-widest` — kernel version, uptime, config hash

### Quad Terminal (4-pane)
- 2x2 grid of terminal panels
- Each pane: independent terminal with own tab bar (GIT LOG, SERVER LOG, ZSH, SYSTEM METRICS)
- Shared top tab bar for pane selection
- Dividers: `border-zinc-800` between panes
- Bottom status bar: `border-t border-zinc-800`, connection status, uptime, LN/COL, branch info

### Status Bar (bottom, optional per screen)
- Background: transparent or `bg-zinc-950`
- `border-t border-zinc-800` or `border-t border-zinc-900`
- Content: `font-mono text-[10px] uppercase tracking-widest`
- Left: connection status, uptime
- Right: LN/COL, spaces, UTF-8, language, branch

---

## 5. Component Patterns

### Buttons
```
Primary (EXECUTE):  bg-primary-container text-on-primary-container px-3 py-1
                    font-headline text-xs font-bold uppercase tracking-widest
                    hover:brightness-110 active:scale-95
Ghost:              p-2 text-zinc-400 hover:bg-zinc-900
                    active:opacity-80 scale-95 duration-75
Apply:              bg-on-surface text-surface py-3
                    text-[10px] font-bold uppercase tracking-[0.2em]
                    hover:bg-white active:scale-95
```

### Cards / Panels
```
Standard:     bg-surface-container p-6 border-l-2 border-primary
Elevated:     bg-surface-container-high p-6
Recessed:     bg-surface-container-low p-6
Deep:         bg-surface-container-lowest p-4 border border-outline-variant/15
```

### Tabs (file/terminal)
```
Container:    h-8 bg-zinc-900 border-b border-zinc-800
Active:       text-blue-400 (or text-primary) font-bold
Inactive:     opacity-40 or text-zinc-500
```

### Borders
```
Primary:      border-zinc-800 (1px)
Subtle:       border-zinc-900 (1px)
Ghost:        border-outline-variant/15
Accent left:  border-l-2 border-blue-500 (or border-primary)
Accent top:   border-t-2 border-secondary
```

### Decorative
```
Background glow:  fixed, pointer-events-none, z-[-1], opacity-20
                  Top-right: 500px circle, bg-primary/10, blur-[120px]
                  Bottom-left: 300px circle, bg-blue-600/5, blur-[80px]
```

---

## 6. Screen Inventory

| # | Screen | File | Description |
|---|--------|------|-------------|
| 1 | Browser + Terminal | `design/v2/01-browser-terminal` | WebView 좌측 + 터미널 우측, 시스템 대시보드 |
| 2 | Editor + Terminal | `design/v2/02-editor-terminal` | 코드 에디터 좌측 + 터미널 우측, CPU/MEM stats |
| 3 | Settings | `design/v2/03-settings` | Box Configuration — Border, Grid, Terminal, Chroma |
| 4 | Quad Terminal | `design/v2/04-quad-terminal` | 4분할 터미널 (Git Log, Server, ZSH, Metrics) |

---

## 7. Key Differences from v1 (Digital Monolith)

| Aspect | v1 (Digital Monolith) | v2 (Hyper-Terminal) |
|--------|----------------------|---------------------|
| Accent | Purple #7c3aed | Blue #0099ff |
| Headline font | Inter | Space Grotesk |
| Background | #10141a (navy) | #131313 (pure dark) |
| Status bar | Solid purple bg | Transparent, border-top only |
| Nav style | Toolbar menu bar | Breadcrumb path |
| Sidebar width | 48px (w-12) | 64px (w-16) |
| Sidebar items | Editor/Browser/Search/Source | Explorer/Search/Git/Debug/Market |
| Terminal prompt | `user@claude-box:~$` | `➜ ~/workspace/path` |
| Border style | Tonal layering (no borders) | Explicit zinc-800 borders |
| Decorative | None | Ambient blue glow blurs |
| Settings page | None | Full bento grid config UI |
| Quad terminal | None | 4-pane split view |

---

## 8. Implementation Notes

- **Fonts**: Import via Google Fonts: `Space+Grotesk:wght@300;400;500;600;700`, `Inter:wght@300;400;500;600`, `JetBrains+Mono:wght@400;500`
- **Icons**: Material Symbols Outlined (can substitute with text/unicode for Electron)
- **border-radius**: Global `0px` or `0.125rem` (2px) max — strictly square
- **Scrollbar**: 4px width, track #131313, thumb #3f4753
- **Selection**: `bg-primary-container text-white`
- **Transitions**: `duration-150` or `duration-200`, `ease-in-out` for sidebar/hover
- **Active states**: `active:scale-95 active:opacity-80` for buttons
