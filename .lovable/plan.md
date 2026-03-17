

# IDE Transformation Plan

## What We're Building
Transform the current dashboard into a JetBrains-style IDE debugging environment. Signals = runtime data, rules = program logic, incidents = runtime errors. The user should feel like they're debugging a system, not browsing dashboards.

## Assumptions
- `react-resizable-panels` is already installed and wrapped in `src/components/ui/resizable.tsx`
- `cmdk` is already installed (used in `src/components/ui/command.tsx`)
- No new npm dependencies needed
- All existing data structures, routes, and entity relationships stay intact

## Irreversible Decisions
- Converting ActivationModal from overlay to inline panel changes the interaction pattern significantly
- Resizable panel layout replaces current fixed layouts across all 5 views

---

## Implementation (8 tasks)

### 1. Command Palette
**New file:** `src/components/platform/CommandPalette.tsx`

Use existing `CommandDialog` from `cmdk`. Index all rules, matrices, signals, incidents, and reports. Support fuzzy search with Russian labels. Actions: navigate to entity, switch view, run simulation. Wire `⌘K` in PlatformShell to toggle open state.

### 2. Trace Panel (Bottom Panel)
**New file:** `src/components/ide/TracePanel.tsx`

Persistent bottom panel showing timestamped execution trace. Entries: signal changes, threshold hits, rule activations, valve actions. Clicking a step dispatches a selection event. Filterable by entity type. Collapsible.

### 3. Context Inspector (Right Panel)
**New file:** `src/components/ide/ContextInspector.tsx`

Dynamic right panel that adapts to selection context:
- **Signal selected:** current value, anomaly status, correlations, sparkline
- **Rule selected:** logic summary, triggers, linked signals, usage count
- **Incident selected:** root cause chain, impact, timeline
- Includes "Перейти к определению" and "Показать использования" links

### 4. Resizable Multi-Panel Layouts
**Modified files:** All 5 view components + PlatformShell

Wrap each view's content with `ResizablePanelGroup`:

- **LIVE:** Main table (center) + TracePanel (bottom, collapsible)
- **INVESTIGATE:** Incident list (left, 20%) | Detail (center) | ContextInspector (right, 20%, collapsible)
- **ANALYZE:** Report list (left) | Charts+detail (center) | ContextInspector (right, collapsible)
- **CONFIGURE:** IDESidebar (left) | CenterPanel (center) | RightPanel (right) | TracePanel (bottom) — wrap center+right in vertical group with bottom trace
- **GOVERN:** Audit log (center) | Impact preview (right, collapsible)

### 5. Inline Debugging (Replace Modal)
**Modified:** `ActivationModal.tsx` → `ActivationPanel.tsx`, `CenterPanel.tsx`

Convert activation modal to an inline slide-down panel within CenterPanel (no overlay, no context switch). Add inline debug tooltips to DependencyGraph nodes: hover shows `Температура: 96°C / Порог: 90°C → активировано`.

### 6. Keyboard Navigation
**Modified:** `useKeyboardShortcuts.ts`

Expand shortcuts:
- `⌘K` → Command palette
- `Escape` → Close panels, deselect
- `F12` → Go to definition (navigate to selected entity's config)
- `⌘⇧F` → Find usages
- Arrow keys in graph → navigate nodes (focus management)
- `⌘Enter` → Run simulation

### 7. Copy Updates (Dev-Tools Language)
**Modified:** All view components, GlobalNav, tabs, headers

| Current | New |
|---|---|
| Расследовать | Debug |
| Описание | Inspect |
| Хронология | Trace |
| Связанные | References |
| Отчёты | Traces |
| Обзор | Inspector |
| Активировать | Deploy |
| Запустить | Run |
| Проверить | Validate |

Nav labels: LIVE → LIVE, INVEST → DEBUG, ANALYZE → TRACE, CONFIG → EDIT, GOVERN → DEPLOY

Status bar: show breadcrumb path like `Северное месторождение / Резервуар-12 / Контроль перегрева`

### 8. System Status Header + Microinteractions
**Modified:** `PlatformShell.tsx`

Top bar additions: system status indicator (Stable/Degraded), signals/sec counter, active incidents count. Graph node hover: 150ms opacity transition + edge highlight. Panel expand/collapse: 180ms ease-out. No heavy animations.

## Implementation Order
1. Command Palette (highest impact, enables keyboard-first)
2. Trace Panel + Context Inspector (new components)
3. Resizable panel wiring across all views
4. Inline debugging (replace modal, graph tooltips)
5. Copy/label updates
6. Keyboard navigation expansion
7. System status header
8. Microinteraction polish

