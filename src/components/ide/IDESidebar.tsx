import { useState } from "react";
import { Search, ChevronDown, ChevronRight, FolderOpen, FileCode, AlertCircle, Clock, FileEdit, CheckCircle } from "lucide-react";
import { rules, categories, statusLabels, type Rule, type RuleStatus } from "@/data/mockRules";

interface IDESidebarProps {
  selectedRule: Rule | null;
  onSelectRule: (rule: Rule) => void;
}

export function IDESidebar({ selectedRule, onSelectRule }: IDESidebarProps) {
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories)
  );
  const [expandedStatuses, setExpandedStatuses] = useState(false);
  const [viewMode, setViewMode] = useState<"projects" | "statuses">("projects");

  const filteredRules = rules.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
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

  const rulesByStatus = (["active", "draft", "scheduled", "error"] as RuleStatus[]).map(
    (status) => ({
      status,
      label: statusLabels[status],
      rules: filteredRules.filter((r) => r.status === status),
    })
  );

  const statusIcons: Record<RuleStatus, React.ReactNode> = {
    active: <CheckCircle className="w-3.5 h-3.5 text-success" />,
    draft: <FileEdit className="w-3.5 h-3.5 text-muted-foreground" />,
    scheduled: <Clock className="w-3.5 h-3.5 text-primary" />,
    error: <AlertCircle className="w-3.5 h-3.5 text-destructive" />,
  };

  return (
    <div className="w-[260px] min-w-[260px] bg-sidebar border-r border-border flex flex-col h-full">
      {/* Search */}
      <div className="p-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск правил... ⌘K"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-input text-foreground text-xs pl-7 pr-2 py-1.5 rounded-sm border border-border focus:border-primary focus:outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* View mode tabs */}
      <div className="flex border-b border-border text-[11px]">
        <button
          onClick={() => setViewMode("projects")}
          className={`flex-1 py-1.5 text-center transition-colors ${
            viewMode === "projects"
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Проекты
        </button>
        <button
          onClick={() => setViewMode("statuses")}
          className={`flex-1 py-1.5 text-center transition-colors ${
            viewMode === "statuses"
              ? "text-foreground border-b-2 border-primary"
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
            <div className="px-2 py-1 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
              Производственная среда
            </div>
            {rulesByCategory.map(({ category, rules: catRules }) => (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center gap-1 px-2 py-1 text-xs text-secondary-foreground hover:bg-accent transition-colors"
                >
                  {expandedCategories.has(category) ? (
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  )}
                  <FolderOpen className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{category}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    {catRules.length}
                  </span>
                </button>
                {expandedCategories.has(category) &&
                  catRules.map((rule) => (
                    <button
                      key={rule.id}
                      onClick={() => onSelectRule(rule)}
                      className={`w-full flex items-center gap-1.5 pl-8 pr-2 py-1 text-xs transition-colors ${
                        selectedRule?.id === rule.id
                          ? "bg-accent text-accent-foreground"
                          : "text-sidebar-foreground hover:bg-accent/50"
                      }`}
                    >
                      <FileCode className="w-3 h-3 text-muted-foreground flex-shrink-0" />
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
          </>
        ) : (
          <>
            {rulesByStatus.map(({ status, label, rules: statusRules }) => (
              <div key={status}>
                <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-secondary-foreground">
                  {statusIcons[status]}
                  <span>{label}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {statusRules.length}
                  </span>
                </div>
                {statusRules.map((rule) => (
                  <button
                    key={rule.id}
                    onClick={() => onSelectRule(rule)}
                    className={`w-full flex items-center gap-1.5 pl-7 pr-2 py-1 text-xs transition-colors ${
                      selectedRule?.id === rule.id
                        ? "bg-accent text-accent-foreground"
                        : "text-sidebar-foreground hover:bg-accent/50"
                    }`}
                  >
                    <FileCode className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{rule.name}</span>
                  </button>
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-3 py-2 text-[10px] text-muted-foreground">
        {rules.length} правил · {rules.filter((r) => r.status === "active").length} активных
      </div>
    </div>
  );
}
