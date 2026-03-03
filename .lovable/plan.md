

# UX Upgrade Plan — Industrial Telemetry Platform

This is a significant upgrade touching nearly every view in the platform. The work is organized into 10 discrete tasks matching the prompt sections.

---

## 1. Enhanced Context Bar with Environment Indicator

**File:** `src/components/platform/ContextBar.tsx`

- Add a colored environment badge: **ПРОДАКШН** (red bg) or **ТЕСТ** (yellow bg) as a prominent left-aligned pill
- Make context segments interactive dropdowns (visual only — mock data, no real filtering)
- Keep the bar persistent at 28px height

---

## 2. Improved Dependency Graph

**File:** `src/components/ide/DependencyGraph.tsx` (major rewrite)

- **Node shapes by entity type:** circle for Сигнал, hexagon for Функция, square for Матрица, triangle for Инцидент
- **Graph mode switcher** (top toolbar): Модули / Функции / Сигналы — filters node detail level
- **Risk overlay:** border color = status, stroke width = criticality (thick = critical dependency)
- **Enhanced tooltips:** show Название, Тип, Статус, Последний запуск, Количество ошибок
- **Click handler** already exists — extend to navigate between entities

---

## 3. Improved Simulation Panel (Debugger Mode)

**File:** `src/components/ide/SimulationPanel.tsx` (major rewrite)

- **Structured input builder** replaces raw JSON textarea: form fields per signal (Температура, Давление, Клапан) that auto-generate JSON
- **Controls bar:** Запустить / Шаг / Сброс buttons
- **Execution timeline:** visual horizontal stepper showing Сигнал → Условие → Матрица → Результат
- **Human-readable trace** replacing raw logs: e.g., `Температура > 90 → ИСТИНА` with evaluation result
- Keep JSON view as a toggle for advanced users

---

## 4. Enhanced Activation Modal with Staged Deployment

**File:** `src/components/ide/ActivationModal.tsx` (rewrite)

- **Staged deployment pipeline:** visual stepper showing Черновик → Симуляция → Проверено → Тестовая среда → Продакшн
- **Mini dependency graph preview** embedded in modal (simplified SVG)
- **Change diff section:** show before/after values (e.g., `Температура > 90` → `Температура > 95`)
- **Impact section** enhanced with Затронутые сигналы / функции / объекты (already partially exists)

---

## 5. Improved Right Panel Inspector

**File:** `src/components/ide/RightPanel.tsx` (rewrite)

- **Collapsible sections** using Radix Collapsible: Логика, Входные сигналы, Результаты, Зависимости, Метаданные
- **Inline validation** next to fields (e.g., `⚠ Допустимый диапазон: 0–100` below threshold input)
- **Signal sparklines:** small inline SVG sparkline charts showing last 5-10 values for linked signals
- **Creation templates** section at bottom: Контроль перегрева / Аномалия давления / Отказ клапана

---

## 6. Improved Govern View

**File:** `src/components/platform/GovernView.tsx` (enhance)

- Convert audit log to a **table format**: Пользователь / Изменение / Влияние / Время columns
- Add **inline diff preview** expandable per row
- Add **version comparison tab** that actually works (side-by-side diff view)

---

## 7. Signal Observability in LIVE View

**File:** `src/components/platform/LiveView.tsx` (enhance)

- Add **mini sparkline charts** per signal row showing last 5-10 values
- Add signal detail panel on row click showing recent values list + chart

---

## 8. Density Mode Toggle

**Files:** `src/components/platform/PlatformShell.tsx`, `src/index.css`

- Add CSS classes for `density-comfortable` and `density-compact`
- Toggle button in the top bar or status bar
- Compact mode reduces row heights, padding, font sizes globally via CSS variables
- Store preference in state

---

## 9. Keyboard Shortcuts

**File:** New `src/hooks/useKeyboardShortcuts.ts` + integration in `PlatformShell.tsx`

- `⌘P` → search/find function (focus search input)
- `⌘F` → find signal
- `⌘Enter` → run simulation
- `⌘D` → duplicate function
- `⌘S` → save
- Show shortcut hints in status bar (already partially there)

---

## 10. Cross-State Navigation Improvements

**Files:** Various view files

- LIVE: clicking "Расследовать" passes signal context to INVESTIGATE
- INVESTIGATE: "Открыть в CONFIGURE" navigates to the specific function/matrix
- CONFIGURE: "Перейти к GOVERN" for version history
- Ensure all cross-state links pass entity context

---

## Implementation Order

1. Context Bar + Density Mode (foundation)
2. Right Panel Inspector (collapsible sections, sparklines, templates, inline validation)
3. Simulation Panel (debugger mode, structured input, execution timeline)
4. Dependency Graph (node shapes, modes, risk overlay)
5. Activation Modal (staged deployment, diff, mini graph)
6. Govern View (table + diff)
7. Live View (sparklines)
8. Keyboard Shortcuts
9. Cross-state navigation wiring

## Technical Notes

- All new components reuse existing `ide-panel`, `ide-header`, status color classes
- Sparklines rendered as inline SVG polylines (no new dependencies)
- Density mode via CSS custom properties override on a parent class
- Collapsible sections via `@radix-ui/react-collapsible` (already installed)
- No new entities introduced — all mock data extends existing interfaces

