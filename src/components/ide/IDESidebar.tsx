import { useState } from "react";
import { Search, ChevronDown, ChevronRight, FolderOpen, Grid3X3 } from "lucide-react";
import { rules, categories, type Rule, type RuleStatus } from "@/data/mockRules";
import { matrices, type Matrix } from "@/data/mockMatrices";
import { StatusBadge, ruleStatusToVariant } from "@/components/ui/status-badge";

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

export function IDESidebar({ selected, onSelect }: IDESidebarProps) {
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set([...categories, "MATRICES"])
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
      if (next.has(cat)) next.delete(cat); else next.add(cat);
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
      items: filteredAllItems.filter((i) => i.status === status),
    })
  );

  const isSelected = (id: string) => {
    if (!selected) return false;
    return selected.item.id === id;
  };

  const totalCount = rules.length + matrices.length;
  const activeCount = rules.filter((r) => r.status === "active").length + matrices.filter((m) => m.status === "active").length;

  const statusLabelMap: Record<RuleStatus, string> = {
    active: "Active",
    draft: "Draft",
    scheduled: "Scheduled",
    error: "Error",
  };

  return (
    <div className="flex flex-col h-full bg-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-border shrink-0">
        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          Explorer
        </div>
      </div>

      {/* Search */}
      <div className="p-2.5 border-b border-border shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search... ⌘K"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-input text-foreground text-xs pl-8 pr-3 py-2 rounded-lg border border-border focus:border-primary focus:outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex gap-1 p-1.5 border-b border-border text-[11px] shrink-0">
        <button
          onClick={() => setViewMode("projects")}
          className={`flex-1 py-1.5 text-center font-medium rounded-lg transition-colors duration-150 ${
            viewMode === "projects" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Tree
        </button>
        <button
          onClick={() => setViewMode("statuses")}
          className={`flex-1 py-1.5 text-center font-medium rounded-lg transition-colors duration-150 ${
            viewMode === "statuses" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Status
        </button>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-1.5 min-h-0">
        {viewMode === "projects" ? (
          <>
            <div className="px-4 py-2 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              Rules
            </div>

            {rulesByCategory.map(({ category, rules: catRules }) => (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-secondary-foreground hover:bg-accent transition-colors"
                >
                  {expandedCategories.has(category) ? (
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  )}
                  <FolderOpen className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-medium">{category}</span>
                </button>
                {expandedCategories.has(category) &&
                  catRules.map((rule) => (
                    <button
                      key={rule.id}
                      onClick={() => onSelect({ type: "rule", item: rule })}
                      className={`tree-item pl-9 ${
                        isSelected(rule.id) ? "tree-item-active" : "tree-item-inactive"
                      }`}
                    >
                      <FunctionIcon className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{rule.name}</span>
                      <StatusBadge variant={ruleStatusToVariant(rule.status)} size="xs" dot className="ml-auto flex-shrink-0" />
                    </button>
                  ))}
              </div>
            ))}

            <div className="px-4 py-2 mt-2 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              Matrices
            </div>

            <div>
              <button
                onClick={() => toggleCategory("MATRICES")}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-secondary-foreground hover:bg-accent transition-colors"
              >
                {expandedCategories.has("MATRICES") ? (
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                )}
                <FolderOpen className="w-3.5 h-3.5 text-primary/70" />
                <span className="font-medium">All matrices</span>
              </button>
              {expandedCategories.has("MATRICES") &&
                filteredMatrices.map((matrix) => (
                  <button
                    key={matrix.id}
                    onClick={() => onSelect({ type: "matrix", item: matrix })}
                    className={`tree-item pl-9 ${
                      isSelected(matrix.id) ? "tree-item-active" : "tree-item-inactive"
                    }`}
                  >
                    <Grid3X3 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{matrix.name}</span>
                    <StatusBadge variant={ruleStatusToVariant(matrix.status)} size="xs" dot className="ml-auto flex-shrink-0" />
                  </button>
                ))}
            </div>
          </>
        ) : (
          <>
            {rulesByStatus.map(({ status, items }) => (
              <div key={status}>
                <div className="flex items-center gap-2 px-4 py-2 text-xs text-secondary-foreground">
                  <StatusBadge variant={ruleStatusToVariant(status)} size="xs">
                    {statusLabelMap[status]}
                  </StatusBadge>
                  <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    {items.length}
                  </span>
                </div>
                {items.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() =>
                      onSelect(
                        entry.type === "rule"
                          ? { type: "rule", item: entry.item as Rule }
                          : { type: "matrix", item: entry.item as Matrix }
                      )
                    }
                    className={`tree-item pl-8 ${
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
      <div className="border-t border-border px-4 py-2 text-[10px] text-muted-foreground shrink-0">
        {totalCount} entities · {activeCount} active
      </div>
    </div>
  );
}
