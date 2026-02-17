import { useState } from "react";
import { rules, type Rule } from "@/data/mockRules";
import { IDESidebar } from "./IDESidebar";
import { CenterPanel } from "./CenterPanel";
import { RightPanel } from "./RightPanel";
import { Activity } from "lucide-react";

export function IDELayout() {
  const [selectedRule, setSelectedRule] = useState<Rule>(rules[0]);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Top bar */}
      <div className="h-9 flex items-center justify-between px-3 border-b border-border bg-card text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground tracking-tight">
            Industrial Telemetry Workspace
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">Производственная среда</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="status-dot status-active" />
            {rules.filter((r) => r.status === "active").length} активных
          </span>
          <span className="flex items-center gap-1">
            <span className="status-dot status-error" />
            {rules.filter((r) => r.status === "error").length} ошибок
          </span>
          <span>v2.4.1</span>
        </div>
      </div>

      {/* Main IDE area */}
      <div className="flex-1 flex min-h-0">
        <IDESidebar selectedRule={selectedRule} onSelectRule={setSelectedRule} />
        <CenterPanel rule={selectedRule} />
        <RightPanel rule={selectedRule} />
      </div>

      {/* Status bar */}
      <div className="h-6 flex items-center justify-between px-3 border-t border-border bg-card text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span>LF</span>
          <span>TypeScript</span>
        </div>
        <div className="flex items-center gap-3">
          <span>⌘K Поиск</span>
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
}
