---
version: alpha
name: WebSCP Dusk Workbench
description: Two-pane file transfer between OneDrive and an SFTP/FTP server, amber on slate, dark and bright themes.
colors:
  primary: "#e5a43b"
  on-primary: "#1a1204"
  primary-text: "#8f5c06"
  primary-wash: "#fcefd6"
  neutral: "#e6e9ef"
  surface: "#ffffff"
  surface-raised: "#f3f5f8"
  outline: "#d5dbe5"
  on-surface: "#19202d"
  on-surface-muted: "#5b6577"
  success: "#1c7a48"
  success-wash: "#ddf1e5"
  error: "#b4361f"
  on-error: "#ffffff"
  primary-text-dark: "#e5a43b"
  primary-wash-dark: "#3a2a0f"
  neutral-dark: "#0b0f17"
  surface-dark: "#121826"
  surface-raised-dark: "#172033"
  outline-dark: "#232d42"
  on-surface-dark: "#e6e9ef"
  on-surface-muted-dark: "#8a93a6"
  success-dark: "#5cc48a"
  success-wash-dark: "#12301f"
  error-dark: "#f07a65"
  on-error-dark: "#1a0805"
typography:
  body-md:
    fontFamily: Source Sans 3
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
  label-md:
    fontFamily: Source Sans 3
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.3
  title-sm:
    fontFamily: Source Sans 3
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.25
  data-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.3
  brand:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1
rounded:
  key: 5px
  control: 6px
  button-lg: 8px
  panel: 10px
  full: 9999px
spacing:
  gutter: 12px
  panel-x: 14px
  row: 32px
  header-row: 28px
  middle-column: 132px
components:
  page:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
  page-dark:
    backgroundColor: "{colors.neutral-dark}"
    textColor: "{colors.on-surface-dark}"
  divider:
    backgroundColor: "{colors.outline}"
    height: 1px
  divider-dark:
    backgroundColor: "{colors.outline-dark}"
    height: 1px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.button-lg}"
    padding: 12px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.control}"
  button-secondary-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-surface-dark}"
  button-danger:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-error}"
    rounded: "{rounded.control}"
  button-danger-dark:
    backgroundColor: "{colors.error-dark}"
    textColor: "{colors.on-error-dark}"
  pane-header-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  pane-header:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
  pane-header-dark:
    backgroundColor: "{colors.surface-raised-dark}"
    textColor: "{colors.on-surface-dark}"
  file-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    height: 32px
  file-row-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-surface-dark}"
  file-row-meta:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.data-md}"
  file-row-meta-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-surface-muted-dark}"
  file-row-selected:
    backgroundColor: "{colors.primary-wash}"
    textColor: "{colors.primary-text}"
  file-row-selected-dark:
    backgroundColor: "{colors.primary-wash-dark}"
    textColor: "{colors.primary-text-dark}"
  status-pill:
    backgroundColor: "{colors.success-wash}"
    textColor: "{colors.success}"
    rounded: "{rounded.control}"
  status-pill-dark:
    backgroundColor: "{colors.success-wash-dark}"
    textColor: "{colors.success-dark}"
  key-cap:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.primary-text}"
    typography: "{typography.data-md}"
    rounded: "{rounded.key}"
  key-cap-dark:
    backgroundColor: "{colors.surface-raised-dark}"
    textColor: "{colors.primary-text-dark}"
---

# WebSCP Dusk Workbench

## Overview

A file-transfer tool for people who move files between their OneDrive and a
server they run, in a browser. It mixes two earlier directions: Dusk's amber
accent, monospace file data and function-key bar, and Workbench's separate
rounded panes, Send/Fetch column and plain-language status. Dark and bright
themes are equal; the user's choice is stored, the OS setting is the default.
The mockup is `docs/design/mockups/D-dusk-workbench.png`.

## Colors

- **Amber (primary):** the one accent. Active pane header, Send, selected rows,
  folder icons, key caps, progress bars, focus outline.
- Amber is never used as text on white: use `primary-text` (a darker amber) for
  text and icons in the bright theme. In dark, text may use amber directly.
- Filled amber always carries `on-primary` (near-black) text, never white.
- **Slate neutrals:** `neutral` is the ground between panels; `surface` is a
  panel; `surface-raised` is a pane header, footer, or key cap.
- **Green (success)** is only for the connection status pill.
- **Red (error)** is only for errors, Delete confirmation and dropped sessions.

## Typography

- **Source Sans 3** for names, labels, buttons and prose: 14px body, 13px for
  secondary text, bold 14px for pane titles.
- **JetBrains Mono** for everything that is data: paths, sizes, dates, rates,
  counts in pane footers, column headings, key caps, the `webscp` wordmark.
- Dates are full `YYYY-MM-DD HH:MM`; sizes and dates use tabular figures and
  right alignment.
- Both faces are bundled from `@fontsource` (Latin subset); the CSP allows no
  font host.

## Layout

- Commander: a 12px gutter around and between every panel. Top to bottom:
  menu bar, the two panes, the transfer panel, the function-key bar.
- Between the panes sits a 132px column holding Send (filled), Fetch
  (outlined) and the drag hint, vertically centred. A 12px splitter sits
  between the left pane and that column.
- Pane: header (icon, title, mono path, Disconnect), toolbar, column headings
  (28px, lowercase mono), 32px file rows, footer (selection count and size,
  or item count).
- The function-key bar has one bordered button per command, 2 columns on
  phones, 4 on tablets, 7 on desktop.

## Elevation & Depth

Flat. Depth comes from tone: panels on the darker ground, raised headers on
panels. Borders are 1px `outline`. Only modals get a shadow (`shadow-lg`) over
a 40% black scrim.

## Shapes

- Panels and modals 10px; Send/Fetch and function-key buttons 8px; other
  buttons, inputs and pills 6px; key caps 5px; progress bars fully round.
- Icons are 16px line icons, 1.8 stroke, in `src/ui/icons.tsx`.

## Components

- **Active pane:** the pane last clicked or focused. Its header fills amber, its
  border turns amber, and the function keys act on it.
- **File row:** 32px, hairline divider, no zebra. Folders bold with an amber
  icon. Selected: amber wash background with amber-text name, size and date.
- **Status pill:** "Connected to <label>" with a check icon. It never says
  "secure" because the protocol is not known at that point.
- **Function-key bar:** key cap plus label: F2 Rename, F5 Copy across,
  F7 New folder, F8 Delete, F9 Properties, then Refresh and Synchronize
  (no key). F-keys are ignored while typing in a field or inside a dialog.
- **Transfer panel:** one row per job, direction arrow, mono rate and elapsed,
  a round progress bar, percentage, size, and an outlined Cancel button.

## Do's and Don'ts

- Do take every colour from the tokens in `src/index.css`. Never a hex value in
  a component.
- Do keep text at WCAG AA (4.5:1) in both themes.
- Don't put white text on amber.
- Don't use emoji as icons. Use the line icons.
- Don't use Tailwind's stock blue or red, or a system font stack.
- Don't add gradients, glass effects or soft coloured shadows.
- Don't use all-caps labels; headings in data areas are lowercase mono.
