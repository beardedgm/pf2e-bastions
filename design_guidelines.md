# Design Guidelines: Pathfinder 2e Bastion System Explorer v2.1

## Design Approach

**Selected Approach:** Design System with Fantasy Aesthetic Enhancement

This is a utility-focused reference and calculation tool requiring exceptional usability for information-dense content. We'll use Material Design principles as our foundation for component structure and information hierarchy, enhanced with Pathfinder-inspired fantasy aesthetics through decorative elements, textures, and medieval styling cues.

**Key Principles:**
- Information hierarchy and scannability above all
- Fantasy aesthetics through subtle textures and ornamental accents
- Functional clarity for complex tables and calculators
- Rapid access to documentation and tools

## Typography

**Font Strategy:**
- **Primary (Headers):** "Cinzel" or "Spectral" - serif font for medieval gravitas
- **Secondary (Body):** "Inter" or "Source Sans Pro" - clean sans-serif for maximum readability
- **Monospace (Numbers/Data):** "Fira Mono" - for tables and stat blocks

**Hierarchy:**
- H1: 2.5rem (40px), font-weight 700, primary font - page titles
- H2: 1.875rem (30px), font-weight 600, primary font - section headers
- H3: 1.5rem (24px), font-weight 600, secondary font - subsections
- H4: 1.25rem (20px), font-weight 600, secondary font - card titles
- Body: 1rem (16px), font-weight 400, line-height 1.6
- Small: 0.875rem (14px), font-weight 400 - metadata, labels
- Tables: 0.875rem, monospace for numbers

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8 for consistency
- Micro spacing: p-2, gap-2 (8px) - tight element grouping
- Standard spacing: p-4, gap-4 (16px) - card padding, form fields
- Section spacing: p-6, mb-6 (24px) - between content blocks
- Major spacing: p-8, mb-8 (32px) - page sections, container padding

**Container Structure:**
- Max-width: max-w-7xl (1280px) for main content
- Sidebar width: w-64 (256px) for navigation
- Card containers: max-w-4xl for focused content areas

**Grid Patterns:**
- Documentation: Single column with sticky sidebar navigation
- Builder/Calculator: 2-column layout (input forms left, preview/results right)
- Facility Cards: 3-column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Quick Reference: 4-column compact grid for stats/numbers

## Component Library

### Navigation
- **Sidebar Navigation:** Fixed left sidebar (w-64) with fantasy border decoration, hierarchical menu structure, collapsible sections for facility categories
- **Top Bar:** Application title with Pathfinder iconography, breadcrumb trail, user tools (settings, save/load)
- **Tabs:** Material-style tabs with fantasy underline treatment for switching between Documentation/Builder/Calculator/Tracker views

### Data Display
- **Tables:** Striped rows, sticky headers, monospace numbers aligned right, sortable columns with arrow indicators, responsive collapse to cards on mobile
- **Stat Blocks:** Border-decorated boxes with label/value pairs, background texture for medieval parchment feel
- **Info Cards:** Rounded corners (rounded-lg), subtle shadow, icon + title + description layout, hover lift effect (hover:shadow-xl transition)

### Interactive Elements
- **Facility Selector:** Card grid with facility icon, name, size badge, cost display, click to select with active state border glow
- **Calculator Inputs:** Labeled number inputs with +/- steppers, dropdowns for size selection, auto-calculating totals with visual feedback
- **Order Tracker:** Checkbox lists with skill DC displays, charge indicators (filled/empty circles), boon status badges
- **Timeline Visualizer:** Horizontal timeline with turn markers, banked turn indicators, event trigger flags

### Forms & Controls
- **Input Fields:** Material-style with floating labels, helper text below, validation states (success/warning/error borders)
- **Dropdowns:** Custom styled selects with fantasy arrow indicator
- **Buttons:** Primary (filled), Secondary (outlined), sizes (px-4 py-2 for standard, px-6 py-3 for large)
- **Toggle Switches:** For feature flags like "Show Advanced Rules"

### Overlays
- **Modal Dialogs:** Centered, max-w-2xl, for facility details and rule references, backdrop blur effect
- **Tooltips:** Small, instant-show on hover for term definitions and quick help
- **Alert Banners:** Top-of-page notifications for income cap warnings, turn completion

### Fantasy Aesthetic Elements
- **Borders:** Use border-2 with decorative corner treatments (CSS pseudo-elements with small ornamental shapes)
- **Backgrounds:** Subtle paper/parchment textures on cards and panels (via CSS background-image with low opacity)
- **Icons:** Use Heroicons for UI controls, custom medieval-style icons for facilities (shield, tower, scroll, etc.)
- **Dividers:** Ornamental horizontal rules between major sections (border-t with centered decorative icon)

## Page Layouts

### Documentation Browser
- Left sidebar navigation (w-64) with expandable categories
- Main content area (flex-1) with H1 page title, tabbed sub-navigation, scrollable content with anchor links
- Right mini-sidebar (w-48) for table of contents on long pages

### Bastion Builder
- Top section: Character level selector, total facility count, gold spent/remaining
- Grid layout: Available facilities (left 2/3) in searchable card grid, Current Bastion (right 1/3) summary panel
- Bottom: Action buttons for save/export/print

### Calculator & Tracker Tools
- Two-column: Input form (left), Results panel (right) with live updates
- Cost Calculator: Size selector → instant cost breakdown with enlargement options
- Income Calculator: Facility income inputs → total vs. cap visualization (progress bar)
- Turn Tracker: Calendar-style timeline with turn management controls

## Responsive Behavior

- Desktop (lg:): Full sidebar + multi-column grids
- Tablet (md:): Collapsible sidebar (hamburger menu), 2-column grids
- Mobile: Single column, sidebar becomes drawer, tables become stacked cards, sticky top navigation bar

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation for all tools (tab order, enter to select)
- Focus indicators with 2px outline
- Form validation with both visual and text feedback
- Skip links for main content

This design balances the need for a fantasy-inspired aesthetic that honors Pathfinder's medieval theme while maintaining exceptional usability for complex rule reference and calculation tasks. The result is a professional tool that feels thematically appropriate without sacrificing functional clarity.