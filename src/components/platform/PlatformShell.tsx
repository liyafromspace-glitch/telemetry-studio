import { useState } from "react";
import { type AppState, defaultContext } from "@/data/mockPlatform";
import { rules } from "@/data/mockRules";
import { matrices } from "@/data/mockMatrices";
import { GlobalNav } from "./GlobalNav";
import { ContextBar } from "./ContextBar";
import { LiveView } from "./LiveView";
import { InvestigateView } from "./InvestigateView";
import { AnalyzeView } from "./AnalyzeView";
import { ConfigureView } from "./ConfigureView";
import { GovernView } from "./GovernView";
import { Activity } from "lucide-react";

export function PlatformShell() {
  const [activeState, setActiveState] = useState<AppState>("live");

  const totalActive =
    rules.filter((r) => r.status === "active").length +
    matrices.filter((m) => m.status === "active").length;
  const totalErrors =
    rules.filter((r) => r.status === "error").length +
    matrices.filter((m) => m.status === "error").length;

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Top bar */}
      <div className="h-9 flex items-center justify-between px-3 border-b border-border bg-card text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground tracking-tight">
            Industrial Telemetry Platform
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{defaultContext.environment}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="status-dot status-active" />
            {totalActive} активных
          </span>
          <span className="flex items-center gap-1">
            <span className="status-dot status-error" />
            {totalErrors} ошибок
          </span>
          <span>v2.4.1</span>
        </div>
      </div>

      {/* Context bar */}
      <ContextBar context={defaultContext} />

      {/* Main area */}
      <div className="flex-1 flex min-h-0">
        <GlobalNav activeState={activeState} onStateChange={setActiveState} />

        {activeState === "live" && (
          <LiveView onNavigateToInvestigate={() => setActiveState("investigate")} />
        )}
        {activeState === "investigate" && (
          <InvestigateView onNavigateToConfigure={() => setActiveState("configure")} />
        )}
        {activeState === "analyze" && (
          <AnalyzeView onNavigateToInvestigate={() => setActiveState("investigate")} />
        )}
        {activeState === "configure" && <ConfigureView />}
        {activeState === "govern" && (
          <GovernView onNavigateToAnalyze={() => setActiveState("analyze")} />
        )}
      </div>

      {/* Status bar */}
      <div className="h-6 flex items-center justify-between px-3 border-t border-border bg-card text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="uppercase tracking-wider font-medium">
            {activeState === "live" ? "LIVE" :
             activeState === "investigate" ? "INVESTIGATE" :
             activeState === "analyze" ? "ANALYZE" :
             activeState === "configure" ? "CONFIGURE" : "GOVERN"}
          </span>
          <span>UTC+3</span>
        </div>
        <div className="flex items-center gap-3">
          <span>⌘K Поиск</span>
          <span>⌘I Инцидент</span>
          <span>⌘F Функция</span>
        </div>
      </div>
    </div>
  );
}
