import { useState } from "react";
import { Search, ChevronDown, ChevronRight, FolderOpen, AlertCircle, Clock, FileEdit, CheckCircle, Grid3X3 } from "lucide-react";
import { rules, categories, statusLabels, type Rule, type RuleStatus } from "@/data/mockRules";
import { matrices, type Matrix } from "@/data/mockMatrices";

export type SelectedItem =
  | { type: "rule"; item: Rule }
  | { type: "matrix"; item: Matrix };

interface IDESidebarProps {
  selected: SelectedItem | null;
  onSelect: (item: SelectedItem) => void;
}

function FunctionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="1" y="10" fontSize="10" fontFamily="serif" fontStyle="italic" fill="currentColor">λ</text>
    </svg>
  );
}

function MiniSparkline({ seed }: { seed: number }) {
  const data = Array.from({ length: 12 }, (_, i) => 
    Math.sin(i * 0.8 + seed) * 0.4 + Math.cos(i * 0.3 + seed * 2) * 0.3 + 0.5
  );
  const w = 48;
  const h = 14;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - v * h}`).join(" ");

  return (
    <svg width={w} height={h} className="sidebar-sparkline ml-auto flex-shrink-0">
      <defs>
        <linearGradient id={`sg-${seed}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(185, 70%, 50%)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(185, 70%, 50%)" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={`url(#sg-${seed})`} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function IDESidebar({ selected, onSelect }: IDESidebarProps) {
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set([...categories, "МАТРИЦЫ"])
  );
  const [viewMode, setViewMode] = useState<"projects" | "statuses">("projects");

  const filteredRules = rules.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredMatrices = matrices.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const rulesByCategory = categories.map((cat) => ({
    category: cat,
    rules: filteredRules.filter((r) => r.category === cat),
  }));

  const allItems = [
    ...rules.map((r) => ({ id: r.id, name: r.name, status: r.status, type: "rule" as const, item: r })),
    ...matrices.map((m) => ({ id: m.id, name: m.name, status: m.status, type: "matrix" as const, item: m })),
  ];

  const filteredAllItems = allItems.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const rulesByStatus = (["active", "draft", "scheduled", "error"] as RuleStatus[]).map(
    (status) => ({
      status,
      label: statusLabels[status],
      items: filteredAllItems.filter((i) => i.status === status),
    })
  );

  const statusIcons: Record<RuleStatus, React.ReactNode> = {
    active: <CheckCircle className="w-3.5 h-3.5 text-success" />,
    draft: <FileEdit className="w-3.5 h-3.5 text-muted-foreground" />,
    scheduled: <Clock className="w-3.5 h-3.5 text-primary" />,
    error: <AlertCircle className="w-3.5 h-3.5 text-destructive" />,
  };

  const isSelected = (id: string) => {
    if (!selected) return false;
    return selected.item.id === id;
  };

  const totalCount = rules.length + matrices.length;
  const activeCount = rules.filter((r) => r.status === "active").length + matrices.filter((m) => m.status === "active").length;

  return (
    <div className="w-[260px] min-w-[260px] bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b border-sidebar-border">
        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          Конфигурация
        </div>
      </div>

      {/* Search */}
      <div className="p-2 border-b border-sidebar-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск правил и матриц... ⌘K"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-input text-foreground text-xs pl-7 pr-2 py-1.5 rounded-sm border border-border focus:border-primary focus:outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex gap-0.5 p-1 border-b border-sidebar-border text-[11px]">
        <button
          onClick={() => setViewMode("projects")}
          className={`flex-1 py-1 text-center font-medium rounded-md transition-colors duration-150 ${
            viewMode === "projects"
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Проекты
        </button>
        <button
          onClick={() => setViewMode("statuses")}
          className={`flex-1 py-1 text-center font-medium rounded-md transition-colors duration-150 ${
            viewMode === "statuses"
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Статусы
        </button>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {viewMode === "projects" ? (
          <>
            {/* ПРАВИЛА section */}
            <div className="px-3 py-1.5 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              Правила
            </div>

            {rulesByCategory.map(({ category, rules: catRules }, ci) => (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center gap-1.5 px-2 py-1 text-xs text-secondary-foreground hover:bg-accent transition-colors"
                >
                  {expandedCategories.has(category) ? (
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  )}
                  <FolderOpen className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-medium">{category}</span>
                  <MiniSparkline seed={ci + 1} />
                </button>
                {expandedCategories.has(category) &&
                  catRules.map((rule) => (
                    <button
                      key={rule.id}
                      onClick={() => onSelect({ type: "rule", item: rule })}
                      className={`tree-item pl-8 ${
                        isSelected(rule.id) ? "tree-item-active" : "tree-item-inactive"
                      }`}
                    >
                      <FunctionIcon className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{rule.name}</span>
                      <span className={`status-dot ml-auto flex-shrink-0 ${
                        rule.status === "active" ? "status-active" :
                        rule.status === "error" ? "status-error" :
                        rule.status === "draft" ? "status-draft" : "status-scheduled"
                      }`} />
                    </button>
                  ))}
              </div>
            ))}

            {/* МАТРИЦЫ section */}
            <div className="px-3 py-1.5 mt-2 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              Матрицы
            </div>

            <div>
              <button
                onClick={() => toggleCategory("МАТРИЦЫ")}
                className="w-full flex items-center gap-1.5 px-2 py-1 text-xs text-secondary-foreground hover:bg-accent transition-colors"
              >
                {expandedCategories.has("МАТРИЦЫ") ? (
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                )}
                <FolderOpen className="w-3.5 h-3.5 text-primary/70" />
                <span className="font-medium">Все матрицы</span>
              </button>
              {expandedCategories.has("МАТРИЦЫ") &&
                filteredMatrices.map((matrix) => (
                  <button
                    key={matrix.id}
                    onClick={() => onSelect({ type: "matrix", item: matrix })}
                    className={`tree-item pl-8 ${
                      isSelected(matrix.id) ? "tree-item-active" : "tree-item-inactive"
                    }`}
                  >
                    <Grid3X3 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{matrix.name}</span>
                    <span className={`status-dot ml-auto flex-shrink-0 ${
                      matrix.status === "active" ? "status-active" :
                      matrix.status === "error" ? "status-error" :
                      matrix.status === "draft" ? "status-draft" : "status-scheduled"
                    }`} />
                  </button>
                ))}
            </div>
          </>
        ) : (
          <>
            {rulesByStatus.map(({ status, label, items }) => (
              <div key={status}>
                <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-secondary-foreground">
                  {statusIcons[status]}
                  <span className="font-medium">{label}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {items.length}
                  </span>
                </div>
                {items.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => onSelect(
                      entry.type === "rule"
                        ? { type: "rule", item: entry.item as Rule }
                        : { type: "matrix", item: entry.item as Matrix }
                    )}
                    className={`tree-item pl-7 ${
                      isSelected(entry.id) ? "tree-item-active" : "tree-item-inactive"
                    }`}
                  >
                    {entry.type === "rule" ? (
                      <FunctionIcon className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <Grid3X3 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="truncate">{entry.name}</span>
                  </button>
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-2 text-[10px] text-muted-foreground">
        {totalCount} элементов · {activeCount} активных
      </div>
    </div>
  );
}
